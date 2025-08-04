import { useRef, useState } from "react";
import { FileUpload } from "~/components/FileUpload";
import { Navbar } from "~/components/shared/Navbar";

export default function Upload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    console.log("File: ", file);

    setFile(file);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget.closest("form");

    if (!form) {
      return null;
    }
    const formData = new FormData(form);

    const companyName = formData.get("company-name");
    const jobTitle = formData.get("job-title");
    const jobDescription = formData.get("job-description");

    console.log(
      `Company Name: ${companyName}, Job Title: ${jobTitle}, Job Description: ${jobDescription}`
    );
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-10">
          <h1>Smart feedback for your targeted job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <picture>
                <img
                  src="/images/resume-scan.gif"
                  alt="resume"
                  className="w-full"
                />
              </picture>
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}

          {!isProcessing && (
            <form
              action=""
              id="upload-form"
              onSubmit={handleUpload}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="job title" />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="job description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="upload">Upload Resume</label>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
