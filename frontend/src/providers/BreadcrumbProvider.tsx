"use client";

import { createContext, useState, ReactNode } from "react";
import {
  BreadcrumbContextType,
  BreadcrumbItem,
} from "@/types/breadcrumb.types";

export const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [customItems, setCustomItems] = useState<BreadcrumbItem[] | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ customItems, setCustomItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
