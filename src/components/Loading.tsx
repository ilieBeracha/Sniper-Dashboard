// src/components/Loading.tsx
export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#121212]">
      {/* outer spinning ring */}
      <div className="relative">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-[#FF8906] border-r-[#F25F4C]" />
        {/* tiny stationary dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-white/90" />
        </div>
      </div>
    </div>
  );
}
