import { ReactNode } from "react";

export interface BreadcrumbItem {
  title: ReactNode;
  href?: string;
}

export interface BreadcrumbConfig {
  [key: string]: {
    translationKey?: string;
    label?: string;
  };
}

export interface BreadcrumbContextType {
  customItems: BreadcrumbItem[] | null;
  setCustomItems: (items: BreadcrumbItem[] | null) => void;
}
