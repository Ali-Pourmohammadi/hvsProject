# HCV Laboratory Analysis

پروژه دانشگاهی Machine Learning برای پیش‌بینی گروه مرتبط با داده‌های آزمایشگاهی HCV.

این ابزار **صرفاً آموزشی** است و نباید به‌عنوان تشخیص پزشکی یا جایگزین نظر پزشک استفاده شود.

## معماری

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Backend:** Python + FastAPI
- **مدل:** فایل‌های ازپیش‌آموزش‌دیده `hcv_model.pkl` و `hcv_imputer.pkl` (joblib)

```
hvs-projects/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── schemas.py
│   ├── models/          # محل قرارگیری فایل‌های .pkl
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── .env.example
└── README.md
```

## فایل‌های مدل

قبل از اجرای بک‌اند، این دو فایل را در مسیر زیر قرار دهید:

```
backend/models/hcv_model.pkl
backend/models/hcv_imputer.pkl
```

اگر فایل‌ها را از Google Colab دانلود کرده‌اید و هنوز در پروژه نیستند، همین مسیر مورد انتظار است.

> فایل‌های `.pkl` در Git ignore شده‌اند و نباید در مخزن عمومی commit شوند.

## ویژگی‌های ورودی مدل

ترتیب ستون‌ها دقیقاً مطابق آموزش:

1. Age  
2. ALB  
3. ALP  
4. ALT  
5. AST  
6. BIL  
7. CHE  
8. CHOL  
9. CREA  
10. GGT  
11. PROT  
12. Sex (`m = 0`, `f = 1`)

کلاس‌ها:

- `0` → Blood Donor  
- `1` → Hepatitis / Fibrosis / Cirrhosis  

## نصب و اجرا (Windows)

### پیش‌نیازها

- Node.js 18+ و npm
- **Python 3.12** (الزامی برای سازگاری با مدل). فایل‌های `.pkl` با `scikit-learn==1.6.1` ذخیره شده‌اند. روی Python 3.15 فقط sklearn جدیدتر ویل دارد و پیش‌بینی می‌شکند.
- اگر چند نسخه Python دارید، venv را صریحاً با 3.12 بسازید:

```powershell
py -3.12 -m venv .venv
```

### ۱) بک‌اند FastAPI

در PowerShell:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> اگر `uvicorn` شناخته نشد، یعنی پکیج‌ها نصب نشده‌اند یا venv فعال نیست. همیشه با `python -m uvicorn ...` داخل venv اجرا کنید.

API روی آدرس زیر بالا می‌آید:

- Health: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### ۲) فرانت‌اند Next.js

در یک ترمینال جدا:

```powershell
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

مرورگر:

- [http://localhost:3000](http://localhost:3000)

## متغیرهای محیطی

### Backend (`backend/.env`)

| متغیر | توضیح | نمونه |
| --- | --- | --- |
| `CORS_ORIGINS` | آدرس‌های مجاز فرانت (با ویرگول) | `http://localhost:3000,http://127.0.0.1:3000` |
| `MODEL_DIR` | پوشه فایل‌های مدل | `models` |

### Frontend (`frontend/.env.local`)

| متغیر | توضیح | نمونه |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | آدرس پایه API بدون `/` انتهایی | `http://127.0.0.1:8000` |

برای انتشار آنلاین:

1. بک‌اند را روی یک سرویس Python (مثلاً Render / Railway / VPS) deploy کنید.
2. `CORS_ORIGINS` را برابر دامنه فرانت‌اند قرار دهید.
3. فرانت‌اند را روی Vercel یا مشابه deploy کنید و `NEXT_PUBLIC_API_URL` را به آدرس عمومی API تنظیم کنید.
4. فایل‌های مدل را فقط روی سرور بک‌اند قرار دهید؛ هرگز آن‌ها را به مرورگر نفرستید.

## نمونه درخواست و پاسخ API

### `GET /health`

```json
{
  "status": "ok",
  "model_loaded": true,
  "imputer_loaded": true
}
```

### `POST /predict`

درخواست:

```json
{
  "Age": 45,
  "ALB": 38.5,
  "ALP": 52.5,
  "ALT": 27.5,
  "AST": 31.0,
  "BIL": 7.5,
  "CHE": 8.5,
  "CHOL": 5.2,
  "CREA": 80.0,
  "GGT": 25.0,
  "PROT": 72.0,
  "Sex": "m"
}
```

پاسخ نمونه:

```json
{
  "predicted_class": 0,
  "predicted_label": "Blood Donor",
  "probabilities": [
    {
      "class_id": 0,
      "label": "Blood Donor",
      "probability": 0.91
    },
    {
      "class_id": 1,
      "label": "Hepatitis / Fibrosis / Cirrhosis",
      "probability": 0.09
    }
  ],
  "disclaimer": "This result is for educational purposes only and must not be used as a medical diagnosis or a substitute for professional clinical advice."
}
```

مقادیر عددی می‌توانند `null` باشند؛ در این حالت imputer ذخیره‌شده مقدار را تکمیل می‌کند. فیلد `Sex` اجباری است و فقط `"m"` یا `"f"` پذیرفته می‌شود.

### تست سریع با PowerShell

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/health -Method GET

$body = @{
  Age = 45
  ALB = 38.5
  ALP = 52.5
  ALT = 27.5
  AST = 31.0
  BIL = 7.5
  CHE = 8.5
  CHOL = 5.2
  CREA = 80.0
  GGT = 25.0
  PROT = 72.0
  Sex = "m"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://127.0.0.1:8000/predict -Method POST -ContentType "application/json" -Body $body
```

## امنیت و حریم خصوصی

- فایل‌های مدل، `.env`، محیط مجازی Python و `node_modules` در `.gitignore` هستند.
- داده‌های آزمایشگاهی در لاگ سرور ذخیره نمی‌شوند.
- مدل فقط روی بک‌اند بارگذاری می‌شود و به مرورگر ارسال نمی‌گردد.

## Docker

برای این پروژه آموزشی، اجرای محلی با venv + npm ساده‌تر است؛ به همین دلیل Docker اضافه نشده است. اگر بعداً برای استقرار یکپارچه نیاز داشتید، می‌توان Dockerfile جدا برای backend و frontend اضافه کرد.
"# hvsProject" 
