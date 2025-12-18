import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBox,
  FaBoxOpen,
  FaBullhorn,
  FaExchangeAlt,
  FaUndoAlt,
  FaTags,
  FaBoxes,
  FaDollarSign,
  FaExclamationTriangle,
  FaBook,
  FaFolder,
  FaList,
  FaLayerGroup,
  FaIndustry,
  FaMapMarkerAlt,
  FaBalanceScale,
  FaCogs,
  FaChartLine,
  FaFileContract,
  FaChevronRight
} from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

/* ================= FUNCTIONALITY ================= */
const functionalityChildren = [
  { to: "/admin/item-details", label: "Item Details", icon: <FaBox size={30} /> },
  { to: "/admin/opening-stock-items", label: "Opening Stock Items", icon: <FaBoxOpen size={30} /> },
  { to: "/admin/defination-promotion", label: "Promotion Definition", icon: <FaBullhorn size={30} /> },
  { to: "/admin/issue-other-units", label: "Issue to Other Units", icon: <FaExchangeAlt size={30} /> },
  { to: "/admin/return-other-units", label: "Return from Other Units", icon: <FaUndoAlt size={30} /> },
];

/* ================= REPORTS ================= */
const reportChildren = [
  { to: "/admin/price-list", label: "Price List", icon: <FaTags size={30} /> },
  { to: "/admin/stock-position", label: "Stock Position", icon: <FaBoxes size={30} /> },
  { to: "/admin/stock-price", label: "Stock Price", icon: <FaDollarSign size={30} /> },
  { to: "/admin/low-level", label: "Low Level Alert", icon: <FaExclamationTriangle size={30} /> },
  { to: "/admin/item-ledger", label: "Item Ledger", icon: <FaBook size={30} /> },
];

/* ================= SETUP ================= */
const setupChildren = [
  { to: "/admin/item-category", label: "Item Category", icon: <FaFolder size={30} /> },
  { to: "/admin/list-categories", label: "Categories List", icon: <FaList size={30} /> },
  { to: "/admin/list-sub-categories", label: "Sub-Categories", icon: <FaLayerGroup size={30} /> },
  { to: "/admin/manufactures", label: "Manufacturers", icon: <FaIndustry size={30} /> },
  { to: "/admin/location-list", label: "Location List", icon: <FaMapMarkerAlt size={30} /> },
  { to: "/admin/unit-list", label: "Unit List", icon: <FaBalanceScale size={30} /> },
];

const StockPage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <CommanHeader />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
          <h1 className="text-2xl font-semibold text-gray-700">Stock Module</h1>
        </div>
        <p className="text-gray-500 ml-4">Manage inventory, track stock movements, and configure settings</p>
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

      {/* Quick Stats */}
      {/* <div className="mt-12 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Module Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">{functionalityChildren.length}</div>
            <div className="text-sm text-gray-600">Core Functions</div>
          </div>
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{reportChildren.length}</div>
            <div className="text-sm text-gray-600">Reports</div>
          </div>
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{setupChildren.length}</div>
            <div className="text-sm text-gray-600">Setup Items</div>
          </div>
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {functionalityChildren.length + reportChildren.length + setupChildren.length}
            </div>
            <div className="text-sm text-gray-600">Total Features</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default StockPage;