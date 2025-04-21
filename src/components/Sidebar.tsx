import { authStore } from "@/store/authStore";
import { BiSolidDashboard } from "react-icons/bi";
import { BsKanban } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useStore } from "zustand";

const navigation = [
  { name: "Dashboard", href: "/", icon: <BiSolidDashboard /> },
  { name: "Kanban Board", href: "/kanban", icon: <BsKanban /> },
];

export default function Sidebar() {
  const useAuthStore = useStore(authStore);

  return (
    <div className="flex flex-col gap-y-5 overflow-y-auto min-w-[15%] max-w-[20%] bg-[#0e0e0e]  px-6 py-6">
      <div className="flex h-16 items-center">
        <img
          alt="Logo"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex flex-1 flex-col">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className=" rounded-md px-4 py-2 text-md font-semibold text-gray-400 hover:bg-gray-100 flex justify-start items-center gap-2"
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={() => useAuthStore.logout()}
          className="mt-auto text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
