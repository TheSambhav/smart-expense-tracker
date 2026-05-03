"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { importCsvData } from "@/actions/import";
import { useRouter } from "next/navigation";

export function ImportButton() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await importCsvData(formData);
      if (res.success) {
        alert(`Successfully imported ${res.inserted} transactions. Skipped ${res.skipped} duplicates.`);
        router.refresh(); // Refresh dashboard data
      }
    } catch (err: any) {
      alert("Failed to import: " + err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {loading ? "Importing..." : "Import CSV"}
      </button>
    </div>
  );
}
