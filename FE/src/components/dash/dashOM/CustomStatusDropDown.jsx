import { useState,useRef,useEffect } from "react";

export default function CustomStatusDropdown({ value, options, onChange, onBlur, getStatusClass }) {
  const [open, setOpen] = useState(true);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        if (onBlur) onBlur();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onBlur]);

  return (
    <div className="relative inline-block" ref={ref}>
      <span
        className={`px-3 py-1 text-sm rounded-full cursor-pointer ${getStatusClass(value)}`}
        onClick={() => setOpen((v) => !v)}
      >
        {value}
      </span>
      {open && (
        <div className="absolute z-10 mt-1 bg-white border rounded shadow min-w-[120px]">
          {options.map((opt) => (
            <div
              key={opt}
              className={`px-3 py-1 text-sm rounded-full cursor-pointer m-1 ${getStatusClass(opt)} ${opt === value ? "ring-2 ring-black/20" : ""}`}
              onClick={() => {
                if (opt !== value) onChange(opt);
                setOpen(false);
                if (onBlur) onBlur();
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}