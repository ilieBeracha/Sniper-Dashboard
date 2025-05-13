// BaseMobileDrawer.tsx
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

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
  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50 sm:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <DialogPanel className="pointer-events-auto w-screen transform transition-all duration-300 ease-in-out data-[closed]:translate-x-full">
              <div className="flex h-full flex-col overflow-y-auto bg-[#161616] border-l border-zinc-800 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 px-4 sm:px-6 py-4 bg-[#161616] border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-white text-lg font-medium">{title}</DialogTitle>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700"
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
