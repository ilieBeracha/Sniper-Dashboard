import { useStore } from "zustand";
import BaseModal from "./BaseModal";
import SearchableCheckboxList from "./SearchableCheckboxList";
import { teamStore } from "@/store/teamStore";
import { useEffect, useState } from "react";
import { squadStore } from "@/store/squadStore";

export default function ScoreFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingScore,
  assignmentSessions = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formValues: any) => void;
  editingScore: any | null;
  assignmentSessions?: { id: string; assignment: { id: string; assignment_name: string } }[];
}) {
  const { squadUsers } = useStore(squadStore);
  const { members: teamMembers } = useStore(teamStore);

  const [formValues, setFormValues] = useState<{
    time_until_first_shot: string;
    distance: string;
    target_hit: string;
    day_night: string;
    participants: string[];
    assignment_session_id?: string;
    squad_id?: string;
  }>({
    time_until_first_shot: "",
    distance: "",
    target_hit: "",
    day_night: "day",
    participants: [],
    assignment_session_id: "",
  });

  useEffect(() => {
    if (editingScore) {
      setFormValues({
        time_until_first_shot: editingScore.time_until_first_shot || "",
        distance: editingScore.distance || "",
        target_hit: editingScore.target_hit || "",
        day_night: editingScore.day_night || "day",
        participants: editingScore.participants || [],
        assignment_session_id: editingScore.assignment_session_id || "",
      });
    } else if (squadUsers && squadUsers.length > 0) {
      setFormValues((current: any) => ({
        ...current,
        participants: squadUsers.map(user => user.id),
      }));
    }
  }, [editingScore, squadUsers]);

  const handleSubmit = () => {
    const scoreData = {
      time_until_first_shot: formValues.time_until_first_shot,
      distance: formValues.distance,
      target_hit: formValues.target_hit,
      day_night: formValues.day_night,
      assignment_session_id: formValues.assignment_session_id,
    };

    console.log('Submitting form data:', scoreData);
    onSubmit(scoreData);
  };

  const formattedMembers = teamMembers?.map((user) => ({
    id: user.id,
    label: `${user.first_name} ${user.last_name}`,
    description: user.email,
    badge: user.user_role,
  })) || [];

  const [searchTerm, setSearchTerm] = useState("");



  return (
    <BaseModal isOpen={isOpen} onClose={onClose} width="max-w-4xl" >
      <div className="border-b border-white/10 pb-4 w-full ">
        <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-3">
          <h2 className="text-xl font-semibold text-white">{editingScore ? "Edit Score Entry" : "New Score Entry"}</h2>
          <p className="mt-1 text-sm text-gray-400">Fill out the score details and assign it to the correct participants.</p>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-6">
          <div className="col-span-1 flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Assignment</label>
              <select
                value={formValues.assignment_session_id}
                onChange={(e) => setFormValues({ ...formValues, assignment_session_id: e.target.value })}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select assignment</option>
                {assignmentSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.assignment.assignment_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Time until first shot</label>
              <input
                type="text"
                value={formValues.time_until_first_shot}
                onChange={(e) => setFormValues({ ...formValues, time_until_first_shot: e.target.value })}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                placeholder="Time in seconds"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Distance</label>
              <input
                type="text"
                value={formValues.distance}
                onChange={(e) => setFormValues({ ...formValues, distance: e.target.value })}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                placeholder="Distance in meters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Target hit</label>
              <input
                type="text"
                value={formValues.target_hit}
                onChange={(e) => setFormValues({ ...formValues, target_hit: e.target.value })}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                placeholder="Hit/Miss"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Day/Night</label>
              <select
                value={formValues.day_night}
                onChange={(e) => setFormValues({ ...formValues, day_night: e.target.value })}
                className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
              >
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Participants</label>
            <SearchableCheckboxList
              items={formattedMembers}
              selectedIds={formValues.participants}
              setSelectedIds={(value: string[]) => setFormValues({ ...formValues, participants: value as any })}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceholder="Select participants..."
              emptyMessage="No participants found"
              maxHeight={180}
              showBadges={true}

            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>


    </BaseModal>
  );
}
