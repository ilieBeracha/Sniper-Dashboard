import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function BaseDesktopDrawer({
  children,
  title,
  isOpen,
  setIsOpen,
  width = "1500px",
}: {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  width?: string;
}) {
  const { theme } = useTheme();

  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50 hidden sm:block w-screen min-w-[600px">
      <div className={`fixed inset-0 backdrop-blur-sm transition-opacity ${theme === "dark" ? "bg-black/50" : "bg-white/50"}`} />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <DialogPanel className={`pointer-events-auto w-[${width}] transform transition duration-500 ease-in-out data-[closed]:translate-x-full`}>
              <div className={`flex h-full flex-col overflow-y-scroll py-6 shadow-xl ${theme === "dark" ? "bg-[#161616]" : "bg-white"}`}>
                <div className="px-6 flex items-center justify-between">
                  <DialogTitle className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</DialogTitle>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`focus:outline-none transition-colors ${
                      theme === "dark" ? "text-white hover:text-gray-400" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="relative mt-6 flex-1 px-6">{children}</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
