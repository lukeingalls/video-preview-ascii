import type { DBSchema } from "idb";

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

export type IdbVideo = DB["videos"]["value"];
export type PlayableIdbVideo = IdbVideo & { local_url: string };
