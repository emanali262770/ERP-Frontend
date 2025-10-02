import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaFileAlt,
  FaCheckCircle,
  FaCommentsDollar,
  FaCalculator,
  FaFileInvoiceDollar,
  FaSignInAlt,
  FaCheckDouble,
  FaFileInvoice,
  FaUndoAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

const purchaseChildren = [
  { to: "/admin/purchase-requisition", label: "Purchase Requisition", icon: <FaFileAlt /> },
  { to: "/admin/purchase-approval", label: "Purchase Approval", icon: <FaCheckCircle /> },
  { to: "/admin/quotation", label: "Market Quotation", icon: <FaCommentsDollar /> },
  { to: "/admin/estimation", label: "Estimation", icon: <FaCalculator /> },
  { to: "/admin/purchase-order", label: "Purchase Order", icon: <FaFileInvoiceDollar /> },
  { to: "/admin/gatepass-in", label: "GatePass IN", icon: <FaSignInAlt /> },
  { to: "/admin/quality-checking", label: "Quality Checking", icon: <FaCheckDouble /> },
  { to: "/admin/grn", label: "Goods Receipt Note", icon: <FaFileInvoice /> },
  { to: "/admin/purchase-return", label: "Purchase Return", icon: <FaUndoAlt /> },
  { to: "/admin/gatepass-out", label: "GatePass OUT", icon: <FaSignOutAlt /> },
];

const PurchasePage = () => {
  return (
    <div className="p-6">
      <CommanHeader />
      <h1 className="text-2xl font-bold mb-6">Purchase Module</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {purchaseChildren.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col h-56 items-center justify-center p-6 rounded-xl text-black bg-white shadow-md hover:no-underline group hover:shadow-lg hover:-translate-y-2 hover:scale-105 transition-all duration-300"
          >
            <div className="text-4xl mb-3 text-black group-hover:text-green-500 transition-colors duration-300">
              {item.icon}
            </div>
            <h2 className="text-lg font-semibold text-center">{item.label}</h2>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default PurchasePage;