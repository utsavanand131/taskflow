"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { setToken } from "@/lib/auth/client";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

interface LoginResponse {
  login: {
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

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [login, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION);

  const [googleLogin, { loading: googleLoading }] =
    useMutation<GoogleLoginResponse>(GOOGLE_LOGIN_MUTATION);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    try {
      const result = await login({
        variables: form,
      });

      const token = result.data?.login.token;

      if (!token) {
        throw new Error("No token received.");
      }

      setToken(token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
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
    } catch (err: any) {
      setError(err.message || "Google login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border p-6"
      >
        <h1 className="text-2xl font-bold">Login to TaskFlow</h1>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button
          disabled={loading}
          className="w-full rounded bg-black p-2 text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
          />
        </div>

        {googleLoading && (
          <p className="text-center text-sm text-gray-500">
            Signing in with Google...
          </p>
        )}
      </form>
    </div>
  );
}
