"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/** Square button that forces the mode opposite to the one displayed. */
const ThemeToggleComponent = ({ label }: { label: string }) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={label}
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
    >
      <svg aria-hidden width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 1.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
      </svg>
    </Button>
  );
};

export default ThemeToggleComponent;
