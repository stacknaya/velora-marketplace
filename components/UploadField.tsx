"use client";

import { useState } from "react";

export default function UploadField({
  value,
  onChange
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [status, setStatus] = useState("");

  async function upload(file?: File) {
    if (!file) return;

    setStatus("Uploading...");

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || "Upload failed");
        return;
      }

      if (!data.url) {
        setStatus("Upload completed but no image URL was returned");
        return;
      }

      setStatus("Uploaded");
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Upload failed. Please try again.");
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-black/20 bg-neutral-50 p-6">
      <label className="block cursor-pointer text-sm font-bold">
        Choose an image
        <input
          type="file"
          accept="image/*"
          className="mt-3 block w-full text-sm"
          onChange={(e) => upload(e.target.files?.[0])}
        />
      </label>

      {status && (
        <p className="mt-3 text-sm text-black/55">{status}</p>
      )}

      {value && (
        <div className="mt-4">
          <img
            src={value}
            alt="Uploaded asset"
            className="max-h-64 rounded-2xl object-cover"
          />
        </div>
      )}
    </div>
  );
}
