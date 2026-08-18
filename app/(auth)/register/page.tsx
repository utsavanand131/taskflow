"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { setToken } from "@/lib/auth/client";

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const GOOGLE_LOGIN_MUTATION = gql`
  mutation GoogleLogin($credential: String!) {
    googleLogin(credential: $credential) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

interface RegisterResponse {
  register: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

interface GoogleLoginResponse {
  googleLogin: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [register, { loading }] =
    useMutation<RegisterResponse>(REGISTER_MUTATION);

  const [googleLogin, { loading: googleLoading }] =
    useMutation<GoogleLoginResponse>(GOOGLE_LOGIN_MUTATION);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    try {
      const result = await register({
        variables: form,
      });

      const token = result.data?.register.token;

      if (!token) {
        throw new Error("No token received.");
      }

      setToken(token);

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  async function handleGoogleSuccess(credentialResponse: {
    credential?: string;
  }) {
    try {
      setError("");

      if (!credentialResponse.credential) {
        throw new Error("No Google credential received.");
      }

      const result = await googleLogin({
        variables: {
          credential: credentialResponse.credential,
        },
      });

      const token = result.data?.googleLogin.token;

      if (!token) {
        throw new Error("No token received.");
      }

      setToken(token);

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-up failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#08090b] px-4 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full border border-zinc-800 bg-zinc-950 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:p-8">
          <div className="mb-7">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-white"
            >
              TaskFlow
            </Link>

            <p className="mt-7 text-xs uppercase tracking-[0.2em] text-zinc-600">
              Get started
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Create your TaskFlow account
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Start organizing projects, tasks, and teams in one workspace.
            </p>
          </div>

          {error && (
            <div className="mb-5 border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-center border border-zinc-800 bg-zinc-900/60 p-3">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-up failed")}
            />
          </div>

          {googleLoading && (
            <p className="mt-3 text-center text-xs text-zinc-600">
              Creating your account with Google...
            </p>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />

            <span className="text-xs uppercase tracking-wider text-zinc-600">
              Or
            </span>

            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="register-name"
                className="text-sm font-medium text-zinc-300"
              >
                Name
              </label>

              <input
                id="register-name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Your name"
                className="mt-2 w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="text-sm font-medium text-zinc-300"
              >
                Email
              </label>

              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="you@example.com"
                className="mt-2 w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="text-sm font-medium text-zinc-300"
              >
                Password
              </label>

              <input
                id="register-password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="mt-2 w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                required
              />

              <p className="mt-1 text-xs text-zinc-600">
                Use a strong password for your account.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                loading || !form.name.trim() || !form.email || !form.password
              }
              className="w-full border border-zinc-600 bg-zinc-800 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 border-t border-zinc-800 pt-5 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-zinc-200 hover:text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
