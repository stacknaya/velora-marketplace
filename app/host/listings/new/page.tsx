import HostShell from "@/components/HostShell";
import ListingWizard from "@/components/ListingWizard";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?error=Please+sign+in+before+creating+a+listing");

  return (
    <HostShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-black/40">New listing</p>
      <h1 className="mt-2 mb-8 text-4xl font-black tracking-tight">List your asset</h1>
      <ListingWizard />
    </HostShell>
  );
}
