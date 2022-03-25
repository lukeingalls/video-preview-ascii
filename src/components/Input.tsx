import { useCallback, useRef, useState } from "react";
import isUrl from "is-url";
import { getMediaMetadata } from "../lib/media";
import { getVideo, putVideo } from "../lib/idb";

function Input() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!inputRef.current) return console.error("No input");

    const url = inputRef.current.value;
    if (!isUrl(url)) return console.error("Not a url");

    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1] || `myfile-${Math.random()}`;

    try {
      setLoading(true);
      const isInIdb = await getVideo(url);
      if (isInIdb) console.info("Hooray!");
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], filename);
      const localUrl = URL.createObjectURL(file);
      const { duration, width, height } = await getMediaMetadata(localUrl);
      await putVideo({
        duration,
        width,
        height,
        url,
        video: file,
      });
    } catch (e) {
      console.error("😭 ", e);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <>Loading...</>;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input ref={inputRef} />
      <button type="submit">Go!</button>
    </form>
  );
}

export default Input;
