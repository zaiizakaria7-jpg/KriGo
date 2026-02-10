import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  refused: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-zinc-100 text-zinc-600 border-zinc-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-blue-100 text-blue-800 border-blue-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium capitalize", statusStyles[status])}
    >
      {status}
    </Badge>
  );
}
