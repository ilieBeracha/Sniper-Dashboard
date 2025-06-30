// BaseDesktopDrawer.tsx
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

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
  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50 hidden sm:block w-screen">
      <div className="fixed inset-0 bg-black/50 " />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <DialogPanel className={`pointer-events-auto w-[${width}] transform transition duration-500 ease-in-out data-[closed]:translate-x-full`}>
              <div className="flex h-full flex-col overflow-y-scroll bg-[#161616] py-6 shadow-xl">
                <div className="px-6 flex items-center justify-between">
                  <DialogTitle className="text-white text-lg ">{title}</DialogTitle>
                  <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-400 focus:outline-none">
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
