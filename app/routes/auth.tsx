import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  {
    title: "ATS | Auth",
  },
  {
    name: "description",
    content: "Login or register to access the ATS application.",
  },
];

export default function Auth() {
  const { isLoading, auth } = usePuterStore();

  const location = useLocation();
  const navigate = useNavigate();
  const nextPath = location.search.split("next=")[1];

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(nextPath);
    }
  }, [auth.isAuthenticated, navigate, nextPath]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-dvh flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log in to continue your job journey</h2>
          </div>

          <div className="">
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Singing you in....</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <>
                    <button className="auth-button" onClick={auth.signOut}>
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <button className="auth-button" onClick={auth.signIn}>
                      Log In
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
