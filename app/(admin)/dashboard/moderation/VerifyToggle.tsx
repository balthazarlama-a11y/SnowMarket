"use client";

import { useState } from "react";
import { toggleProductVerified } from "@/actions/admin-products";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface VerifyToggleProps {
  productId: string;
  initialVerified: boolean;
}

export function VerifyToggle({ productId, initialVerified }: VerifyToggleProps) {
  const [checked, setChecked] = useState(initialVerified);
  const [loading, setLoading] = useState(false);

  async function handleToggle(newValue: boolean) {
    setLoading(true);
    setChecked(newValue);
    const result = await toggleProductVerified(productId);
    setLoading(false);

    if (result.success) {
      setChecked(result.data.is_verified);
      toast.success(
        result.data.is_verified ? "Gestión y envío activado" : "Gestión y envío desactivado"
      );
    } else {
      setChecked(!newValue);
      toast.error(result.error);
    }
  }

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleToggle}
      disabled={loading}
      aria-label="Envío incluido"
    />
  );
}
