import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import BaseDashboardCard from "@/components/BaseDashboardCard";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

export default function TrainingSummaryListPage() {
  const { user } = useStore(userStore);
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<{ [key: string]: any[] }>({});
  const [userFeedbackMap, setUserFeedbackMap] = useState<{ [key: string]: string }>({});
  const [feedbackIdMap, setFeedbackIdMap] = useState<{ [key: string]: string }>({});
  const [editingMap, setEditingMap] = useState<{ [key: string]: boolean }>({});
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
      const fbIdMap: { [key: string]: string } = {};

      for (const training of data) {
        const { data: fbData, error: fbError } = await supabase
          .from("training_feedback")
          .select("id, user_id, comment, created_at, users(first_name, last_name)")
          .eq("training_id", training.id)
          .order("created_at", { ascending: true });

        if (!fbError && fbData) {
          feedbackObj[training.id] = fbData;
          const existing = fbData.find((f: any) => f.user_id === user?.id);
          if (existing) {
            userFbMap[training.id] = existing.comment;
            fbIdMap[training.id] = existing.id;
          }
        }
      }

      setFeedbackMap(feedbackObj);
      setUserFeedbackMap(userFbMap);
      setFeedbackIdMap(fbIdMap);
    }
  };

  const handleFeedbackChange = (trainingId: string, comment: string) => {
    setUserFeedbackMap((prev) => ({ ...prev, [trainingId]: comment }));
  };

  const handleFeedbackSubmit = async (trainingId: string) => {
    const comment = userFeedbackMap[trainingId];
    const feedbackId = feedbackIdMap[trainingId];
    if (!comment?.trim()) return;

    let error;
    if (feedbackId) {
      ({ error } = await supabase.from("training_feedback").update({ comment }).eq("id", feedbackId));
    } else {
      const { data, error: insertError } = await supabase
        .from("training_feedback")
        .insert({ training_id: trainingId, user_id: user?.id, comment })
        .select("id")
        .single();

      if (!insertError && data?.id) {
        setFeedbackIdMap((prev) => ({ ...prev, [trainingId]: data.id }));
      }
      error = insertError;
    }

    if (!error) {
      setEditingMap((prev) => ({ ...prev, [trainingId]: false }));
      fetchTrainings();
    }
  };

  const filteredTrainings = trainings
    .filter((training) => (filter === "mine" ? training.participant_ids?.includes(user?.id) : true))
    .sort((a, b) => sortDescending ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime());

  const paginatedTrainings = filteredTrainings.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredTrainings.length / pageSize);

  return (
    <BaseDashboardCard header="📋 Closed Trainings" tooltipContent="Summaries and feedback for completed sessions">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="inline-flex items-center space-x-4">
          <span className="text-sm text-gray-400">Filter:</span>
          {['all', 'mine'].map((option) => (
            <button
              key={option}
              className={`text-sm px-3 py-1 rounded-md border ${filter === option ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-zinc-800 text-gray-300 border-zinc-600'}`}
              onClick={() => setFilter(option as "all" | "mine")}
            >
              {option === 'all' ? 'All Trainings' : 'My Trainings'}
            </button>
          ))}
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
            const isEditing = editingMap[training.id];

            return (
              <div key={training.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-5 space-y-4 shadow-md">
                <div className="text-white text-lg font-bold">{training.session_name}</div>
                <div className="text-sm text-zinc-300">📍 {training.location}</div>
                <div className="text-sm text-zinc-400">📅 {new Date(training.date).toLocaleString()}</div>
                <div className="text-sm text-zinc-400">👥 Participants: {training.participant_ids?.length || 0}</div>
                <div className="text-sm text-zinc-400">🎯 Scores Added: {training.total_scores}</div>
                <div className="text-sm text-zinc-400">🔍 Your Scores: {training.user_scores}</div>

                {training.summary && (
                  <div className="text-sm text-gray-300 border-t border-zinc-700 pt-3">
                    <strong className="flex items-center gap-1">🧠 Commander Summary:</strong>
                    <p className="mt-1 text-zinc-200">{training.summary}</p>
                    {training.commander_first_name && training.commander_last_name && (
                      <p className="text-xs text-zinc-500 mt-1">
                        — {training.commander_first_name} {training.commander_last_name}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <h4 className="text-sm text-white font-semibold mb-2">Participant Feedback</h4>
                  {feedbacks.length > 0 ? (
                    <ul className="divide-y divide-zinc-700 bg-zinc-900 rounded-md">
                      {feedbacks.map((fb) => (
                        <li key={fb.id} className="flex items-start gap-4 px-4 py-4 hover:bg-zinc-800">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-700 text-white font-bold">
                            {fb.users?.first_name?.[0]}{fb.users?.last_name?.[0]}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">{fb.users?.first_name} {fb.users?.last_name}</div>
                            <div className="text-xs text-gray-400">{new Date(fb.created_at).toLocaleString()}</div>
                            <div className="mt-1 text-sm text-gray-300">{fb.comment}</div>
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
                    <h4 className="text-sm text-white font-semibold mb-2">Your Feedback</h4>
                    {feedbackIdMap[training.id] && !isEditing ? (
                      <div className="bg-zinc-900 p-3 rounded-md border border-zinc-700 flex items-start justify-between">
                        <p className="text-sm text-gray-300 flex-1">{myFeedback}</p>
                        <button
                          className="text-indigo-400 hover:text-indigo-200 ml-4"
                          onClick={() => setEditingMap((prev) => ({ ...prev, [training.id]: true }))}
                          title="Edit Feedback"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded"
                          rows={3}
                          value={myFeedback}
                          onChange={(e) => handleFeedbackChange(training.id, e.target.value)}
                          placeholder="Write your thoughts about the training..."
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            className="px-4 py-1 text-sm bg-zinc-700 text-white rounded"
                            onClick={() => setEditingMap((prev) => ({ ...prev, [training.id]: false }))}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                            onClick={() => handleFeedbackSubmit(training.id)}
                          >
                            {feedbackIdMap[training.id] ? "Update Feedback" : "Submit Feedback"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!isParticipant && (
                  <p className="text-xs mt-2 text-red-400 italic">You were not a participant in this training. View only mode.</p>
                )}

                <div className="pt-2">
                  <button className="text-sm text-indigo-400 hover:underline" onClick={() => navigate(`/training-summary/${training.id}`)}>
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
          <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} className="px-2 py-1 text-sm bg-zinc-700 rounded disabled:opacity-50" disabled={currentPage === 1}>Prev</button>
          <span className="text-sm text-gray-300">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} className="px-2 py-1 text-sm bg-zinc-700 rounded disabled:opacity-50" disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </BaseDashboardCard>
  );
}
