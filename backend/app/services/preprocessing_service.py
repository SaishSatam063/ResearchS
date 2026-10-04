import re


def clean_text(text: str) -> str:
    """
    Clean extracted PDF text before NLP processing.

    Args:
        text: Raw text extracted from a PDF.

    Returns:
        Cleaned text.
    """

    if not text:
        return ""

    # Replace multiple spaces/tabs with a single space
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n\s*\n+", "\n\n", text)

    # Remove spaces at the beginning/end of each line
    lines = [
        line.strip()
        for line in text.splitlines()
    ]

    # Remove completely empty lines
    lines = [
        line
        for line in lines
        if line
    ]

    # Join lines back together
    text = "\n".join(lines)

    # Remove spaces before punctuation
    text = re.sub(r"\s+([,.!?;:])", r"\1", text)

    return text.strip()