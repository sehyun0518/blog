"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@blog/ui/button";

const SCROLL_THRESHOLD = 300;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <Button
      onClick={scrollToTop}
      variant="outline"
      size="icon"
      aria-label="맨 위로"
      className="fixed bottom-6 right-6 z-40 shadow-md"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
}
