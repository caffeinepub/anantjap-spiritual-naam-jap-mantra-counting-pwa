"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--error-bg": "#dc2626",
          "--error-text": "#ffffff",
          "--error-border": "#b91c1c",
          "--success-bg": "#16a34a",
          "--success-text": "#ffffff",
          "--success-border": "#15803d",
          "--warning-bg": "#d97706",
          "--warning-text": "#ffffff",
          "--warning-border": "#b45309",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
