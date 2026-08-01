"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
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

  async function handleSubmit(e: React.FormEvent) {
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
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border p-6"
      >
        <h1 className="text-2xl font-bold">Create TaskFlow Account</h1>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <input
          className="w-full rounded border p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

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
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
