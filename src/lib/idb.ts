import { DBSchema, openDB } from "idb";

export interface DB extends DBSchema {
  videos: {
    value: {
      /** The video the url was originally fetched from */
      url: string;

      /** The video file */
      video: File;

      /** Doration of the video (seconds) */
      duration: number;

      /** Width of the video */
      width: number;

      /** Height of the video */
      height: number;

      /** When the asset was added to idb */
      dateTimeAdded: number;
    };
    key: string;
  };
}

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
