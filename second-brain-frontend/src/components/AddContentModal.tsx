import { useState } from "react";
import { X } from "lucide-react";

import { createContent } from "../services/createContent";
import { useAuth } from "../context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const AddContentModal = ({
  isOpen,
  onClose,
  onCreated,
}: Props) => {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("note");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setType("note");
    setTags("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!token) return;

    try {
      setLoading(true);
      setError("");

      await createContent(token, {
        title,
        description: description || undefined,
        link: link || undefined,
        type,
        tags: tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      });

      resetForm();

      await onCreated();

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">

        {/* Close button stays fixed */}

        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
        >
          <X size={18} />
        </button>

        {/* Header */}

        <div className="border-b border-zinc-800 px-6 py-5 pr-16">

          <h2 className="text-xl font-semibold text-zinc-100">
            Add Content
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Save something useful to your second brain.
          </p>

        </div>

        {/* Scrollable body */}

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Title */}

            <Field
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="JavaScript Event Loop"
            />

            {/* Link */}

            <Field
              label="Link"
              value={link}
              onChange={setLink}
              placeholder="https://..."
            />

            {/* Type + Tags */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm text-zinc-400">
                  Type
                </label>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-violet-500"
                >

                  <option value="note">
                    Note
                  </option>

                  <option value="youtube">
                    YouTube
                  </option>

                  <option value="twitter">
                    Twitter
                  </option>

                  <option value="article">
                    Article
                  </option>

                  <option value="document">
                    Document
                  </option>

                  <option value="link">
                    Link
                  </option>

                </select>

              </div>

              <Field
                label="Tags"
                value={tags}
                onChange={setTags}
                placeholder="javascript, backend"
              />

            </div>

            {/* Description */}

            <div>

              <label className="mb-2 block text-sm text-zinc-400">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Short note about this content..."
                rows={3}
                className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-violet-500"
              />

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
              >
                {loading
                  ? "Adding..."
                  : "Add Content"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

interface FieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const Field = ({
  label,
  value,
  placeholder,
  onChange,
}: FieldProps) => {
  return (
    <div>

      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-violet-500"
      />

    </div>
  );
};

export default AddContentModal;