import BaseDashboardCard from "@/components/BaseDashboardCard";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { supabase } from "@/services/supabaseClient";
import { userStore } from "@/store/userStore";
import { PlusCircle } from "lucide-react";

export default function UserNotebook() {
  const { user } = useStore(userStore);
  const [errorNotes, setErrorNotes] = useState<ErrorNote[]>([]);
  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);

  const [newNote, setNewNote] = useState("");
  const [newReflection, setNewReflection] = useState({
    training_summary: "",
    key_focus: "",
    recurring_mistakes: "",
    next_goal: "",
  });

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState("");
  const [editingReflectionId, setEditingReflectionId] = useState<string | null>(null);
  const [editingReflectionContent, setEditingReflectionContent] = useState<Partial<Reflection>>({});

  type ErrorNote = {
    note: string;
    created_at: string;
  };

  type PersonalNote = {
    id: string;
    content: string;
    created_at: string;
  };

  type Reflection = {
    id: string;
    training_summary: string;
    key_focus: string;
    recurring_mistakes: string;
    next_goal: string;
    week_start?: string;
    created_at?: string;
  };

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id) return;

      const { data: scoreIds, error: idError } = await supabase.from("score_participants").select("score_id").eq("user_id", user.id);
      if (idError) return;

      const ids = scoreIds?.map((s) => s.score_id) || [];
      const { data: allNotes } = await supabase.from("score").select("note, created_at").in("id", ids).order("created_at", { ascending: false });

      const filteredNotes = (allNotes || []).filter((n) => n.note && n.note.trim() !== "").slice(0, 3);

      const { data: personal } = await supabase
        .from("user_notes")
        .select("id, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const { data: reflectionsData } = await supabase
        .from("user_reflections")
        .select("*")
        .eq("user_id", user.id)
        .order("week_start", { ascending: false });

      setErrorNotes(filteredNotes);
      setPersonalNotes(personal || []);
      setReflections(reflectionsData || []);
    };

    fetchNotes();
  }, [user?.id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const { data, error } = await supabase
      .from("user_notes")
      .insert({
        user_id: user?.id,
        content: newNote,
      })
      .select()
      .single();
    if (!error && data) {
      setPersonalNotes((prev) => [data, ...prev]);
      setNewNote("");
    }
  };

  const handleUpdateNote = async (id: string) => {
    const { error } = await supabase.from("user_notes").update({ content: editingNoteContent }).eq("id", id);
    if (!error) {
      setPersonalNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content: editingNoteContent } : n)));
      setEditingNoteId(null);
      setEditingNoteContent("");
    }
  };

  const handleDeleteNote = async (id: string) => {
    await supabase.from("user_notes").delete().eq("id", id);
    setPersonalNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAddReflection = async () => {
    const { data, error } = await supabase
      .from("user_reflections")
      .insert({
        user_id: user?.id,
        ...newReflection,
      })
      .select()
      .single();
    if (!error && data) {
      setReflections((prev) => [data, ...prev]);
      setNewReflection({ training_summary: "", key_focus: "", recurring_mistakes: "", next_goal: "" });
    }
  };

  const handleUpdateReflection = async (id: string) => {
    const { error } = await supabase.from("user_reflections").update(editingReflectionContent).eq("id", id);
    if (!error) {
      setReflections((prev) => prev.map((r) => (r.id === id ? { ...r, ...editingReflectionContent } : r)));
      setEditingReflectionId(null);
      setEditingReflectionContent({});
    }
  };

  const handleDeleteReflection = async (id: string) => {
    await supabase.from("user_reflections").delete().eq("id", id);
    setReflections((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <BaseDashboardCard header="🗒️ Personal Notebook" tooltipContent="Your log of errors, notes, and tactical reflections">
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-semibold text-white mb-2">Latest Shooting Error Notes</h2>
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-2">
            {errorNotes.length === 0 ? (
              <p className="text-sm text-gray-500">No recent notes found.</p>
            ) : (
              errorNotes.map((n, i) => (
                <p key={i} className="text-sm text-gray-300">
                  • {n.note}
                </p>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white mb-2">📌 My Notes</h2>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a reminder or thought..."
            className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white mb-2"
          />
          <button onClick={handleAddNote} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm font-medium text-white">
            <PlusCircle className="inline-block w-4 h-4 mr-1" /> Add Note
          </button>

          <div className="mt-4 space-y-2">
            {personalNotes.map((n) => (
              <div key={n.id} className="bg-zinc-800 border border-zinc-700 p-3 rounded-md text-sm text-gray-200">
                {editingNoteId === n.id ? (
                  <>
                    <textarea
                      value={editingNoteContent}
                      onChange={(e) => setEditingNoteContent(e.target.value)}
                      className="w-full p-2 rounded bg-zinc-900 text-white"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleUpdateNote(n.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                        Save
                      </button>
                      <button onClick={() => setEditingNoteId(null)} className="text-xs bg-gray-600 text-white px-2 py-1 rounded">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{n.content}</span>
                    <div className="flex gap-3 mt-1 text-xs text-indigo-400">
                      <button
                        onClick={() => {
                          setEditingNoteId(n.id);
                          setEditingNoteContent(n.content);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteNote(n.id)} className="text-red-400">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white mb-2">📊 Tactical Reflections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(newReflection).map(([key, val]) => (
              <textarea
                key={key}
                placeholder={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                value={val}
                onChange={(e) => setNewReflection({ ...newReflection, [key]: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-md"
              />
            ))}
          </div>
          <button
            onClick={handleAddReflection}
            className="mt-4 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm font-medium text-white"
          >
            Save Reflection
          </button>

          <div className="mt-6 space-y-4">
            {reflections.map((r) => (
              <div key={r.id} className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg space-y-2">
                {editingReflectionId === r.id ? (
                  <>
                    {Object.entries(r)
                      .filter(([key]) => key !== "id")
                      .map(([key]) => (
                        <textarea
                          key={key}
                          placeholder={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          value={(editingReflectionContent as any)[key] || ""}
                          onChange={(e) => setEditingReflectionContent({ ...editingReflectionContent, [key]: e.target.value })}
                          className="w-full p-2 bg-zinc-900 border border-zinc-700 text-white rounded"
                        />
                      ))}
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateReflection(r.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                        Save
                      </button>
                      <button onClick={() => setEditingReflectionId(null)} className="text-xs bg-zinc-600 text-white px-2 py-1 rounded">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Summary:</strong> {r.training_summary}
                    </p>
                    <p>
                      <strong>Focus:</strong> {r.key_focus}
                    </p>
                    <p>
                      <strong>Mistakes:</strong> {r.recurring_mistakes}
                    </p>
                    <p>
                      <strong>Goal:</strong> {r.next_goal}
                    </p>
                    <div className="flex gap-3 text-xs text-indigo-400">
                      <button
                        onClick={() => {
                          setEditingReflectionId(r.id);
                          setEditingReflectionContent(r);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteReflection(r.id)} className="text-red-400">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseDashboardCard>
  );
}
