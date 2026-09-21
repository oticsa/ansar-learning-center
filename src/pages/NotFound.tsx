import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-display text-7xl font-black text-secondary">404</p>
      <h1 className="text-2xl">This screen is offline</h1>
      <p className="max-w-md text-muted-foreground">
        The page you tried to open does not exist in the learning console.
      </p>
      <Link to="/dashboard" className="console-btn-neon">
        Back to console
      </Link>
    </div>
  );
}
