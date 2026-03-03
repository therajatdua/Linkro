import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProfileViewTracker } from "@/components/shared/profile-view-tracker";
import { Button } from "@/components/ui/button";
import { getCreatorByUsername, getLinksByUserId } from "@/lib/data";

export const revalidate = 120;

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);

  if (!creator) {
    return {
      title: "Profile Not Found | Linkro",
      description: "This creator profile does not exist.",
    };
  }

  const ogImage = `/api/og?username=${encodeURIComponent(creator.username)}&name=${encodeURIComponent(creator.profile.name)}&bio=${encodeURIComponent(creator.profile.bio)}`;

  return {
    title: `${creator.profile.name} | Linkro`,
    description: creator.profile.bio,
    openGraph: {
      title: `${creator.profile.name} | Linkro`,
      description: creator.profile.bio,
      images: [ogImage],
    },
  };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);

  if (!creator) {
    notFound();
  }

  const links = (await getLinksByUserId(creator.uid)).filter((link) => link.isActive);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 py-10">
      <ProfileViewTracker ownerId={creator.uid} />
      <section className="rounded-2xl border bg-background p-6 text-center">
        <div className="mx-auto mb-3 h-16 w-16 rounded-full border bg-muted" />
        <h1 className="text-xl font-semibold">{creator.profile.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{creator.profile.bio}</p>
      </section>
      <section className="space-y-3">
        {links.map((link) => (
          <form key={link.id} action="/api/track" method="POST">
            <input type="hidden" name="ownerId" value={creator.uid} />
            <input type="hidden" name="linkId" value={link.id} />
            <input type="hidden" name="url" value={link.url} />
            <Button type="submit" variant="outline" className="w-full justify-center">
              {link.title}
            </Button>
          </form>
        ))}
      </section>
    </main>
  );
}
