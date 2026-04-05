"use client";

import { SKI_MODES, SKI_MODE_LABELS, type SkiMode } from "@/lib/validations/product";

interface SkiModesFieldProps {
  selected: SkiMode[] | string[];
  onChange: (modes: SkiMode[]) => void;
  required?: boolean;
  error?: string;
}

export function SkiModesField({
  selected,
  onChange,
  required = false,
  error,
}: SkiModesFieldProps) {
  function toggle(mode: SkiMode) {
    onChange(
      selected.includes(mode)
        ? (selected.filter((m) => m !== mode) as SkiMode[])
        : [...selected, mode] as SkiMode[]
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-medium">
          Modalidad de ski
          {required && <span className="text-destructive"> *</span>}
        </span>
        {!required && (
          <span className="text-xs text-muted-foreground">(opcional)</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {SKI_MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => toggle(m)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selected.includes(m)
                ? "border-primary bg-primary/10 text-primary"
                : "border-input bg-background text-muted-foreground hover:bg-secondary"
            }`}
          >
            {SKI_MODE_LABELS[m]}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
