// Sidebar.tsx
import { BiUser } from "react-icons/bi";
import { BsInbox } from "react-icons/bs";
import { GoHome } from "react-icons/go";

export default function Sidebar() {
  const menuList = [
    { label: "Home", icon: <GoHome />, href: "/" },
    {
      label: "Inbox",
      icon: <BsInbox />,
      href: "#",
      badge: "",
      badgeColor: "blue",
    },
    { label: "Users", icon: <BiUser />, href: "#" },
  ];

  return (
    <aside className="w-[10%] min-w-[120px] h-screen bg-[#252229] px-3 py-4 hidden sm:block">
      <h3 className="py-5 text-2xl px-2 text-white">Sniper</h3>
      <ul className="space-y-2 font-medium">
        {menuList.map((item, idx) => (
          <li key={idx}>
            <a
              href={item.href}
              className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
            >
              {item.icon}
              <span className="flex-1 ms-3 whitespace-nowrap">
                {item.label}
              </span>
              {item.badge && (
                <span
                  className={`inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full ${
                    item.badgeColor === "blue"
                      ? "text-blue-800 bg-blue-100"
                      : "text-gray-800 bg-gray-100"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
