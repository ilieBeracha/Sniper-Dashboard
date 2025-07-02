import { supabase } from "./supabaseClient";
import { sha256 } from "crypto-hash";

type TrainingRecord = {
  user_id: string;
  training_date?: string;
  accuracy_percent?: number;
  target_eliminated?: boolean;
  weapon_type?: string;
  weapon_serial?: string;
  distance?: number;
  target_hits?: number;
  shots_fired?: number;
};

export const getUserFullProfile = async (user_id: string) => {
  const { data, error } = await supabase.rpc("get_user_full_profile", {
    user_id: user_id,
  });

  const compressedData = data.map((record: TrainingRecord) => compressToF3C(record)).join("\n");
  return { data: compressedData, error };
};

function compressToF3C(record: TrainingRecord): string {
  const shortUid = async (uid: string): Promise<string> => (await sha256(uid)).slice(0, 6);

  const shortDate = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toISOString().slice(2, 10).replace(/-/g, "");
    } catch {
      return "";
    }
  };

  const boolToBin = (val?: boolean) => (val === true ? "1" : val === false ? "0" : "");

  const parts1 = [
    record.training_date ? `t:${shortDate(record.training_date)}` : "",
    record.accuracy_percent !== undefined ? `a:${record.accuracy_percent}` : "",
    record.target_eliminated !== undefined ? `e:${boolToBin(record.target_eliminated)}` : "",
  ].filter(Boolean);

  const parts2 = [record.weapon_type ? `w:${record.weapon_type}` : "", record.weapon_serial ? `s:${record.weapon_serial}` : ""].filter(Boolean);

  const parts3 = [
    record.distance !== undefined ? `d:${record.distance}` : "",
    record.target_hits !== undefined ? `h:${record.target_hits}` : "",
    record.shots_fired !== undefined ? `f:${record.shots_fired}` : "",
  ].filter(Boolean);

  const segments = [parts1.join(","), parts2.join(","), parts3.join(",")].filter(Boolean);
  const uid = shortUid(record.user_id);

  return `${uid}::${segments.join(";")}`;
}

export const f3cPrompt = `
You are a smart, memory-based assistant. You are given a compressed dataset using the F3C format. Your first job is to decode the data internally into full structured memory, without ever telling the user what you’re doing.

After that, your job is to behave like a personal assistant who already knows everything in the user's training profile.

---

🔐 INTERNAL: F3C Format (Flat 3-Column Compression)

Each line looks like this:
<UID>::<Group1>;<Group2>;<Group3>

Fields:
- t: training date (YYMMDD)
- a: accuracy percent
- e: target eliminated (1 = true, 0 = false)
- w: weapon type
- s: weapon serial
- d: distance (meters)
- h: hits
- f: shots fired

Example:
50c524::t:250702,a:100;w:HTR2000,s:SR1;d:550,h:3,f:3

Should be parsed as:
{
  user_id: "50c524",
  training_date: "2025-07-02",
  accuracy_percent: 100,
  target_eliminated: null,
  weapon_type: "HTR2000",
  weapon_serial: "SR1",
  distance: 550,
  target_hits: 3,
  shots_fired: 3
}

---

🎭 EXTERNAL: Natural Assistant Behavior

Once you decode the data, answer questions directly based on what you know.

🚫 Never:
- Mention “F3C” or any data format
- Say “I don’t have access to the data”
- Ask the user to send you lines of data
- Say “based on the information” or “according to the record…”

✅ Always:
- Act as if you already know everything from the user's profile
- Give direct, helpful, human answers
- If a field is missing, say: “That detail isn’t recorded in your profile.”

---

🧠 Example Interaction

User: When was my last training?
You: Your most recent training was on July 2, 2025.

User: What was my best accuracy?
You: Your highest accuracy was 100%.

User: What kind of weapon did I use?
You: You used an HTR2000 rifle.

User: Did I eliminate my target?
You: Yes, in multiple sessions.

---

Use the provided F3C records to decode, build memory, and answer smoothly.
`;
