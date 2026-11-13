import Link from "next/link";
import Logo from "./components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-slate-50 max-w-md mx-auto text-center gap-6">
      <Logo size={72} />
      <div>
        <h1 className="text-5xl font-black text-slate-900 mb-2">404</h1>
        <p className="text-lg font-semibold text-slate-700">Page not found</p>
        <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Link
        href="/home"
        className="inline-flex items-center justify-center h-12 px-6 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
