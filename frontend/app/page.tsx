import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PredictionForm } from "@/components/PredictionForm";

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="hero">
        <h1 className="brand">HCV Laboratory Analysis</h1>
        <p className="lead">
          An educational web application that sends laboratory markers to a
          pre-trained Machine Learning model and returns a predicted group from
          the UCI HCV Data project. Built with Next.js and a FastAPI inference
          service.
        </p>
      </header>

      <DisclaimerBanner />
      <PredictionForm />

      <p className="footer-note">
        Model classes: <strong>0 = Blood Donor</strong>,{" "}
        <strong>1 = Hepatitis / Fibrosis / Cirrhosis</strong>. Suspect Blood
        Donor samples were excluded during training.
      </p>
    </main>
  );
}
