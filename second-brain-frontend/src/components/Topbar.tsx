import {
  Plus,
  Search,
  Share2,
} from "lucide-react";

interface Props {
  search: string;

  onSearchChange: (
    value: string
  ) => void;

  onAddContent: () => void;
  onShare: () => void;
}

const Topbar = ({
  search,
  onSearchChange,
  onAddContent,
  onShare,
}: Props) => {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/80 px-8 py-4 backdrop-blur-xl">

      <div className="flex items-center justify-between gap-6">

        {/* Search */}

        <div className="relative w-full max-w-md">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }
            placeholder="Search your brain..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/70 py-2.5 pl-10 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
          />

        </div>

        {/* Buttons */}

        <div className="flex items-center gap-3">
         <button
  onClick={onShare}
  className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
>
  <Share2 size={16} />
  Share
</button>

          <button
            onClick={
              onAddContent
            }
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
          >

            <Plus size={17} />

            Add Content

          </button>

        </div>

      </div>

    </header>
  );
};

export default Topbar;