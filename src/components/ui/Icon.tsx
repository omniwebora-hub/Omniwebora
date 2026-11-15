import type { SVGProps } from "react";

export type IconName = "arrow-right" | "arrow-up-right" | "search" | "menu" | "close" | "play" | "check" | "chevron-right" | "alert" | "whatsapp";

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
  whatsapp: (
    <path
      d="M12 3.2a8.7 8.7 0 0 0-7.5 13.2L3.3 20.8l4.5-1.2A8.7 8.7 0 1 0 12 3.2Zm0 1.6a7.1 7.1 0 1 1-3.6 13.2l-.3-.2-2.6.7.7-2.5-.2-.3A7.1 7.1 0 0 1 12 4.8Zm-3 3.3c-.2 0-.5 0-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.8-.9c-.3-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1a5.8 5.8 0 0 1-2.9-2.5c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.8-2c-.2-.5-.4-.4-.6-.4H9Z"
      fill="currentColor"
      stroke="none"
    />
  ),
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
