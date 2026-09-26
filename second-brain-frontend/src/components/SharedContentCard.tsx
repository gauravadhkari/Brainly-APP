import {
  ExternalLink,
  Brain,
} from "lucide-react";

import type {
  Content,
} from "../types/content";

interface Props {
  content: Content;
}

const SharedContentCard = ({
  content,
}: Props) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700 hover:bg-zinc-900">

      <div className="mb-5 flex items-center justify-between">

        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-medium capitalize text-violet-400">
          {content.type}
        </span>

        <Brain
          size={16}
          className="text-zinc-700"
        />

      </div>

      <h3 className="mb-2 font-medium leading-6 text-zinc-100">
        {content.title}
      </h3>

      {content.description && (
        <p className="mb-5 line-clamp-3 text-sm leading-6 text-zinc-500">
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
          <ExternalLink size={14} />

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

export default SharedContentCard;