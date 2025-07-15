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
    <div
      className={` min-h-screen w-full bg-black/30 transition-colors duration-200 ${theme === "dark" ? " text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <main className={`${isMobile ? "space-y-2" : "space-y-4"}`}>{children}</main>
    </div>
  );
}

export function SpPageHeader({
  title,
  subtitle,
  icon,
  breadcrumbs,
  button,
}: {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  breadcrumbs?: { label: string; link: string }[];
  button?: ReactNode[];
}) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className="">
      {breadcrumbs && (
        <div className={`${isMobile ? "px-2" : "md:px-4 2xl:px-6"}`}>
          <SpPageBreadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      )}

      <div className={` ${isMobile ? "px-6 mb-8 mt-6" : "px-6 pt-8 pb-8"} transition-all duration-200 relative py-2`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 justify-between w-full">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"}`}>{icon}</div>
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
            {button &&
              button.length > 0 &&
              (isMobile ? (
                <Dropdown>
                  <DropdownTrigger>
                    <MoreVertical className="w-5 h-5 cursor-pointer" />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    {button.map((item, index) => (
                      <DropdownItem className="text-sm  rounded-md bg-zinc-900 text-white" key={index}>
                        {item}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <div className="flex items-center gap-2">
                  {button.map((item, index) => (
                    <div key={index}>{item}</div>
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
  tabs: { id: string; label: string; icon: React.ComponentType<any> }[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className={`border-b my-6 transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
      <nav className={`flex ${isMobile ? "justify-center space-x-4" : "justify-start space-x-8"} items-center px-4`} aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.label}
              onClick={() => onChange(tab.id)}
              className={`group relative flex items-center gap-2 py-3 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                isActive
                  ? theme === "dark"
                    ? "border-purple-400 text-purple-400"
                    : "border-purple-600 text-purple-600"
                  : theme === "dark"
                    ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              title={tab.label}
            >
              <tab.icon className="w-4 h-4" />
              <span className={isMobile ? "text-xs" : "text-sm"}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function SpPageBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 md:px-4 2xl:px-6 px-2 pb-10 space-y-6">{children}</div>;
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
