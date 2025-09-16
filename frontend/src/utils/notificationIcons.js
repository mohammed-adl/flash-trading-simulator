import { DollarSign } from "lucide-react";
import { Logo } from "@/components/ui";

export function getNotificationIcon(
  type,
  className = "w-8 h-8 text-secondary"
) {
  switch (type) {
    case "WARNING":
      return <DollarSign className={className} />;
    default:
      return <Logo className={className} />;
  }
}
