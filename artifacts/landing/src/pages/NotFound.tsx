import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#0A0A0F]">
      <h1 className="text-8xl font-black text-[#00D9A0] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-[#8F8FA3] max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-8 py-4 bg-[#00D9A0] text-[#0A0A0F] font-bold rounded-2xl hover:bg-[#00C490] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
