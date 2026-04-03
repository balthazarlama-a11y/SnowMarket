import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getPropertyById } from "@/actions/properties";
import { getAvailabilityByProperty } from "@/actions/availability";
import { EditPropertyForm } from "./EditPropertyForm";
import { AvailabilityEditor } from "@/app/components/AvailabilityEditor";
import { Card, CardContent } from "@/components/ui/card";

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
  const [{ data: property, error }, { data: availability }] = await Promise.all([
    getPropertyById(id),
    getAvailabilityByProperty(id),
  ]);

  if (error || !property) return notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <EditPropertyForm property={property} />
      <Card>
        <CardContent className="p-6">
          <AvailabilityEditor
            propertyId={id}
            initialRanges={(availability as any[]) ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
