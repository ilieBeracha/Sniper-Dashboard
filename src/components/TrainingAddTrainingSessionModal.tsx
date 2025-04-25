import BaseModal from "./BaseModal";
import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { Assignment } from "@/types/training";

export default function TrainingAddTrainingSessionModal({
  isOpen,
  onClose,
  onSuccess,
  teamMembers,
  assignments,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamMembers: User[];
  assignments: Assignment[];
}) {
  const [sessionName, setSessionName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const [assignmentIds, setAssignmentIds] = useState<string[]>([]);

  async function handleSubmit() {
    const user = userStore.getState().user;
    if (!user?.team_id) return alert("Missing team ID");

    const trainingId = await createTrainingSession(user.team_id);
    if (!trainingId) return;

    const participantsInserted = await insertParticipants(trainingId);
    if (!participantsInserted) return;

    const assignmentsInserted = await insertAssignments(trainingId);
    if (!assignmentsInserted) return;

    resetForm();
    onSuccess();
    onClose();
  }

  async function createTrainingSession(teamId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("training_sessions")
      .insert([
        {
          session_name: sessionName,
          location,
          date: new Date(date).toISOString(),
          team_id: teamId,
        },
      ])
      .select("id")
      .maybeSingle();

    if (error || !data?.id) {
      console.error("Error creating training session:", error);
      alert("Failed to create training session.");
      return null;
    }

    return data.id;
  }

  async function insertParticipants(trainingId: string): Promise<boolean> {
    if (!members.length) return true;

    const participants = members.map((participantId) => ({
      training_id: trainingId,
      participant_id: participantId,
    }));

    const { error } = await supabase
      .from("trainings_participants")
      .insert(participants);

    if (error) {
      console.error("Assigning participants failed:", error);
      alert("Training created, but assigning participants failed.");
      return false;
    }

    return true;
  }

  async function insertAssignments(trainingId: string): Promise<boolean> {
    if (!assignmentIds.length) return true;

    const assignmentData = assignmentIds.map((assignmentId) => ({
      training_id: trainingId,
      assignment_id: assignmentId,
    }));

    const { error } = await supabase
      .from("assignments_trainings")
      .insert(assignmentData);

    if (error) {
      console.error("Assigning training assignments failed:", error);
      alert("Training created, but assignment linking failed.");
      return false;
    }

    return true;
  }

  function resetForm() {
    setSessionName("");
    setLocation("");
    setDate("");
    setMembers([]);
    setAssignmentIds([]);
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-10 text-white">
        <div className="border-b border-white/10 pb-10">
          <h2 className="text-base font-semibold leading-7 text-white flex">
            New Training Session
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Plan a session and assign members to participate.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium leading-6 text-white">
                Session Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  placeholder="Sniper Weekly Training"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium leading-6 text-white">
                Location
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  placeholder="Base A - Range 3"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium leading-6 text-white">
                Date & Time
              </label>
              <div className="mt-2">
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium leading-6 text-white">
                Assignments
              </label>
              <select
                multiple
                value={assignmentIds}
                onChange={(e) =>
                  setAssignmentIds(
                    Array.from(e.target.selectedOptions, (opt) => opt.value)
                  )
                }
                className="mt-2 block w-full h-32 rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              >
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.assignment_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-white mb-2">
                Assign Members
              </label>

              <div className="relative bg-[#1F1F1F] rounded-lg shadow-md ring-1 ring-white/10 overflow-hidden">
                <div className="max-h-52 overflow-y-auto custom-scrollbar">
                  <ul className="divide-y divide-white/5">
                    {teamMembers.map((member) => (
                      <li key={member.id} className="group">
                        <label className="flex items-center px-4 py-3 cursor-pointer hover:bg-white/10 transition-all">
                          <input
                            type="checkbox"
                            value={member.id}
                            checked={members.includes(member.id)}
                            onChange={(e) => {
                              const id = e.target.value;
                              setMembers((prev) =>
                                e.target.checked
                                  ? [...prev, id]
                                  : prev.filter((x) => x !== id)
                              );
                            }}
                            className="h-4 w-4 text-indigo-600 bg-transparent border-white/20 rounded focus:ring-indigo-500"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-white">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-xs text-white/60">
                              {member.email}
                            </p>
                          </div>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-white hover:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
