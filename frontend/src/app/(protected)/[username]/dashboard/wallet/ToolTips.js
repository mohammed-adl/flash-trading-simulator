import { useState, useEffect, useRef } from "react";
import { HelpCircle } from "lucide-react";

export default function Tooltips({ content, size = "w-64" }) {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <HelpCircle
        className="w-4 h-4 text-secondary cursor-pointer"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div
          className={`absolute  transform -translate-y-1/2 p-2 rounded-md bg-card border border-border text-sm text-muted shadow-md z-50 ${size} 
            left-[-33px] sm:left-[150%]  top-11 sm:top-3`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
