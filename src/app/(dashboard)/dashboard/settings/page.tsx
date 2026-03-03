import { getSessionUser } from "@/lib/auth-server";
import { getCreatorByUid } from "@/lib/data";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const sessionUser = await getSessionUser();
  const uid = sessionUser?.uid ?? "demo-user-id";
  const creator = await getCreatorByUid(uid);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">Manage your account and public link.</p>
      </div>
      <SettingsClient
        currentUsername={creator.username ?? ""}
        email={creator.email ?? sessionUser?.email ?? ""}
      />
    </div>
  );
}
