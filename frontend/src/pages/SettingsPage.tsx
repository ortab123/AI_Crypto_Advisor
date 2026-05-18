import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { FormError } from "../components/common/FormError";
import apiClient from "../utils/api.utils";

export function SettingsPage() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingPw, setIsSavingPw] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  async function handleSaveName() {
    if (!name.trim()) return;
    setIsSavingName(true);
    setNameError(null);
    setNameSuccess(false);
    try {
      await apiClient.patch("/auth/me", { name: name.trim() });
      setNameSuccess(true);
    } catch (err) {
      setNameError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to update name."
          : "Unexpected error.",
      );
    } finally {
      setIsSavingName(false);
    }
  }

  async function handleSavePassword() {
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setIsSavingPw(true);
    setPwError(null);
    setPwSuccess(false);
    try {
      await apiClient.patch("/auth/me/password", {
        currentPassword,
        newPassword,
      });
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to update password."
          : "Unexpected error.",
      );
    } finally {
      setIsSavingPw(false);
    }
  }

  function Section({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="bg-brand-slate rounded-xl border border-brand-border p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-muted">
          {title}
        </h2>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-slate-dark text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-brand-slate border-b border-brand-border px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center font-black text-sm shadow">
            M
          </div>
          <span className="font-bold tracking-wide">AI Crypto Advisor</span>
        </div>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </Button>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Display name */}
        <Section title="Account">
          <div className="space-y-1">
            <p className="text-xs text-brand-muted">Email</p>
            <p className="text-white/70 text-sm bg-brand-slate-deep border border-brand-border rounded-lg px-4 py-2.5">
              {user?.email}
            </p>
          </div>
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameSuccess(false);
            }}
          />
          <FormError message={nameError} />
          {nameSuccess && (
            <p className="text-emerald-400 text-sm">
              Name updated successfully!
            </p>
          )}
          <Button isLoading={isSavingName} onClick={handleSaveName}>
            Save Name
          </Button>
        </Section>

        {/* Change password */}
        <Section title="Change Password">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setPwSuccess(false);
            }}
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPwSuccess(false);
            }}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPwSuccess(false);
            }}
          />
          <FormError message={pwError} />
          {pwSuccess && (
            <p className="text-emerald-400 text-sm">
              Password updated successfully!
            </p>
          )}
          <Button isLoading={isSavingPw} onClick={handleSavePassword}>
            Update Password
          </Button>
        </Section>

        {/* Danger zone */}
        <Section title="Session">
          <p className="text-brand-muted text-sm">
            Signed in as <span className="text-white">{user?.email}</span>
          </p>
          <Button variant="secondary" onClick={logout}>
            Sign Out
          </Button>
        </Section>
      </main>
    </div>
  );
}
