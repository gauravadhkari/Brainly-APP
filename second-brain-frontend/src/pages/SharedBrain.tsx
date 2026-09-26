import {
  useEffect,
  useState,
} from "react";

import {
  Brain,
  ArrowLeft,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getSharedContent,
} from "../services/contentApi";

import SharedContentCard from "../components/SharedContentCard";

import type {
  Content,
} from "../types/content";

const SharedBrain = () => {
  const {
    shareId,
  } = useParams();

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

  useEffect(() => {
    const fetchSharedBrain =
      async () => {
        try {
          if (!shareId) {
            setError(
              "Invalid share link"
            );

            return;
          }

          setLoading(true);
          setError("");

          const data =
            await getSharedContent(
              shareId
            );

          setContents(
            data.content || []
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
      };

    fetchSharedBrain();
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
        Loading shared brain...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">

        <div className="max-w-md text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <Brain size={25} />
          </div>

          <h1 className="text-xl font-semibold text-zinc-100">
            Shared brain unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {error}
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
          >
            <ArrowLeft size={15} />
            Go back
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Header */}

      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">

              <Brain size={20} />

            </div>

            <div>

              <h1 className="font-semibold">
                Cortex
              </h1>

              <p className="text-xs text-zinc-500">
                Shared Second Brain
              </p>

            </div>

          </div>

          <Link
            to="/login"
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
          >
            Build your brain
          </Link>

        </div>

      </header>

      {/* Main */}

      <main className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">

          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
            Public collection
          </p>

          <h2 className="text-3xl font-semibold tracking-tight">
            Shared Brain
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            A collection of saved ideas,
            resources and notes.
          </p>

        </div>

        {contents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center">

            <Brain
              size={28}
              className="mx-auto text-zinc-700"
            />

            <h2 className="mt-4 font-medium text-zinc-300">
              Nothing shared yet
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              This brain doesn't contain
              any content yet.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

            {contents.map(
              (content) => (
                <SharedContentCard
                  key={content._id}
                  content={content}
                />
              )
            )}

          </div>
        )}

      </main>

    </div>
  );
};

export default SharedBrain;