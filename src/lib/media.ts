export async function getMediaMetadata(url: string) {
  console.log("here");
  return new Promise<{ duration: number; height: number; width: number }>(
    (resolve, reject) => {
      let resolved = false;
      const video = document.createElement("video");
      video.muted = true;
      video.preload = "auto";
      video.onloadedmetadata = () => {
        resolved = true;
        resolve({
          duration: video.duration,
          height: video.videoHeight,
          width: video.videoWidth,
        });
      };
      video.src = url;
      video.load();

      setTimeout(() => {
        if (!resolved) reject();
      }, 5000);
    }
  );
}
