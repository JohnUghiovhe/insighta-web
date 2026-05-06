"use client";
import React, { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setStatus("Please choose a file first.");

    setStatus("Uploading...");
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/profiles/upload", {
        method: "POST",
        body: form,
        credentials: "include"
      });

      if (!res.ok) {
        const text = await res.text();
        setStatus(`Upload failed: ${res.status} ${text}`);
        return;
      }

      const json = await res.json();
      setStatus(`Upload complete: inserted=${json.inserted} skipped=${json.skipped} total=${json.total_rows}`);
    } catch (err) {
      setStatus(`Upload error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Upload Profiles CSV</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
        </div>
        <button type="submit">Upload</button>
      </form>
      {status && (
        <div style={{ marginTop: 12 }}>
          <pre>{status}</pre>
        </div>
      )}
    </div>
  );
}
