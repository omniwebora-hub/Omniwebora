"use client";

import Link, { type LinkProps } from "next/link";
import { track, type TrackEvent } from "@/lib/analytics";

type Props = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    event: TrackEvent;
    props?: Record<string, string>;
  };

/** next/link that records a privacy-respecting analytics event on click. */
export function TrackedLink({ event, props, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, props);
        onClick?.(e);
      }}
    />
  );
}
