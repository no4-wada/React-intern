import { EventInput } from "@fullcalendar/react";

let eventGuid = 0;
const todayStr = new Date().toISOString().replace(/T.*$/, "");  // 今日の日付をYYYY-MM-DD形式にする
export const createEventId = () => String(eventGuid++);
export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: "All-day event",
    content: "wow",
    start: todayStr,
    end: todayStr + "T11:00:00",
  },
  {
    id: createEventId(),
    title: "Timed event",
    start: todayStr + "T12:00:00",  // 時刻はTで結ぶ
  },
];