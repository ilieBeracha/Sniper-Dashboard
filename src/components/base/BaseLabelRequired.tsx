import { Label } from "../ui/label";

export const BaseLabelRequired = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-normal text-gray-200">{children}</Label>
      <span className="text-3xl text-red-500">*</span>
    </div>
  );
};
