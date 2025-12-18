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
  FaClipboardCheck,
  FaBalanceScale,
  FaTruckLoading,
  FaClipboardList,
  FaChartLine,
  FaCogs,
  FaFileContract,
  FaChevronRight,
  FaUserTie,
  FaPercentage,
  FaWarehouse,
  FaReceipt,
  FaBoxOpen,
  FaUsers,
  FaListAlt,
  FaChartBar
} from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

/* ================= FUNCTIONALITY ================= */
const functionalityChildren = [
  { to: "/admin/purchase-requisition", label: "Purchase Requisition", icon: <FaFileAlt size={30} /> },
  { to: "/admin/purchase-approval", label: "Purchase Requisition Approval", icon: <FaCheckCircle size={30} /> },
  { to: "/admin/quotation", label: "Quotations from Suppliers", icon: <FaCommentsDollar size={30} /> },
  { to: "/admin/comparative-statement", label: "Comparative Statement", icon: <FaBalanceScale size={30} /> },
  { to: "/admin/comparative-approval", label: "Approval of Comparative", icon: <FaClipboardCheck size={30} /> },
  { to: "/admin/purchase-order", label: "Purchase Order", icon: <FaFileInvoiceDollar size={30} /> },
  { to: "/admin/gatepass-in", label: "GatePass IN", icon: <FaSignInAlt size={30} /> },
  { to: "/admin/goods-inspection", label: "Goods Inspection Note", icon: <FaClipboardList size={30} /> },
  { to: "/admin/goods-receipt-ack", label: "Goods Receipt/Rejection Acknowledgment", icon: <FaTruckLoading size={30} /> },
  { to: "/admin/gatepass-out", label: "GatePass OUT", icon: <FaSignOutAlt size={30} /> },
  { to: "/admin/grn", label: "Goods Receipt Note", icon: <FaReceipt size={30} /> },
  { to: "/admin/finished-goods-receipt", label: "Finished Goods Receipt Note", icon: <FaBoxOpen size={30} /> },
  { to: "/admin/purchase-invoice", label: "Purchase Invoice", icon: <FaFileInvoice size={30} /> },
];

/* ================= REPORTS ================= */
const reportChildren = [
  { to: "/admin/datewise-purchase-req", label: "Datewise Purchase Requisition", icon: <FaChartBar size={30} /> },
  { to: "/admin/itemwise-purchase-req", label: "Itemwise Purchase Requisition", icon: <FaListAlt size={30} /> },
  { to: "/admin/deptwise-purchase-req", label: "Departmentwise Purchase Requisition", icon: <FaUsers size={30} /> },
  { to: "/admin/pending-purchase-req", label: "Pending Purchase Requisition", icon: <FaClipboardList size={30} /> },
  { to: "/admin/datewise-approved-req", label: "Datewise Approved Purchase Requisition", icon: <FaCheckCircle size={30} /> },
  { to: "/admin/datewise-purchase-orders", label: "Datewise Purchase Orders", icon: <FaFileInvoiceDollar size={30} /> },
  { to: "/admin/supplierwise-purchase-orders", label: "Supplierwise Purchase Orders", icon: <FaUserTie size={30} /> },
  { to: "/admin/itemwise-purchase-orders", label: "Itemwise Purchase Orders", icon: <FaListAlt size={30} /> },
  { to: "/admin/datewise-goods-receipts", label: "Datewise Goods Receipts", icon: <FaReceipt size={30} /> },
  { to: "/admin/itemwise-goods-receipts", label: "Itemwise Goods Receipts", icon: <FaListAlt size={30} /> },
  { to: "/admin/supplierwise-goods-receipts", label: "Supplierwise Goods Receipts", icon: <FaUserTie size={30} /> },
  { to: "/admin/datewise-gatepass-in", label: "Datewise GatePass IN", icon: <FaSignInAlt size={30} /> },
  { to: "/admin/datewise-gatepass-out", label: "Datewise GatePass OUT", icon: <FaSignOutAlt size={30} /> },
];

/* ================= SETUP ================= */
const setupChildren = [
  { to: "/admin/supplier-information", label: "Supplier Information", icon: <FaUserTie size={30} /> },
  { to: "/admin/taxes-setup", label: "Taxes Setup", icon: <FaPercentage size={30} /> },
];

const PurchasePage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <CommanHeader />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
          <h1 className="text-2xl font-semibold text-gray-700">Purchase Module</h1>
        </div>
        <p className="text-gray-500 ml-4">Manage procurement processes, supplier relationships, and purchase analytics</p>
      </div>

      {/* ================= FUNCTIONALITY ================= */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
            <FaCogs size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Functionality</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {functionalityChildren.length} modules
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {functionalityChildren.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors">
                    <div className="text-emerald-600 group-hover:text-emerald-700 transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors mt-1" />
                </div>
                <h2 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors text-sm leading-tight">
                  {item.label}
                </h2>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ================= REPORTS ================= */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
            <FaChartLine size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Reports & Analytics</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {reportChildren.length} reports
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {reportChildren.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors mt-1" />
                </div>
                <h2 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors text-sm leading-tight">
                  {item.label}
                </h2>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* ================= SETUP ================= */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg">
            <FaFileContract size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Setup & Configuration</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
          <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            {setupChildren.length} settings
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {setupChildren.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 group-hover:from-purple-100 group-hover:to-violet-100 transition-colors">
                    <div className="text-purple-600 group-hover:text-purple-700 transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-300 group-hover:text-purple-500 transition-colors mt-1" />
                </div>
                <h2 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors text-sm leading-tight">
                  {item.label}
                </h2>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-violet-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;