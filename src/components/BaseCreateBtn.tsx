import { PlusCircleIcon } from "lucide-react";

export default function BaseCreateBtn({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-indigo-200/10  px-2 py-0.5 rounded text-xs cursor-pointer" onClick={onClick}>
      <span className="text-sm font-medium text-gray-200">Create</span>
      <PlusCircleIcon className="w-4 h-4 text-gray-200" />
    </div>
  );
}
