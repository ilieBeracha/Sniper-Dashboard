import { XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface BaseModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

export default function BaseModal({ isOpen = true, isLoading = false, onClose, children, width = "max-w-2xl" }: BaseModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className={`bg-[#1E1E1E] text-white shadow-2xl w-full ${width} p-4 sm:p-6 md:p-8 relative my-8 rounded-xl`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr rounded-xl from-white/5 to-white/0 opacity-10 pointer-events-none" />
            {!isLoading && (
              <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white transition p-1" aria-label="Close modal">
                <XCircle className="w-6 h-6" />
              </button>
            )}
            <div className="relative z-10 max-h-[calc(100vh-8rem)] mt-12 overflow-y-auto rounded-xl">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
