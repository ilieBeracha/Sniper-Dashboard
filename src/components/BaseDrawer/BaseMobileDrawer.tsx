// BaseMobileDrawer.tsx
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function BaseMobileDrawer({
  children,
  title,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { theme } = useTheme();

  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50 sm:hidden">
      {/* Backdrop */}
      <div className={`fixed inset-0 backdrop-blur-sm transition-opacity ${theme === "dark" ? "bg-black/50" : "bg-gray-50"}`} />

      <div className="fixed inset-0 overflow-hidden z-50" style={{ zIndex: 1000 }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <DialogPanel className="pointer-events-auto w-screen transform transition-all duration-300 ease-in-out data-[closed]:translate-x-full">
              <div
                className={`flex h-full flex-col overflow-y-auto shadow-2xl ${
                  theme === "dark" ? "bg-[#161616] border-l border-zinc-800" : "bg-white border-l border-gray-200"
                }`}
              >
                {/* Header */}
                <div
                  className={`sticky top-0 z-10 px-4 sm:px-6 py-4 ${
                    theme === "dark" ? "bg-[#161616] border-b border-zinc-800" : "bg-white border-b border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <DialogTitle className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</DialogTitle>
                    <button
                      onClick={() => setIsOpen(false)}
                      className={`p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "hover:bg-zinc-800 text-zinc-400 hover:text-white focus:ring-zinc-700"
                          : "hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:ring-gray-300"
                      }`}
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-4 sm:px-6 py-4">
                  <div className="h-full">{children}</div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
