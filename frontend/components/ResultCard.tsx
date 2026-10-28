import { getClassDisplayLabel, MEDICAL_DISCLAIMER } from "@/lib/labels";
import type { PredictResponse } from "@/lib/types";

interface ResultCardProps {
  result: PredictResponse;
}

export function ResultCard({ result }: ResultCardProps) {
  const isDonor = result.predicted_class === 0;
  const displayLabel = getClassDisplayLabel(
    result.predicted_class,
    result.predicted_label
  );

  return (
    <section
      className="result-card"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={-1}
    >
      <p className="result-eyebrow">نتیجه پیش‌بینی</p>
      <h2 className="result-title">{displayLabel}</h2>
      <p className="result-meta">
        کلاس پیش‌بینی‌شده: <span>{result.predicted_class}</span>
        {" · "}
        <span className={isDonor ? "tone-donor" : "tone-risk"}>
          {isDonor ? "گروه اهداکننده خون" : "گروه غیراهداکننده خون"}
        </span>
      </p>

      {result.probabilities && result.probabilities.length > 0 ? (
        <ul className="probability-list">
          {result.probabilities.map((item) => {
            const percent = Math.round(item.probability * 1000) / 10;
            const itemLabel = getClassDisplayLabel(item.class_id, item.label);
            return (
              <li key={item.class_id}>
                <div className="probability-row">
                  <span>{itemLabel}</span>
                  <span>{percent}٪</span>
                </div>
                <div
                  className="probability-track"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  aria-label={`احتمال ${itemLabel}`}
                >
                  <span
                    className="probability-fill"
                    style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <p className="result-disclaimer">{MEDICAL_DISCLAIMER}</p>
    </section>
  );
}
