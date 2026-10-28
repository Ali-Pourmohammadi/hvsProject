import type { FormErrors, FormValues, PredictPayload } from "./types";

const NUMERIC_FIELDS = [
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
] as const;

export const EMPTY_FORM: FormValues = {
  Age: "",
  ALB: "",
  ALP: "",
  ALT: "",
  AST: "",
  BIL: "",
  CHE: "",
  CHOL: "",
  CREA: "",
  GGT: "",
  PROT: "",
  Sex: "",
};

export const FIELD_META: Record<
  (typeof NUMERIC_FIELDS)[number],
  { label: string; hint: string; min?: number; max?: number }
> = {
  Age: { label: "Age", hint: "Years", min: 0, max: 120 },
  ALB: { label: "ALB", hint: "Albumin" },
  ALP: { label: "ALP", hint: "Alkaline phosphatase" },
  ALT: { label: "ALT", hint: "Alanine aminotransferase" },
  AST: { label: "AST", hint: "Aspartate aminotransferase" },
  BIL: { label: "BIL", hint: "Bilirubin" },
  CHE: { label: "CHE", hint: "Cholinesterase" },
  CHOL: { label: "CHOL", hint: "Cholesterol" },
  CREA: { label: "CREA", hint: "Creatinine" },
  GGT: { label: "GGT", hint: "Gamma-glutamyl transferase" },
  PROT: { label: "PROT", hint: "Protein" },
};

function parseOptionalNumber(raw: string): number | null | "invalid" {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return "invalid";
  }
  return value;
}

export function validateForm(values: FormValues): {
  errors: FormErrors;
  payload: PredictPayload | null;
} {
  const errors: FormErrors = {};
  const payload = {
    Age: null as number | null,
    ALB: null as number | null,
    ALP: null as number | null,
    ALT: null as number | null,
    AST: null as number | null,
    BIL: null as number | null,
    CHE: null as number | null,
    CHOL: null as number | null,
    CREA: null as number | null,
    GGT: null as number | null,
    PROT: null as number | null,
    Sex: "m" as PredictPayload["Sex"],
  };

  let hasAnyLabValue = false;

  for (const field of NUMERIC_FIELDS) {
    const parsed = parseOptionalNumber(values[field]);
    const meta = FIELD_META[field];

    if (parsed === "invalid") {
      errors[field] = `${meta.label} must be a valid number.`;
      continue;
    }

    if (parsed !== null) {
      hasAnyLabValue = true;
      if (meta.min !== undefined && parsed < meta.min) {
        errors[field] = `${meta.label} must be at least ${meta.min}.`;
      } else if (meta.max !== undefined && parsed > meta.max) {
        errors[field] = `${meta.label} must be at most ${meta.max}.`;
      } else {
        payload[field] = parsed;
      }
    }
  }

  if (!values.Sex) {
    errors.Sex = "Please select sex.";
  } else {
    payload.Sex = values.Sex;
  }

  if (!hasAnyLabValue) {
    errors.Age =
      errors.Age ??
      "Enter at least one laboratory value. Missing values are filled by the imputer.";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return {
    errors,
    payload: hasErrors ? null : payload,
  };
}
