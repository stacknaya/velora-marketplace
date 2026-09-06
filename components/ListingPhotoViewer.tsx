"use client";

import { useState } from "react";

export default function ListingPhotoViewer({
  image,
  title
}: {
  image: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative mx-auto block h-[300px] w-full max-w-[900px] overflow-hidden rounded-[2rem] bg-neutral-200"
      >
        <img
          src={`/api/image?pathname=${encodeURIComponent(image)}`}
          alt={title}
          className="h-full w-full object-cover"
        />

        <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#172033] shadow">
          View photo
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 text-lg font-bold text-[#172033]"
          >
            ✕
          </button>

          <img
            src={`/api/image?pathname=${encodeURIComponent(image)}`}
            alt={title}
            className="max-h-[90vh] max-w-[95vw] object-contain"
          />
        </div>
      )}
    </>
  );
}
