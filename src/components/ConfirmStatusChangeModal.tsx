import { TrainingStatus } from "@/types/training";

type ConfirmStatusChangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newStatus: TrainingStatus;
};

const statusDisplayNames = {
  [TrainingStatus.Scheduled]: "SCHEDULED",
  [TrainingStatus.InProgress]: "IN PROGRESS",
  [TrainingStatus.Completed]: "COMPLETED",
  [TrainingStatus.Canceled]: "CANCELED"
};

export default function ConfirmStatusChangeModal({ isOpen, onClose, onConfirm, newStatus }: ConfirmStatusChangeModalProps) {
  if (!isOpen) return null;

  const isCanceled = newStatus === TrainingStatus.Canceled;
  const title = isCanceled ? "Cancel Training Session" : "Change Training Status";
  const message = isCanceled
    ? "Are you sure you want to cancel this training session? This action cannot be undone."
    : `Are you sure you want to change the status to ${statusDisplayNames[newStatus]}?`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-md transition-colors"
          >
            No, Keep Current
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              isCanceled 
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
            }`}
          >
            Yes, {isCanceled ? "Cancel Training" : "Change Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
