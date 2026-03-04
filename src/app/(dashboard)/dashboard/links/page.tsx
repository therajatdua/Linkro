import { LinkListEditor } from "@/components/dashboard/link-list-editor";
import { getSessionUser } from "@/lib/auth-server";
import { getCreatorByUid, getLinksByUserId } from "@/lib/data";

export default async function LinksPage() {
  const sessionUser = await getSessionUser();
  const uid = sessionUser?.uid ?? "demo-user-id";

  const [creator, links] = await Promise.all([getCreatorByUid(uid), getLinksByUserId(uid)]);

  return (
    <LinkListEditor
      links={links}
      plan={creator.plan}
      profile={creator.profile}
      username={creator.username ?? "me"}
      style={creator.style}
    />
  );
}
