import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <GraduationCap className="size-5" />
      </span>
      {!compact ? (
        <span className="text-[19px] font-extrabold tracking-tight">
          Edu<span className="text-primary">Centre</span>
        </span>
      ) : null}
    </span>
  );
}
