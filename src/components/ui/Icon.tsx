import type { SVGProps } from "react";

export type IconName = "arrow-right" | "arrow-up-right" | "search" | "menu" | "close" | "play" | "check" | "chevron-right" | "alert";

const paths: Record<IconName, React.ReactNode> = {
  "arrow-right": <path d="M4 12h15m-6-6 6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8.5 7H17v8.5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  menu: <path d="M4 7.5h16M4 12h16M4 16.5h10" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  play: <path d="M9.5 7.8v8.4a.6.6 0 0 0 .9.5l6.6-4.2a.6.6 0 0 0 0-1l-6.6-4.2a.6.6 0 0 0-.9.5Z" fill="currentColor" stroke="none" />,
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8v5M12 16.2v.1" />
    </>
  ),
};

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
