// src/components/breadcrumb/useBreadcrumb.ts
"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { HomeOutlined } from "@ant-design/icons";
import { BreadcrumbContext } from "@/providers/BreadcrumbProvider";
import { BreadcrumbItem } from "@/types/breadcrumb.types";
import { breadcrumbConfig, excludedRoutes } from "@/config/breadcrumb.config";
import { useTheme } from "@/providers/ThemeProvider";

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }
  return context;
}

export function useAutoBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("breadcrumb");
  const { isDark } = useTheme();

  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

    const segments = pathWithoutLocale.split("/").filter(Boolean);

    if (segments.some((seg) => excludedRoutes.includes(seg))) {
      setItems([]);
      return;
    }

    const breadcrumbs: BreadcrumbItem[] = [
      {
        title: (
          <Link href={`/${locale}`} className="flex items-center gap-1">
            <HomeOutlined />
            <span
              className={`${
                isDark ? "text-text-primary-dark" : "text-text-primary"
              }`}
            >
              {" "}
              {t("home")}
            </span>
          </Link>
        ),
        href: `/${locale}`,
      },
    ];

    let currentPath = `/${locale}`;

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      const isDynamicId =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          segment
        ) || /^\d+$/.test(segment);

      if (isDynamicId) {
        return;
      }

      const config = breadcrumbConfig[segment];
      let label = segment;

      if (config) {
        if (config.translationKey) {
          label = t(config.translationKey as any);
        } else if (config.label) {
          label = config.label;
        }
      } else {
        label =
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      }

      if (isLast) {
        breadcrumbs.push({ title: label });
      } else {
        breadcrumbs.push({
          title: <Link href={currentPath}>{label}</Link>,
          href: currentPath,
        });
      }
    });

    setItems(breadcrumbs);
  }, [pathname, locale, t]);

  return items;
}

export function useSetBreadcrumb(getItems: () => BreadcrumbItem[]) {
  const { setCustomItems } = useBreadcrumb();
  const t = useTranslations("breadcrumb");
  const locale = useLocale();

  const { isDark } = useTheme();

  useEffect(() => {
    const items = getItems();

    if (items.length > 0 && !items[0].href?.includes("home")) {
      items.unshift({
        title: (
          <Link href={`/${locale}`} className="flex items-center gap-1">
            <HomeOutlined color={isDark ? "#ffffff" : "#000000"} />
            <span className={`${isDark ? "text-white" : "text-black"}`}>
              {" "}
              {t("home")}
            </span>
          </Link>
        ),
        href: `/${locale}`,
      });
    }

    setCustomItems(items);

    return () => setCustomItems(null);
  }, [getItems, setCustomItems, locale, t]);
}
