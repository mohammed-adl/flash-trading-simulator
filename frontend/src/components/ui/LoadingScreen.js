import { Logo } from "./Brand";

export default function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center pb-[10vh] sm:justify-center sm:pt-0">
      <div className="flex flex-col items-center gap-4">
        <Logo className="w-15 h-15" />
        <div className="flex gap-1">
          {[0, 0.3, 0.6].map((delay, i) => (
            <div
              key={i}
              className="w-[0.46rem] h-[0.46rem] bg-yellow-400 rounded-full animate-pulse"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
