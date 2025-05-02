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
    <BaseModal isOpen={isOpen} onClose={onClose} width="max-w-6xl" >
      <div className="border-b border-white/10 pb-4 w-full ">
        <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-3">
          <h2 className="text-xl font-semibold text-white">{editingScore ? "Edit Score Entry" : "New Score Entry"}</h2>
          <p className="mt-1 text-sm text-gray-400">Fill out the score details and assign it to the correct participants.</p>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Time until first shot</label>
              <input
                type="text"
                value={editingScore?.time_until_first_shot}
                onChange={(e) => editingScore?.time_until_first_shot(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                placeholder="Sniper Weekly Training"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Location</label>
              <input
                type="text"
                value={editingScore?.location}
                onChange={(e) => editingScore?.location(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                placeholder="Base A - Range 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Distance</label>
              <input
                type="text"
                value={editingScore?.distance}
                onChange={(e) => editingScore?.distance(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                placeholder="Base A - Range 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Target hit</label>
              <input
                type="text"
                value={editingScore?.target_hit}
                onChange={(e) => editingScore?.target_hit(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                placeholder="Base A - Range 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Day/Night</label>
              <select
                value={editingScore?.day_night}
                onChange={(e) => editingScore?.day_night(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
              >
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>


    </BaseModal>
  );
}
