import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CompleteLogin() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const data = params.get("data");
    if (!data) return;

    try {
      const user = JSON.parse(atob(data));
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      navigate("/dashboard", { replace: true });
    } catch {
      navigate("/login");
    }
  }, []);

  return <p>Completing login…</p>;
}