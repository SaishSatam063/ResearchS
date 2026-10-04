import { useRef, useState } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef(null);

  // ---------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a research topic or paper title.");
      return;
    }

    alert(`arXiv search for: ${searchQuery}`);
  };

  // ---------------------------------------------------------
  // OPEN FILE SELECTOR
  // ---------------------------------------------------------

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // ---------------------------------------------------------
  // FILE SELECTION
  // ---------------------------------------------------------

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setUploadMessage("");
    setUploadError("");

    // Check file type
    if (file.type !== "application/pdf") {
      setUploadError("Please select a PDF file.");
      return;
    }

    // Upload PDF
    await uploadPDF(file);
  };

  // ---------------------------------------------------------
  // UPLOAD PDF TO FASTAPI
  // ---------------------------------------------------------

  const uploadPDF = async (file) => {
    setUploading(true);
    setUploadMessage("");
    setUploadError("");

    // FormData is used because we are sending a file
    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      // Handle backend errors
      if (!response.ok) {
        throw new Error(
          data.detail || "Upload failed."
        );
      }

      // Show successful upload
      setUploadMessage(
        `✓ ${data.filename} uploaded successfully`
      );

    } catch (error) {
      setUploadError(
        error.message ||
          "Unable to upload the PDF. Please check that the backend is running."
      );

    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          <div className="logo-icon">R</div>
          <span>ResearchS</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <button className="status-button">
          <span className="status-dot"></span>
          System Online
        </button>

      </nav>


      {/* MAIN */}

      <main id="home">

        {/* HERO */}

        <section className="hero">

          <div className="hero-badge">
            <span>✦</span>
            AI-Powered Research Assistant
          </div>

          <h1>
            Understand Research Papers
            <span> Faster with AI.</span>
          </h1>

          <p className="hero-description">
            Search research papers, upload PDFs, generate intelligent
            summaries, compare transformer models, and ask questions
            about your research.
          </p>


          {/* SEARCH */}

          <div className="search-container">

            <div className="search-box">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search research papers on arXiv..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <button onClick={handleSearch}>
                Search
              </button>

            </div>

          </div>


          {/* ACTION BUTTONS */}

          <div className="hero-actions">

            <button
              className="primary-button"
              onClick={handleSearch}
            >
              Search Papers
              <span>→</span>
            </button>


            <button
              className="secondary-button"
              onClick={handleUploadClick}
              disabled={uploading}
            >

              <span>↑</span>

              {uploading
                ? "Uploading..."
                : "Upload Research Paper"}

            </button>


            {/* Hidden file input */}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden-input"
            />

          </div>


          {/* UPLOAD STATUS */}

          {selectedFile && (

            <div className="upload-status">

              <p className="selected-file">

                Selected:

                {" "}

                <strong>
                  {selectedFile.name}
                </strong>

              </p>


              {uploadMessage && (

                <p className="upload-success">
                  {uploadMessage}
                </p>

              )}


              {uploadError && (

                <p className="upload-error">
                  {uploadError}
                </p>

              )}

            </div>

          )}


          <p className="supported-text">
            Supports research papers from{" "}
            <strong>arXiv</strong> and PDF uploads
          </p>

        </section>


        {/* FEATURES */}

        <section
          className="features"
          id="features"
        >

          <div className="section-heading">

            <p>
              POWERED BY TRANSFORMERS
            </p>

            <h2>
              Everything you need to understand research.
            </h2>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon purple">
                ⌕
              </div>

              <h3>
                Search Papers
              </h3>

              <p>
                Discover research papers directly from arXiv
                using topics, keywords, or paper titles.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon blue">
                ▤
              </div>

              <h3>
                Smart Summaries
              </h3>

              <p>
                Generate concise and meaningful summaries
                using multiple transformer models.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon green">
                ✦
              </div>

              <h3>
                Model Comparison
              </h3>

              <p>
                Compare FLAN-T5, BART, LongT5, and Mistral
                to identify the most suitable model.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon orange">
                ◌
              </div>

              <h3>
                Research Chatbot
              </h3>

              <p>
                Ask questions about your uploaded research
                paper and receive context-aware answers.
              </p>

            </div>

          </div>

        </section>


        {/* WORKFLOW */}

        <section
          className="workflow"
          id="about"
        >

          <div className="section-heading">

            <p>
              HOW IT WORKS
            </p>

            <h2>
              From research paper to understanding in minutes.
            </h2>

          </div>


          <div className="workflow-grid">

            <div className="workflow-step">

              <span>01</span>

              <h3>
                Upload or Search
              </h3>

              <p>
                Find a paper on arXiv or upload your own PDF.
              </p>

            </div>


            <div className="workflow-step">

              <span>02</span>

              <h3>
                Analyze
              </h3>

              <p>
                ResearchS extracts and processes the paper
                content.
              </p>

            </div>


            <div className="workflow-step">

              <span>03</span>

              <h3>
                Compare Models
              </h3>

              <p>
                Four transformer models generate and evaluate
                results.
              </p>

            </div>


            <div className="workflow-step">

              <span>04</span>

              <h3>
                Ask Questions
              </h3>

              <p>
                Interact with your research paper through the
                AI chatbot.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;