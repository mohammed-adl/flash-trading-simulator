"use client";

import { useRouter } from "next/navigation";

// import SearchStocks from "./SearchStocks";
// import WalletDropdown from "./WalletDropdown";
// import UserPanel from "./userPanel/UserPanel";

import { Logo } from "@/components/ui";

export default function Navbar({ username }) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card fixed top-0 left-0 w-full lg:static z-50">
      <div className="flex items-center gap-2">
        <Logo
          onClick={() => router.push("/username")}
          className="cursor-pointer"
        />
        <span className="text-primary">/</span>
        {/* <WalletDropdown username={username} /> */}
      </div>

      <div className="flex items-center gap-4">
        {/* <SearchStocks />
        <UserPanel /> */}
      </div>
    </header>
  );
}
