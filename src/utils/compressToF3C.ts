import { userStore } from "@/store/userStore";

function shortUid(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = (hash << 5) - hash + uid.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).slice(0, 6);
}

export async function compressToF3C(record: any): Promise<string> {
  const user = userStore.getState().user;
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

  // Handle Score objects
  if (record.position !== undefined || record.assignment_session !== undefined) {
    const parts1 = [
      record.created_at ? `t:${shortDate(record.created_at)}` : "",
      record.target_eliminated !== undefined ? `e:${boolToBin(record.target_eliminated)}` : "",
      record.first_shot_hit !== undefined ? `fh:${boolToBin(record.first_shot_hit)}` : "",
    ].filter(Boolean);

    const parts2 = [
      record.position ? `p:${record.position}` : "",
      record.day_night ? `dn:${record.day_night}` : "",
      record.assignment_session?.assignment?.assignment_name ? `a:${record.assignment_session.assignment.assignment_name}` : "",
    ].filter(Boolean);

    const parts3 = [
      record.distance !== undefined ? `d:${record.distance}` : "",
      record.wind_strength !== undefined ? `ws:${record.wind_strength}` : "",
      record.wind_direction !== undefined ? `wd:${record.wind_direction}` : "",
      record.time_until_first_shot !== undefined ? `tf:${record.time_until_first_shot}` : "",
    ].filter(Boolean);

    const parts4 = [
      record.note ? `n:${record.note.slice(0, 50)}` : "",
    ].filter(Boolean);

    const segments = [parts1.join(","), parts2.join(","), parts3.join(","), parts4.join(",")].filter(Boolean);
    const uid = shortUid(user?.id || "");

    return `${uid}::${segments.join(";")}`;
  }

  // Handle Training objects (existing logic)
  const parts1 = [
    record.training_date || record.date ? `t:${shortDate(record.training_date || record.date)}` : "",
    record.target_eliminated !== undefined ? `e:${boolToBin(record.target_eliminated)}` : "",
  ].filter(Boolean);

  const parts2 = [
    record.weapon_type ? `w:${record.weapon_type}` : "",
    record.weapon_serial ? `s:${record.weapon_serial}` : "",
    record.session_name ? `sn:${record.session_name}` : "",
    record.location ? `l:${record.location}` : "",
    record.status ? `st:${record.status}` : "",
  ].filter(Boolean);

  const parts3 = [
    record.distance !== undefined ? `d:${record.distance}` : "",
    record.target_hits !== undefined ? `h:${record.target_hits}` : "",
    record.shots_fired !== undefined ? `f:${record.shots_fired}` : "",
  ].filter(Boolean);

  const segments = [parts1.join(","), parts2.join(","), parts3.join(",")].filter(Boolean);
  const uid = shortUid(user?.id || "");

  return `${uid}::${segments.join(";")}`;
}
