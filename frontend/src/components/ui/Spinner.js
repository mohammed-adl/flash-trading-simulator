export function Spinner({ className = "" }) {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-8 h-8 border-4 border-solid border-secondary border-t-transparent rounded-full animate-spin ${className}`}
      ></div>
    </div>
  );
}
