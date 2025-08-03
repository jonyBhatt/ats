import { Navbar } from "~/components/shared/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import { ResumeCards } from "~/components/cards/ResumeCards";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ATS" },
    { name: "description", content: "Feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Application Status & Ratings</h1>
          <h2>Check AI powered feedback for your dream job!</h2>
        </div>

        {
          /* This is where the ResumeCards component will be used */
          resumes.length > 0 && (
            <div className="resumes-section">
              {resumes.map((resume: Resume) => (
                <ResumeCards key={resume.id} resume={resume} />
              ))}
            </div>
          )
        }
      </section>
    </main>
  );
}
