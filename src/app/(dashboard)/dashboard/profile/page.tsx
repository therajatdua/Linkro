import { ProfileForm } from "@/components/dashboard/profile-form";
import { getSessionUser } from "@/lib/auth-server";
import { getCreatorByUid, getLinksByUserId } from "@/lib/data";

export default async function ProfilePage() {
  const sessionUser = await getSessionUser();
  const uid = sessionUser?.uid ?? "demo-user-id";

  const [creator, links] = await Promise.all([getCreatorByUid(uid), getLinksByUserId(uid)]);

  return (
    <ProfileForm
      defaultValues={creator.profile}
      templateId={creator.templateId}
      links={links}
      username={creator.username ?? "me"}
    />
  );
}
