import React, { useState, useEffect } from "react";
import { SquarePen, Trash2, Eye, Plus, Search, X, FileText, Clock, Calendar, User, DollarSign, Filter } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import CPVViewModal from "./ViewModels/CashPaymentVoucherView";

const CashPaymentVoucher = () => {
    // Main state for cash payment vouchers
    const [cpvList, setCpvList] = useState([
        {
            id: 1,
            sr: 1,
            cpvNo: "CPV-2025-001",
            date: "2025-12-05",
            time: "10:30 AM",
            purchaseOrderNo: "PO-2025-001",
            supplier: "Tech Supplies Inc.",
            poDate: "2025-12-01",
            expenseHead: "Office Equipment",
            amount: 3399.96,
            expenseBy: "John Smith",
            description: "Payment for IT equipment purchase",
            createdBy: "Admin User",
            status: "Paid"
        },
        {
            id: 2,
            sr: 2,
            cpvNo: "CPV-2025-002",
            date: "2025-12-04",
            time: "02:15 PM",
            purchaseOrderNo: "PO-2025-002",
            supplier: "Office Furniture Co.",
            poDate: "2025-11-28",
            expenseHead: "Furniture",
            amount: 2849.92,
            expenseBy: "Sarah Johnson",
            description: "Payment for office furniture",
            createdBy: "Finance Manager",
            status: "Paid"
        },
        {
            id: 3,
            sr: 3,
            cpvNo: "CPV-2025-003",
            date: "2025-12-03",
            time: "11:45 AM",
            purchaseOrderNo: "PO-2025-003",
            supplier: "Stationery World",
            poDate: "2025-11-25",
            expenseHead: "Stationery",
            amount: 449.70,
            expenseBy: "Robert Wilson",
            description: "Monthly stationery supplies",
            createdBy: "Store Manager",
            status: "Pending"
        },
        {
            id: 4,
            sr: 4,
            cpvNo: "CPV-2025-004",
            date: "2025-12-02",
            time: "09:20 AM",
            purchaseOrderNo: "PO-2025-004",
            supplier: "Electronics Hub",
            poDate: "2025-11-20",
            expenseHead: "Electronics",
            amount: 1899.99,
            expenseBy: "Emily Davis",
            description: "Network equipment purchase",
            createdBy: "IT Manager",
            status: "Paid"
        }
    ]);

    // Form state
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingCpv, setEditingCpv] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedCpv, setSelectedCpv] = useState(null);
    const recordsPerPage = 10;

    // Form fields
    const [cpvNo, setCpvNo] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [purchaseOrder, setPurchaseOrder] = useState("");
    const [supplier, setSupplier] = useState("");
    const [poDate, setPoDate] = useState("");
    const [expenseHead, setExpenseHead] = useState("");
    const [amount, setAmount] = useState("");
    const [expenseBy, setExpenseBy] = useState("");
    const [description, setDescription] = useState("");

    // Filter state
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateRange, setDateRange] = useState({
        from: "",
        to: ""
    });

    // Purchase Orders for dropdown
    const purchaseOrders = [
        { id: 1, poNumber: "PO-2025-001", supplier: "Tech Supplies Inc.", date: "2025-12-01", amount: 3399.96 },
        { id: 2, poNumber: "PO-2025-002", supplier: "Office Furniture Co.", date: "2025-11-28", amount: 2849.92 },
        { id: 3, poNumber: "PO-2025-003", supplier: "Stationery World", date: "2025-11-25", amount: 449.70 },
        { id: 4, poNumber: "PO-2025-004", supplier: "Electronics Hub", date: "2025-11-20", amount: 1899.99 },
        { id: 5, poNumber: "PO-2025-005", supplier: "Cleaning Supplies Ltd.", date: "2025-11-15", amount: 799.99 },
        { id: 6, poNumber: "PO-2025-006", supplier: "IT Equipment Solutions", date: "2025-11-10", amount: 5599.50 }
    ];

    useEffect(() => {
        // Check localStorage for last CPV number
        const lastCPV = localStorage.getItem("last_cpv_no");

        if (!lastCPV) {
            // If no CPV in localStorage, start from CPV-2025-0001
            const firstCPV = "CPV-2025-0001";
            setCpvNo(firstCPV);
            localStorage.setItem("last_cpv_no", firstCPV);
        }
    }, []);

    const generateNextCPV = () => {
        if (editingCpv) {
            setCpvNo(editingCpv.cpvNo);
            return;
        }

        // Get the highest CPV number from existing data
        let maxNumber = 0;

        cpvList.forEach(cpv => {
            const match = cpv.cpvNo.match(/CPV-\d{4}-(\d+)/);
            if (match) {
                const num = parseInt(match[1]);
                if (num > maxNumber) {
                    maxNumber = num;
                }
            }
        });

        // Get current year
        const currentYear = new Date().getFullYear();

        // Generate next number
        const nextNumber = maxNumber + 1;
        const nextCPV = `CPV-${currentYear}-${String(nextNumber).padStart(3, '0')}`;

        setCpvNo(nextCPV);
    };



    // Expense Heads for dropdown
    const expenseHeads = [
        "Office Equipment",
        "Furniture",
        "Stationery",
        "Electronics",
        "Cleaning Supplies",
        "IT Equipment",
        "Travel Expenses",
        "Utility Bills",
        "Maintenance",
        "Software Licenses",
        "Marketing",
        "Training"
    ];

    // Expense By persons for dropdown
    const expenseByPersons = [
        "John Smith",
        "Sarah Johnson",
        "Robert Wilson",
        "Emily Davis",
        "Michael Brown",
        "Jessica Miller",
        "David Wilson",
        "Lisa Anderson",
        "Mark Thompson"
    ];

    // Status options
    const statusOptions = ["All", "Paid", "Pending", "Cancelled"];

    // Generate CPV number
    const generateCpvNo = () => {
        const currentYear = new Date().getFullYear();
        const lastCpv = [...cpvList].sort((a, b) => b.id - a.id)[0];

        if (lastCpv && lastCpv.cpvNo.includes(`CPV-${currentYear}-`)) {
            const lastNumber = parseInt(lastCpv.cpvNo.split('-').pop());
            return `CPV-${currentYear}-${String(lastNumber + 1).padStart(3, '0')}`;
        }

        return `CPV-${currentYear}-001`;
    };

    // Handle purchase order selection
    const handlePurchaseOrderSelect = (poNumber) => {
        const selectedPO = purchaseOrders.find(po => po.poNumber === poNumber);
        if (selectedPO) {
            setPurchaseOrder(poNumber);
            setSupplier(selectedPO.supplier);
            setPoDate(selectedPO.date);
            setAmount(selectedPO.amount.toString());
        }
    };

    // Get current time
    const getCurrentTime = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!date || !purchaseOrder || !expenseHead || !amount || !expenseBy) {
            Swal.fire({
                icon: "warning",
                title: "Missing Required Fields",
                text: "Please fill in all required fields (Date, Purchase Order, Expense Head, Amount, Expense By)",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (editingCpv) {
            // Update existing CPV
            const updatedList = cpvList.map(cpv =>
                cpv.id === editingCpv.id
                    ? {
                        ...cpv,
                        cpvNo,
                        date,
                        time,
                        purchaseOrderNo: purchaseOrder,
                        supplier,
                        poDate,
                        expenseHead,
                        amount: parseFloat(amount),
                        expenseBy,
                        description,
                        status: "Paid"
                    }
                    : cpv
            );
            setCpvList(updatedList);
            Swal.fire("Updated!", "Cash Payment Voucher updated successfully.", "success");
        } else {
            // Add new CPV
            const newCpv = {
                id: cpvList.length + 1,
                sr: cpvList.length + 1,
                cpvNo,
                date,
                time: time || getCurrentTime(),
                purchaseOrderNo: purchaseOrder,
                supplier,
                poDate,
                expenseHead,
                amount: parseFloat(amount),
                expenseBy,
                description,
                createdBy: "Current User",
                status: "Paid"
            };
            setCpvList([...cpvList, newCpv]);
            Swal.fire("Added!", "Cash Payment Voucher added successfully.", "success");

            // Save this CPV number to localStorage for next time
            localStorage.setItem("last_cpv_no", cpvNo);

            // Generate next CPV number for future use
            generateNextCPV();
        }

        setIsSliderOpen(false);
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        setCpvNo("");
        setDate("");
        setTime("");
        setPurchaseOrder("");
        setSupplier("");
        setPoDate("");
        setExpenseHead("");
        setAmount("");
        setExpenseBy("");
        setDescription("");
        setEditingCpv(null);
    };

    // Handle edit click
    const handleEditClick = (cpv) => {
        setEditingCpv(cpv);
        setCpvNo(cpv.cpvNo);
        setDate(cpv.date);
        setTime(cpv.time);
        setPurchaseOrder(cpv.purchaseOrderNo);
        setSupplier(cpv.supplier);
        setPoDate(cpv.poDate);
        setExpenseHead(cpv.expenseHead);
        setAmount(cpv.amount.toString());
        setExpenseBy(cpv.expenseBy);
        setDescription(cpv.description);
        setIsSliderOpen(true);
    };

    // Handle view click
    const handleViewClick = (cpv) => {
        setSelectedCpv(cpv);
        setViewModalOpen(true);
    };

    // Handle delete
    const handleDelete = (id) => {
        const swalWithTailwindButtons = Swal.mixin({
            customClass: {
                actions: "space-x-2",
                confirmButton:
                    "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
                cancelButton:
                    "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
            },
            buttonsStyling: false,
        });

        swalWithTailwindButtons
            .fire({
                title: "Delete Cash Payment Voucher",
                text: "Are you sure you want to delete this voucher? This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const updatedList = cpvList.filter((cpv) => cpv.id !== id)
                        .map((cpv, index) => ({
                            ...cpv,
                            sr: index + 1
                        }));
                    setCpvList(updatedList);
                    setCurrentPage(1);

                    swalWithTailwindButtons.fire(
                        "Deleted!",
                        "Cash Payment Voucher deleted successfully.",
                        "success"
                    );
                }
            });
    };

    // Filter CPV based on search term and filters
    const filteredCpv = cpvList.filter(cpv => {
        // Search term filter
        const matchesSearch = searchTerm === "" ||
            cpv.cpvNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cpv.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cpv.expenseHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cpv.expenseBy.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus = statusFilter === "All" || cpv.status === statusFilter;

        // Date range filter
        let matchesDateRange = true;
        if (dateRange.from && dateRange.to) {
            const cpvDate = new Date(cpv.date);
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            matchesDateRange = cpvDate >= fromDate && cpvDate <= toDate;
        }

        return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredCpv.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredCpv.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page total
    const pageTotal = currentRecords.reduce((sum, cpv) => sum + cpv.amount, 0);

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Clear filters
    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDateRange({ from: "", to: "" });
        setCurrentPage(1);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">
                            Cash Payment Vouchers
                        </h1>
                        <p className="text-gray-600 mt-1">Manage cash payments and expense tracking</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by CPV No, supplier, expense head..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[300px] pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            />
                        </div>

                        <button
                            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 flex items-center gap-2"
                            onClick={() => {
                                // Generate next CPV number
                                generateNextCPV();
                                // Set current date and time
                                setDate(new Date().toISOString().split('T')[0]);
                                setTime(getCurrentTime());
                                // Clear other form fields
                                setPurchaseOrder("");
                                setSupplier("");
                                setPoDate("");
                                setExpenseHead("");
                                setAmount("");
                                setExpenseBy("");
                                setDescription("");
                                setEditingCpv(null);
                                // Open slider
                                setIsSliderOpen(true);
                            }}
                        >
                            <Plus size={20} />
                            Add Payment Voucher
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Filter size={18} />
                            Filters
                        </h3>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-600 hover:text-newPrimary"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="max-h-screen overflow-y-auto custom-scrollbar">
                            <div className="inline-block w-full align-middle">
                                {/* Table Header */}
                                <div className="hidden lg:grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_2fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                    <div>SR#</div>
                                    <div>CPV No.</div>
                                    <div>Date</div>
                                    <div>Expense By</div>
                                    <div>Expense Head</div>
                                    <div>Description</div>
                                    <div>Amount</div>
                                    <div className="text-center">Actions</div>
                                </div>

                                <div className="flex flex-col divide-y divide-gray-100">
                                    {loading ? (
                                        <TableSkeleton
                                            rows={recordsPerPage}
                                            cols={8}
                                            className="lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_2fr_1fr_1fr]"
                                        />
                                    ) : currentRecords.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 bg-white">
                                            <FileText className="mx-auto mb-3 text-gray-400" size={48} />
                                            <p className="text-lg">No cash payment vouchers found.</p>
                                            <p className="text-sm mt-1">Try adjusting your filters or add a new voucher.</p>
                                        </div>
                                    ) : (
                                        currentRecords.map((cpv) => (
                                            <div
                                                key={cpv.id}
                                                className="grid grid-cols-1 lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_2fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                            >
                                                <div className="font-medium text-gray-900">
                                                    {cpv.sr}
                                                </div>
                                                <div>
                                                    <div className="text-gray-900 font-medium">
                                                        {cpv.cpvNo}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                        <Clock size={12} />
                                                        {cpv.time}
                                                    </div>
                                                </div>
                                                <div className="text-gray-600">
                                                    {cpv.date}
                                                </div>
                                                <div>
                                                    <div className="text-gray-900 font-medium">
                                                        {cpv.expenseBy}
                                                    </div>
                                                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getStatusBadgeColor(cpv.status)}`}>
                                                        {cpv.status}
                                                    </div>
                                                </div>
                                                <div className="text-gray-600">
                                                    {cpv.expenseHead}
                                                </div>
                                                <div className="text-gray-600">
                                                    {cpv.description || "No description"}
                                                </div>
                                                <div className="text-gray-900 font-semibold">
                                                    ${cpv.amount.toFixed(2)}
                                                </div>
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleViewClick(cpv)}
                                                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                                                        title="View"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(cpv)}
                                                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cpv.id)}
                                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page Total - Separate Row */}
                    <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_2fr_1fr_1fr] items-center gap-4 px-6 py-3 border-t bg-gray-100">
                        {/* Empty cells for first 6 columns */}
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>

                        {/* Page Total positioned exactly under AMOUNT column */}
                        <div className="font-semibold text-blue-700">
                            Total: ${pageTotal.toFixed(2)}
                        </div>

                        {/* Empty cell for Actions column */}
                        <div></div>
                    </div>

                    {/* Pagination Controls */}
                    {filteredCpv.length > 0 && (
                        <div className="grid grid-cols-[1fr_auto] items-center my-4 px-6">
                            {/* Records info on left */}
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRecord + 1} to{" "}
                                {Math.min(indexOfLastRecord, filteredCpv.length)} of{" "}
                                {filteredCpv.length} records
                            </div>

                            {/* Right side - Total and Pagination */}
                            <div className="flex items-center gap-8">

                                {/* Pagination buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-md ${currentPage === 1
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-newPrimary text-white hover:bg-newPrimary/80"
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded-md ${currentPage === totalPages
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-newPrimary text-white hover:bg-newPrimary/80"
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add/Edit Slider Modal */}
                {isSliderOpen && (
                    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
                        <div className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                                <h2 className="text-xl font-bold text-newPrimary">
                                    {editingCpv ? "Update Cash Payment Voucher" : "Add New Cash Payment Voucher"}
                                </h2>
                                <button
                                    className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                                    onClick={() => {
                                        setIsSliderOpen(false);
                                        resetForm();
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                                {/* CPV No, Date, Time */}
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <FileText size={18} />
                                        Voucher Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                CPV No. <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={cpvNo}
                                                onChange={(e) => setCpvNo(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                                placeholder="Auto-generated"
                                                required
                                                readOnly={!editingCpv} // Only editable when editing
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Time
                                            </label>
                                            <input
                                                type="text"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="HH:MM AM/PM"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Purchase Order Information */}
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <FileText size={18} />
                                        Purchase Order Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Purchase Order <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={purchaseOrder}
                                                onChange={(e) => handlePurchaseOrderSelect(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Purchase Order</option>
                                                {purchaseOrders.map((po) => (
                                                    <option key={po.id} value={po.poNumber}>
                                                        {po.poNumber} - {po.supplier}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Supplier
                                            </label>
                                            <input
                                                type="text"
                                                value={supplier}
                                                readOnly
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                PO Date
                                            </label>
                                            <input
                                                type="date"
                                                value={poDate}
                                                onChange={(e) => setPoDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Expense Details */}
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <DollarSign size={18} />
                                        Expense Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Expense Head <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={expenseHead}
                                                onChange={(e) => setExpenseHead(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Expense Head</option>
                                                {expenseHeads.map((head, index) => (
                                                    <option key={index} value={head}>{head}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Amount <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Expense By <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={expenseBy}
                                                onChange={(e) => setExpenseBy(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Person</option>
                                                {expenseByPersons.map((person, index) => (
                                                    <option key={index} value={person}>{person}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <FileText size={18} />
                                        Description
                                    </h3>
                                    <div>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                            placeholder="Enter payment description or additional notes..."
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    {/* <button
                                        type="button"
                                        onClick={() => {
                                            setIsSliderOpen(false);
                                            resetForm();
                                        }}
                                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button> */}
                                    <button
                                        type="submit"
                                        className="flex-1 bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors"
                                    >
                                        {editingCpv ? "Update Voucher" : "Add Voucher"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {viewModalOpen && selectedCpv && (
                    <CPVViewModal
                        cpv={selectedCpv}
                        onClose={() => setViewModalOpen(false)}
                        onEdit={() => {
                            setViewModalOpen(false);
                            handleEditClick(selectedCpv);
                        }}
                    />
                )}

                <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #edf2f7;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #a0aec0;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #718096;
          }
        `}</style>
            </div>
        </div>
    );
};

export default CashPaymentVoucher;