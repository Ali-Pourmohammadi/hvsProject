export function DisclaimerBanner() {
  return (
    <aside
      className="disclaimer"
      role="note"
      aria-label="Educational use disclaimer"
    >
      <p>
        <strong>Educational use only.</strong> This tool is a university Machine
        Learning project based on the UCI HCV Data set. It is{" "}
        <em>not</em> a medical device and must not be used for diagnosis,
        treatment decisions, or as a substitute for a physician&apos;s advice.
      </p>
    </aside>
  );
}
