import Notifications from "./Notifications";
import UserMenu from "./UserMenu";

export default function UserPanel() {
  return (
    <div className="hidden md:flex items-center gap-4">
      <Notifications />
      <UserMenu />
    </div>
  );
}
