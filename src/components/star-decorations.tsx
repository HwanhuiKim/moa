"use client";

const STARS = [
  { top: "5%", left: "8%", size: 18, delay: 0, color: "#7ba1ff" },
  { top: "12%", right: "12%", size: 14, delay: 0.8, color: "#ffaed7" },
  { top: "30%", left: "3%", size: 10, delay: 1.6, color: "#c6e94e" },
  { top: "45%", right: "5%", size: 16, delay: 0.4, color: "#a3e4ff" },
  { top: "65%", left: "6%", size: 12, delay: 2.0, color: "#c4a8ff" },
  { top: "80%", right: "8%", size: 14, delay: 1.2, color: "#fff4a3" },
  { top: "20%", left: "50%", size: 8, delay: 2.4, color: "#7ba1ff" },
  { top: "90%", left: "15%", size: 10, delay: 0.6, color: "#ffaed7" },
];

function StarSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
    </svg>
  );
}

export default function StarDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {STARS.map((star, i) => (
        <div
          key={i}
          className="star-decoration"
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            animationDelay: `${star.delay}s`,
          }}
        >
          <StarSVG size={star.size} color={star.color} />
        </div>
      ))}
    </div>
  );
}
