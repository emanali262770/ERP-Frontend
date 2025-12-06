import React, { useState, useEffect } from "react";
import { SquarePen, Trash2, Eye, Plus, Search, X, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import GrnView from "./ViewModels/PurchaseGRNView";

const Purchases = () => {
    // Main state for purchases/grn
    const [grns, setGrns] = useState([
        {
            id: 1,
            sr: 1,
            grnNo: "GRN-2025-001",
            grnDate: "2025-12-03",
            supplier: "Tech Supplies Inc.",
            supplierInvoiceNo: "INV-TS-001",
            invoiceDate: "2025-12-03",
            description: "IT equipment purchase",
            items: [
                { id: 1, item: "Laptop", category: "Electronics", spec: "Dell XPS 15", purchasePrice: 1299.99, qty: 5, total: 6499.95, stock: 10 },
                { id: 2, item: "Monitor", category: "Electronics", spec: "Samsung 27\" 4K", purchasePrice: 399.99, qty: 10, total: 3999.90, stock: 15 }
            ],
            grandTotal: 10499.85
        },
        {
            id: 2,
            sr: 2,
            grnNo: "GRN-2025-002",
            grnDate: "2025-12-04",
            supplier: "Office Furniture Co.",
            supplierInvoiceNo: "INV-OF-002",
            invoiceDate: "2025-12-04",
            description: "Office furniture",
            items: [
                { id: 1, item: "Office Chair", category: "Furniture", spec: "ErgoPro 300", purchasePrice: 299.99, qty: 20, total: 5999.80, stock: 25 },
                { id: 2, item: "Desk", category: "Furniture", spec: "Standing Desk Pro", purchasePrice: 449.99, qty: 10, total: 4499.90, stock: 15 }
            ],
            grandTotal: 10499.70
        },
        {
            id: 3,
            sr: 3,
            grnNo: "GRN-2025-003",
            grnDate: "2025-12-05",
            supplier: "Stationery World",
            supplierInvoiceNo: "INV-SW-003",
            invoiceDate: "2025-12-05",
            description: "Office supplies",
            items: [
                { id: 1, item: "Notebooks", category: "Stationery", spec: "Premium A4", purchasePrice: 24.99, qty: 100, total: 2499.00, stock: 120 },
                { id: 2, item: "Pens", category: "Stationery", spec: "Ballpoint Black", purchasePrice: 9.99, qty: 200, total: 1998.00, stock: 250 }
            ],
            grandTotal: 4497.00
        }
    ]);

    // Form state
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingGrn, setEditingGrn] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedGrn, setSelectedGrn] = useState(null);
    const recordsPerPage = 10;

    // Form fields
    const [grnNo, setGrnNo] = useState("");
    const [grnDate, setGrnDate] = useState("");
    const [supplier, setSupplier] = useState("");
    const [supplierInvoiceNo, setSupplierInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [description, setDescription] = useState("");

    // Items table in form
    const [items, setItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [currentItem, setCurrentItem] = useState({
        item: "",
        category: "",
        spec: "",
        purchasePrice: "",
        qty: 1,
        stock: ""
    });

    // Suppliers for dropdown
    const suppliers = [
        "Tech Supplies Inc.",
        "Office Furniture Co.",
        "Stationery World",
        "Electronics Hub",
        "Cleaning Supplies Ltd.",
        "IT Equipment Solutions",
        "Furniture Express",
        "General Supplies Corp."
    ];

    // Categories for dropdown
    const categories = [
        "Electronics",
        "Furniture",
        "Stationery",
        "IT Equipment",
        "Office Supplies",
        "Cleaning Supplies",
        "Hardware",
        "Software"
    ];

    // Available items for selection
    const availableItems = [
        { id: 1, name: "Laptop", category: "Electronics", spec: "Dell XPS 15", price: 1299.99 },
        { id: 2, name: "Office Chair", category: "Furniture", spec: "ErgoPro 300", price: 299.99 },
        { id: 3, name: "Monitor", category: "Electronics", spec: "Samsung 27\" 4K", price: 399.99 },
        { id: 4, name: "Notebooks", category: "Stationery", spec: "Premium A4", price: 24.99 },
        { id: 5, name: "Desk", category: "Furniture", spec: "Standing Desk Pro", price: 449.99 },
        { id: 6, name: "Router", category: "IT Equipment", spec: "TP-Link Archer AX50", price: 129.99 },
        { id: 7, name: "Keyboard", category: "Electronics", spec: "Logitech MX Keys", price: 99.99 },
        { id: 8, name: "Mouse", category: "Electronics", spec: "Logitech MX Master 3", price: 89.99 },
        { id: 9, name: "Printer Paper", category: "Stationery", spec: "A4 80gsm", price: 8.99 },
        { id: 10, name: "Hand Sanitizer", category: "Cleaning Supplies", spec: "500ml Gel", price: 12.99 }
    ];

    // Add this function to generate GRN number
    const generateGrnNo = () => {
        const currentYear = new Date().getFullYear();
        const lastGrn = [...grns].sort((a, b) => b.id - a.id)[0];

        if (lastGrn && lastGrn.grnNo.includes(`GRN-${currentYear}-`)) {
            const lastNumber = parseInt(lastGrn.grnNo.split('-').pop());
            return `GRN-${currentYear}-${String(lastNumber + 1).padStart(3, '0')}`;
        }

        return `GRN-${currentYear}-001`;
    };

    // Handle add item to GRN form
    const handleAddItem = () => {
        if (!currentItem.item || !currentItem.purchasePrice || !currentItem.qty) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please select an item, enter purchase price and quantity",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (editingItemId) {
            // Update existing item
            const updatedItems = items.map(item =>
                item.id === editingItemId
                    ? {
                        ...item,
                        item: currentItem.item,
                        category: currentItem.category,
                        spec: currentItem.spec,
                        purchasePrice: parseFloat(currentItem.purchasePrice),
                        qty: parseInt(currentItem.qty) || 1,
                        stock: parseInt(currentItem.stock) || parseInt(currentItem.qty) || 1,
                        total: parseFloat(currentItem.purchasePrice) * (parseInt(currentItem.qty) || 1)
                    }
                    : item
            );
            setItems(updatedItems);
        } else {
            // Add new item
            const newItem = {
                id: items.length + 1,
                item: currentItem.item,
                category: currentItem.category,
                spec: currentItem.spec,
                purchasePrice: parseFloat(currentItem.purchasePrice),
                qty: parseInt(currentItem.qty) || 1,
                stock: parseInt(currentItem.stock) || parseInt(currentItem.qty) || 1,
                total: parseFloat(currentItem.purchasePrice) * (parseInt(currentItem.qty) || 1)
            };
            setItems([...items, newItem]);
        }

        setCurrentItem({ item: "", category: "", spec: "", purchasePrice: "", qty: 1, stock: "" });
        setEditingItemId(null);
    };

    // Remove item from GRN form
    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Handle edit item in the form
    const handleEditItem = (item) => {
        setCurrentItem({
            item: item.item,
            category: item.category,
            spec: item.spec,
            purchasePrice: item.purchasePrice,
            qty: item.qty,
            stock: item.stock
        });
        setEditingItemId(item.id);
    };

    // Calculate grand total
    const calculateGrandTotal = () => {
        return items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!grnNo || !grnDate || !supplier || !supplierInvoiceNo || !invoiceDate || items.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing Required Fields",
                text: "Please fill in all required fields and add at least one item",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (editingGrn) {
            // Update existing GRN
            setGrns(grns.map(grn =>
                grn.id === editingGrn.id
                    ? {
                        ...grn,
                        grnNo,
                        grnDate,
                        supplier,
                        supplierInvoiceNo,
                        invoiceDate,
                        description,
                        items,
                        grandTotal: parseFloat(calculateGrandTotal())
                    }
                    : grn
            ));
            Swal.fire("Updated!", "GRN updated successfully.", "success");
        } else {
            // Add new GRN
            const newGrn = {
                id: grns.length + 1,
                sr: grns.length + 1,
                grnNo,
                grnDate,
                supplier,
                supplierInvoiceNo,
                invoiceDate,
                description,
                items: [...items],
                grandTotal: parseFloat(calculateGrandTotal())
            };
            setGrns([...grns, newGrn]);
            Swal.fire("Added!", "GRN added successfully.", "success");
        }

        setIsSliderOpen(false);
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        if (editingGrn) {
            return;
        } else {
            // For new entries, generate GRN number
            setGrnNo(generateGrnNo());
            setGrnDate("");
            setSupplier("");
            setSupplierInvoiceNo("");
            setInvoiceDate("");
            setDescription("");
            setItems([]);
            setCurrentItem({ item: "", category: "", spec: "", purchasePrice: "", qty: 1, stock: "" });
            setEditingItemId(null); // Add this
            setEditingGrn(null);
        }
    };

    // Handle edit click
    const handleEditClick = (grn) => {
        setEditingGrn(grn);
        setGrnNo(grn.grnNo);
        setGrnDate(grn.grnDate);
        setSupplier(grn.supplier);
        setSupplierInvoiceNo(grn.supplierInvoiceNo);
        setInvoiceDate(grn.invoiceDate);
        setDescription(grn.description);
        setItems(grn.items);
        setIsSliderOpen(true);
    };

    // Handle view click
    const handleViewClick = (grn) => {
        setSelectedGrn(grn);
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
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const updatedGrns = grns.filter((grn) => grn.id !== id)
                        .map((grn, index) => ({
                            ...grn,
                            sr: index + 1
                        }));
                    setGrns(updatedGrns);
                    setCurrentPage(1);

                    swalWithTailwindButtons.fire(
                        "Deleted!",
                        "GRN deleted successfully.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "GRN is safe 🙂",
                        "error"
                    );
                }
            });
    };

    // Filter GRNs based on search term
    const filteredGrns = grns.filter(grn =>
        grn.grnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grn.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grn.supplierInvoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search by item names
        grn.items.some(item => item.item.toLowerCase().includes(searchTerm.toLowerCase())) ||
        // Search by category
        grn.items.some(item => item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        // Search by details/specifications
        grn.items.some(item => item.spec.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredGrns.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredGrns.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page total (grand total of all GRNs on the page)
    const pageTotal = currentRecords.reduce((sum, grn) => sum + grn.grandTotal, 0);

    // Calculate total quantity for the page
    const pageTotalQty = currentRecords.reduce((sum, grn) =>
        sum + grn.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0
    );

    // Handle item selection
    const handleItemSelect = (e) => {
        const selectedItem = availableItems.find(item => item.name === e.target.value);
        if (selectedItem) {
            setCurrentItem({
                ...currentItem,
                item: selectedItem.name,
                category: selectedItem.category,
                spec: selectedItem.spec,
                purchasePrice: selectedItem.price
            });
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle size={28} className="text-newPrimary" />
                        <div>
                            <h1 className="text-2xl font-bold text-newPrimary">
                                Purchases (GRN)
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by category, item, details..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-[300px] pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            />
                        </div>

                        <button
                            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 flex items-center gap-2"
                            onClick={() => {
                                // Clear any existing editing state
                                setEditingGrn(null);
                                // Generate new GRN number
                                setGrnNo(generateGrnNo());
                                // Clear all form fields
                                setGrnDate("");
                                setSupplier("");
                                setSupplierInvoiceNo("");
                                setInvoiceDate("");
                                setDescription("");
                                setItems([]);
                                setCurrentItem({ item: "", category: "", spec: "", purchasePrice: "", qty: 1, stock: "" });
                                setIsSliderOpen(true);
                            }}
                        >
                            <Plus size={18} />
                            Add GRN
                        </button>
                    </div>
                </div>

                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="max-h-screen overflow-y-auto custom-scrollbar">
                            <div className="inline-block w-full align-middle">
                                {/* Table Header - 8 columns */}
                                <div className="hidden lg:grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                    <div>SR#</div>
                                    <div>Category</div>
                                    <div>Item</div>
                                    <div>Details</div>
                                    <div>Price</div>
                                    <div>Qty</div>
                                    <div>Total</div>
                                    <div className="text-center">Actions</div>
                                </div>

                                <div className="flex flex-col divide-y divide-gray-100">
                                    {loading ? (
                                        <TableSkeleton
                                            rows={recordsPerPage}
                                            cols={8}
                                            className="lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                                        />
                                    ) : currentRecords.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500 bg-white">
                                            No GRNs found.
                                        </div>
                                    ) : (
                                        currentRecords.map((grn) => {
                                            // Get all items combined with comma separation
                                            const allItems = grn.items.map(item => item.item).join(", ");
                                            const allCategories = [...new Set(grn.items.map(item => item.category))].join(", ");
                                            const allSpecs = grn.items.map(item => item.spec).join(", ");
                                            const allPrices = grn.items.map(item => `$${item.purchasePrice.toFixed(2)}`).join(", ");
                                            const allQtys = grn.items.map(item => item.qty).join(", ");

                                            return (
                                                <div
                                                    key={grn.id}
                                                    className="grid grid-cols-1 lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                                >
                                                    <div className="font-medium text-gray-900">
                                                        {grn.sr}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {allCategories}
                                                    </div>
                                                    <div className="text-gray-900 font-medium">
                                                        {allItems}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {allSpecs}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {allPrices}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {allQtys}
                                                    </div>
                                                    <div className="text-gray-900 font-semibold">
                                                        ${grn.grandTotal.toFixed(2)}
                                                    </div>
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => handleEditClick(grn)}
                                                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <SquarePen size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(grn.id)}
                                                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewClick(grn)}
                                                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                                                            title="View"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page Total - Separate Row */}
                    {currentRecords.length > 0 && (
                        <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-3 border-t bg-gray-100">
                            {/* Empty cells for first 5 columns */}
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>

                            {/* Total Qty under QTY column */}
                            <div className="font-semibold text-blue-700">
                                Total Qty: {pageTotalQty}
                            </div>

                            {/* Page Total under TOTAL column */}
                            <div className="font-semibold text-blue-700">
                                Total: ${pageTotal.toFixed(2)}
                            </div>

                            {/* Empty cell for Actions column */}
                            <div></div>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredGrns.length > 0 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                            {/* Records info on left */}
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRecord + 1} to{" "}
                                {Math.min(indexOfLastRecord, filteredGrns.length)} of{" "}
                                {filteredGrns.length} records
                            </div>

                            {/* Pagination buttons on right */}
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
                    )}
                </div>

                {/* Add/Edit Slider Modal */}
                {isSliderOpen && (
                    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
                        <div className="w-full md:w-[900px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                                <h2 className="text-xl font-bold text-newPrimary">
                                    {editingGrn ? "Update GRN" : "Add New GRN"}
                                </h2>
                                <button
                                    className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                                    onClick={() => {
                                        setIsSliderOpen(false);
                                        // Reset form completely when closing
                                        setGrnNo("");
                                        setGrnDate("");
                                        setSupplier("");
                                        setSupplierInvoiceNo("");
                                        setInvoiceDate("");
                                        setDescription("");
                                        setItems([]);
                                        setCurrentItem({ item: "", category: "", spec: "", purchasePrice: "", qty: 1, stock: "" });
                                        setEditingItemId(null); // Add this
                                        setEditingGrn(null);
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                                {/* Main Form Fields */}
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                GRN No. <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={grnNo}
                                                onChange={(e) => setGrnNo(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                                placeholder="e.g., GRN-2024-001"
                                                required
                                                readOnly // Make it read-only
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                GRN Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={grnDate}
                                                onChange={(e) => setGrnDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Supplier <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={supplier}
                                                onChange={(e) => setSupplier(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Supplier</option>
                                                {suppliers.map((sup, index) => (
                                                    <option key={index} value={sup}>{sup}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Supplier Invoice No. <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={supplierInvoiceNo}
                                                onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="e.g., INV-001"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Invoice Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={invoiceDate}
                                                onChange={(e) => setInvoiceDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table Section */}
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-4 border-b">
                                        <h3 className="font-semibold text-gray-700">Add Items</h3>
                                    </div>
                                    <div className="p-4">
                                        {/* Add Item Form - 7 columns */}
                                        <div className="grid gap-1 mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Item <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={currentItem.item}
                                                        onChange={handleItemSelect}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"

                                                    >
                                                        <option value="">Select Item</option>
                                                        {availableItems.map((item) => (
                                                            <option key={item.id} value={item.name}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Category
                                                    </label>
                                                    <select
                                                        value={currentItem.category}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.map((cat, index) => (
                                                            <option key={index} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Specification
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={currentItem.spec}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, spec: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                        placeholder="Item specification"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Purchase Price <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.purchasePrice}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, purchasePrice: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                        placeholder="0.00"
                                                        step="0.01"
                                                        min="0"

                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Qty <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.qty}
                                                        onChange={(e) => {
                                                            const qty = e.target.value;
                                                            setCurrentItem({
                                                                ...currentItem,
                                                                qty: qty,
                                                                // Auto-calculate total when qty changes
                                                                stock: currentItem.stock || qty // Set stock to qty if empty
                                                            });
                                                        }}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                        placeholder="1"
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Total
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={(currentItem.purchasePrice * currentItem.qty) || 0}
                                                        readOnly
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm bg-gray-50"
                                                        placeholder="Auto-calculated"
                                                        step="0.01"
                                                        min="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Stock
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.stock}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, stock: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                        placeholder="Stock quantity"
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={handleAddItem}
                                                        className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-2 text-sm"
                                                    >
                                                        <Plus size={16} />
                                                        {editingItemId ? "Update Item" : "Add Item"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Table */}
                                        {items.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">SR#</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Category</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Item</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Details</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Price</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Qty</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Total</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Stock</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, index) => (
                                                            <tr key={item.id} className="hover:bg-gray-50">
                                                                <td className="p-2 border-b">{index + 1}</td>
                                                                <td className="p-2 border-b">{item.category}</td>
                                                                <td className="p-2 border-b">{item.item}</td>
                                                                <td className="p-2 border-b">{item.spec}</td>
                                                                <td className="p-2 border-b">${item.purchasePrice.toFixed(2)}</td>
                                                                <td className="p-2 border-b">{item.qty}</td>
                                                                <td className="p-2 border-b font-medium">${item.total.toFixed(2)}</td>
                                                                <td className="p-2 border-b">{item.stock}</td>
                                                                <td className="p-3 border-b flex gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleEditItem(item)}
                                                                        className="text-blue-500 hover:text-blue-700"
                                                                        title="Edit"
                                                                    >
                                                                        <SquarePen size={16} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveItem(item.id)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="mt-4 text-right pr-4">
                                                    <span className="text-lg font-semibold text-gray-800">
                                                        Grand Total: ${calculateGrandTotal()}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No items added yet.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Additional notes or description..."
                                        rows="3"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors"
                                >
                                    {editingGrn ? "Update GRN" : "Add GRN"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {viewModalOpen && selectedGrn && (
                    <GrnView
                        grn={selectedGrn}
                        onClose={() => setViewModalOpen(false)}
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

export default Purchases;