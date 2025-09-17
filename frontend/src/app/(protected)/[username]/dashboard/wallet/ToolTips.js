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
          className={`absolute top-1/2 transform -translate-y-1/2 p-2 rounded-md bg-card border border-border text-sm text-muted shadow-md z-50 ${size} 
            right-0 lg:right-auto lg:left-full lg:ml-2
            left-[10%] sm:left-[150%]`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
