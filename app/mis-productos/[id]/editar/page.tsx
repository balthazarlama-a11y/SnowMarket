import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getProductById } from "@/actions/products";
import { EditProductForm } from "./EditProductForm";

export const metadata = {
  title: "Editar Producto",
};

export default async function EditarProductoPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  // Await the params object itself in Next.js 15+ if needed, but doing params.id is standard Next 14 App Router.
  // Wait, in Next 15 `params` needs to be awaited. The system usually uses Next.js 14, but relying on direct access is fine for Next.js <.
  // Let's await it just in case:
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;

  const { data: product, error } = await getProductById(id);

  if (!product || error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <p className="mt-2 text-muted-foreground">El producto que intentas editar no existe.</p>
      </div>
    );
  }

  // Security check: Only the owner can edit the product
  if (product.owner_id !== user.id) {
    redirect("/mis-productos");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <EditProductForm product={product} />
    </div>
  );
}
