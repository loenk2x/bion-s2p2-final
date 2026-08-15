// AddEntryModal is mounted once in AppShell, above the routed page, so a page
// like Home or DailyLog has no direct way to hear about a newly-saved entry.
// A window event is the simplest bridge for that — deliberately not put in
// @shared since it is DOM-specific plumbing, not portable to React Native.

import { useEffect } from "react";

const EVENT_NAME = "healthylife:entry-added";

export function notifyEntryAdded() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useEntryAddedListener(callback) {
  useEffect(() => {
    window.addEventListener(EVENT_NAME, callback);
    return () => window.removeEventListener(EVENT_NAME, callback);
  }, [callback]);
}
