import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
  overlay?: boolean;
}

export const LoadingSpinner = ({ text, className = "", overlay = true }: LoadingSpinnerProps) => {
  const spinnerContent = (
    <div className={`bg-zinc-800 rounded-lg p-4 flex items-center space-x-3 border border-zinc-700 ${className}`}>
      <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
      {text && <span className="text-zinc-300 font-medium">{text}</span>}
    </div>
  );

  if (overlay) {
    return <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm z-10">{spinnerContent}</div>;
  }

  return spinnerContent;
};
