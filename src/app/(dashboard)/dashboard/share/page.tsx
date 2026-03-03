import { getSessionUser } from "@/lib/auth-server";
import { getCreatorByUid } from "@/lib/data";
import { ShareClient } from "./share-client";

export default async function SharePage() {
  const sessionUser = await getSessionUser();
  const uid = sessionUser?.uid ?? "demo-user-id";

  const creator = await getCreatorByUid(uid);
  const username = creator.username ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Share Your Page</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Share your Linkro profile link or download your QR code to use offline.
        </p>
      </div>
      <ShareClient username={username} profile={creator.profile} />
    </div>
  );
}
