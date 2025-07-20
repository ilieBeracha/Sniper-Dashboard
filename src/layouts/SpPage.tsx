import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import React, { ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import BaseButton from "@/components/base/BaseButton";

export function SpPage({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  return (
    <div
      className={`w-full h-screen bg-black/30 transition-colors duration-200 ${theme === "dark" ? "text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <main className={`flex flex-col h-screen ${isMobile ? "space-y-2" : ""}`}>{children}</main>
    </div>
  );
}

export function SpPageHeader({
  title,
  subtitle,
  icon,
  breadcrumbs,
  dropdownItems,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  breadcrumbs?: { label: string; link: string }[];
  dropdownItems?: { label: string; onClick: () => void }[];
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
      <div className={`${isMobile ? "px-6 py-4" : "px-6 py-4"} transition-all duration-200 relative`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            {dropdownItems &&
              dropdownItems.length > 0 &&
              (isMobile ? (
                <Dropdown>
                  <DropdownTrigger className="cursor-pointer">
                    <span
                      className={`min-w-unit-8 p-2 h-unit-8 rounded-lg ${theme === "dark" ? "bg-black/20" : "bg-gray-400/10"} backdrop-blur-sm flex items-center justify-center`}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </span>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions" className={`${theme === "dark" ? "bg-zinc-900" : "bg-gray-100"} rounded-lg p-1`}>
                    {dropdownItems.map((item, index) => (
                      <DropdownItem
                        className="text-sm  rounded-md bg-zinc-900 text-white"
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
                <div className="flex items-center gap-2">
                  {dropdownItems.map((item, index) => (
                    <BaseButton style="purple" className="text-sm px-2 py-1 rounded-md" key={index} onClick={item.onClick}>
                      <span className="text-sm">{item.label}</span>
                    </BaseButton>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpPageTabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string; icon: React.ComponentType<any>; disabled?: boolean }[];
  activeTab: string;
  onChange: (tab: { id: string; label: string; icon: React.ComponentType<any>; disabled?: boolean }) => void;
}) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className={`flex-shrink-0 ${isMobile ? "pb-4" : "pb-4"} transition-colors duration-200`}>
      <nav className={`flex ${isMobile ? "justify-center gap-2" : "justify-start gap-4"} items-center px-4`} aria-label="Tabs">
        {tabs.map((tab) => {
          if (tab.disabled) {
            return null;
          }
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.label}
              onClick={() => onChange(tab)}
              disabled={tab.disabled}
              className={`relative flex items-center gap-2 ${
                isMobile ? "px-4 py-2" : "px-6 py-2.5"
              } font-medium rounded-full transition-all duration-300 ${
                isActive
                  ? theme === "dark"
                    ? "bg-zinc-800 text-white"
                    : "bg-gray-900 text-white"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-800"
              }`}
              title={tab.label}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span className={isMobile ? "text-xs" : "text-sm"}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function SpPageBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-2 md:px-4 2xl:px-6 pb-6">{children}</div>
    </div>
  );
}

export function SpPageBreadcrumbs({ breadcrumbs }: { breadcrumbs: { label: string; link: string }[] }) {
  const { theme } = useTheme();
  const isLastItem = (index: number) => index === breadcrumbs.length - 1;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.label}>
            <BreadcrumbItem>
              {isLastItem(index) ? (
                <BreadcrumbLink asChild className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} text-xs font-medium cursor-default`}>
                  <span>{breadcrumb.label}</span>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink
                  asChild
                  className={`${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"} text-xs transition-colors`}
                >
                  <Link to={breadcrumb.link}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function SpPageDivider() {
  const { theme } = useTheme();
  return <div className={`border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`} />;
}
