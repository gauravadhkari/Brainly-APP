import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import {
  updateContent,
} from "../services/contentApi";

import type { Content } from "../types/content";

interface Props {
  isOpen: boolean;
  content: Content | null;

  onClose: () => void;
  onUpdated: () => void;
}

const EditContentModal = ({
  isOpen,
  content,
  onClose,
  onUpdated,
}: Props) => {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [link, setLink] = useState("");
  const [type, setType] = useState("note");
  const [tags, setTags] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!content) return;

    setTitle(content.title || "");
    setDescription(
      content.description || ""
    );

    setLink(content.link || "");
    setType(content.type || "note");

    setTags(
      content.tags?.join(", ") || ""
    );
  }, [content]);

  if (!isOpen || !content) {
    return null;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!token) return;

    try {
      setLoading(true);
      setError("");

      await updateContent(
        token,
        content._id,
        {
          title,
          description:
            description || undefined,

          link:
            link || undefined,

          type,

          tags: tags
            .split(",")
            .map((tag) =>
              tag
                .trim()
                .toLowerCase()
            )
            .filter(Boolean),
        }
      );

      onUpdated();
      onClose();
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(
          error.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-zinc-100">
              Edit Content
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update your saved content.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X size={18} />
          </button>

        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <Input
            label="Title"
            value={title}
            onChange={setTitle}
          />

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-violet-500"
            />
          </div>

          <Input
            label="Link"
            value={link}
            onChange={setLink}
          />

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-violet-500"
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

          <Input
            label="Tags"
            value={tags}
            onChange={setTags}
          />

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

interface InputProps {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}

const Input = ({
  label,
  value,
  onChange,
}: InputProps) => {
  return (
    <div>

      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-violet-500"
      />

    </div>
  );
};

export default EditContentModal;