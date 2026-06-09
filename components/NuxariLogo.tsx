interface NuxariLogoProps {
  size?:    "sm" | "md" | "lg";
  variant?: "full" | "mark";
}

export function NuxariLogo({ size = "md", variant = "full" }: NuxariLogoProps) {
  const dims      = { sm: 18, md: 22, lg: 28 };
  const px        = dims[size];
  const textSizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };

  const mark = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M14 2 25 8.25V19.75L14 26 3 19.75V8.25L14 2Z" stroke="#161616" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 8.25 14 14.5l11-6.25M14 14.5V26" stroke="#161616" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 8.5 18.5 11v5L14 18.5 9.5 16v-5L14 8.5Z" fill="#2f4bff" />
    </svg>
  );

  if (variant === "mark") return mark;

  return (
    <div className="flex items-center gap-2">
      {mark}
      <span
        className={`font-semibold ${textSizes[size]} tracking-tight`}
        style={{ color: "#161616" }}
      >
        Nuxari
      </span>
    </div>
  );
}
