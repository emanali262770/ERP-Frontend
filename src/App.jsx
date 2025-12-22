import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
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
import QualityCheck from "./pages/admin/Purchase/QualityChecking.jsx";
import GRN from "./pages/admin/Purchase/GRN.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import SupplierList from "./pages/admin/SetUp/Supplier.jsx";
import Manufacture from "./pages/admin/SetUp/Manufacture.jsx";
import ItemBarcode from "./pages/admin/ItemBarcode";
import ItemPurchase from "./pages/admin/Purchase/ItemPurchase";
import SalesInvoice from "./pages/admin/SalesInvoice";
import ExpiryTags from "./pages/admin/ExpiryTags";
import BookingOrder from "./pages/admin/BookingOrder";
import GatePassOut from "./pages/admin/Purchase/GatePassOUT.jsx";
import ItemUnit from "./pages/admin/SetUp/ItemUnit.jsx";


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
import Users from './pages/admin/Security/Users.jsx'
import Departments from "./pages/admin/Mangement/Departments.jsx";
import Employee from "./pages/admin/Mangement/Employee.jsx";
import PurchaseOrder from "./pages/admin/Purchase/PurchaseOrder.jsx";

import RateList from "./pages/admin/Sales/RateList.jsx";
import DistributionRateList from "./pages/admin/Sales/DistributionRateList.jsx";
import BookingOrders from "./pages/admin/Sales/BookingOrders.jsx";
import DeliveryChallan from "./pages/admin/Sales/DeliveryChallan.jsx";
import SalesInvoices from "./pages/admin/Sales/SalesInvoices.jsx";
import PaymentReceiptVoucher from "./pages/admin/Sales/PaymentReceiptVoucher.jsx";
import CustomerLedger from "./pages/admin/Sales/CustomerLedger.jsx";
import Receivable from "./pages/admin/Sales/Receivable.jsx";
import SalesReturn from "./pages/admin/Sales/SalesReturn.jsx";
import StoreAcknowledgement from "./pages/admin/Sales/StoreAcknowledgement.jsx";
import Profile from "./components/Profile.jsx";
import PurchaseReturn from "./pages/admin/Purchase/PurchaseReturn.jsx";
import DistributorList from "./pages/admin/Sales/Distributor.jsx";
import EmptyVehicleEntry from "./pages/admin/Sales/EmptyVehicleEntry.jsx";
import CustomerList from "./pages/admin/SetUp/Customer.jsx";
import Tax from "./pages/admin/SetUp/Tax.jsx";
import PurchasePage from "./pages/admin/Purchase/PurchasePage.jsx";
import SalesPage from "./pages/admin/Sales/SalesPage.jsx";
import Test from "./pages/admin/Purchase/api.jsx";
import Group from "./pages/admin/SetUp/Group.jsx";
import Company from "./pages/admin/SetUp/Company.jsx";
// import FbrCompany from "./pages/admin/FbrIntergration/FbrCompany.jsx";
// import FbrCustomers from "./pages/admin/FbrIntergration/FbrCustomers.jsx";
// import FbrProduct from "./pages/admin/FbrIntergration/FbrProduct.jsx";
// import FbrBookingOrders from "./pages/admin/FbrIntergration/FbrBookingOrders.jsx";
// import FbrDeliveryChallan from "./pages/admin/FbrIntergration/FbrDeliveryChallan.jsx";
// import FbrSalesInvoices from "./pages/admin/FbrIntergration/FbrSalesInvoices.jsx";
// import FbrSalesReturn from "./pages/admin/FbrIntergration/FbrSalesReturn.jsx";
// import FbrPaymentReceipt from "./pages/admin/FbrIntergration/FbrPaymentReceipt.jsx";
// import FbrLedger from "./pages/admin/FbrIntergration/FbrLedger.jsx";
// import FbrReceivable from "./pages/admin/FbrIntergration/FbrReceivable.jsx";
// import FbrPage from "./pages/admin/FbrIntergration/FbrPage.jsx";
import StoreItemDefination from "./pages/admin/Store/ItemDefination.jsx";
import StorePage from "./pages/admin/Store/StorePage.jsx";
import StoreQutation from "./pages/admin/Store/Quotation.jsx";
import StorePurchase from "./pages/admin/Store/PurchaseGRN.jsx";
import StoreProductsOpeningBalance from "./pages/admin/Store/ProductsOpeningBalances.jsx";
import MonthlyStoreDemand from "./pages/admin/Store/MonthlyStoreDemand.jsx";
import StoreComparativeStatement from "./pages/admin/Store/ComparativeStatement.jsx";
import StoreItemsReturn from "./pages/admin/Store/ItemsReturn.jsx";
import StoreCashPaymentVoucher from "./pages/admin/Store/CashPaymentVoucher.jsx";
import StoreTransferFromUnits from "./pages/admin/Store/TransferFromUnits.jsx";
import StoreItemsIssue from "./pages/admin/Store/ItemsIssue.jsx";
import TaskMangementPage from "./pages/admin/taskManagement/TaskMangementPage.jsx";
import PayrolePage from "./pages/admin/payRoll/PayrolePage.jsx";
import FinancialPage from "./pages/admin/financial/FinancialPage.jsx";
import SoftwareSecurity from "./pages/admin/Security/SoftwareSecurity.jsx";
import ComplainMangementPage from "./pages/admin/complaintManagement/ComplainMangementPage.jsx"

