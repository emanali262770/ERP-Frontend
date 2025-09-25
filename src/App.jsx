import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ItemList from "./pages/admin/ItemList.jsx";
import CustomerData from "./pages/admin/CustomerData";
import { ToastContainer } from "react-toastify";
import ShelveLocation from "./pages/admin/SetUp/ShelveLocation.jsx";
import "react-toastify/dist/ReactToastify.css";
import CategoryItem from "./pages/admin/SetUp/CategoryItem";
import PurchaseRequisition from "./pages/admin/Purchase/PurchaseRequisition";
import PurchaseApproval from "./pages/admin/Purchase/PurchaseApproval.jsx";
import Quotation from "./pages/admin/Purchase/Quotation.jsx";
import Estimation from "./pages/admin/Purchase/Estimation";
import GatePassIN from "./pages/admin/Purchase/GatePassIN.jsx";
// import ProtectedRoute from "./components/ProtectedRoute";
import SupplierList from "./pages/admin/SetUp/Supplier.jsx";
import Manufacture from "./pages/admin/SetUp/Manufacture.jsx";
import ItemBarcode from "./pages/admin/ItemBarcode";
import ItemPurchase from "./pages/admin/Purchase/ItemPurchase";
import SalesInvoice from "./pages/admin/SalesInvoice";
import ExpiryTags from "./pages/admin/ExpiryTags";
import BookingOrder from "./pages/admin/BookingOrder";

import ItemUnit from "./pages/admin/SetUp/ItemUnit.jsx";

import Company from "./pages/admin/Company";
import Users from "./pages/admin/Security/Users.jsx";
import GroupManagement from "./pages/admin/Security/GroupManagement.jsx";
// import AccessRights from "./pages/admin/AccessControl";
import Modules from "./pages/admin/Modules";
import AccessControll from "./pages/admin/Security/AccessControll.jsx";
import ExpenseHead from "./pages/admin/ExpenseHead.jsx";
import ExpenseVoucher from "./pages/admin/ExpenseVoucher.jsx";
import DayBook from "./pages/admin/DayBook.jsx";
import ItemType from "./pages/admin/SetUp/ItemType.jsx";
import Promotion from "./pages/admin/SetUp/PromotionDetail.jsx";
import PromotionItem from "./pages/admin/SetUp/PromotionItem.jsx";
import OpeningBalance from "./pages/admin/OpeningBalance.jsx";
import ScrollToTop from "./helper/ScrollToTop.jsx";
import Designation from "./pages/admin/Mangement/Designation.jsx";

import Departments from "./pages/admin/Mangement/Departments.jsx";
import Employee from "./pages/admin/Mangement/Employee.jsx";
function AppContent() {
  return (
    <div className="max-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              // <ProtectedRoute>
              <AdminLayout />
              // </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="item-details" element={<ItemList />} />
            <Route path="customers" element={<CustomerData />} />
            <Route path="shelve-location" element={<ShelveLocation />} />
            <Route path="category-item" element={<CategoryItem />} />
            <Route path="supplier" element={<SupplierList />} />
            <Route path="manufacture" element={<Manufacture />} />
            <Route path="item-barcode" element={<ItemBarcode />} />
            <Route path="sales-invoice" element={<SalesInvoice />} />
            <Route path="item-purchase" element={<ItemPurchase />} />
            <Route path="expiry-tags" element={<ExpiryTags />} />
            <Route path="item-unit" element={<ItemUnit />} />
            <Route path="promotion" element={<Promotion />} />
            <Route path="customers-booking" element={<BookingOrder />} />
            <Route path="company" element={<Company />} />
            <Route path="users" element={<Users />} />
            <Route path="groups" element={<GroupManagement />} />
            <Route path="access-rights" element={<AccessControll />} />
            <Route path="modules" element={<Modules />} />
            <Route
              path="purchase-requisition"
              element={<PurchaseRequisition />}
            />
            <Route path="purchase-approval" element={<PurchaseApproval />} />
            <Route path="quotation" element={<Quotation />} />
            <Route path="estimation" element={<Estimation />} />
            <Route path="gatepass-in" element={<GatePassIN />} />
            {/* <Route path="modules-functionalities" element={<ModulesFunctionalities />} /> */}
            <Route path="expense-head" element={<ExpenseHead />} />
            <Route path="expense-voucher" element={<ExpenseVoucher />} />
            <Route path="day-book" element={<DayBook />} />
            <Route path="open-balance" element={<OpeningBalance />} />
            <Route path="designation" element={<Designation />} />
            <Route path="employee" element={<Employee />} />
            <Route path="departments" element={<Departments />} />

            <Route path="promotion-item" element={<PromotionItem />} />
            <Route path="item-type" element={<ItemType />} />
          </Route>
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
