import { NavLink } from "react-router-dom";
import reactLogo from "../assets/react.svg";

export function NavBar() {
    return (
        <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
                <img src={reactLogo} alt="Inkwell" className="w-7 h-7" />
                <span className="font-bold text-lg">Inkwell</span>
            </div>

            <div className="flex gap-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `text-sm ${isActive ? "font-semibold text-indigo-600" : "text-gray-600"}`
                    }
                >
                    Feed
                </NavLink>

                <NavLink
                    to="/write"
                    className={({ isActive }) =>
                        `text-sm ${isActive ? "font-semibold text-indigo-600" : "text-gray-600"}`
                    }
                >
                    Write
                </NavLink>
            </div>
        </nav>
    );
}