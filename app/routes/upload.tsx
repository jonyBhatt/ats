import { prepareInstructions } from "../../constants";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FileUpload } from "~/components/FileUpload";
import { Navbar } from "~/components/shared/Navbar";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/utils/pdfToImage";
import { generateUUID } from "~/utils/UUID";

interface AnalyzeProps {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}

export default function Upload() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState("");

  const { auth, isLoading, fs, ai, kv } = usePuterStore();

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    file,
    jobDescription,
    jobTitle,
  }: AnalyzeProps) => {
    setIsProcessing(true);
    setStatusText("Uploading your file....");

    const uploadFile = await window.puter.fs.upload([file]);

    if (!uploadFile) return setStatusText("Error: Failed to upload file");

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    console.log("Image File: ", imageFile);

    if (!imageFile.file)
      return setStatusText("Error: Failed to convert PDF to image");

    setStatusText("Uploading...");
    const uploadImage = await fs.upload([imageFile.file]);
    if (!uploadImage) return setStatusText("Error: Failed to upload image");

    setStatusText("Prepare data...");

    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadFile.path,
      imagePath: uploadImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };

    await kv.set(`resume${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing data...");

    const feedback = await ai.feedback(
      uploadFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );

    if (!feedback) {
      setStatusText("Error: Failed to Analyze");
    }

    const feedbackText =
      typeof feedback?.message.content === "string"
        ? feedback.message.content
        : feedback?.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing complete...");
    setImage(data.imagePath);
    console.log("Data: ", data);

    // Wait a moment to show the completed image
    setTimeout(() => {
      setIsProcessing(false);
      // navigate(`/results/${uuid}`);
    }, 2000);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget.closest("form");

    if (!form) {
      return null;
    }
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return null;

    handleAnalyze({ companyName, file, jobDescription, jobTitle });
  };

  return (
    <main className="">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-10">
          <h1>Smart feedback for your targeted job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <picture>
                <img
                  src={
                    statusText === "Analyzing complete..."
                      ? image
                      : "/images/resume-scan.gif"
                  }
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