// Stock Pages
import StockPage from "./pages/admin/stock/StockPage.jsx";
import StockItemList from "./pages/admin/stock/functionalities/ItemList.jsx";
import StockDefinationPromotion from "./pages/admin/stock/functionalities/DefinePromotions.jsx";
import StockIssueOtherUnits from "./pages/admin/stock/functionalities/IssueOtherUnits.jsx";
import StockOpeningStockItems from "./pages/admin/stock/functionalities/OpeningStockItems.jsx";
import StockReturnOtherUnits from "./pages/admin/stock/functionalities/ReturnOtherUnits.jsx";
import StockItemLedger from "./pages/admin/stock/reports/ItemLedger.jsx";
import StockLowLevel from "./pages/admin/stock/reports/LowLevelStock.jsx";
import StockPriceList from "./pages/admin/stock/reports/PriceList.jsx";
import StockPosition from "./pages/admin/stock/reports/StockPosition.jsx";
import StockPrice from "./pages/admin/stock/reports/StockPrice.jsx";
import StockItemCategory from "./pages/admin/stock/setup/ItemCategory.jsx";
import StocListCategories from "./pages/admin/stock/setup/ListCategories.jsx";
import StockListSubCategories from "./pages/admin/stock/setup/ListSubCategories.jsx";
import StockLocationList from "./pages/admin/stock/setup/LocationList.jsx";
import StockManufactures from "./pages/admin/stock/setup/Manufactures.jsx";
import StockUnitList from "./pages/admin/stock/setup/UnitList.jsx";

