import BaseModal from "./BaseModal";
import { useState, useEffect } from "react";
import SearchableCheckboxList from "./SearchableCheckboxList";
import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { SquadScore } from "@/types/training";
import { squadStore } from "@/store/squadStore";
import { isCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { supabase } from "@/services/supabaseClient";
import { UserRole } from "@/types/user";

export default function ScoreFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingScore,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingScore: SquadScore | null;
}) {
  const [assignmentId, setAssignmentId] = useState<string>();
  const [score, setScore] = useState<SquadScore>({} as SquadScore);
  const { squadsWithMembers } = useStore(squadStore);
  const { members: teamMembers } = useStore(teamStore);
  const { user } = useStore(userStore);
  const { training } = useStore(TrainingStore);

  useEffect(() => {
    console.log("editingScore:", editingScore);
    if (editingScore) {
      setScore(editingScore);
      setAssignmentId(editingScore.assignment_session_id);
    } else {
      setScore({} as SquadScore);
      setAssignmentId(undefined);
    }
  }, [editingScore]);

  const formattedAssignments = training?.assignment_session?.map((assignment) => ({
    id: assignment.assignment.id,
    label: assignment.assignment.assignment_name,
    description: "",
  }));

  async function handleSubmit() {
    const assignmentSession = training?.assignment_session?.find((assignment) => assignment.assignment.id === assignmentId);

    if (editingScore) {
      const res = await supabase
        .from("score")
        .update({
          assignment_session_id: assignmentSession?.id || null,
          squad_id: user?.squads?.id || null,
          shots_fired: score.shots_fired,
          time_until_first_shot: score.time_until_first_shot,
          distance: score.distance,
          target_hit: score.target_hit,
          day_night: score.day_night,
        })
        .eq("id", editingScore.score_id);

      if (res.error) {
        console.log(res.error);
      }
    } else {
      const res = await supabase.from("score").insert({
        assignment_session_id: assignmentSession?.id,
        squad_id: user?.squads?.id || null,
        shots_fired: score.shots_fired,
        time_until_first_shot: score.time_until_first_shot,
        distance: score.distance,
        target_hit: score.target_hit,
        day_night: score.day_night,
      });

      if (res.error) {
        console.log(res.error);
      }
    }

    onSubmit();
  }

  const handleDayNightToggle = (value: "day" | "night") => {
    setScore((prev) => ({ ...prev, day_night: value }));
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} width="max-w-6xl">
      <div className="border-b border-white/10 pb-4 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{editingScore ? "Edit Score Entry" : "New Score Entry"}</h2>
        </div>
        <p className="mt-1 text-sm text-gray-400">Fill out the score details and assign it to the correct participants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Assignment</label>
            <SearchableCheckboxList
              items={formattedAssignments as any[]}
              selectedIds={assignmentId ? [assignmentId] : []}
              setSelectedIds={(ids) => setAssignmentId(ids[0])}
              searchTerm={searchTerm}
              showClearButton={false}
              setSearchTerm={setSearchTerm}
              searchPlaceholder="Select assignments..."
              emptyMessage="No assignments found"
              maxHeight={200}
            />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Shots Fired
                </label>
                <input
                  className="block w-full rounded-md bg-white/10 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  type="number"
                  placeholder="Enter shots fired"
                  value={score?.shots_fired || ""}
                  onChange={(e) => setScore({ ...score, shots_fired: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Time Until First Shot
                </label>
                <input
                  className="block w-full rounded-md bg-white/10 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  type="number"
                  placeholder="Seconds until first shot"
                  value={score?.time_until_first_shot || ""}
                  onChange={(e) => setScore({ ...score, time_until_first_shot: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Distance
                </label>
                <input
                  className="block w-full rounded-md bg-white/10 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  type="number"
                  placeholder="Distance (meters)"
                  value={score?.distance || ""}
                  onChange={(e) => setScore({ ...score, distance: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Target Hit
                </label>
                <input
                  className="block w-full rounded-md bg-white/10 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  type="number"
                  placeholder="Number of targets hit"
                  value={score?.target_hit || ""}
                  onChange={(e) => setScore({ ...score, target_hit: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Day/Night
                </label>
                <div className="flex items-center gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => handleDayNightToggle("day")}
                    className={`flex-1 rounded-md px-4 py-2 text-base font-medium border ${score.day_night === "day"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white/10 text-white border-white/20"
                      }`}
                  >
                    Day
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDayNightToggle("night")}
                    className={`flex-1 rounded-md px-4 py-2 text-base font-medium border ${score.day_night === "night"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white/10 text-white border-white/20"
                      }`}
                  >
                    Night
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            {isCommander(user?.user_role as UserRole) ? (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 w-full h-full">
                <div className="space-y-4 flex flex-col gap-2">
                  {teamMembers?.map((member) => (
                    <div key={member.id} className="text-sm text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      {member.first_name} - {member.last_name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Participants</label>
                <div className="space-y-4 flex flex-col gap-2">
                  {editingScore?.squad_members?.map((squadMember) => (
                    <div key={squadMember.user_id}>
                      <div className="text-sm font-medium text-white">{squadMember.first_name} {squadMember.last_name}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-white/10 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-medium text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-md text-sm font-medium text-white shadow-sm"
        >
          {editingScore ? "Update Score" : "Save Score"}
        </button>
      </div>
    </BaseModal>
  );
}
