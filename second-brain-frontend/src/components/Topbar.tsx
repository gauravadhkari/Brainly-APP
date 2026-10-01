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
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 sm:px-6 lg:px-8 lg:py-4 backdrop-blur-xl">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

        {/* Search */}

        <div className="relative min-w-0 w-full sm:max-w-md">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            aria-label="Search your brain"
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

        <div className="flex shrink-0 items-center gap-3">
         <button
  onClick={onShare}
  className="flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl sm:flex-none border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
>
  <Share2 size={16} />
  Share
</button>

          <button
            onClick={
              onAddContent
            }
            className="flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl sm:flex-none bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
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