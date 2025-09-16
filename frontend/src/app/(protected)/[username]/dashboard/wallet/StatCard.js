import { Logo } from "@/components/ui";

export default function StatCard({ label, value, loading }) {
  return (
    <div
      className={`relative rounded-md p-5 flex flex-col items-center justify-center text-center overflow-hidden border border-border bg-gradient-to-br from-card to-[#111] mb-20 mt-2 max-sm:mb-9 max-sm:mt-9 ${
        loading ? "opacity-60" : "hover:shadow-md transition"
      }`}
    >
      {loading && <div className="absolute inset-0 shimmer"></div>}

      <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none pointer-events-none">
        <Logo className="w-32 h-32 transform rotate-12" />
      </div>

      {!loading && (
        <>
          <span className="text-xs md:text-[1.3rem] font-semibold text-secondary z-10">
            {label}
          </span>
          <span className="text-xs md:text-sm font-extrabold mt-2 text-secondary z-10">
            {value}
          </span>
        </>
      )}
    </div>
  );
}
