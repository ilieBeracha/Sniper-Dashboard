import type { WheelPickerOption } from "@/components/wheel-picker";
import { WheelPicker, WheelPickerWrapper } from "@/components/wheel-picker";

const createArray = (length: number, add = 0): WheelPickerOption[] =>
  Array.from({ length }, (_, i) => {
    const value = i + add;
    return {
      label: value.toString().padStart(2, "0"),
      value: value.toString(),
    };
  });

const shotsOptions = createArray(100);

export function WheelPickerShots() {
  return (
    <div className="w-56">
      <WheelPickerWrapper>
        <WheelPicker options={shotsOptions} infinite />
      </WheelPickerWrapper>
    </div>
  );
}
