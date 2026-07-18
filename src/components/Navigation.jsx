// src/components/Navigation.jsx
import { NavLink } from "react-router-dom";
import chatIcon from "../assets/chat.svg";
import homeIcon from "../assets/home.svg";
import storeIcon from "../assets/store.svg";
import profileIcon from "../assets/profile.svg";
import "../styles/components/Navigation.css";

export default function Navigation() {
    const tabs = [
        { to: "/chat", label: "채팅", icon: chatIcon },
        { to: "/", label: "홈", icon: homeIcon },
        { to: "/village", label: "마을시장", icon: storeIcon },
        { to: "/mypage", label: "프로필", icon: profileIcon },
    ];

    return (
        <nav className="bottom-nav">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.to === "/"}
                    className={({ isActive }) =>
                        isActive
                            ? "bottom-nav__tab bottom-nav__tab--active"
                            : "bottom-nav__tab"
                    }
                >
                    <img className="bottom-nav__icon" src={tab.icon} alt="" />
                    <span className="bottom-nav__label">{tab.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
