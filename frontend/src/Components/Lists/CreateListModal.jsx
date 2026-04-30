import { useState } from "react";
import { createPortal } from "react-dom";

export default function CreateListModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    await onCreate(formData);
    setSaving(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h4 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">
          Create Collection
        </h4>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              List Name
            </label>
            <input
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="e.g., Best Sci-Fi 2024"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Description (Optional)
            </label>
            <textarea
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white h-32 resize-none focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="What is this collection about?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg text-sm font-bold text-gray-400 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!formData.name.trim() || saving}
            className="flex-1 rounded-lg bg-sky-600 px-4 py-3 text-sm font-black text-white shadow-lg hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? "Creating…" : "CREATE LIST"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
