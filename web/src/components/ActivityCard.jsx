// One ".ak" card in the daily-log history. `entry` is one item from the
// `catatan` array returned by GET /api/logs (see shared/api.js / api.entries).

import { ACTIVITIES, moodByValue } from "@shared/activities";
import { formatActivityValue, formatTime } from "@shared/format";
import Icon, { ACTIVITY_ICONS } from "./Icon";
import { activityColorVar } from "../lib/activityColors";

export default function ActivityCard({ entry }) {
  const activity = ACTIVITIES[entry.type];
  const colorVar = activityColorVar(entry.type);
  const mood = entry.type === "breathing" ? moodByValue(entry.mood) : null;

  return (
    <div className="ak">
      <span className="cap" style={{ background: `var(${colorVar})` }} />
      <Icon name={ACTIVITY_ICONS[entry.type]} size={96} className="wm" style={{ color: `var(${colorVar})` }} />
      <div className="jam">{formatTime(entry.loggedAt)}</div>
      <div className="nilai">
        {formatActivityValue(entry.value, activity?.decimal)} <span>{entry.satuan}</span>
      </div>
      <div className="jns" style={{ color: `var(${colorVar})` }}>{entry.namaJenis}</div>
      {mood ? (
        <div className="cat">Perasaan setelah sesi: {mood.emoji} {mood.label}</div>
      ) : entry.note ? (
        <div className="cat">{entry.note}</div>
      ) : null}
    </div>
  );
}
