import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Brain,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getSharedSingleContent,
} from "../services/contentApi";

import SharedContentCard from "../components/SharedContentCard";

import type {
  Content,
} from "../types/content";

const SharedContent = () => {
  const {
    shareId,
  } = useParams();

  const [
    content,
    setContent,
  ] =
    useState<Content | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const fetchSharedContent =
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
            await getSharedSingleContent(
              shareId
            );

          setContent(
            data.content
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

    fetchSharedContent();

  }, [shareId]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">

        Loading shared content...

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (
    error ||
    !content
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">

        <div className="max-w-md text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">

            <Brain
              size={25}
            />

          </div>

          <h1 className="text-xl font-semibold text-zinc-100">

            Shared content unavailable

          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">

            {error ||
              "This content is no longer available."}

          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm text-violet-400 transition hover:text-violet-300"
          >

            <ArrowLeft
              size={15}
            />

            Go back

          </Link>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Header */}

      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">

              <Brain
                size={20}
              />

            </div>

            <div>

              <h1 className="font-semibold">
                Cortex
              </h1>

              <p className="text-xs text-zinc-500">
                Shared Content
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

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">

        <div className="mb-8">

          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-violet-400">

            Public resource

          </p>

          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">

            Shared from a Second Brain

          </h2>

          <p className="mt-2 text-sm text-zinc-500">

            Someone shared this
            resource with you.

          </p>

        </div>

        <SharedContentCard
          content={
            content
          }
        />

      </main>

    </div>
  );
};

export default SharedContent;