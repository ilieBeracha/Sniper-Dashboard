import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export function SpPage({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <div
      className={`min-h-screen w-full transition-colors duration-200 ${theme === "dark" ? "bg-[#121212] text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <main className="pb-10 space-y-6">{children}</main>
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
    <div className="m-0 p-0">
      {breadcrumbs && (
        <div className="md:px-6 2xl:px-6 px-4">
          <SpPageBreadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      )}

      <div className={` ${isMobile ? "px-6 mt-10 mb-0" : "px-8 py-14"} transition-all duration-200 min-h-28`}>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreVertical className="w-6 h-6 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col gap-2 border-none bg-zinc-700">
                    <DropdownMenuItem className="cursor-pointer flex flex-col gap-2">
                      {button.map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
  tabs: { label: string; icon: ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className={`border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
      <nav className={`flex ${isMobile ? "justify-center space-x-4" : "justify-start space-x-8"} items-center px-4`} aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => onChange(tab.label)}
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
              {tab.icon}
              <span className={isMobile ? "text-xs" : "text-sm"}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function SpPageBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 md:px-6 py-4 2xl:px-6 px-4 pb-10 space-y-6">{children}</div>;
}

export function SpPageBreadcrumbs({ breadcrumbs }: { breadcrumbs: { label: string; link: string }[] }) {
  const { theme } = useTheme();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem key={breadcrumb.label}>
            <BreadcrumbLink asChild className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-md`}>
              <Link to={breadcrumb.link}>{breadcrumb.label}</Link>
            </BreadcrumbLink>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
