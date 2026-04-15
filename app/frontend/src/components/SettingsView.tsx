import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "sonner";
import {
  User, Mail, Lock, Brain, Moon, Database, Zap,
  ChevronDown, Eye, EyeOff,
} from "lucide-react";

/* ── helpers ── */
const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
    <h3 className="font-semibold text-sm">{title}</h3>
  </div>
);

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-foreground" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );
}

/* ──────────────── Main Component ──────────────── */
interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsView = ({ darkMode, onToggleDarkMode }: SettingsViewProps) => {
  const { settings, updateSetting } = useSettings();

  /* Account state */
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "");
        setNewEmail(user.email ?? "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", user.id)
          .maybeSingle();
        if (profile?.display_name) setDisplayName(profile.display_name);
      }
    };
    load();
  }, []);

  /* ── Handlers ── */
  const saveName = async () => {
    setSaving("name");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, display_name: displayName, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    setSaving(null);
    if (error) toast.error("Failed to save name");
    else toast.success("Name updated");
  };

  const saveEmail = async () => {
    if (newEmail === email) { setEditingEmail(false); return; }
    setSaving("email");
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setSaving(null);
    if (error) toast.error(error.message);
    else {
      toast.success("Verification email sent to new address");
      setEditingEmail(false);
    }
  };

  const changePassword = async () => {
    if (newPw !== confirmPw) { toast.error("Passwords do not match"); return; }
    if (newPw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setSaving("password");
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSaving(null);
    if (error) toast.error(error.message);
    else {
      toast.success("Password changed successfully");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
        </div>

        {/* ─── Account: Name ─── */}
        <div className="space-y-4">
          <SectionTitle icon={User} title="Display Name" />
          <div className="flex gap-2">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-10 text-sm flex-1"
            />
            <Button onClick={saveName} disabled={saving === "name"} className="h-10 px-5">
              {saving === "name" ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        {/* ─── Account: Email ─── */}
        <div className="space-y-4">
          <SectionTitle icon={Mail} title="Email Address" />
          {!editingEmail ? (
            <div className="flex items-center justify-between p-3.5 bg-card border border-border rounded-lg">
              <span className="text-sm font-medium">{email}</span>
              <button
                onClick={() => setEditingEmail(true)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="h-10 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                A verification link will be sent to your new address.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={saveEmail} disabled={saving === "email"} className="h-9 px-4">
                  {saving === "email" ? "Sending…" : "Update Email"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditingEmail(false); setNewEmail(email); }} className="h-9">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Change Password ─── */}
        <div className="space-y-4">
          <SectionTitle icon={Lock} title="Change Password" />
          <div className="space-y-3">
            <div className="relative">
              <Input
                type={showCurrentPw ? "text" : "password"}
                placeholder="Current password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="h-10 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNewPw ? "text" : "password"}
                placeholder="New password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="h-10 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="h-10 text-sm"
            />
            <Button
              onClick={changePassword}
              disabled={saving === "password" || !currentPw || !newPw || !confirmPw}
              className="h-10 px-5 mt-1"
            >
              {saving === "password" ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </div>

        {/* ─── AI Response Style ─── */}
        <div className="space-y-4">
          <SectionTitle icon={Brain} title="AI Response Style" />
          <Select
            value={settings.aiStyle}
            onChange={(v) => updateSetting("aiStyle", v as any)}
            options={[
              { value: "concise",  label: "Concise — Short, direct answers" },
              { value: "balanced", label: "Balanced — Clear and thorough" },
              { value: "detailed", label: "Detailed — In-depth explanations" },
            ]}
          />
        </div>

        {/* ─── Theme ─── */}
        <div className="space-y-4">
          <SectionTitle icon={Moon} title="Theme" />
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <p className="text-sm font-medium">{darkMode ? "Dark Mode" : "Light Mode"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {darkMode ? "Warm dark palette" : "Warm light palette"}
              </p>
            </div>
            <Toggle checked={darkMode} onChange={onToggleDarkMode} />
          </div>
        </div>

        {/* ─── Data Handling ─── */}
        <div className="space-y-4">
          <SectionTitle icon={Database} title="Data Handling Mode" />
          <div className="space-y-3">
            {(["store", "temporary"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => updateSetting("dataHandlingMode", mode)}
                className={`w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-all ${
                  settings.dataHandlingMode === mode
                    ? "border-foreground bg-card"
                    : "border-border hover:bg-secondary/50"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  settings.dataHandlingMode === mode ? "border-foreground" : "border-border"
                }`}>
                  {settings.dataHandlingMode === mode && (
                    <div className="w-2 h-2 rounded-full bg-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {mode === "store" ? "Store uploaded data" : "Temporary (session only)"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mode === "store"
                      ? "Files are persisted to the database for future sessions."
                      : "Files are cleared when you close the app. Nothing is saved."}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Auto-Generate Dashboard ─── */}
        <div className="space-y-4">
          <SectionTitle icon={Zap} title="Auto-Generate Dashboard" />
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <p className="text-sm font-medium">
                {settings.autoGenerateDashboard ? "Generate instantly after upload" : "Review before generating"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {settings.autoGenerateDashboard
                  ? "Dashboard is created automatically once the file is processed."
                  : "You will see a preview of the proposed charts and can confirm before the dashboard is built."}
              </p>
            </div>
            <Toggle
              checked={settings.autoGenerateDashboard}
              onChange={(v) => updateSetting("autoGenerateDashboard", v)}
            />
          </div>
        </div>

        {/* bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
};
