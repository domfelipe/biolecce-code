import { BIOLECCE_LEAF_PATH, BIOLECCE_LEAF_VIEWBOX } from "@/components/ui/biolecceLeaf.js";
import { cn } from "@/components/lib/utils.js";

export function ZCodeAboutLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="90"
      height="100"
      fill="none"
      viewBox={BIOLECCE_LEAF_VIEWBOX}
      className={cn("shrink-0 text-current", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#71AF5E" d={BIOLECCE_LEAF_PATH} />
    </svg>
  );
}

export function ZCodeWordmarkLogo({ className }: { className?: string }) {
  return (
    <svg
      width="244"
      height="54"
      viewBox="0 0 244 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-current", className)}
      aria-hidden="true"
      focusable="false"
    >
      <text x="0" y="40" fill="currentColor" fontSize="38" fontWeight="600" fontFamily="system-ui, -apple-system, sans-serif">
        Biolecce Code
      </text>
    </svg>
  );
}
