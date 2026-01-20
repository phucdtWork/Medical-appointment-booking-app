// src/components/breadcrumb/GlobalBreadcrumb.tsx
"use client";

import { useState, useEffect } from "react";
import { Breadcrumb, Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBreadcrumb, useAutoBreadcrumb } from "@/hooks/useBreadcrumb";

export default function GlobalBreadcrumb() {
  const { customItems } = useBreadcrumb();
  const autoItems = useAutoBreadcrumb();
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 0;
  });

  // Use custom items if provided, otherwise use auto-generated
  const items = customItems && customItems.length > 0 ? customItems : autoItems;

  // Track window width
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!items.length) return null;

  const isMobile = windowWidth < 768;
  const shouldCollapse = isMobile && items.length > 4;

  // Mobile collapsed view with dropdown
  if (shouldCollapse) {
    const first = items[0];
    const middle = items.slice(1, -1);
    const last = items[items.length - 1];

    // Create dropdown menu items
    const menuItems: MenuProps["items"] = middle.map((item, index) => ({
      key: index,
      label: item.href ? (
        <Link href={item.href}>{item.title || "Page"}</Link>
      ) : (
        <span>{item.title || "Page"}</span>
      ),
      onClick: item.href ? () => router.push(item.href as string) : undefined,
    }));

    const collapsedItems = [
      first,
      {
        title: (
          <Dropdown menu={{ items: menuItems }} placement="bottomLeft">
            <span className="cursor-pointer px-2">
              <EllipsisOutlined />
            </span>
          </Dropdown>
        ),
      },
      last,
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Breadcrumb items={collapsedItems as any} className="py-3" />;
  }

  // Normal view
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Breadcrumb items={items as any} className="py-3" />;
}
