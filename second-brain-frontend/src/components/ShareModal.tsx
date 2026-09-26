import {
  Copy,
  Check,
  Share2,
  X,
} from "lucide-react";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  link: string;
  loading?: boolean;

  onClose: () => void;
  onDisable: () => void;
}

const ShareModal = ({
  isOpen,
  link,
  loading = false,
  onClose,
  onDisable,
}: Props) => {
  const [copied, setCopied] =
    useState(false);

  if (!isOpen) return null;

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      link
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
        >
          <X size={18} />
        </button>

        <div className="mb-6 flex items-start gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Share2 size={20} />
          </div>

          <div>

            <h2 className="text-xl font-semibold text-zinc-100">
              Share your brain
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Anyone with this link can view your shared content.
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-2">

          <input
            value={link}
            readOnly
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-zinc-400 outline-none"
          />

          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
          >
            {copied ? (
              <>
                <Check size={15} />
                Copied
              </>
            ) : (
              <>
                <Copy size={15} />
                Copy
              </>
            )}
          </button>

        </div>

        <div className="mt-6 flex justify-end">

          <button
            onClick={onDisable}
            disabled={loading}
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50"
          >
            {loading
              ? "Disabling..."
              : "Disable Sharing"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ShareModal;