export default function Loading({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.01] backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">
        <span className="loading loading-spinner loading-lg text-white loading-animation"></span>

        <p className="text-lg font-medium text-white drop-shadow-md">
          {message}
        </p>
      </div>
    </div>
  );
}
