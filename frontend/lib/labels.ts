/** Display-only Persian labels mapped from model class ids (API unchanged). */
export const CLASS_DISPLAY_LABELS: Record<number, string> = {
  0: "اهداکننده خون",
  1: "غیراهداکننده خون؛ شامل گروه‌های دارای هپاتیت، فیبروز یا سیروز در داده‌های آموزشی",
};

export function getClassDisplayLabel(
  classId: number,
  fallback?: string
): string {
  return CLASS_DISPLAY_LABELS[classId] ?? fallback ?? `کلاس ${classId}`;
}

export const MEDICAL_DISCLAIMER =
  "این سامانه صرفاً یک ابزار آموزشی و پژوهشی برای نمایش عملکرد مدل یادگیری ماشین است. نتیجه آن تشخیص قطعی پزشکی نیست و نباید مبنای تصمیم‌گیری درمانی قرار گیرد. برای تفسیر آزمایش‌ها و تشخیص بیماری، با پزشک مشورت کنید.";
