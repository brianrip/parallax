export default function ParallaxLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1="4" y1="22" x2="18" y2="22"
        stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"
        style={{ strokeDasharray: 20, strokeDashoffset: 20, animation: "drawLine 300ms ease 200ms forwards" }}
      />
      <circle
        cx="18" cy="22" r="2.5" fill="#F5A623"
        style={{ opacity: 0, animation: "fadeIn 150ms ease 500ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="8"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.95"
        style={{ strokeDasharray: 32, strokeDashoffset: 32, animation: "drawLine 220ms ease 520ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="14"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.80"
        style={{ strokeDasharray: 28, strokeDashoffset: 28, animation: "drawLine 220ms ease 560ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="22"
        stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"
        style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: "drawLine 220ms ease 600ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="30"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.80"
        style={{ strokeDasharray: 28, strokeDashoffset: 28, animation: "drawLine 220ms ease 640ms forwards" }}
      />
      <line
        x1="18" y1="22" x2="40" y2="36"
        stroke="#F0F4FF" strokeWidth="2" strokeLinecap="round" opacity="0.95"
        style={{ strokeDasharray: 32, strokeDashoffset: 32, animation: "drawLine 220ms ease 680ms forwards" }}
      />
    </svg>
  );
}
