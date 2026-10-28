"use client";

import { FormEvent, useId, useState } from "react";
import { predictHcv } from "@/lib/api";
import type { FormErrors, FormValues, PredictResponse } from "@/lib/types";
import { EMPTY_FORM, FIELD_META, validateForm } from "@/lib/validation";
import { ResultCard } from "./ResultCard";

export function PredictionForm() {
  const formId = useId();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError(null);

    const { errors: nextErrors, payload } = validateForm(values);
    setErrors(nextErrors);

    if (!payload) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const prediction = await predictHcv(payload);
      setResult(prediction);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "خطای غیرمنتظره‌ای هنگام درخواست پیش‌بینی رخ داد."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setValues(EMPTY_FORM);
    setErrors({});
    setApiError(null);
    setResult(null);
  }

  return (
    <div className="workspace">
      <form
        id={formId}
        className="prediction-form"
        onSubmit={handleSubmit}
        noValidate
        aria-describedby="form-help"
      >
        <div className="form-heading">
          <h2>ورودی‌های آزمایشگاهی</h2>
          <p id="form-help">
            شاخص‌های آزمایش خون و مشخصات فرد را وارد کنید. فیلدهای عددی خالی
            توسط مدل تکمیل می‌شوند. انتخاب جنسیت الزامی است.
          </p>
        </div>

        <fieldset className="sex-fieldset">
          <legend>جنسیت</legend>
          <div className="sex-options" role="radiogroup" aria-required="true">
            <label className={`sex-option ${values.Sex === "m" ? "active" : ""}`}>
              <input
                type="radio"
                name="sex"
                value="m"
                checked={values.Sex === "m"}
                onChange={() => updateField("Sex", "m")}
              />
              مرد
            </label>
            <label className={`sex-option ${values.Sex === "f" ? "active" : ""}`}>
              <input
                type="radio"
                name="sex"
                value="f"
                checked={values.Sex === "f"}
                onChange={() => updateField("Sex", "f")}
              />
              زن
            </label>
          </div>
          {errors.Sex ? (
            <p className="field-error" role="alert">
              {errors.Sex}
            </p>
          ) : null}
        </fieldset>

        <div className="fields-grid">
          {(Object.keys(FIELD_META) as Array<keyof typeof FIELD_META>).map(
            (field) => {
              const meta = FIELD_META[field];
              const inputId = `${formId}-${field}`;
              const errorId = `${inputId}-error`;
              const hintId = `${inputId}-hint`;
              const hasError = Boolean(errors[field]);

              return (
                <div className="field" key={field}>
                  <label htmlFor={inputId}>{meta.label}</label>
                  <input
                    id={inputId}
                    name={field}
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={values[field]}
                    onChange={(event) => updateField(field, event.target.value)}
                    aria-invalid={hasError}
                    aria-describedby={
                      hasError ? `${hintId} ${errorId}` : hintId
                    }
                    placeholder="اختیاری"
                  />
                  <span id={hintId} className="field-hint">
                    {meta.hint}
                  </span>
                  {hasError ? (
                    <p id={errorId} className="field-error" role="alert">
                      {errors[field]}
                    </p>
                  ) : null}
                </div>
              );
            }
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "در حال پیش‌بینی…" : "پیش‌بینی نتیجه"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            پاک‌کردن فرم
          </button>
        </div>

        {loading ? (
          <p className="status-line" role="status" aria-live="polite">
            در حال ارسال اطلاعات آزمایشگاهی به مدل…
          </p>
        ) : null}

        {apiError ? (
          <p className="api-error" role="alert">
            {apiError}
          </p>
        ) : null}
      </form>

      {result ? <ResultCard result={result} /> : null}
    </div>
  );
}
