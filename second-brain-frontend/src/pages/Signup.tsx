import {
  useState,
} from "react";

import {
  Brain,
  ArrowRight,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  API_URL,
} from "../services/api";

const Signup = () => {
  const navigate =
    useNavigate();

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_URL}/auth/signup`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username,
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Signup failed"
        );

        return;
      }

      navigate("/login");
    } catch {
      setError(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10 text-zinc-100">

      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="relative w-full max-w-md">

        <div className="mb-8 flex justify-center">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">

              <Brain size={22} />

            </div>

            <div>

              <h1 className="font-semibold">
                Cortex
              </h1>

              <p className="text-xs text-zinc-500">
                Second Brain
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl">

          <h2 className="text-2xl font-semibold">
            Create your brain
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Save everything worth remembering.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            <Input
              label="Username"
              value={username}
              placeholder="Choose username"
              onChange={setUsername}
            />

            <Input
              label="Email"
              value={email}
              placeholder="you@example.com"
              onChange={setEmail}
              type="email"
            />

            <Input
              label="Password"
              value={password}
              placeholder="Minimum 6 characters"
              onChange={setPassword}
              type="password"
            />

            <button
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
            >

              {loading
                ? "Creating..."
                : "Create account"}

              {!loading && (
                <ArrowRight
                  size={16}
                />
              )}

            </button>

          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

interface InputProps {
  label: string;
  value: string;
  placeholder: string;
  type?: string;

  onChange: (
    value: string
  ) => void;
}

const Input = ({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: InputProps) => {
  return (
    <div>

      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
      />

    </div>
  );
};

export default Signup;