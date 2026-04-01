import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getPropertyById } from "@/actions/properties";
import { EditPropertyForm } from "./EditPropertyForm";

export const metadata = {
  title: "Editar Propiedad",
};

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  if (user.app_metadata?.role !== "admin") redirect("/");

  const { id } = await params;
  const { data: property, error } = await getPropertyById(id);

  if (error || !property) return notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <EditPropertyForm property={property} />
    </div>
  );
}