// Production Pages
import ProductionPage from "./pages/admin/production/ProductionPage.jsx";
import AnalysisProductionReport from "./pages/admin/production/functionalities/AnalysisProductionReport.jsx";
import AreaProduction from "./pages/admin/production/functionalities/AreaProduction.jsx";
import CalculateRawMaterialProduction from "./pages/admin/production/functionalities/CalculateRawMaterialProduction.jsx";
import DataSheetManufacturedItems from "./pages/admin/production/functionalities/DataSheetManufacuredItems.jsx";
import Destruction from "./pages/admin/production/functionalities/Destruction.jsx";
import FinishedGoodsTransfer from "./pages/admin/production/functionalities/FinishedGoodsTransfer.jsx";
import IssueRawMaterialProduction from "./pages/admin/production/functionalities/IssueRawMaterialProduction.jsx";
import ProductionBatches from "./pages/admin/production/functionalities/ProductionBatches.jsx";
import ProductionOrderManufacturing from "./pages/admin/production/functionalities/ProductionOrderManufacturing.jsx";
import RecordProductionEachPhase from "./pages/admin/production/functionalities/RecordProductionEachPhase.jsx";
import EmployeList from "./pages/admin/taskManagement/EmployeList.jsx";
import TaskList from "./pages/admin/taskManagement/TaskList.jsx";
import AssignTaskToStaff from "./pages/admin/taskManagement/AssignTaskToStaff.jsx";
import MonthlyWorkingSheet from "./pages/admin/taskManagement/MontlyWorkingSheet.jsx";
import TaskProgress from "./pages/admin/taskManagement/TaskProgress.jsx";
import TaskCompleted from "./pages/admin/taskManagement/TaskCompleted.jsx";
import TaskDailyBase from "./pages/admin/taskManagement/TaskDailyBase.jsx"

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
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<Profile />} />

            {/* Stock Routes */}
            <Route path="stock" element={<StockPage />} />
            <Route path="item-details" element={<StockItemList />} />
            <Route
              path="defination-promotion"
              element={<StockDefinationPromotion />}
            />
            <Route
              path="issue-other-units"
              element={<StockIssueOtherUnits />}
            />
            <Route
              path="opening-stock-items"
              element={<StockOpeningStockItems />}
            />
            <Route
              path="return-other-units"
              element={<StockReturnOtherUnits />}
            />
            <Route path="item-ledger" element={<StockItemLedger />} />
            <Route path="low-level" element={<StockLowLevel />} />
            <Route path="price-list" element={<StockPriceList />} />
            <Route path="stock-position" element={<StockPosition />} />
            <Route path="stock-price" element={<StockPrice />} />
            <Route path="item-category" element={<StockItemCategory />} />
            <Route path="list-categories" element={<StocListCategories />} />
            <Route
              path="list-sub-categories"
              element={<StockListSubCategories />}
            />
            <Route path="location-list" element={<StockLocationList />} />
            <Route path="manufactures" element={<StockManufactures />} />
            <Route path="unit-list" element={<StockUnitList />} />

            {/* Production Routes */}
            <Route path="production" element={<ProductionPage />} />
            <Route path="analysis-production-report" element={<AnalysisProductionReport />} />
            <Route path="area-production" element={<AreaProduction />} />
            <Route path="calculate-raw-material-production" element={<CalculateRawMaterialProduction />} />
            <Route path="data-sheet-manufactured-items" element={<DataSheetManufacturedItems />} />
            <Route path="destruction" element={<Destruction />} />
            <Route path="finished-goods-transfer" element={<FinishedGoodsTransfer />} />
            <Route path="issue-raw-material-production" element={<IssueRawMaterialProduction />} />
            <Route path="production-batches" element={<ProductionBatches />} />
            <Route path="production-order-manufacturing" element={<ProductionOrderManufacturing />} />
            <Route path="record-production-each-phase" element={<RecordProductionEachPhase />} />


            <Route path="customers" element={<CustomerData />} />
            <Route path="shelve-location" element={<ShelveLocation />} />
            <Route path="category-item" element={<CategoryItem />} />
            <Route path="supplier" element={<SupplierList />} />
            <Route path="purchase" element={<PurchasePage />} />
            <Route path="sales" element={<SalesPage />} />
            {/* <Route path="fbr-integration" element={<FbrPage />} /> */}
            <Route path="api" element={<Test />} />

            <Route path="group" element={<Group />} />

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
            <Route path="purchase-return" element={<PurchaseReturn />} />
            <Route path="purchase-order" element={<PurchaseOrder />} />
            <Route path="quotation" element={<Quotation />} />
            <Route path="estimation" element={<Estimation />} />
            <Route path="gatepass-in" element={<GatePassIN />} />

            <Route path="quality-checking" element={<QualityCheck />} />
            <Route path="grn" element={<GRN />} />
            <Route path="gatepass-out" element={<GatePassOut />} />
            <Route path="rate-list" element={<RateList />} />
            <Route
              path="distributor-rate-list"
              element={<DistributionRateList />}
            />
            <Route path="booking-orders" element={<BookingOrders />} />
            <Route path="delivery-challan" element={<DeliveryChallan />} />
            <Route
              path="store-acknowledgement"
              element={<StoreAcknowledgement />}
            />
            <Route path="sales-invoices" element={<SalesInvoices />} />
            <Route
              path="payment-receipt-voucher"
              element={<PaymentReceiptVoucher />}
            />
            <Route path="customer-ledger" element={<CustomerLedger />} />
            <Route path="receivable" element={<Receivable />} />
            <Route path="sales-return" element={<SalesReturn />} />
            <Route path="distributor" element={<DistributorList />} />

            {/* Store */}
            <Route path="store" element={<StorePage />} />
            <Route path="item-defination" element={<StoreItemDefination />} />
            <Route path="item-quotation" element={<StoreQutation />} />
            <Route path="purchase-grn" element={<StorePurchase />} />
            <Route
              path="products-opening-balances"
              element={<StoreProductsOpeningBalance />}
            />
            <Route
              path="monthly-store-demand"
              element={<MonthlyStoreDemand />}
            />
            <Route
              path="comparative-statement"
              element={<StoreComparativeStatement />}
            />
            <Route path="items-return" element={<StoreItemsReturn />} />
            <Route
              path="cash-payment-voucher"
              element={<StoreCashPaymentVoucher />}
            />
            <Route
              path="transfer-from-units"
              element={<StoreTransferFromUnits />}
            />
            <Route path="items-issue" element={<StoreItemsIssue />} />
            {/* Task managment */}
            <Route path="task-management" element={<TaskMangementPage />} />
            <Route path="create-employee-list" element={<EmployeList />} />
            <Route path="create-task-list" element={<TaskList />} />
            <Route path="assign-task" element={<AssignTaskToStaff />} />
            <Route path="monthly-working-sheet" element={<MonthlyWorkingSheet />} />
            <Route path="task-progress" element={<TaskProgress />} />
            <Route path="task-completed" element={<TaskCompleted />} />
            <Route path="task-daily-base" element={<TaskDailyBase />} />

            {/* payrole */}
            <Route path="payrole" element={<PayrolePage />} />
            {/* finance */}
            <Route path="financial" element={<FinancialPage />} />
            {/* security */}
            <Route path="security" element={<SoftwareSecurity />} />
            {/* fbr */}
            {/* <Route path="fbr-company" element={<FbrCompany />} />
            <Route path="fbr-customers" element={<FbrCustomers />} />
            <Route path="fbr-products" element={<FbrProduct />} />
            <Route path="fbr-booking-orders" element={<FbrBookingOrders />} />
            <Route path="fbr-delivery-challan" element={<FbrDeliveryChallan />} />
            <Route path="fbr-sale-invoice" element={<FbrSalesInvoices />} />
            <Route path="fbr-sales-return" element={<FbrSalesReturn />} />
            <Route path="fbr-payment-receipt" element={<FbrPaymentReceipt />} />
            <Route path="fbr-ledger" element={<FbrLedger />} />
            <Route path="fbr-receivable" element={<FbrReceivable />} /> */}
            {/* <Route path="modules-functionalities" element={<ModulesFunctionalities />} /> */}
            <Route path="expense-head" element={<ExpenseHead />} />
            <Route path="expense-voucher" element={<ExpenseVoucher />} />
            <Route path="day-book" element={<DayBook />} />
            <Route path="open-balance" element={<OpeningBalance />} />
            <Route path="designation" element={<Designation />} />
            <Route path="employee" element={<Employee />} />
            <Route path="departments" element={<Departments />} />
            <Route path="empty-vehicle-entry" element={<EmptyVehicleEntry />} />
            <Route path="promotion-item" element={<PromotionItem />} />
            <Route path="item-type" element={<ItemType />} />
            <Route path="tax" element={<Tax />} />
            <Route path="customers-list" element={<CustomerList />} />

            {/* Complaint Management */}
            <Route path="complaint-management" element={<ComplainMangementPage />} />
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
