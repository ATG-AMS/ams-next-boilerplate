"use client";

import type { TabItem } from "@/components/atoms/LinkTabs/LinkTabsGroup";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export const Tab = ({
  path,
  parallelRoutesKey,
  item,
  description,
}: {
  path: string;
  parallelRoutesKey?: string;
  item: TabItem;
  description?: string;
}) => {
  const { key, name, disabled } = item;
  const segment = useSelectedLayoutSegment(parallelRoutesKey);
  const href = key ? path + "/" + key : path;
  const isActive = (!key && segment === null) || segment === key;

  if (disabled)
    return (
      <div
        className={
          "cursor-not-allowed rounded-lg bg-gray-300 px-3 py-1 text-sm font-medium shadow-md"
        }
      >
        <p>{name}</p>
        {description && <p>{description}</p>}
      </div>
    );
  else {
    return (
      <Link
        href={href}
        className={cn("rounded-lg px-3 py-1 text-sm font-medium shadow-md", {
          "bg-[#f3f3f3] text-[#001E2B] hover:bg-gray-500 hover:text-white":
            !isActive,
          "bg-[#C0FAE6] font-semibold text-[#00684A]": isActive,
        })}
      >
        <p>{name}</p>
        {description && <p>{description}</p>}
      </Link>
    );
  }
};
