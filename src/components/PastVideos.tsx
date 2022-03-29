import { useEffect, useState } from "react";
import { getAllVideos } from "../lib/idb";
import type { PlayableIdbVideo } from "../types/idb";
import AsciiVideoPlayer from "./AsciiVideoPlayer";

function PastVideos() {
  const [videos, setVideos] = useState<PlayableIdbVideo[]>([]);

  useEffect(() => {
    let mounted = true;
    getAllVideos().then((_vids) => {
      if (mounted) {
        const vids = _vids.map((v) => {
          return {
            local_url: URL.createObjectURL(v.video),
            ...v,
          };
        });
        setVideos(vids);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <div>Past Videos</div>
      {/* <div>
        {videos.map((video) => {
          return (
            <video
              controls
              key={video.url}
              muted
              playsInline
              src={video.local_url}
            />
          );
        })}
      </div> */}

      <div>
        {videos.map((video) => {
          return <AsciiVideoPlayer key={video.url} video={video} />;
        })}
      </div>
    </div>
  );
}

export default PastVideos;
