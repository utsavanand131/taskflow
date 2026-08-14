"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      image
      emailVerified
      hasPassword
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($name: String!) {
    updateProfile(name: $name) {
      id
      name
      email
      image
      emailVerified
      hasPassword
      createdAt
      updatedAt
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MeResponse {
  me: User;
}

interface UpdateProfileResponse {
  updateProfile: User;
}

interface ChangePasswordResponse {
  changePassword: boolean;
}

export default function SettingsPage() {
  const { data, loading, error } = useQuery<MeResponse>(ME_QUERY);

  const [updateProfile, { loading: updatingProfile }] =
    useMutation<UpdateProfileResponse>(UPDATE_PROFILE_MUTATION);

  const [changePassword, { loading: changingPassword }] =
    useMutation<ChangePasswordResponse>(CHANGE_PASSWORD_MUTATION);

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Loading settings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-red-400">
        {error.message}
      </div>
    );
  }

  if (!data?.me) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Unable to load account information.
      </div>
    );
  }

  const user = data.me;

  async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    if (!name.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }

    try {
      const result = await updateProfile({
        variables: {
          name: name.trim(),
        },
      });

      if (result.data?.updateProfile) {
        setProfileMessage("Profile updated successfully.");
        setName("");
      }
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    }
  }

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      await changePassword({
        variables: {
          currentPassword,
          newPassword,
        },
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage("Password changed successfully.");
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Failed to change password.",
      );
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 px-4 py-6 text-zinc-100 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm text-zinc-400">
            Manage your TaskFlow account and preferences.
          </p>
        </div>

        <section className="border border-zinc-800 bg-zinc-900/80">
          <div className="border-b border-zinc-800 p-5">
            <h2 className="text-lg font-semibold text-zinc-100">Profile</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Your account information.
            </p>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Name
              </p>

              <p className="mt-2 text-sm font-medium text-zinc-200">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Email
              </p>

              <p className="mt-2 break-all text-sm font-medium text-zinc-200">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Email verification
              </p>

              <span
                className={`mt-2 inline-block border px-3 py-1.5 text-xs font-medium ${
                  user.emailVerified
                    ? "border-emerald-900 bg-emerald-950/30 text-emerald-400"
                    : "border-zinc-700 bg-zinc-950 text-zinc-400"
                }`}
              >
                {user.emailVerified ? "Verified" : "Not verified"}
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Member since
              </p>

              <p className="mt-2 text-sm font-medium text-zinc-300">
                {new Date(Number(user.createdAt)).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        <section className="border border-zinc-800 bg-zinc-900/80">
          <div className="border-b border-zinc-800 p-5">
            <h2 className="text-lg font-semibold text-zinc-100">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update your display name.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 p-5">
            <div>
              <label
                htmlFor="profile-name"
                className="text-sm font-medium text-zinc-300"
              >
                Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={user.name}
                className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
              />
            </div>

            {profileError && (
              <p className="border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
                {profileError}
              </p>
            )}

            {profileMessage && (
              <p className="border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-400">
                {profileMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={updatingProfile || !name.trim()}
              className="border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {user.hasPassword ? (
          <section className="border border-zinc-800 bg-zinc-900/80">
            <div className="border-b border-zinc-800 p-5">
              <h2 className="text-lg font-semibold text-zinc-100">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Update your account password.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="current-password"
                  className="text-sm font-medium text-zinc-300"
                >
                  Current password
                </label>

                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium text-zinc-300"
                >
                  New password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                  required
                />

                <p className="mt-1 text-xs text-zinc-600">
                  Minimum 8 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-zinc-300"
                >
                  Confirm new password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                  required
                />
              </div>

              {passwordError && (
                <p className="border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
                  {passwordError}
                </p>
              )}

              {passwordMessage && (
                <p className="border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-400">
                  {passwordMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  changingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          </section>
        ) : (
          <section className="border border-zinc-800 bg-zinc-900/80">
            <div className="border-b border-zinc-800 p-5">
              <h2 className="text-lg font-semibold text-zinc-100">Password</h2>

              <p className="mt-1 text-sm text-zinc-500">Password management.</p>
            </div>

            <div className="p-5">
              <div className="border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm leading-6 text-zinc-400">
                  Your account uses Google Sign-In. Password management is
                  handled through Google.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
