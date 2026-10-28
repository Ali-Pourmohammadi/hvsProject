import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PredictionForm } from "@/components/PredictionForm";

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="hero">
        <h1 className="brand">
          سامانه تحلیل آزمایش‌های خونی برای ارزیابی اولیه هپاتیت C
        </h1>
        <p className="lead">
          این سامانه با استفاده از یک مدل یادگیری ماشین و برخی شاخص‌های آزمایش
          خون، به ارزیابی اولیه وضعیت فرد از نظر احتمال ابتلا به هپاتیت C کمک
          می‌کند.
        </p>
        <div className="intro-panel">
          <h2 className="intro-title">نحوه عملکرد</h2>
          <p className="intro-text">
            برای استفاده از سامانه، اطلاعات خواسته‌شده در آزمایش خون و مشخصات فرد
            را وارد کنید و روی دکمه پیش‌بینی بزنید. مدل با بررسی اطلاعات
            واردشده، یکی از دو گروه زیر را پیش‌بینی می‌کند.
          </p>
          <ul className="intro-outcomes">
            <li>اهداکننده خون</li>
            <li>
              غیراهداکننده خون؛ شامل گروه‌های دارای هپاتیت، فیبروز یا سیروز در
              داده‌های آموزشی
            </li>
          </ul>
        </div>
      </header>

      <PredictionForm />
      <DisclaimerBanner />
    </main>
  );
}
