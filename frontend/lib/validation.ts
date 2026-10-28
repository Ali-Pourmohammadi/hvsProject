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
  Age: { label: "سن", hint: "سال", min: 0, max: 120 },
  ALB: { label: "آلبومین", hint: "ALB" },
  ALP: { label: "آلکالین فسفاتاز", hint: "ALP" },
  ALT: { label: "آلانین آمینوترانسفراز", hint: "ALT" },
  AST: { label: "آسپارتات آمینوترانسفراز", hint: "AST" },
  BIL: { label: "بیلی‌روبین", hint: "BIL" },
  CHE: { label: "کولین‌استراز", hint: "CHE" },
  CHOL: { label: "کلسترول", hint: "CHOL" },
  CREA: { label: "کراتینین", hint: "CREA" },
  GGT: { label: "گاما گلوتامیل ترانسفراز", hint: "GGT" },
  PROT: { label: "پروتئین کل", hint: "PROT" },
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
      errors[field] = `${meta.label} باید عدد معتبر باشد.`;
      continue;
    }

    if (parsed !== null) {
      hasAnyLabValue = true;
      if (meta.min !== undefined && parsed < meta.min) {
        errors[field] = `${meta.label} باید حداقل ${meta.min} باشد.`;
      } else if (meta.max !== undefined && parsed > meta.max) {
        errors[field] = `${meta.label} باید حداکثر ${meta.max} باشد.`;
      } else {
        payload[field] = parsed;
      }
    }
  }

  if (!values.Sex) {
    errors.Sex = "لطفاً جنسیت را انتخاب کنید.";
  } else {
    payload.Sex = values.Sex;
  }

  if (!hasAnyLabValue) {
    errors.Age =
      errors.Age ??
      "حداقل یک مقدار آزمایشگاهی وارد کنید. مقادیر خالی توسط مدل تکمیل می‌شوند.";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return {
    errors,
    payload: hasErrors ? null : payload,
  };
}
