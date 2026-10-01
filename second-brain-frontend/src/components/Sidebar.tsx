import { useState } from "react";
import {
  Menu,
  X,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const selectType = (type: string) => {
    onTypeChange(type);
    setMenuOpen(false);
  };
  const selectTag = (tag: string) => {
    onTagChange(tag);
    setMenuOpen(false);
  };
  const {
    user,
    logout,
  } = useAuth();

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2 font-semibold"><Brain className="text-violet-400" size={22} /> Cortex</div>
        <button type="button" aria-expanded={menuOpen} aria-controls="brain-navigation" onClick={() => setMenuOpen(!menuOpen)} className="flex min-h-11 items-center gap-2 rounded-xl border border-zinc-800 px-3 text-sm">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
          {menuOpen ? "Close menu" : "Menu"}
        </button>
      </div>
      <aside id="brain-navigation" aria-label="Workspace navigation" onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }} className={`${menuOpen ? "flex" : "hidden"} w-full flex-col border-b border-zinc-800 bg-zinc-950 p-4 lg:fixed lg:left-0 lg:top-0 lg:z-30 lg:flex lg:h-dvh lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:border-r`}>

      {/* Logo */}

      <div className="mb-8 hidden items-center gap-3 px-2 lg:flex">

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
            selectType("")
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
            selectType(
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
            selectType(
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
            selectType(
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
            selectType(
              "link"
            )
          }
        />

      </nav>

      {/* Tags */}

      <div className="my-6 min-w-0">

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
          selectTag(selectedTag === tag ? "" : tag)
        }
      />
    ))
  )}
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
            aria-label="Log out"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-500 transition hover:text-zinc-200"
          >

            <LogOut size={17} />

          </button>

        </div>

      </div>

    </aside>
    </>
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

      <span className="min-w-0 break-all text-left">{name}</span>

    </button>
  );
};

export default Sidebar;