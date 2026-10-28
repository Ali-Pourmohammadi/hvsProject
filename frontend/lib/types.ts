export type Sex = "m" | "f";

export interface PredictPayload {
  Age: number | null;
  ALB: number | null;
  ALP: number | null;
  ALT: number | null;
  AST: number | null;
  BIL: number | null;
  CHE: number | null;
  CHOL: number | null;
  CREA: number | null;
  GGT: number | null;
  PROT: number | null;
  Sex: Sex;
}

export interface ClassProbability {
  class_id: number;
  label: string;
  probability: number;
}

export interface PredictResponse {
  predicted_class: number;
  predicted_label: string;
  probabilities: ClassProbability[] | null;
  disclaimer: string;
}

export interface FormValues {
  Age: string;
  ALB: string;
  ALP: string;
  ALT: string;
  AST: string;
  BIL: string;
  CHE: string;
  CHOL: string;
  CREA: string;
  GGT: string;
  PROT: string;
  Sex: Sex | "";
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;
