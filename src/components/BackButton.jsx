import { useNavigate, useLocation } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        flex items-center gap-2
        px-3 py-1.5
        rounded-lg
        bg-white/10 border border-white/20
        text-white hover:bg-white/20
        transition
      "
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Back
    </button>
  );
}
