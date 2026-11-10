"use client";

import { ReactNode } from "react";

export default function Y2kWindow({
  title,
  children,
  className = "",
  icon,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: string;
}) {
  return (
    <div className={`y2k-window ${className}`}>
      <div className="y2k-titlebar">
        <div className="y2k-dot" style={{ background: "#ff7070" }} />
        <div className="y2k-dot" style={{ background: "#ffcc4d" }} />
        <div className="y2k-dot" style={{ background: "#73e06e" }} />
        <span className="ml-1 text-xs font-bold text-white drop-shadow-sm">
          {icon && <span className="mr-1">{icon}</span>}
          {title}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
