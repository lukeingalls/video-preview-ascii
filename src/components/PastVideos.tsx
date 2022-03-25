import { useEffect, useState } from "react";
import { DB, getAllVideos } from "../lib/idb";

function PastVideos() {
  const [videos, setVideos] = useState<
    Array<DB["videos"]["value"] & { local_url: string }>
  >([]);

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
      <div>
        {videos.map((video) => {
          return <video src={video.local_url} controls playsInline muted />;
        })}
      </div>
    </div>
  );
}

export default PastVideos;
