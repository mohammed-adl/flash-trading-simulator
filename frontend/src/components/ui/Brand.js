import brand from "@/assets/brand.svg";
import logo from "@/assets/logo.svg";

export function Brand({ className = "" }) {
  return (
    <img
      width={100}
      height={100}
      src={brand.src}
      className={`sm:top-6 sm:left-6 flex items-center gap-2 ${className}`}
    />
  );
}

export function Logo({ className = "", onClick }) {
  return (
    <img
      width={13}
      height={13}
      src={logo.src}
      className={` text-secondary ${className}`}
      onClick={onClick}
    />
  );
}
