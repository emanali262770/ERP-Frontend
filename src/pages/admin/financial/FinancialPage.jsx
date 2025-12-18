import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaFileAlt,
  FaCheckCircle,
  FaCommentsDollar,
  FaCalculator,
  FaFileInvoiceDollar,
  FaCheckDouble,
  FaChevronRight,
  FaChartLine,
  FaCogs,
  FaFileContract
} from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

/* ================= FUNCTIONALITY ================= */
const functionalityChildren = [
  { to: "/admin/companies", label: "List of Companies (Brands)", icon: <FaFileAlt size={30} /> },
  { to: "/admin/opening-balances", label: "Opening Balances", icon: <FaCheckCircle size={30} /> },
  { to: "/admin/cash-payment-voucher", label: "Cash Payment Voucher", icon: <FaCommentsDollar size={30} /> },
  { to: "/admin/cash-receipt-voucher", label: "Cash Receipt Voucher", icon: <FaCalculator size={30} /> },
  { to: "/admin/bank-payment-voucher", label: "Bank Payment Voucher", icon: <FaFileInvoiceDollar size={30} /> },
  { to: "/admin/bank-receipt-voucher", label: "Bank Receipt Voucher", icon: <FaCheckDouble size={30} /> },
  { to: "/admin/journal-voucher", label: "Journal Voucher", icon: <FaFileAlt size={30} /> },
  { to: "/admin/general-acquisition", label: "General Acquisition", icon: <FaCheckCircle size={30} /> },
  { to: "/admin/employee-advance", label: "Employee Advance Voucher", icon: <FaCommentsDollar size={30} /> },
  { to: "/admin/employee-loan", label: "Employee Loan Management", icon: <FaCalculator size={30} /> },
  { to: "/admin/voucher-approval", label: "Vouchers Approval", icon: <FaFileInvoiceDollar size={30} /> },
  { to: "/admin/ledger", label: "Ledger", icon: <FaCheckDouble size={30} /> },
  { to: "/admin/pdc-issued", label: "Post Dated Cheques Issued", icon: <FaFileAlt size={30} /> },
  { to: "/admin/pdc-received", label: "Post Dated Cheques Received", icon: <FaCheckCircle size={30} /> },
  { to: "/admin/trial-balance", label: "Trial Balance", icon: <FaCommentsDollar size={30} /> },
  { to: "/admin/accumulative-balance", label: "Accumulative Balances", icon: <FaCalculator size={30} /> },
];

/* ================= REPORTS ================= */
const reportChildren = [
  { to: "/admin/account-payables", label: "Account Payables", icon: <FaFileAlt size={30} /> },
  { to: "/admin/account-receivables", label: "Account Receivables", icon: <FaCheckCircle size={30}  /> },
  { to: "/admin/balance-sheet", label: "Balance Sheet", icon: <FaCommentsDollar size={30} /> },
  { to: "/admin/income-expenditure", label: "Income & Expenditure", icon: <FaCalculator size={30} /> },
  { to: "/admin/cash-flow", label: "Cash Flow Statement", icon: <FaFileInvoiceDollar size={30} /> },
  { to: "/admin/funds-position", label: "Funds Position", icon: <FaCheckDouble size={30} /> },
  { to: "/admin/budget-variance", label: "Budget vs Actual Variance", icon: <FaFileAlt size={30} /> },
  { to: "/admin/fixed-assets", label: "Fixed Assets & Depreciation", icon: <FaCheckCircle size={30} /> },
  {
    to: "/admin/withholding-tax",
    label: "Withholding Tax Deducted at Source",
    icon: <FaCommentsDollar size={30} />,
  },
  { to: "/admin/head-expense", label: "Head Wise Expense Reports", icon: <FaCalculator size={30} /> },
  { to: "/admin/closing-year", label: "Closing of Financial Year", icon: <FaFileInvoiceDollar size={30} /> },
  { to: "/admin/employee-dsa", label: "Employee Wise DSA & Medical Breakup", icon: <FaCheckDouble size={30} /> },
  { to: "/admin/bank-reconciliation", label: "Bank Reconciliation Statements", icon: <FaFileAlt size={30} /> },
  { to: "/admin/admin-expense", label: "Administrative Expenditures on Projects", icon: <FaCheckCircle size={30} /> },
];

/* ================= DEFINITIONS ================= */
const definitionChildren = [
  { to: "/admin/currency", label: "Currency", icon: <FaFileAlt size={30} /> },
  { to: "/admin/bank-info", label: "Bank Information", icon: <FaCheckCircle size={30} /> },
  { to: "/admin/main-heads", label: "Main Heads", icon: <FaCommentsDollar size={30} /> },
  { to: "/admin/sub-heads", label: "Sub Main Heads", icon: <FaCalculator size={30} /> },
  { to: "/admin/chart-account", label: "Chart of Account", icon: <FaFileInvoiceDollar size={30} /> },
  { to: "/admin/income-mapping", label: "Income Statement Mapping", icon: <FaCheckDouble size={30} /> },
];

const FinancialPage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <CommanHeader />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
          <h1 className="text-2xl font-semibold text-gray-700">Financial Module</h1>
        </div>
        <p className="text-gray-500 ml-4">Manage all financial operations, reports, and configurations</p>
      </div>

      {/* ================= FUNCTIONALITY ================= */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
            <FaCogs size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Functionality</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
          <span className="text-sm font-medium text-funcationlityColor  bg-emerald-50 px-3 py-1 rounded-full">
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
                    <div className="text-funcationlityColor group-hover:text-emerald-700 transition-colors">
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
          <span className="text-sm font-medium text-reportColor bg-blue-50 px-3 py-1 rounded-full">
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
                    <div className="text-reportColor group-hover:text-blue-700 transition-colors">
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

      {/* ================= DEFINITIONS ================= */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg">
            <FaFileContract size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Definitions & Settings</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
          <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            {definitionChildren.length} settings
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {definitionChildren.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 group-hover:from-purple-100 group-hover:to-violet-100 transition-colors">
                    <div className="text-setupColor group-hover:text-setupColor/90 transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-300 group-hover:text-setupColor transition-colors mt-1" />
                </div>
                <h2 className="font-semibold text-gray-800 group-hover:text-setupColor/90 transition-colors text-sm leading-tight">
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

export default FinancialPage;