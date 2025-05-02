import BaseModal from "./BaseModal";

export default function ScoreFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingScore,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingScore: any | null;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} width="max-w-6xl">
      <div className="border-b border-white/10 pb-4 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{editingScore ? "Edit Score Entry" : "New Score Entry"}</h2>
        </div>
        <p className="mt-1 text-sm text-gray-400">Fill out the score details and assign it to the correct participants.</p>
      </div>
      <div></div>
      {/* Modal content will be added here */}
    </BaseModal>
  );
}
