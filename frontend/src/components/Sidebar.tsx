import { useState } from "react";
import { Home, List, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/", icon: <Home /> },
    {
      id: "list-products",
      label: "List Products",
      path: "/product-list",
      icon: <List />,
    },
    {
      id: "create-product",
      label: "Create Product",
      path: "/create-product",
      icon: <Plus />,
    },
  ];

  return (
    <>
      <button
        className="fixed top-5 left-5 bg-white text-black border-2 border-black rounded-lg p-2 z-50 shadow-lg hover:bg-black hover:text-white transition"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <img
            src="\product-icon-collection-trendy-modern-flat-linear-vector-white-background-thin-line-outline-illustration-130947207.webp"
            alt="Logo"
            className="w-6 h-6 rounded-full"
          />
        )}
      </button>

      {isOpen && (
        <nav className="fixed top-0 left-0 h-full w-[280px] bg-white text-black flex flex-col z-40 shadow-2xl animate-slideIn">
          <div className="flex justify-center items-center py-5 border-b border-gray-200">
            <img
              src="\product-icon-collection-trendy-modern-flat-linear-vector-white-background-thin-line-outline-illustration-130947207.webp"
              alt="product logo"
              className="w-14 h-14 rounded-full object-cover border-2 border-black shadow-md hover:scale-105 transition"
            />
          </div>

          <ul className="flex-1 px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition relative hover:bg-gray-100 ${
                  activeItem === item.id
                    ? "bg-white text-black shadow font-semibold"
                    : ""
                }`}
                onClick={() => {
                  setActiveItem(item.id);
                  navigate(item.path);
                }}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center text-gray-600 mr-3 ${
                    activeItem === item.id ? "text-black" : ""
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-sm flex-1 truncate">{item.label}</span>
                {activeItem === item.id && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-black rounded" />
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};

export default SideBar;
