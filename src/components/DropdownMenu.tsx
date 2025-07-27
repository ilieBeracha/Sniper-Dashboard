import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function DropdownMenu({
  children,
  items,
}: {
  children: React.ReactNode;
  items: { label: string; onClick: () => void; icon?: React.ReactNode }[];
}) {
  const { theme } = useTheme();
  return (
    <div className="text-right relative justify-end w-full items-center">
      <Menu>
        <MenuButton
          className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold cursor-pointer ${
            theme === "dark" ? "bg-gray-800 text-white shadow-inner shadow-white/10" : "bg-gray-100 text-gray-900"
          } focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700`}
        >
          {children}
          <ChevronDownIcon className="size-4 fill-white/60" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          {items.map((item) => (
            <MenuItem key={item.label}>
              <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                {item.icon}
                {item.label}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
}
