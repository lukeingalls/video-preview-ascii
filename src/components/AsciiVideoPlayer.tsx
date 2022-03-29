import { FC, useLayoutEffect, useRef, useState } from "react";
import { PlayableIdbVideo } from "../types/idb";

interface AsciiVideoPlayerProps {
  video: PlayableIdbVideo;
}

const CANVAS_MAX_SIZE = 100;
// const ASCII_GRADIENT = " .,-<o*wW";
const ASCII_GRADIENT = "W*<-. ";

const AsciiVideoPlayer: FC<AsciiVideoPlayerProps> = ({
  video,
}: AsciiVideoPlayerProps) => {
  const [videoString, setVideoString] = useState("");
  const [lineHeight, setLineHeight] = useState(14);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const maxBorderSize = Math.max(video.height, video.width);
  const canvasWidth = (CANVAS_MAX_SIZE * video.width) / maxBorderSize;
  const canvasHeight = (CANVAS_MAX_SIZE * video.height) / maxBorderSize;

  useLayoutEffect(() => {
    let mounted = true;

    function copyVideoToCanvas() {
      if (canvasRef.current && videoRef.current) {
        if (!ctx.current) {
          // TODO: probably can't assume we get a context here
          ctx.current = canvasRef.current.getContext("2d")!;
        }
        ctx.current.drawImage(
          videoRef.current,
          0,
          0,
          canvasWidth,
          canvasHeight
        );
        const { data, width } = ctx.current.getImageData(
          0,
          0,
          canvasWidth,
          canvasHeight
        );
        ctx.current.font = "14px monospace";
        const { width: textWidth } = ctx.current.measureText("W");
        setLineHeight(textWidth);

        const chars = [];
        let nextNewLine = width;

        for (let i = 0; i < data.length; i += 4) {
          if (i && i / 4 >= nextNewLine) {
            chars.push("\n");
            nextNewLine += width;
          }
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          const grayVal = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
          chars.push(
            ASCII_GRADIENT[Math.floor(grayVal * ASCII_GRADIENT.length)]
          );
        }
        setVideoString(chars.join(""));
      }
      if (mounted) requestAnimationFrame(copyVideoToCanvas);
    }

    requestAnimationFrame(copyVideoToCanvas);
    return () => {
      mounted = false;
    };
  }, [canvasHeight, canvasWidth, video.height, video.width]);

  return (
    <div>
      <div>AsciiVideoPlayer</div>
      <canvas
        ref={canvasRef}
        height={canvasHeight}
        width={canvasWidth}
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
      <p
        style={{
          fontSize: 14,
          fontFamily: "monospace",
          whiteSpace: "pre",
          lineHeight: `${lineHeight}px`,
        }}
      >
        {videoString}
      </p>
    </div>
  );
};

export default AsciiVideoPlayer;
