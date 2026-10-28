import type { PredictResponse } from "@/lib/types";

interface ResultCardProps {
  result: PredictResponse;
}

export function ResultCard({ result }: ResultCardProps) {
  const isDonor = result.predicted_class === 0;

  return (
    <section
      className="result-card"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={-1}
    >
      <p className="result-eyebrow">Prediction result</p>
      <h2 className="result-title">{result.predicted_label}</h2>
      <p className="result-meta">
        Predicted class: <span>{result.predicted_class}</span>
        {" · "}
        <span className={isDonor ? "tone-donor" : "tone-risk"}>
          {isDonor ? "Blood Donor group" : "Non–Blood Donor group"}
        </span>
      </p>

      {result.probabilities && result.probabilities.length > 0 ? (
        <ul className="probability-list">
          {result.probabilities.map((item) => {
            const percent = Math.round(item.probability * 1000) / 10;
            return (
              <li key={item.class_id}>
                <div className="probability-row">
                  <span>{item.label}</span>
                  <span>{percent}%</span>
                </div>
                <div
                  className="probability-track"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  aria-label={`${item.label} probability`}
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

      <p className="result-disclaimer">{result.disclaimer}</p>
    </section>
  );
}
