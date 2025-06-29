import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useStore } from "zustand";
import { scoreStore } from "@/store/scoreSrore";

export default function AddDistanceModal({ scoreId, isOpen, onClose }: { scoreId: string; isOpen: boolean; onClose: () => void }) {
  const [distance, setDistance] = useState<number>(0);
  const [shots, setShots] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);
  const addScoreRange = useStore(scoreStore, (s) => s.addScoreRange);

  const handleSave = async () => {
    await addScoreRange({ score_id: scoreId, distance, shots_fired: shots, target_hit: hits });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm space-y-4 rounded-xl bg-card p-6">
          <Dialog.Title className="text-lg font-medium text-gray-100">Add distance data</Dialog.Title>

          <label className="block text-sm">
            <span className="text-gray-400">Distance (m)</span>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(+e.target.value)}
              className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 text-gray-100 outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="text-gray-400">Shots fired</span>
            <input
              type="number"
              value={shots}
              onChange={(e) => setShots(+e.target.value)}
              className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 text-gray-100 outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="text-gray-400">Hits</span>
            <input
              type="number"
              value={hits}
              onChange={(e) => setHits(+e.target.value)}
              className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 text-gray-100 outline-none"
            />
          </label>

          <button onClick={handleSave} className="mt-4 w-full rounded-lg bg-indigo-500 py-2 text-sm font-semibold">
            Save
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
