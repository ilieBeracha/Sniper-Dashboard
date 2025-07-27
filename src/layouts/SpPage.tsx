import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import React, { ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

export function SpPage({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  return (
    <div className={`w-full bg-black/30 pt-12 transition-colors duration-200 ${theme === "dark" ? "text-gray-100" : "bg-white text-gray-900"}`}>
      <main className={`flex flex-col gap-3 ${isMobile ? "space-y-2" : ""}`}>{children}</main>
    </div>
  );
}

export function SpPageHeader({
  title,
  subtitle,
  icon,
  breadcrumbs,
  action,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  breadcrumbs?: { label: string; link: string }[];
  action?: { label: string; onClick: () => void }[];
}) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className="flex-shrink-0">
      {breadcrumbs && (
        <div className={`${isMobile ? "px-2" : "md:px-4 2xl:px-6"}`}>
          <SpPageBreadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      )}
      <div className={`${isMobile ? "px-6 py-8" : "px-6 py-4"} transition-all duration-200 relative`}>
        <div className="flex flex justify-between sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 justify-between w-full">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"}`}>
                {React.createElement(icon, { className: "w-5 h-5" })}
              </div>
              <div>
                <h2 className={`text-lg font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>{title}</h2>
                {subtitle && (
                  <div className="flex items-center gap-4 mt-1">
                    <div className={`flex items-center gap-1.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <span>{subtitle}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {action && action.length > 0 && (
            <div className=" gap-2 rounded-lg shadow-2xs flex items-center justify-center">
              {isMobile ? (
                <Dropdown>
                  <DropdownTrigger className="cursor-pointer">
                    <span
                      className={`min-w-unit-8  p-1 h-unit-8 rounded-lg ${theme === "dark" ? "bg-zinc-800" : "bg-white"} backdrop-blur-sm flex items-center justify-center`}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </span>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions" className={`${theme === "dark" ? "bg-zinc-900" : "bg-gray-100"} rounded-lg p-1`}>
                    {action.map((item, index) => (
                      <DropdownItem
                        className="text-sm  rounded-md bg-zinc-900 text-white col-span-1"
                        key={index}
                        onPress={() => {
                          item.onClick();
                        }}
                      >
                        {item.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <div className="inline-flex rounded-lg  overflow-hidden shadow-sm">
                  {action.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className={`
                        px-3 py-1.5 text-xs font-medium transition-colors duration-200
                        ${index > 0 ? "border-l border-gray-200 dark:border-gray-700" : ""}
                        ${
                          theme === "dark"
                            ? "bg-zinc-800 text-gray-200 hover:bg-zinc-700 focus:bg-zinc-700"
                            : "bg-white text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                        }
                        focus:outline-none focus:z-10 disabled:opacity-50 disabled:pointer-events-none
                      `}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SpPageTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: {
  tabs: { id: string; label: string; icon: React.ComponentType<any>; disabled?: boolean }[];
  activeTab: string;
  onChange: (tab: { id: string; label: string; icon: React.ComponentType<any>; disabled?: boolean }) => void;
  className?: string;
}) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className={`flex-shrink-0 ${isMobile ? "" : "pb-4"} transition-colors duration-200`}>
      <nav className={`flex ${isMobile ? "justify-center gap-2" : "justify-start gap-4"} items-center ${className}`} aria-label="Tabs">
        {tabs.map((tab) => {
          if (tab.disabled) {
            return null;
          }
          const isActive = activeTab === tab.id;
          return (
            <span
              key={tab.label}
              onClick={() => onChange(tab)}
              className={`cursor-pointer relative flex items-center gap-2 ${isMobile ? "px-4 py-2 text-xs" : "px-6 py-2.5"} font-medium transition-all duration-300 ${
                isActive
                  ? theme === "dark"
                    ? "border-t-none border-b-2 border-white text-white"
                    : "border-t-none border-b-2 border-gray-900 text-gray-900"
                  : ""
              }`}
              title={tab.label}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span className={isMobile ? "text-xs" : "text-sm"}>{tab.label}</span>
            </span>
          );
        })}
      </nav>
    </div>
  );
}

export function SpPageBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 sm:px-4 md:px-6 pb-6">{children}</div>
    </div>
  );
}

export function SpPageBreadcrumbs({ breadcrumbs }: { breadcrumbs: { label: string; link: string }[] }) {
  const { theme } = useTheme();
  const isLastItem = (index: number) => index === breadcrumbs.length - 1;
  const isMobile = useIsMobile();

  // If there are 3 or more breadcrumbs, show only first and last with "..." in between
  const shouldCollapse = breadcrumbs.length >= 3;
  const visibleBreadcrumbs = shouldCollapse ? [breadcrumbs[0], { label: "...", link: "" }, breadcrumbs[breadcrumbs.length - 1]] : breadcrumbs;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {visibleBreadcrumbs.map((breadcrumb, index) => {
          const isEllipsis = breadcrumb.label === "...";
          const actualIndex = shouldCollapse && index === 2 ? breadcrumbs.length - 1 : index;

          return (
            <React.Fragment key={`${breadcrumb.label}-${index}`}>
              <BreadcrumbItem>
                {isEllipsis ? (
                  <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} ${isMobile ? "text-[12px]" : "text-xs"}`}>...</span>
                ) : isLastItem(actualIndex) ? (
                  <BreadcrumbLink
                    asChild
                    className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} ${isMobile ? "text-[12px]" : "text-xs"} font-medium cursor-default`}
                  >
                    <span>{breadcrumb.label}</span>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className={`${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"} ${isMobile ? "text-[12px]" : "text-xs"} transition-colors`}
                  >
                    <Link to={breadcrumb.link}>{breadcrumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < visibleBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function SpPageDivider() {
  const { theme } = useTheme();
  return <div className={`border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`} />;
}
