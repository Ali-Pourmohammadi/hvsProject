from typing import Literal, Optional

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    """Laboratory features. Null/omitted numeric fields are filled by the trained imputer."""

    Age: Optional[float] = Field(default=None, ge=0, le=120, description="Age in years")
    ALB: Optional[float] = Field(default=None, description="Albumin")
    ALP: Optional[float] = Field(default=None, description="Alkaline phosphatase")
    ALT: Optional[float] = Field(default=None, description="Alanine aminotransferase")
    AST: Optional[float] = Field(default=None, description="Aspartate aminotransferase")
    BIL: Optional[float] = Field(default=None, description="Bilirubin")
    CHE: Optional[float] = Field(default=None, description="Cholinesterase")
    CHOL: Optional[float] = Field(default=None, description="Cholesterol")
    CREA: Optional[float] = Field(default=None, description="Creatinine")
    GGT: Optional[float] = Field(default=None, description="Gamma-glutamyl transferase")
    PROT: Optional[float] = Field(default=None, description="Protein")
    Sex: Literal["m", "f"] = Field(..., description="Sex encoded as m=0, f=1 for the model")


class ClassProbability(BaseModel):
    class_id: int
    label: str
    probability: float


class PredictResponse(BaseModel):
    predicted_class: int
    predicted_label: str
    probabilities: Optional[list[ClassProbability]] = None
    disclaimer: str = (
        "This result is for educational purposes only and must not be used "
        "as a medical diagnosis or a substitute for professional clinical advice."
    )


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    imputer_loaded: bool
