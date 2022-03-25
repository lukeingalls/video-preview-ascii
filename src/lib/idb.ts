import { openDB } from "idb";
import type { DB } from "../types/idb";

let idbError = false;
const idb = openDB<DB>("ascii-video-preview", 1, {
  upgrade(db) {
    if (db.version <= 1) {
      if (!db.objectStoreNames.contains("videos")) {
        db.createObjectStore("videos", { keyPath: "url" });
      }
    }
  },
  blocked() {
    idbError = true;
  },
  blocking() {
    idbError = true;
  },
  terminated() {
    idbError = true;
  },
});

export async function getVideo(url: string) {
  return (await idb).get("videos", url);
}

export async function getAllVideos() {
  return (await idb).getAll("videos");
}

export async function putVideo(videoData: {
  duration: number;
  height: number;
  width: number;
  video: File;
  url: string;
}) {
  return (await idb).put("videos", { ...videoData, dateTimeAdded: Date.now() });
}
export { idb, idbError };
