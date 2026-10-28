import { MEDICAL_DISCLAIMER } from "@/lib/labels";

export function DisclaimerBanner() {
  return (
    <aside
      className="disclaimer"
      role="note"
      aria-label="هشدار پزشکی"
    >
      <p>
        <strong>هشدار پزشکی. </strong>
        {MEDICAL_DISCLAIMER}
      </p>
    </aside>
  );
}
