import { DBSchema, openDB } from "idb";

interface DB extends DBSchema {
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

export { idb, idbError };
