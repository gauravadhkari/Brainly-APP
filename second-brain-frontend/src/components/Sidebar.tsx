import {
  Brain,
  FileText,
  Video,
  BookOpen,
  Link2,
  Hash,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

interface Props {
  selectedType: string;
  selectedTag: string;

  tags: string[];

  onTypeChange: (type: string) => void;
  onTagChange: (tag: string) => void;
}

const Sidebar = ({
  selectedType,
  selectedTag,
  tags,
  onTypeChange,
  onTagChange,
}: Props) => {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-4">

      {/* Logo */}

      <div className="mb-8 flex items-center gap-3 px-2">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">

          <Brain
            size={21}
            className="text-white"
          />

        </div>

        <div>

          <h1 className="font-semibold tracking-tight text-zinc-100">
            Cortex
          </h1>

          <p className="text-xs text-zinc-500">
            Second Brain
          </p>

        </div>

      </div>

      {/* Navigation */}

      <nav className="space-y-1">

        <SidebarItem
          icon={
            <Brain size={18} />
          }
          text="All Content"
          active={
            selectedType === ""
          }
          onClick={() =>
            onTypeChange("")
          }
        />

        <SidebarItem
          icon={
            <FileText size={18} />
          }
          text="Notes"
          active={
            selectedType ===
            "note"
          }
          onClick={() =>
            onTypeChange(
              "note"
            )
          }
        />

        <SidebarItem
          icon={
            <Video size={18} />
          }
          text="YouTube"
          active={
            selectedType ===
            "youtube"
          }
          onClick={() =>
            onTypeChange(
              "youtube"
            )
          }
        />

        <SidebarItem
          icon={
            <BookOpen size={18} />
          }
          text="Articles"
          active={
            selectedType ===
            "article"
          }
          onClick={() =>
            onTypeChange(
              "article"
            )
          }
        />

        <SidebarItem
          icon={
            <Link2 size={18} />
          }
          text="Links"
          active={
            selectedType ===
            "link"
          }
          onClick={() =>
            onTypeChange(
              "link"
            )
          }
        />

      </nav>

      {/* Tags */}

      <div className="mt-8">

        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-zinc-600">
          Tags
        </p>

        <div className="mt-8">

  <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-zinc-600">
    Tags
  </p>

  {tags.length === 0 ? (
    <p className="px-3 text-xs text-zinc-600">
      No tags yet
    </p>
  ) : (
    tags.map((tag) => (
      <Tag
        key={tag}
        name={tag}
        active={selectedTag === tag}
        onClick={() =>
          onTagChange(
            selectedTag === tag
              ? ""
              : tag
          )
        }
      />
    ))
  )}
</div>
</div>

      {/* User */}

      <div className="mt-auto">

        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">

            {user?.username
              ?.charAt(0)
              .toUpperCase()}

          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-medium text-zinc-200">
              {user?.username}
            </p>

            <p className="truncate text-xs text-zinc-500">
              {user?.email}
            </p>

          </div>

          <button
            onClick={logout}
            className="text-zinc-500 transition hover:text-zinc-200"
          >

            <LogOut size={17} />

          </button>

        </div>

      </div>

    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({
  icon,
  text,
  active = false,
  onClick,
}: SidebarItemProps) => {
  return (
    <button
      onClick={
        onClick
      }
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-zinc-800 text-zinc-100"
          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
      }`}
    >

      {icon}

      {text}

    </button>
  );
};

interface TagProps {
  name: string;
  active: boolean;
  onClick: () => void;
}

const Tag = ({
  name,
  active,
  onClick,
}: TagProps) => {
  return (
    <button
      onClick={
        onClick
      }
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-violet-500/10 text-violet-400"
          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
      }`}
    >

      <Hash size={14} />

      {name}

    </button>
  );
};

export default Sidebar;