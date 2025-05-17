import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import BaseDashboardCard from "@/components/BaseDashboardCard";
import { useNavigate } from "react-router-dom";

export default function TrainingSummaryListPage() {
  const { user } = useStore(userStore);
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<{ [key: string]: any[] }>({});
  const [userFeedbackMap, setUserFeedbackMap] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [sortDescending, setSortDescending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (!user?.id) return;
    fetchTrainings();
  }, [user?.id]);

  const fetchTrainings = async () => {
    const { data, error } = await supabase.rpc("get_closed_trainings_with_summary_and_scores", { user_id: user?.id });
    if (!error && data) {
      setTrainings(data);

      const feedbackObj: { [key: string]: any[] } = {};
      const userFbMap: { [key: string]: string } = {};

      for (const training of data) {
        const { data: fbData, error: fbError } = await supabase
          .from("training_feedback")
          .select("id, user_id, comment, created_at, users(first_name, last_name, avatar_url)")
          .eq("training_id", training.id)
          .order("created_at", { ascending: true });

        if (!fbError && fbData) {
          feedbackObj[training.id] = fbData;
          const existing = fbData.find((f: any) => f.user_id === user?.id);
          if (existing) userFbMap[training.id] = existing.comment;
        }
      }

      setFeedbackMap(feedbackObj);
      setUserFeedbackMap(userFbMap);
    }
  };

  const handleFeedbackChange = (trainingId: string, comment: string) => {
    setUserFeedbackMap((prev) => ({ ...prev, [trainingId]: comment }));
  };

  const handleFeedbackSubmit = async (trainingId: string) => {
    const existing = feedbackMap[trainingId]?.find((f) => f.user_id === user?.id);
    const comment = userFeedbackMap[trainingId];
    if (!comment?.trim()) return;

    let error;
    if (existing) {
      ({ error } = await supabase.from("training_feedback").update({ comment }).eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("training_feedback").insert({ training_id: trainingId, user_id: user?.id, comment }));
    }

    if (!error) {
      await fetchTrainings();
    }
  };

  const filteredTrainings = trainings
    .filter((training) => {
      if (filter === "mine") {
        return training.participant_ids?.includes(user?.id);
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDescending ? dateB - dateA : dateA - dateB;
    });

  const paginatedTrainings = filteredTrainings.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredTrainings.length / pageSize);

  return (
    <BaseDashboardCard header="📋 Closed Trainings" tooltipContent="Summaries and feedback for completed sessions">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="inline-flex items-center space-x-4">
          <span className="text-sm text-gray-400">Filter:</span>
          <button
            className={`text-sm px-3 py-1 rounded-md border ${
              filter === "all" ? "bg-indigo-600 text-white border-indigo-600" : "bg-zinc-800 text-gray-300 border-zinc-600"
            }`}
            onClick={() => setFilter("all")}
          >
            All Trainings
          </button>
          <button
            className={`text-sm px-3 py-1 rounded-md border ${
              filter === "mine" ? "bg-indigo-600 text-white border-indigo-600" : "bg-zinc-800 text-gray-300 border-zinc-600"
            }`}
            onClick={() => setFilter("mine")}
          >
            My Trainings
          </button>
        </div>
        <button onClick={() => setSortDescending(!sortDescending)} className="text-sm text-indigo-400 hover:underline">
          Sort by Date {sortDescending ? "↓" : "↑"}
        </button>
      </div>

      <div className="space-y-6">
        {paginatedTrainings.length === 0 ? (
          <p className="text-gray-500">No closed trainings found for this filter.</p>
        ) : (
          paginatedTrainings.map((training) => {
            const isParticipant = training.participant_ids?.includes(user?.id);
            const feedbacks = feedbackMap[training.id] || [];
            const myFeedback = userFeedbackMap[training.id] || "";

            return (
              <div key={training.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-4">
                <div className="text-white font-semibold text-md">{training.session_name}</div>
                <div className="text-sm text-gray-300">📍 {training.location}</div>
                <div className="text-sm text-gray-400">📅 {new Date(training.date).toLocaleString()}</div>
                <div className="text-sm text-gray-400">👥 Participants: {training.participant_ids?.length || 0}</div>
                <div className="text-sm text-gray-400">🎯 Scores Added: {training.total_scores}</div>
                <div className="text-sm text-gray-400">🔍 Your Scores: {training.user_scores}</div>
                {training.summary && (
                  <div className="text-sm text-gray-300 border-t border-zinc-700 pt-2">
                    <strong className="flex items-center gap-1">
                      🧠 Commander Summary:
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Well documented</span>
                    </strong>
                    <p className="mt-1 text-zinc-200">{training.summary}</p>
                  </div>
                )}

                <div className="mt-4">
                  <h4 className="text-sm text-white font-semibold mb-2">Participant Feedback</h4>
                  {feedbacks.length > 0 ? (
                    <ul className="divide-y divide-zinc-700 bg-zinc-900 rounded-md">
                      {feedbacks.map((fb) => (
                        <li key={fb.id} className="flex justify-between gap-x-6 px-4 py-4 hover:bg-zinc-800">
                          <div className="flex gap-x-4">
                            <img
                              alt=""
                              src={fb.users?.avatar_url || "/default-avatar.png"}
                              className="w-12 h-12 rounded-full bg-zinc-700"
                            />
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold text-white">
                                {fb.users?.first_name} {fb.users?.last_name}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {new Date(fb.created_at).toLocaleString()}
                              </p>
                              <p className="mt-1 text-sm text-gray-300">{fb.comment}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No feedback submitted yet.</p>
                  )}
                </div>

                {isParticipant && (
                  <div className="mt-4">
                    <h4 className="text-sm text-white font-semibold mb-2">Add / Edit Your Feedback</h4>
                    <textarea
                      className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded"
                      rows={3}
                      value={myFeedback}
                      onChange={(e) => handleFeedbackChange(training.id, e.target.value)}
                      placeholder="Write your thoughts about the training..."
                    />
                    <button
                      className="mt-2 px-4 py-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                      onClick={() => handleFeedbackSubmit(training.id)}
                    >
                      {feedbackMap[training.id]?.find((f) => f.user_id === user?.id) ? "Update Feedback" : "Submit Feedback"}
                    </button>
                  </div>
                )}

                {!isParticipant && (
                  <p className="text-xs mt-2 text-red-400 italic">You were not a participant in this training. View only mode.</p>
                )}

                <div className="pt-2">
                  <button
                    className="text-sm text-indigo-400 hover:underline"
                    onClick={() => navigate(`/training-summary/${training.id}`)}
                  >
                    View Full Summary & Feedback →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="px-2 py-1 text-sm bg-zinc-700 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="px-2 py-1 text-sm bg-zinc-700 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </BaseDashboardCard>
  );
}
