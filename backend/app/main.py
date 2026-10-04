from pathlib import Path
import shutil

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.services.pdf_service import extract_text_from_pdf
from app.services.preprocessing_service import clean_text


app = FastAPI(
    title="ResearchS API",
    description="AI-powered research paper summarization and question answering system",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/")
def root():
    return {
        "message": "Welcome to ResearchS API",
        "status": "Backend is running successfully"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "PDF uploaded successfully",
        "filename": file.filename,
        "content_type": file.content_type,
        "file_path": str(file_path)
    }


@app.get("/extract-text/{filename}")
def extract_pdf_text(filename: str):

    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF file not found."
        )

    try:
        extracted_text = extract_text_from_pdf(
            str(file_path)
        )

        if not extracted_text.strip():
            raise HTTPException(
                status_code=422,
                detail=(
                    "No readable text was found in this PDF. "
                    "The PDF may contain scanned images instead of text."
                )
            )

        cleaned_text = clean_text(extracted_text)

        return {
            "filename": filename,
            "original_character_count": len(extracted_text),
            "cleaned_character_count": len(cleaned_text),
            "text": cleaned_text
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process PDF: {str(error)}"
        )