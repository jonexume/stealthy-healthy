import Image from "next/image";

interface LogoProps {
  /** Size in pixels (width = height). Defaults to 80. */
  size?: number;
  /** Show the word-mark text beside the icon. Defaults to false. */
  showWordmark?: boolean;
  className?: string;
}

/**
 * Stealthy Healthy logo.
 * Renders the SVG badge, optionally with a text wordmark alongside it.
 */
export default function Logo({
  size = 80,
  showWordmark = false,
  className = "",
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Stealthy Healthy logo"
        width={size}
        height={size}
        priority
      />
      {showWordmark && (
        <span
          className="font-extrabold tracking-tight leading-none select-none"
          style={{ fontSize: size * 0.3, color: "#0d5bbf" }}
        >
          Stealthy
          <br />
          <span style={{ color: "#1a7de8" }}>Healthy</span>
        </span>
      )}
    </div>
  );
}
