import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ContentCard from "../components/ContentCard";
import AddContentModal from "../components/AddContentModal";
import EditContentModal from "../components/EditContentModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ShareModal from "../components/ShareModal";

import {
  enableSharing,
  disableSharing,
} from "../services/contentApi";

import { useAuth } from "../context/AuthContext";

import {
  getContents,
  deleteContent,
} from "../services/contentApi";

import type { Content } from "../types/content";

const Dashboard = () => {
  const { token } =
    useAuth();

  const [
    contents,
    setContents,
  ] = useState<Content[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    isAddModalOpen,
    setIsAddModalOpen,
  ] = useState(false);

  const [
    isEditOpen,
    setIsEditOpen,
  ] = useState(false);

  const [
    selectedContent,
    setSelectedContent,
  ] =
    useState<Content | null>(
      null
    );

  const [
    deleteId,
    setDeleteId,
  ] =
    useState<string | null>(
      null
    );

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  // Search / filters

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedType,
    setSelectedType,
  ] = useState("");

  const [
    selectedTag,
    setSelectedTag,
  ] = useState("");

  const [
    sort,
    setSort,
  ] = useState<
    "newest" | "oldest"
  >("newest");

  // Pagination

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalItems,
    setTotalItems,
  ] = useState(0);
  const [
  shareModalOpen,
  setShareModalOpen,
] = useState(false);

const [
  shareLink,
  setShareLink,
] = useState("");

const [
  shareLoading,
  setShareLoading,
] = useState(false);
  const fetchContents =
    useCallback(async () => {
      try {
        if (!token) return;

        setLoading(true);
        setError("");

        const data =
          await getContents(
            token,
            {
              search,
              type:
                selectedType,
              tag:
                selectedTag,
              sort,
              page,
              limit: 9,
            }
          );

        setContents(
          data.content || []
        );

        setTotalPages(
          data.pagination
            ?.totalPages || 1
        );

        setTotalItems(
          data.pagination
            ?.totalItems || 0
        );
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
    }, [
      token,
      search,
      selectedType,
      selectedTag,
      sort,
      page,
    ]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleEdit = (
    content: Content
  ) => {
    setSelectedContent(
      content
    );

    setIsEditOpen(true);
  };

  const handleDelete = (
    id: string
  ) => {
    setDeleteId(id);
  };

  const confirmDelete =
    async () => {
      if (
        !token ||
        !deleteId
      ) {
        return;
      }

      try {
        setDeleteLoading(
          true
        );

        setError("");

        await deleteContent(
          token,
          deleteId
        );

        setDeleteId(null);

        await fetchContents();
      } catch (error) {
        if (
          error instanceof Error
        ) {
          setError(
            error.message
          );
        }
      } finally {
        setDeleteLoading(
          false
        );
      }
    };
    const handleShare = async () => {
  if (!token) return;

  try {
    setShareLoading(true);
    setError("");

    const data =
      await enableSharing(token);

    const publicUrl =
  `${window.location.origin}/share/${data.shareId}`;

setShareLink(publicUrl);

    setShareModalOpen(true);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    }
  } finally {
    setShareLoading(false);
  }
};
const handleDisableSharing =
  async () => {
    if (!token) return;

    try {
      setShareLoading(true);

      await disableSharing(token);

      setShareLink("");

      setShareModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setShareLoading(false);
    }
  };
const availableTags = Array.from(
  new Set(
    contents.flatMap(
      (content) =>
        content.tags || []
    )
  )
);
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Sidebar */}

      <Sidebar
        selectedType={selectedType}
  selectedTag={selectedTag}
  tags={availableTags}

  onTypeChange={(type) => {
    setSelectedType(type);
    setPage(1);
  }}

  onTagChange={(tag) => {
    setSelectedTag(tag);
    setPage(1);
  }}
      />

      <main className="ml-64 min-h-screen">

        {/* Topbar */}

        <Topbar
  search={search}
  onSearchChange={(value) => {
    setSearch(value);
    setPage(1);
  }}
  onAddContent={() =>
    setIsAddModalOpen(true)
  }
  onShare={handleShare}
/>

        <section className="p-8">

          {/* Heading */}

          <div className="mb-8">

            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
              Workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              My Second Brain
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Everything you've
              saved, organized
              in one place.
            </p>

          </div>

          {/* Controls */}

          <div className="mb-6 flex items-center justify-between gap-4">

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">

              <span>
                {totalItems} items
              </span>

              {selectedType && (
                <span className="rounded-lg bg-zinc-900 px-3 py-1.5">
                  Type:{" "}
                  {selectedType}
                </span>
              )}

              {selectedTag && (
                <span className="rounded-lg bg-violet-500/10 px-3 py-1.5 text-violet-400">
                  #
                  {selectedTag}
                </span>
              )}

            </div>

            {/* Sorting */}

            <select
              value={sort}
              onChange={(e) => {
                setSort(
                  e.target
                    .value as
                    | "newest"
                    | "oldest"
                );

                setPage(1);
              }}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 outline-none focus:border-violet-500"
            >

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

            </select>

          </div>

          {/* Loading */}

          {loading && (
            <div className="text-zinc-500">
              Loading your
              brain...
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            contents.length ===
              0 && (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center">

                <h2 className="text-lg font-medium text-zinc-300">
                  No content
                  found
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Try changing
                  your search or
                  filters.
                </p>

              </div>
            )}

          {/* Cards */}

          {!loading &&
            contents.length >
              0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {contents.map(
                  (content) => (
                    <ContentCard
                      key={
                        content._id
                      }
                      content={
                        content
                      }
                      onEdit={
                        handleEdit
                      }
                      onDelete={
                        handleDelete
                      }
                    />
                  )
                )}

              </div>
            )}

          {/* Pagination */}

          {!loading &&
            totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">

                <button
                  disabled={
                    page === 1
                  }
                  onClick={() =>
                    setPage(
                      (
                        prev
                      ) =>
                        Math.max(
                          1,
                          prev -
                            1
                        )
                    )
                  }
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="text-sm text-zinc-500">
                  Page {page}{" "}
                  of{" "}
                  {totalPages}
                </span>

                <button
                  disabled={
                    page ===
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (
                        prev
                      ) =>
                        Math.min(
                          totalPages,
                          prev +
                            1
                        )
                    )
                  }
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>

              </div>
            )}

        </section>

      </main>

      {/* Add modal */}
      
      <AddContentModal
        isOpen={
          isAddModalOpen
        }
        onClose={() =>
          setIsAddModalOpen(
            false
          )
        }
        onCreated={
          fetchContents
        }
      />

      {/* Edit modal */}

      <EditContentModal
        isOpen={
          isEditOpen
        }
        content={
          selectedContent
        }
        onClose={() => {
          setIsEditOpen(
            false
          );

          setSelectedContent(
            null
          );
        }}
        onUpdated={
          fetchContents
        }
      />
      <ShareModal
  isOpen={shareModalOpen}
  link={shareLink}
  loading={shareLoading}
  onClose={() =>
    setShareModalOpen(false)
  }
  onDisable={
    handleDisableSharing
  }
/>

      {/* Delete modal */}

      <DeleteConfirmModal
        isOpen={
          deleteId !== null
        }
        loading={
          deleteLoading
        }
        onClose={() =>
          setDeleteId(
            null
          )
        }
        onConfirm={
          confirmDelete
        }
      />

    </div>
  );
};

export default Dashboard;