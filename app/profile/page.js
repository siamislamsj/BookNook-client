"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [authorInput, setAuthorInput] = useState("");
  const [authors, setAuthors] = useState([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!isPending && !session) router.replace(`/login?next=${encodeURIComponent("/profile")}`);
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
      setAuthors(Array.isArray(session.user.favoriteAuthors) ? session.user.favoriteAuthors : []);
    }
  }, [session, isPending, router]);

  function addAuthor() {
    const value = authorInput.trim();
    if (!value) return;
    if (authors.some(a => a.toLowerCase() === value.toLowerCase())) return toast.error("This author is already in your list");
    setAuthors(current => [...current, value]);
    setAuthorInput("");
  }

  async function saveProfile(e) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name");
    setSaving(true);
    try {
      const result = await authClient.updateUser({ name: name.trim(), image: image.trim() || undefined, favoriteAuthors: authors });
      if (result.error) throw new Error(result.error.message || "Could not update profile");
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) { toast.error(error.message || "Could not update profile"); }
    finally { setSaving(false); }
  }

  async function updatePassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("New password must be at least 8 characters");
    setChangingPassword(true);
    try {
      const result = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
      if (result.error) throw new Error(result.error.message || "Could not change password");
      setCurrentPassword(""); setNewPassword("");
      toast.success("Password changed successfully");
    } catch (error) { toast.error(error.message || "Could not change password"); }
    finally { setChangingPassword(false); }
  }

  if (isPending || !session) return <main className="container section">Loading profile…</main>;
  return <main className="container section min-h-[70vh]">
    <p className="text-xs uppercase tracking-[.2em] text-[#9a6b55]">Your reading identity</p>
    <h1 className="serif mt-2 text-5xl">My Profile</h1>
    <p className="muted mt-3">Manage your account details and favourite authors.</p>

    <div className="mt-9 grid gap-7 lg:grid-cols-[1.15fr_.85fr]">
      <form onSubmit={saveProfile} className="card space-y-5 p-6 md:p-8">
        <h2 className="serif text-2xl">Personal information</h2>
        <div className="flex items-center gap-4">
          {image ? <img src={image} alt="Profile" className="h-20 w-20 rounded-full border border-[#e6ded2] object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eee7dc] text-2xl text-[#713b43]">{name?.[0]?.toUpperCase() || "B"}</div>}
          <p className="text-sm muted">Use a public image URL for your profile picture.</p>
        </div>
        <label className="block text-sm">Profile image URL<input className="field mt-2" type="url" placeholder="https://example.com/photo.jpg" value={image} onChange={e => setImage(e.target.value)} /></label>
        <label className="block text-sm">Full name<input className="field mt-2" value={name} onChange={e => setName(e.target.value)} required /></label>
        <label className="block text-sm">Email<input className="field mt-2 opacity-70" value={session.user.email || ""} readOnly /></label>
        <div className="border-t border-[#e6ded2] pt-5">
          <h3 className="serif text-xl">Favourite authors</h3>
          <div className="mt-3 flex gap-2"><input className="field" placeholder="Add an author's name" value={authorInput} onChange={e => setAuthorInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addAuthor(); } }} /><button type="button" className="btn shrink-0" onClick={addAuthor}>Add</button></div>
          <div className="mt-3 flex flex-wrap gap-2">{authors.map(author => <span key={author} className="inline-flex items-center gap-2 border border-[#e6ded2] bg-[#f7f3eb] px-3 py-2 text-sm">{author}<button type="button" aria-label={`Remove ${author}`} className="font-bold text-[#713b43] hover:text-[#c47b4e]" onClick={() => setAuthors(list => list.filter(a => a !== author))}>×</button></span>)}{!authors.length && <p className="text-sm muted">No favourite authors added yet.</p>}</div>
        </div>
        <button disabled={saving} className="btn w-full">{saving ? "Saving…" : "Save profile changes"}</button>
      </form>

      <form onSubmit={updatePassword} className="card h-fit space-y-5 p-6 md:p-8">
        <h2 className="serif text-2xl">Change password</h2>
        <p className="text-sm muted">Choose a strong password with at least 8 characters.</p>
        <label className="block text-sm">Current password<input className="field mt-2" type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required /></label>
        <label className="block text-sm">New password<input className="field mt-2" type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} required /></label>
        <button disabled={changingPassword} className="btn w-full">{changingPassword ? "Updating…" : "Update password"}</button>
      </form>
    </div>
  </main>;
}
