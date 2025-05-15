import * as React from "react";
import { cn } from "@/libs/utils";

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b border-gray-200 my-4", className)} {...props} />;
}