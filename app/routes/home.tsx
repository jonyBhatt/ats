import { Navbar } from "~/components/shared/Navbar";
import type { Route } from "./+types/home";

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
        <div className="page-heading">
          <h1>Track your Application Status & Ratings</h1>
          <h2>Check AI powered feedback for your dream job!</h2>
        </div>
      </section>
    </main>
  );
}
