import { Card, Select, SelectItem } from "@heroui/react";
import { PlusCircle } from "lucide-react";
import { BarChart } from "recharts";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const data = [
  {
    name: "Open PRs",
    value: 4,
    icon: PlusCircle,
    iconColor: "text-indigo-500",
  },
  {
    name: "Merged PRs",
    value: 8,
    icon: PlusCircle,
    iconColor: "text-emerald-500",
  },
  {
    name: "New Issues",
    value: 8,
    icon: PlusCircle,
    iconColor: "text-indigo-500",
  },
  {
    name: "Closed Issues",
    value: 0,
    icon: PlusCircle,
    iconColor: "text-emerald-500",
  },
];

const topContributors = [
  {
    username: "Mbauchet",
    contributions: 7,
  },
  {
    username: "Pizuronin",
    contributions: 4,
  },
  {
    username: "Codetrendy",
    contributions: 3,
  },
  {
    username: "Devsparkle",
    contributions: 3,
  },
  {
    username: "Techphantom",
    contributions: 2,
  },
];

export default function Example() {
  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between">
        <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          December 27, 2023 – January 3, 2024
        </h3>
        <div>
          <Select placeholder="Select period" className="mt-4 sm:mt-0">
            <SelectItem>1</SelectItem>
            <SelectItem>2</SelectItem>
            <SelectItem>3</SelectItem>
          </Select>
        </div>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-tremor-border bg-tremor-background-muted px-6 py-4 dark:border-dark-tremor-border dark:bg-dark-tremor-background-muted">
          <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Overview</h3>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <div>
            <BarChart data={data} layout="vertical" className="mt-4 h-48" />
            <p className="mt-2 text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong">Active Pull Requests</p>
          </div>
          <div>
            <BarChart data={data} layout="vertical" className="mt-4 h-48" />
            <p className="mt-2 text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong">
              <span className="font-semibold">8</span> Active Issues
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-px border-t border-tremor-border bg-tremor-border dark:border-dark-tremor-border dark:bg-dark-tremor-border md:grid-cols-4">
          {data.map((item) => (
            <li key={item.name} className="flex flex-col items-center justify-center bg-tremor-brand-inverted p-3 dark:bg-dark-tremor-background">
              <div className="flex items-center space-x-1">
                <item.icon className={classNames(item.iconColor, "size-5")} aria-hidden={true} />
                <span className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{item.value}</span>
              </div>
              <span className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong">{item.name}</span>
            </li>
          ))}
        </ul>
      </Card>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Repository Summary</h4>
          <p className="mt-4 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
            Excluding merges, <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">2 authors</span> have
            pushed <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">2 commits</span> to main and{" "}
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">19 commits</span> to all branches. On main,{" "}
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">12 files </span>
            have changed and there have been{" "}
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">38 additions</span> and{" "}
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">9 deletions</span>.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Top contributors</h4>
          <BarChart data={topContributors} layout="vertical" className="mt-4 h-48" />
        </div>
      </div>
    </>
  );
}
