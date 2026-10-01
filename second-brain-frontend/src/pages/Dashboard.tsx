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
  deleteContent,
  disableContentSharing,
  enableContentSharing,
  getContents,
} from "../services/contentApi";

import {
  useAuth,
} from "../context/AuthContext";

import type {
  Content,
} from "../types/content";

const Dashboard = () => {
  const {
    token,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | Content
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Add modal
  |--------------------------------------------------------------------------
  */

  const [
    isAddModalOpen,
    setIsAddModalOpen,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Edit modal
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Search / Filter
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Individual sharing
  |--------------------------------------------------------------------------
  */

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

  const [
    sharingContent,
    setSharingContent,
  ] =
    useState<Content | null>(
      null
    );

  /*
  |--------------------------------------------------------------------------
  | Fetch content
  |--------------------------------------------------------------------------
  */

  const fetchContents =
    useCallback(async () => {
      try {
        if (!token) {
          return;
        }

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

  /*
  |--------------------------------------------------------------------------
  | Edit
  |--------------------------------------------------------------------------
  */

  const handleEdit = (
    content: Content
  ) => {
    setSelectedContent(
      content
    );

    setIsEditOpen(
      true
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = (
    id: string
  ) => {
    setDeleteId(
      id
    );
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

        setDeleteId(
          null
        );

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

  /*
  |--------------------------------------------------------------------------
  | Share ONE content
  |--------------------------------------------------------------------------
  */

  const handleContentShare =
    async (
      content: Content
    ) => {
      if (!token) {
        return;
      }

      try {
        setShareLoading(
          true
        );

        setError("");

        setSharingContent(
          content
        );

        /*
         * Enable sharing for only
         * this content item.
         */
        const data =
          await enableContentSharing(
            token,
            content._id
          );

        /*
         * Our recommended backend
         * returns:
         *
         * {
         *   shareId: "abc123"
         * }
         */

        let shareId =
          data.shareId;

        /*
         * Optional fallback if your
         * backend returns a full Link.
         */
        if (
          !shareId &&
          data.Link
        ) {
          shareId =
            data.Link
              .split("/")
              .filter(Boolean)
              .pop();
        }

        if (!shareId) {
          throw new Error(
            "Backend did not return a shareId"
          );
        }

        /*
         * Important:
         *
         * We create a FRONTEND URL,
         * not a backend API URL.
         */

        const publicUrl =
          `${window.location.origin}/share/content/${shareId}`;

        setShareLink(
          publicUrl
        );

        setShareModalOpen(
          true
        );

        /*
         * Refresh so the card can
         * show the Shared badge.
         */

        await fetchContents();

      } catch (error) {

        setSharingContent(
          null
        );

        if (
          error instanceof Error
        ) {
          setError(
            error.message
          );
        }

      } finally {

        setShareLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Disable sharing for ONE content
  |--------------------------------------------------------------------------
  */

  const handleDisableContentSharing =
    async () => {
      if (
        !token ||
        !sharingContent
      ) {
        return;
      }

      try {
        setShareLoading(
          true
        );

        setError("");

        await disableContentSharing(
          token,
          sharingContent._id
        );

        setShareLink("");

        setShareModalOpen(
          false
        );

        setSharingContent(
          null
        );

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

        setShareLoading(
          false
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Available tags
  |--------------------------------------------------------------------------
  */

  const availableTags =
    Array.from(
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
        selectedType={
          selectedType
        }
        selectedTag={
          selectedTag
        }
        tags={
          availableTags
        }

        onTypeChange={(
          type
        ) => {
          setSelectedType(
            type
          );

          setPage(1);
        }}

        onTagChange={(
          tag
        ) => {
          setSelectedTag(
            tag
          );

          setPage(1);
        }}
      />

      <main className="min-h-dvh min-w-0 lg:ml-64">

        {/* Topbar */}

        <Topbar
          search={search}

          onSearchChange={(
            value
          ) => {
            setSearch(
              value
            );

            setPage(1);
          }}

          onAddContent={() =>
            setIsAddModalOpen(
              true
            )
          }
        />

        <section className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

          {/* Heading */}

          <div className="mb-8">

            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
              Workspace
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              My Second Brain
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Everything you've
              saved, organized
              in one place.
            </p>

          </div>

          {/* Controls */}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">

              <span>
                {totalItems} items
              </span>

              {selectedType && (
                <span className="max-w-full break-all rounded-lg bg-zinc-900 px-3 py-1.5">

                  Type:{" "}
                  {selectedType}

                </span>
              )}

              {selectedTag && (
                <span className="max-w-full break-all rounded-lg bg-violet-500/10 px-3 py-1.5 text-violet-400">

                  #
                  {selectedTag}

                </span>
              )}

            </div>

            {/* Sorting */}

            <select
              aria-label="Sort content"

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

              Loading your brain...

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
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-4 py-8 text-center sm:p-12">

                <h2 className="text-lg font-medium text-zinc-300">

                  No content found

                </h2>

                <p className="mt-2 text-sm text-zinc-500">

                  Try changing your
                  search or filters.

                </p>

              </div>
            )}

          {/* Cards */}

          {!loading &&
            contents.length >
              0 && (

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

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

                      onShare={
                        handleContentShare
                      }
                    />

                  )
                )}

              </div>
            )}

          {/* Pagination */}

          {!loading &&
            totalPages >
              1 && (

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">

                <button
                  disabled={
                    page === 1
                  }

                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.max(
                          1,
                          prev - 1
                        )
                    )
                  }

                  className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="text-sm text-zinc-500">

                  Page {page} of{" "}
                  {totalPages}

                </span>

                <button
                  disabled={
                    page ===
                    totalPages
                  }

                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.min(
                          totalPages,
                          prev + 1
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

      {/* Add Content Modal */}

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

      {/* Edit Modal */}

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

      {/* Individual Share Modal */}

      <ShareModal
        isOpen={
          shareModalOpen
        }

        link={
          shareLink
        }

        loading={
          shareLoading
        }

        onClose={() => {
          setShareModalOpen(
            false
          );

          setSharingContent(
            null
          );
        }}

        onDisable={
          handleDisableContentSharing
        }
      />

      {/* Delete Modal */}

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