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
    return <div>Loading settings...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.me) {
    return <div>Unable to load account information.</div>;
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
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          Manage your TaskFlow account and preferences.
        </p>
      </div>

      <div className="rounded-xl border">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">Profile</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your account information.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="text-sm text-gray-500">Name</p>

            <p className="mt-1 font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>

            <p className="mt-1 font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email verification</p>

            <span className="mt-1 inline-block rounded-full border px-3 py-1 text-xs">
              {user.emailVerified ? "Verified" : "Not verified"}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Member since</p>

            <p className="mt-1 font-medium">
              {new Date(Number(user.createdAt)).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">Edit Profile</h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your display name.
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 p-5">
          <div>
            <label className="text-sm font-medium">Name</label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={user.name}
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          {profileError && (
            <p className="text-sm text-red-600">{profileError}</p>
          )}

          {profileMessage && (
            <p className="text-sm text-green-600">{profileMessage}</p>
          )}

          <button
            type="submit"
            disabled={updatingProfile || !name.trim()}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updatingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {user.hasPassword ? (
        <div className="rounded-xl border">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">Change Password</h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your account password.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 p-5">
            <div>
              <label className="text-sm font-medium">Current password</label>

              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">New password</label>

              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                required
              />

              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 characters.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">
                Confirm new password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                required
              />
            </div>

            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}

            {passwordMessage && (
              <p className="text-sm text-green-600">{passwordMessage}</p>
            )}

            <button
              type="submit"
              disabled={
                changingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-xl border">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">Password</h2>

            <p className="mt-1 text-sm text-gray-500">Password management.</p>
          </div>

          <div className="p-5">
            <p className="text-sm text-gray-500">
              Your account uses Google Sign-In. Password management is handled
              through Google.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
