import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    ClassProbability,
    HealthResponse,
    PredictRequest,
    PredictResponse,
)

# Feature order must match the training pipeline exactly.
FEATURE_ORDER = [
    "Age",
    "ALB",
    "ALP",
    "ALT",
    "AST",
    "BIL",
    "CHE",
    "CHOL",
    "CREA",
    "GGT",
    "PROT",
    "Sex",
]

CLASS_LABELS = {
    0: "Blood Donor",
    1: "Hepatitis / Fibrosis / Cirrhosis",
}

SEX_ENCODING = {"m": 0, "f": 1}

DISCLAIMER = (
    "This result is for educational purposes only and must not be used "
    "as a medical diagnosis or a substitute for professional clinical advice."
)

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("hcv-api")

model: Any = None
imputer: Any = None


def _model_dir() -> Path:
    configured = os.getenv("MODEL_DIR", "models")
    path = Path(configured)
    if not path.is_absolute():
        path = BASE_DIR / path
    return path


def load_artifacts() -> None:
    global model, imputer
    model_dir = _model_dir()
    model_path = model_dir / "hcv_model.pkl"
    imputer_path = model_dir / "hcv_imputer.pkl"

    if not model_path.exists() or not imputer_path.exists():
        raise FileNotFoundError(
            f"Model artifacts not found in {model_dir}. "
            "Place hcv_model.pkl and hcv_imputer.pkl in that directory."
        )

    model = joblib.load(model_path)
    imputer = joblib.load(imputer_path)
    logger.info("Model and imputer loaded from %s", model_dir)


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        load_artifacts()
    except Exception:
        logger.exception("Failed to load model artifacts at startup")
        raise
    yield


app = FastAPI(
    title="HCV Laboratory Analysis API",
    description=(
        "Educational API for predicting HCV-related laboratory groups. "
        "Not intended for clinical diagnosis."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


def build_feature_row(payload: PredictRequest) -> pd.DataFrame:
    data = payload.model_dump()
    row: dict[str, float] = {}

    for name in FEATURE_ORDER:
        if name == "Sex":
            row[name] = float(SEX_ENCODING[data["Sex"]])
            continue

        raw = data[name]
        row[name] = np.nan if raw is None else float(raw)

    # DataFrame preserves the training feature names expected by the imputer.
    return pd.DataFrame([row], columns=FEATURE_ORDER)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok" if model is not None and imputer is not None else "degraded",
        model_loaded=model is not None,
        imputer_loaded=imputer is not None,
    )


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest) -> PredictResponse:
    if model is None or imputer is None:
        raise HTTPException(status_code=503, detail="Model artifacts are not loaded.")

    try:
        features = build_feature_row(payload)
        imputed = imputer.transform(features)
        prediction = int(model.predict(imputed)[0])

        probabilities: list[ClassProbability] | None = None
        if hasattr(model, "predict_proba"):
            proba_row = model.predict_proba(imputed)[0]
            classes = getattr(model, "classes_", list(range(len(proba_row))))
            probabilities = [
                ClassProbability(
                    class_id=int(class_id),
                    label=CLASS_LABELS.get(int(class_id), f"Class {class_id}"),
                    probability=round(float(prob), 4),
                )
                for class_id, prob in zip(classes, proba_row)
            ]

        return PredictResponse(
            predicted_class=prediction,
            predicted_label=CLASS_LABELS.get(prediction, f"Class {prediction}"),
            probabilities=probabilities,
            disclaimer=DISCLAIMER,
        )
    except HTTPException:
        raise
    except Exception:
        # Do not log laboratory payload values.
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=500,
            detail="Prediction failed due to an internal server error.",
        )
