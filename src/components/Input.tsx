import { useRef } from "react";

function Input() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <input ref={inputRef} />
      <button type="button">Go!</button>
    </div>
  );
}

export default Input;
