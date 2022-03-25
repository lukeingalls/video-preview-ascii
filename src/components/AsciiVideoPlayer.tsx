import { FC, useLayoutEffect, useRef } from "react";
import { PlayableIdbVideo } from "../types/idb";

interface AsciiVideoPlayerProps {
  video: PlayableIdbVideo;
}

const AsciiVideoPlayer: FC<AsciiVideoPlayerProps> = ({
  video,
}: AsciiVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  useLayoutEffect(() => {
    let mounted = true;

    function copyVideoToCanvas() {
      if (canvasRef.current && videoRef.current) {
        if (!ctx.current) {
          // TODO: probably can't assume we get a context here
          ctx.current = canvasRef.current.getContext("2d")!;
        }
        ctx.current.drawImage(videoRef.current, 0, 0);
      }
      if (mounted) requestAnimationFrame(copyVideoToCanvas);
    }

    requestAnimationFrame(copyVideoToCanvas);
    return () => {
      mounted = false;
    };
  }, [video.height, video.width]);

  return (
    <div>
      <div>AsciiVideoPlayer</div>
      <canvas
        ref={canvasRef}
        height={video.height}
        width={video.width}
      ></canvas>
      <video
        ref={videoRef}
        src={video.local_url}
        style={{
          position: "fixed",
          width: 0,
          height: 0,
          right: 100000,
        }}
        muted
        autoPlay
        loop
      />
    </div>
  );
};

export default AsciiVideoPlayer;
