import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProfilePageClient } from "@/components/shared/profile-page-client";
import { ProfileViewTracker } from "@/components/shared/profile-view-tracker";
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
    <>
      <ProfileViewTracker ownerId={creator.uid} />
      <ProfilePageClient
        profile={creator.profile}
        username={creator.username ?? username}
        links={links}
        uid={creator.uid}
        style={creator.style}
      />
    </>
  );
}
