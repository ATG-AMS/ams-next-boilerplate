import { Tab } from "@/components/atoms/LinkTabs/LinkTab";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type TabItem = {
  key: string;
  name: string;
  description?: string;
  disabled?: boolean;
};

type Props = {
  path: string;
  parallelRoutesKey?: string;
  tabItems: TabItem[];
  className?: string;
};

export const TabGroup = ({
  path,
  parallelRoutesKey,
  tabItems,
  className = "",
}: Props) => {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {tabItems.map((item) => (
        <Tab
          key={path + item.name}
          item={item}
          path={path}
          description={item.description}
          parallelRoutesKey={parallelRoutesKey}
        />
      ))}
    </div>
  );
};

export const TabNavItem = ({
  children,
  href,
  isActive,
}: {
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={cn("rounded-lg px-3 py-1 text-sm font-medium", {
        "bg-[#F9FBFA] text-[#001E2B] hover:bg-gray-500 hover:text-white":
          !isActive,
        "bg-[#71F6BA] font-semibold text-[#00684A]": isActive,
      })}
    >
      {children}
    </Link>
  );
};
