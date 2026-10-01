import { Trash2, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({
  isOpen,
  loading = false,
  onClose,
  onConfirm,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-4 backdrop-blur-sm">

      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-2xl">

        <div className="mb-5 flex items-start justify-between">

          <div className="flex gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Trash2 size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Delete content?
              </h2>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                This action cannot be undone.
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
          aria-label="Close dialog"
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X size={18} />
          </button>

        </div>

        <div className="flex justify-end gap-3 flex-wrap">

          <button
            onClick={onClose}

            className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-400 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteConfirmModal;