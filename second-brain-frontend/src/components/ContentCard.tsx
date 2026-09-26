import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  Content,
} from "../types/content";

interface Props {
  content: Content;

  onEdit: (
    content: Content
  ) => void;

  onDelete: (
    id: string
  ) => void;
}

const ContentCard = ({
  content,
  onEdit,
  onDelete,
}: Props) => {
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  return (
    <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900">

      <div className="mb-5 flex items-center justify-between">

        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-medium capitalize text-violet-400">

          {content.type}

        </span>

        <div className="relative">

          <button
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
            className="rounded-lg p-1.5 text-zinc-600 transition hover:bg-zinc-800 hover:text-zinc-300"
          >
            <MoreHorizontal
              size={18}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 w-32 rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-xl">

              <button
                onClick={() => {
                  onEdit(
                    content
                  );

                  setMenuOpen(
                    false
                  );
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Pencil
                  size={14}
                />

                Edit
              </button>

              <button
                onClick={() => {
                  onDelete(
                    content._id
                  );

                  setMenuOpen(
                    false
                  );
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <Trash2
                  size={14}
                />

                Delete
              </button>

            </div>
          )}

        </div>

      </div>

      <h3 className="mb-2 font-medium leading-6 text-zinc-100">
        {content.title}
      </h3>

      {content.description && (
        <p className="mb-5 line-clamp-2 text-sm leading-6 text-zinc-500">
          {content.description}
        </p>
      )}

      {content.link && (
        <a
          href={content.link}
          target="_blank"
          rel="noreferrer"
          className="mb-5 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-violet-400"
        >
          <ExternalLink
            size={14}
          />

          Open resource
        </a>
      )}

      <div className="flex flex-wrap gap-2">

        {content.tags?.map(
          (tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400"
            >
              #{tag}
            </span>
          )
        )}

      </div>

    </div>
  );
};

export default ContentCard;