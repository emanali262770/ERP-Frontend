import React from "react";
import { NavLink } from "react-router-dom";
import { FaStore } from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

const storeChildren = [
    { to: "/admin/item-defination", label: "Item Definition", icon: <FaStore /> },
];

const StorePage = () => {
    return (
        <div className="p-6">
            <CommanHeader />

            <h1 className="text-2xl font-bold mb-6">Store Module</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {storeChildren.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className="flex flex-col items-center justify-center text-black hover:no-underline group transition-all duration-300 hover:bg-blue-100 h-40 w-60 rounded-2xl"
                    >
                        <div className="text-4xl mb-2 text-black group-hover:text-blue-500 transition-colors duration-300">
                            {item.icon}
                        </div>
                        <h2 className="text-base font-medium text-center group-hover:text-blue-600">
                            {item.label}
                        </h2>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default StorePage;
