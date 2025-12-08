import React, { useState, useEffect } from "react";
import { SquarePen, Trash2, Eye, Plus, Search, X, Package, ArrowRight, Building, Calendar, Filter, Box, ArrowRightLeft } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import TransferViewModal from "./ViewModels/TransferViewModal";

const TransferFromUnits = () => {
    // Main state for transfers
    const [transfers, setTransfers] = useState([
        {
            id: 1,
            sr: 1,
            transferId: "TFU-2025-001",
            date: "2025-12-05",
            fromUnit: "Warehouse A",
            items: [
                {
                    id: 1,
                    itemName: "Laptop",
                    specifications: "Dell XPS 15, 16GB RAM, 512GB SSD",
                    quantity: 5,
                    unit: "pcs"
                },
                {
                    id: 2,
                    itemName: "Office Chair",
                    specifications: "Ergonomic, Black, Adjustable",
                    quantity: 10,
                    unit: "pcs"
                }
            ],
            totalQuantity: 15,
            status: "Completed",
            preparedBy: "John Doe",
            remarks: "Regular stock transfer"
        },
        {
            id: 2,
            sr: 2,
            transferId: "TFU-2025-002",
            date: "2025-12-04",
            fromUnit: "Main Store",
            items: [
                {
                    id: 1,
                    itemName: "Printer Paper",
                    specifications: "A4, 80gsm, 500 sheets",
                    quantity: 20,
                    unit: "reams"
                },
                {
                    id: 2,
                    itemName: "Ink Cartridges",
                    specifications: "HP 304, Black & Color",
                    quantity: 50,
                    unit: "pcs"
                }
            ],
            totalQuantity: 70,
            status: "Pending",
            preparedBy: "Jane Smith",
            remarks: "Branch office supplies"
        },
        {
            id: 3,
            sr: 3,
            transferId: "TFU-2025-003",
            date: "2025-12-03",
            fromUnit: "Regional Warehouse",
            items: [
                {
                    id: 1,
                    itemName: "Safety Helmets",
                    specifications: "Yellow, Hard Hat, Adjustable",
                    quantity: 100,
                    unit: "pcs"
                },
                {
                    id: 2,
                    itemName: "Safety Shoes",
                    specifications: "Steel Toe, Size 8-12",
                    quantity: 50,
                    unit: "pairs"
                }
            ],
            totalQuantity: 150,
            status: "In Transit",
            preparedBy: "Robert Wilson",
            remarks: "Construction site safety equipment"
        }
    ]);

    // Form state
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingTransfer, setEditingTransfer] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState(null);
    const recordsPerPage = 10;

    // Form fields
    const [transferId, setTransferId] = useState("");
    const [date, setDate] = useState("");
    const [fromUnit, setFromUnit] = useState("");
    const [remarks, setRemarks] = useState("");

    // Items table in form
    const [items, setItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [currentItem, setCurrentItem] = useState({
        itemName: "",
        specifications: "",
        quantity: 1,
        unit: "pcs"
    });

    // Filter state
    const [statusFilter, setStatusFilter] = useState("All");
    const [unitFilter, setUnitFilter] = useState("All");
    const [dateRange, setDateRange] = useState({
        from: "",
        to: ""
    });

    // Units for dropdown
    const units = [
        "Warehouse A",
        "Warehouse B",
        "Main Store",
        "Regional Warehouse",
        "Central Storage",
        "Branch Office Store",
        "Factory Storage",
        "Distribution Center"
    ];

    // Available items for selection
    const availableItems = [
        { id: 1, name: "Laptop", specifications: "Dell XPS 15, 16GB RAM, 512GB SSD", unit: "pcs" },
        { id: 2, name: "Office Chair", specifications: "Ergonomic, Black, Adjustable", unit: "pcs" },
        { id: 3, name: "Printer Paper", specifications: "A4, 80gsm, 500 sheets", unit: "reams" },
        { id: 4, name: "Ink Cartridges", specifications: "HP 304, Black & Color", unit: "pcs" },
        { id: 5, name: "Safety Helmets", specifications: "Yellow, Hard Hat, Adjustable", unit: "pcs" },
        { id: 6, name: "Safety Shoes", specifications: "Steel Toe, Size 8-12", unit: "pairs" },
        { id: 7, name: "Monitor", specifications: "Samsung 27\" 4K, LED", unit: "pcs" },
        { id: 8, name: "Keyboard", specifications: "Logitech MX Keys, Wireless", unit: "pcs" },
        { id: 9, name: "Mouse", specifications: "Logitech MX Master 3, Wireless", unit: "pcs" },
        { id: 10, name: "Desk", specifications: "Standing Desk Pro, 160x80cm", unit: "pcs" }
    ];

    // Unit options
    const unitOptions = ["pcs", "reams", "pairs", "boxes", "kg", "liters", "meters"];

    // Status options
    const statusOptions = ["All", "Pending", "In Transit", "Completed", "Cancelled"];

    // Generate Transfer ID
    useEffect(() => {
        generateNextTransferId();
    }, []);

    const generateNextTransferId = () => {
        if (editingTransfer) {
            setTransferId(editingTransfer.transferId);
            return;
        }

        // Always generate based on existing data
        const currentYear = new Date().getFullYear();

        // Filter transfers from current year
        const currentYearTransfers = transfers.filter(transfer =>
            transfer.transferId.includes(`TFU-${currentYear}-`)
        );

        if (currentYearTransfers.length === 0) {
            // First transfer of the year
            setTransferId(`TFU-${currentYear}-001`);
            return;
        }

        // Get the highest number
        let maxNumber = 0;
        currentYearTransfers.forEach(transfer => {
            const match = transfer.transferId.match(new RegExp(`TFU-${currentYear}-(\\d+)`));
            if (match) {
                const num = parseInt(match[1]);
                if (num > maxNumber) {
                    maxNumber = num;
                }
            }
        });

        const nextNumber = maxNumber + 1;
        setTransferId(`TFU-${currentYear}-${String(nextNumber).padStart(3, '0')}`);
    };

    // Handle item selection
    const handleItemSelect = (e) => {
        const selectedItem = availableItems.find(item => item.name === e.target.value);
        if (selectedItem) {
            setCurrentItem({
                ...currentItem,
                itemName: selectedItem.name,
                specifications: selectedItem.specifications,
                unit: selectedItem.unit
            });
        }
    };

    // Handle add/edit item to transfer form
    const handleAddItem = () => {
        if (!currentItem.itemName || !currentItem.quantity) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please select an item and enter quantity",
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
                        itemName: currentItem.itemName,
                        specifications: currentItem.specifications,
                        quantity: parseInt(currentItem.quantity) || 1,
                        unit: currentItem.unit
                    }
                    : item
            );
            setItems(updatedItems);
        } else {
            // Add new item
            const newItem = {
                id: items.length + 1,
                itemName: currentItem.itemName,
                specifications: currentItem.specifications,
                quantity: parseInt(currentItem.quantity) || 1,
                unit: currentItem.unit
            };
            setItems([...items, newItem]);
        }

        // Reset form
        setCurrentItem({ itemName: "", specifications: "", quantity: 1, unit: "pcs" });
        setEditingItemId(null);
    };

    // Remove item from transfer form
    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Handle edit item in the form
    const handleEditItem = (item) => {
        setCurrentItem({
            itemName: item.itemName,
            specifications: item.specifications,
            quantity: item.quantity,
            unit: item.unit
        });
        setEditingItemId(item.id);
    };

    // Calculate total quantity
    const calculateTotalQuantity = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!date || !fromUnit || items.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing Required Fields",
                text: "Please fill in Date, From Unit and add at least one item",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (editingTransfer) {
            // Update existing transfer
            setTransfers(transfers.map(transfer =>
                transfer.id === editingTransfer.id
                    ? {
                        ...transfer,
                        transferId,
                        date,
                        fromUnit,
                        items,
                        totalQuantity: calculateTotalQuantity(),
                        remarks,
                        status: "Pending"
                    }
                    : transfer
            ));
            Swal.fire("Updated!", "Transfer updated successfully.", "success");
        } else {
            // Add new transfer
            const newTransfer = {
                id: transfers.length + 1,
                sr: transfers.length + 1,
                transferId,
                date,
                fromUnit,
                items: [...items],
                totalQuantity: calculateTotalQuantity(),
                status: "Pending",
                preparedBy: "Current User",
                remarks
            };
            setTransfers([...transfers, newTransfer]);
            Swal.fire("Added!", "Transfer added successfully.", "success");
        }

        setIsSliderOpen(false);
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        setTransferId("");
        setDate("");
        setFromUnit("");
        setRemarks("");
        setItems([]);
        setCurrentItem({ itemName: "", specifications: "", quantity: 1, unit: "pcs" });
        setEditingItemId(null);
        setEditingTransfer(null);
    };

    // Handle edit click
    const handleEditClick = (transfer) => {
        setEditingTransfer(transfer);
        setTransferId(transfer.transferId);
        setDate(transfer.date);
        setFromUnit(transfer.fromUnit);
        setRemarks(transfer.remarks || "");
        setItems(transfer.items);
        setIsSliderOpen(true);
    };

    // Handle view click
    const handleViewClick = (transfer) => {
        setSelectedTransfer(transfer);
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
                title: "Delete Transfer Record",
                text: "Are you sure you want to delete this transfer? This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const updatedTransfers = transfers.filter((transfer) => transfer.id !== id)
                        .map((transfer, index) => ({
                            ...transfer,
                            sr: index + 1
                        }));
                    setTransfers(updatedTransfers);
                    setCurrentPage(1);

                    swalWithTailwindButtons.fire(
                        "Deleted!",
                        "Transfer record deleted successfully.",
                        "success"
                    );
                }
            });
    };

    // Filter transfers based on search term and filters
    const filteredTransfers = transfers.filter(transfer => {
        // Search term filter
        const matchesSearch = searchTerm === "" ||
            transfer.transferId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transfer.fromUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transfer.items.some(item =>
                item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.specifications.toLowerCase().includes(searchTerm.toLowerCase())
            );

        // Status filter
        const matchesStatus = statusFilter === "All" || transfer.status === statusFilter;

        // Unit filter
        const matchesUnit = unitFilter === "All" || transfer.fromUnit === unitFilter;

        // Date range filter
        let matchesDateRange = true;
        if (dateRange.from && dateRange.to) {
            const transferDate = new Date(transfer.date);
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            matchesDateRange = transferDate >= fromDate && transferDate <= toDate;
        }

        return matchesSearch && matchesStatus && matchesUnit && matchesDateRange;
    });

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredTransfers.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredTransfers.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page total quantity
    const pageTotalQty = currentRecords.reduce((sum, transfer) => sum + transfer.totalQuantity, 0);

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Transit':
                return 'bg-blue-100 text-blue-800';
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
        setUnitFilter("All");
        setDateRange({ from: "", to: "" });
        setCurrentPage(1);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <div className="flex gap-2">
                            <ArrowRightLeft size={28} className="text-newPrimary" />
                            <h1 className="text-2xl font-bold text-newPrimary">
                                Transfer From Units
                            </h1>
                        </div>
                        <p className="text-gray-600 mt-1">Manage inter-unit inventory transfers</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by Transfer ID, unit, item..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[300px] pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            />
                        </div>

                        <button
                            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 flex items-center gap-2"
                            onClick={() => {
                                generateNextTransferId();
                                setDate(new Date().toISOString().split('T')[0]);
                                resetForm();
                                setIsSliderOpen(true);
                            }}
                        >
                            <Plus size={20} />
                            Add Transfer
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
                            <select
                                value={unitFilter}
                                onChange={(e) => setUnitFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                            >
                                <option value="All">All Units</option>
                                {units.map((unit, index) => (
                                    <option key={index} value={unit}>{unit}</option>
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
                                <div className="hidden lg:grid grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                    <div>SR#</div>
                                    <div>Transfer ID</div>
                                    <div>Date</div>
                                    <div>Items</div>
                                    <div>From Unit</div>
                                    <div>Total Qty</div>
                                    <div className="text-center">Actions</div>
                                </div>

                                <div className="flex flex-col divide-y divide-gray-100">
                                    {loading ? (
                                        <TableSkeleton
                                            rows={recordsPerPage}
                                            cols={7}
                                            className="lg:grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr]"
                                        />
                                    ) : currentRecords.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 bg-white">
                                            <Package className="mx-auto mb-3 text-gray-400" size={48} />
                                            <p className="text-lg">No transfer records found.</p>
                                            <p className="text-sm mt-1">Try adjusting your filters or add a new transfer.</p>
                                        </div>
                                    ) : (
                                        currentRecords.map((transfer) => (
                                            <div
                                                key={transfer.id}
                                                className="grid grid-cols-1 lg:grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                            >
                                                <div className="font-medium text-gray-900">
                                                    {transfer.sr}
                                                </div>
                                                <div>
                                                    <div className="text-gray-900 font-medium">
                                                        {transfer.transferId}
                                                    </div>
                                                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getStatusBadgeColor(transfer.status)}`}>
                                                        {transfer.status}
                                                    </div>
                                                </div>
                                                <div className="text-gray-600">
                                                    {transfer.date}
                                                </div>
                                                <div className="text-gray-600">
                                                    <div className="space-y-1">
                                                        {transfer.items.slice(0, 2).map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 text-xs">
                                                                <Box size={12} className="text-gray-400" />
                                                                <span className="font-medium">{item.itemName}</span>
                                                                <span className="text-gray-500">({item.quantity} {item.unit})</span>
                                                            </div>
                                                        ))}
                                                        {transfer.items.length > 2 && (
                                                            <div className="text-xs text-gray-500">
                                                                +{transfer.items.length - 2} more items
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Building size={14} className="text-gray-400" />
                                                        {transfer.fromUnit}
                                                    </div>
                                                </div>
                                                <div className="text-gray-900 font-semibold">
                                                    {transfer.totalQuantity} units
                                                </div>
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleViewClick(transfer)}
                                                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                                                        title="View"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(transfer)}
                                                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(transfer.id)}
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
                    <div className="grid grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr] items-center gap-4 px-6 py-3 border-t bg-gray-100">
                        {/* Empty cells for first 5 columns */}
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>

                        {/* Page Total positioned exactly under TOTAL QTY column */}
                        <div className="font-semibold text-blue-700">
                            Total: {pageTotalQty} units
                        </div>

                        {/* Empty cell for Actions column */}
                        <div></div>
                    </div>

                    {/* Pagination Controls */}
                    {filteredTransfers.length > 0 && (
                        <div className="grid grid-cols-[1fr_auto] items-center my-4 px-6">
                            {/* Records info on left */}
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRecord + 1} to{" "}
                                {Math.min(indexOfLastRecord, filteredTransfers.length)} of{" "}
                                {filteredTransfers.length} records
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
                        <div className="w-full md:w-[900px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                                <h2 className="text-xl font-bold text-newPrimary flex items-center gap-2">
                                    {editingTransfer ? "Update Transfer" : "Add New Transfer"}
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
                                {/* Transfer Information */}
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <Package size={18} />
                                        Transfer Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Transfer ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={transferId}
                                                onChange={(e) => setTransferId(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                                placeholder="Auto-generated"
                                                required
                                                readOnly
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
                                                From Unit <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={fromUnit}
                                                onChange={(e) => setFromUnit(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Unit</option>
                                                {units.map((unit, index) => (
                                                    <option key={index} value={unit}>{unit}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table Section */}
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-4 border-b">
                                        <h3 className="font-semibold text-gray-700">Add Items to Transfer</h3>
                                        <p className="text-sm text-gray-600 mt-1">Add items that need to be transferred</p>
                                    </div>
                                    <div className="p-4">
                                        {/* Add Item Form */}
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                    Item Name
                                                </label>
                                                <select
                                                    value={currentItem.itemName}
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
                                                    Specifications
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentItem.specifications}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, specifications: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    placeholder="Item specifications"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                    Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentItem.quantity}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    placeholder="1"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                    Unit
                                                </label>
                                                <select
                                                    value={currentItem.unit}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                >
                                                    {unitOptions.map((unit, index) => (
                                                        <option key={index} value={unit}>{unit}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mt-7">
                                                <button
                                                    type="button"
                                                    onClick={handleAddItem}
                                                    className="bg-green-500 w-full text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <Plus size={16} />
                                                    {editingItemId ? "Update Item" : "Add Item"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Items Table */}
                                        {items.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">SR#</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Item Name</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Specifications</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Quantity</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Unit</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, index) => (
                                                            <tr key={item.id} className="hover:bg-gray-50">
                                                                <td className="p-2 border-b">{index + 1}</td>
                                                                <td className="p-2 border-b font-medium">{item.itemName}</td>
                                                                <td className="p-2 border-b text-gray-600">{item.specifications}</td>
                                                                <td className="p-2 border-b font-medium">{item.quantity}</td>
                                                                <td className="p-2 border-b">{item.unit}</td>
                                                                <td className="p-2 border-b">
                                                                    <div className="flex gap-2">
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
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="mt-4 text-right pr-4">
                                                    <span className="text-lg font-semibold text-gray-800">
                                                        Total Items: {items.length} | Total Quantity: {calculateTotalQuantity()} units
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No items added yet. Add items using the form above.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Remarks */}
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <Calendar size={18} />
                                        Remarks
                                    </h3>
                                    <div>
                                        <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                            placeholder="Enter any remarks or additional information about this transfer..."
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors"
                                    >
                                        {editingTransfer ? "Update Transfer" : "Add Transfer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {viewModalOpen && selectedTransfer && (
                    <TransferViewModal
                        transfer={selectedTransfer}
                        onClose={() => setViewModalOpen(false)}
                        onEdit={() => {
                            setViewModalOpen(false);
                            handleEditClick(selectedTransfer);
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

export default TransferFromUnits;