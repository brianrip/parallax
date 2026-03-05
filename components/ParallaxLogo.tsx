export default function ParallaxLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="512" height="512" rx="96" fill="#0f172a" />
      <line x1="128" y1="128" x2="256" y2="384" stroke="#fbbf24" strokeWidth="28" strokeLinecap="round" />
      <line x1="192" y1="128" x2="288" y2="384" stroke="#fbbf24" strokeWidth="28" strokeLinecap="round" opacity="0.6" />
      <line x1="384" y1="128" x2="256" y2="384" stroke="#22d3ee" strokeWidth="28" strokeLinecap="round" />
      <line x1="320" y1="128" x2="224" y2="384" stroke="#22d3ee" strokeWidth="28" strokeLinecap="round" opacity="0.6" />
      <circle cx="256" cy="384" r="10" fill="#e2e8f0" />
    </svg>
  );
}
