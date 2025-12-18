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
  FaFileContract,
  FaBuilding,
  FaUserPlus,
  FaKey,
  FaUsers,
  FaUserLock,
  FaClipboardList,
  FaHistory,
  FaUserCheck,
  FaShieldAlt,
  FaCog
} from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

/* ================= FUNCTIONALITY ================= */
const functionalityChildren = [
  {
    to: "/admin/define-company",
    label: "Define Company",
    icon: <FaBuilding size={30} />,
  },
  {
    to: "/admin/create-software-user",
    label: "Create Software User",
    icon: <FaUserPlus size={30} />,
  },
  {
    to: "/admin/change-password",
    label: "Change Password",
    icon: <FaKey size={30} />,
  },
  {
    to: "/admin/create-software-groups",
    label: "Create Software Groups",
    icon: <FaUsers size={30} />,
  },
  {
    to: "/admin/assign-rights",
    label: "Assign Rights to Users & Groups",
    icon: <FaUserLock size={30} />,
  },
];

/* ================= REPORTS ================= */
const reportChildren = [
  {
    to: "/admin/software-users",
    label: "List of Software Users",
    icon: <FaClipboardList size={30} />,
  },
  {
    to: "/admin/group-rights",
    label: "Rights Assigned to Software Group",
    icon: <FaUserCheck size={30} />,
  },
  {
    to: "/admin/datewise-usage",
    label: "Datewise Software Usage Log",
    icon: <FaHistory size={30} />,
  },
  {
    to: "/admin/userwise-usage",
    label: "Userwise Software Usage Log",
    icon: <FaHistory size={30} />,
  },
  {
    to: "/admin/functionality-usage",
    label: "Functionality-wise Usage Log",
    icon: <FaChartLine size={30} />,
  },
];

/* ================= DEFINITIONS ================= */
const definitionChildren = [
  {
    to: "/admin/define-functionalities",
    label: "Define List of Functionalities",
    icon: <FaShieldAlt size={30} />,
  },
  {
    to: "/admin/form-operations",
    label: "Modes of Form Operations",
    icon: <FaCog size={30} />,
  },
];

const SoftwareSecurity = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <CommanHeader />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-gradient-to-b from-funcationlityColor to-teal-600 rounded-full"></div>
          <h1 className="text-2xl font-semibold text-gray-700">Software Security</h1>
        </div>
        <p className="text-gray-500 ml-4">Manage user access, permissions, and system security settings</p>
      </div>

      {/* ================= FUNCTIONALITY ================= */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-funcationlityColor to-teal-500 text-white shadow-lg">
            <FaCogs size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Functionality</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
          <span className="text-sm font-medium text-funcationlityColor bg-emerald-50 px-3 py-1 rounded-full">
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
                    <div className="text-funcationlityColor group-hover:text-funcationlityColor/90 transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-300 group-hover:text-funcationlityColor transition-colors mt-1" />
                </div>
                <h2 className="font-semibold text-gray-800 group-hover:text-funcationlityColor/90 transition-colors text-sm leading-tight">
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
          <div className="p-2 rounded-xl bg-gradient-to-r from-reportColor to-indigo-500 text-white shadow-lg">
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
                    <div className="text-reportColor group-hover:text-reportColor/90 transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-300 group-hover:text-reportColor transition-colors mt-1" />
                </div>
                <h2 className="font-semibold text-gray-800 group-hover:text-reportColor/90 transition-colors text-sm leading-tight">
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
          <div className="p-2 rounded-xl bg-gradient-to-r from-setupColor to-violet-500 text-white shadow-lg">
            <FaFileContract size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Definitions & Settings</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
          <span className="text-sm font-medium text-setupColor bg-purple-50 px-3 py-1 rounded-full">
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

export default SoftwareSecurity;