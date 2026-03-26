"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePropertyStatus, type PropertyStatus } from "@/actions/properties";
import { toast } from "sonner";

const STATUS_OPTIONS: { value: PropertyStatus; label: string; color: string }[] = [
  { value: "activo", label: "Activo", color: "text-green-700 bg-green-50 border-green-200" },
  { value: "pausado", label: "Pausado", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  { value: "arrendado", label: "Arrendado", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { value: "vendido", label: "Vendido", color: "text-red-700 bg-red-50 border-red-200" },
];

interface PropertyStatusSelectProps {
  propertyId: string;
  currentStatus: PropertyStatus;
}

export function PropertyStatusSelect({
  propertyId,
  currentStatus,
}: PropertyStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<PropertyStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as PropertyStatus;
    setLoading(true);
    setStatus(newStatus);

    const result = await updatePropertyStatus(propertyId, newStatus);
    setLoading(false);

    if (result.success) {
      toast.success(`Estado actualizado a "${newStatus}"`);
      router.refresh();
    } else {
      setStatus(currentStatus);
      toast.error(result.error);
    }
  }

  const current = STATUS_OPTIONS.find((o) => o.value === status);

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`rounded-md border px-2 py-1 text-xs font-medium outline-none transition-colors ${current?.color ?? ""}`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
