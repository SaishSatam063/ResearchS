import pymupdf
from pathlib import Path


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from every page of a PDF.

    Args:
        pdf_path: Path to the PDF file.

    Returns:
        Complete extracted text as a single string.
    """

    pdf_path = Path(pdf_path)

    if not pdf_path.exists():
        raise FileNotFoundError(
            f"PDF file not found: {pdf_path}"
        )

    document = pymupdf.open(pdf_path)

    extracted_pages = []

    try:
        for page_number, page in enumerate(document, start=1):

            page_text = page.get_text("text")

            if page_text.strip():
                extracted_pages.append(page_text)

    finally:
        document.close()

    extracted_text = "\n".join(extracted_pages)

    return extracted_text