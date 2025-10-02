import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaListAlt,
  FaExchangeAlt,
  FaShoppingCart,
  FaDoorOpen,
  FaFileInvoiceDollar,
  FaUndoAlt,
  FaAddressBook,
  FaMoneyBillWave,
  FaReceipt,
} from "react-icons/fa";


import { FaClipboardCheck } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

const salesChildren = [
  { to: "/admin/distributor", label: "Distributor", icon: <FaListAlt /> },
  { to: "/admin/rate-list", label: "Rate List", icon: <FaListAlt /> },
  { to: "/admin/distributor-rate-list", label: "Distributor Rate List", icon: <FaExchangeAlt /> },
  { to: "/admin/booking-orders", label: "Booking Order", icon: <FaShoppingCart /> },
  { to: "/admin/empty-vehicle-entry", label: "Empty Vehicle Entry", icon: <FaDoorOpen /> },
  { to: "/admin/store-acknowledgement", label: "Store Acknowledgement", icon: <FaClipboardCheck /> },
  { to: "/admin/delivery-challan", label: "Delivery Challan", icon: <FaTruck /> },
  { to: "/admin/sales-invoices", label: "Sales Invoice", icon: <FaFileInvoiceDollar /> },
  { to: "/admin/sales-return", label: "Sales Return", icon: <FaUndoAlt /> },
  { to: "/admin/customer-ledger", label: "Customer Ledger", icon: <FaAddressBook /> },
  { to: "/admin/receivable", label: "Receivable", icon: <FaMoneyBillWave /> },
  { to: "/admin/payment-receipt-voucher", label: "Payment Receipt Voucher", icon: <FaReceipt /> },
];

const SalesPage = () => {
  return (
    <div className="p-6">
      <CommanHeader />
      <h1 className="text-2xl font-bold mb-6">Sales Module</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {salesChildren.map((item) => (
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

export default SalesPage;