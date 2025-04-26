import { XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface BaseModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

export default function BaseModal({ isOpen = true, isLoading = false, onClose, children, width = "max-w-8xl" }: BaseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className={`bg-[#1E1E1E] text-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl w-full ${width} p-8 relative overflow-hidden`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-white/0 opacity-10 pointer-events-none" />
            {!isLoading && (
              <button onClick={onClose} className="absolute top-1 right-1 text-gray-500 hover:text-white transition" aria-label="Close modal">
                <XCircle className="w-6 h-6" />
              </button>
            )}
            <div className="relative z-10">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
