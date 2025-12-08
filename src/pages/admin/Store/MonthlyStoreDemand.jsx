import React, { useState } from "react";
import { SquarePen, Trash2, Eye, Plus, Search, X, Calendar } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import MonthlyDemandView from "./ViewModels/MonthlyDemandView";

const MonthlyStoreDemand = () => {
    // Main state for monthly demands
    const [demands, setDemands] = useState([
        {
            id: 1,
            sr: 1,
            monthlyId: "MSD-2025-01",
            manualId: "MAN-001",
            demandDate: "2025-01-15",
            subject: "Office Supplies Monthly Demand",
            for: "Administration Department",
            fromVendor: "Stationery World",
            createdBy: "John Smith",
            description: "Monthly office supplies for January 2025",
            items: [
                { id: 1, itemName: "Notebooks", unit: "Pack", specifications: "A4 Size, 100 pages", inHand: 15, quantityRequire: 20, rate: 24.99, total: 499.80 },
                { id: 2, itemName: "Pens", unit: "Box", specifications: "Blue Ballpoint", inHand: 8, quantityRequire: 15, rate: 9.99, total: 149.85 }
            ],
            grandTotal: 649.65,
            previousDate: "2024-12-15",
            prevDemand: 12,
            inStock: 23,
            required: 35,
            rate: 17.49,
            totals: 612.15
        },
        {
            id: 2,
            sr: 2,
            monthlyId: "MSD-2025-02",
            manualId: "MAN-002",
            demandDate: "2025-01-20",
            subject: "Cleaning Supplies Demand",
            for: "Maintenance Department",
            fromVendor: "Cleaning Supplies Ltd.",
            createdBy: "Sarah Johnson",
            description: "Monthly cleaning supplies",
            items: [
                { id: 1, itemName: "Hand Sanitizer", unit: "Bottle", specifications: "500ml Gel", inHand: 25, quantityRequire: 30, rate: 12.99, total: 389.70 },
                { id: 2, itemName: "Disinfectant Spray", unit: "Can", specifications: "500ml", inHand: 12, quantityRequire: 20, rate: 8.99, total: 179.80 }
            ],
            grandTotal: 569.50,
            previousDate: "2024-12-20",
            prevDemand: 15,
            inStock: 37,
            required: 50,
            rate: 10.99,
            totals: 549.50
        },
        {
            id: 3,
            sr: 3,
            monthlyId: "MSD-2025-03",
            manualId: "MAN-003",
            demandDate: "2025-01-25",
            subject: "IT Equipment Demand",
            for: "IT Department",
            fromVendor: "Tech Supplies Inc.",
            createdBy: "Robert Wilson",
            description: "Monthly IT equipment requirements",
            items: [
                { id: 1, itemName: "Mouse", unit: "Piece", specifications: "Wireless Optical", inHand: 10, quantityRequire: 8, rate: 19.99, total: 159.92 },
                { id: 2, itemName: "Keyboard", unit: "Piece", specifications: "Mechanical", inHand: 5, quantityRequire: 5, rate: 49.99, total: 249.95 }
            ],
            grandTotal: 409.87,
            previousDate: "2024-12-25",
            prevDemand: 8,
            inStock: 15,
            required: 13,
            rate: 34.99,
            totals: 454.87
        }
    ]);

    // Form state
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingDemand, setEditingDemand] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedDemand, setSelectedDemand] = useState(null);
    const recordsPerPage = 10;

    // Form fields
    const [monthlyId, setMonthlyId] = useState("");
    const [manualId, setManualId] = useState("");
    const [demandDate, setDemandDate] = useState("");
    const [subject, setSubject] = useState("");
    const [forDemand, setForDemand] = useState("");
    const [fromVendor, setFromVendor] = useState("");
    const [description, setDescription] = useState("");
    const [createdBy, setCreatedBy] = useState("");

    // Items table in form
    const [items, setItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [currentItem, setCurrentItem] = useState({
        itemName: "",
        unit: "",
        specifications: "",
        inHand: "",
        quantityRequire: "",
        rate: "",
        total: ""
    });

    // Available items for selection
    const availableItems = [
        { id: 1, name: "Notebooks", unit: "Pack", specifications: "A4 Size, 100 pages", price: 24.99 },
        { id: 2, name: "Pens", unit: "Box", specifications: "Blue Ballpoint", price: 9.99 },
        { id: 3, name: "Hand Sanitizer", unit: "Bottle", specifications: "500ml Gel", price: 12.99 },
        { id: 4, name: "Disinfectant Spray", unit: "Can", specifications: "500ml", price: 8.99 },
        { id: 5, name: "Mouse", unit: "Piece", specifications: "Wireless Optical", price: 19.99 },
        { id: 6, name: "Keyboard", unit: "Piece", specifications: "Mechanical", price: 49.99 },
        { id: 7, name: "Printer Paper", unit: "Ream", specifications: "A4 80gsm", price: 8.99 },
        { id: 8, name: "Stapler", unit: "Piece", specifications: "Standard Size", price: 5.99 },
        { id: 9, name: "File Folders", unit: "Pack", specifications: "A4 Manila", price: 6.99 },
        { id: 10, name: "Whiteboard Marker", unit: "Pack", specifications: "Assorted Colors", price: 4.99 }
    ];

    // Vendors for dropdown
    const vendors = [
        "Stationery World",
        "Cleaning Supplies Ltd.",
        "Tech Supplies Inc.",
        "Office Furniture Co.",
        "General Supplies Corp.",
        "IT Equipment Solutions",
        "Electronics Hub"
    ];

    // Departments for dropdown
    const departments = [
        "Administration Department",
        "IT Department",
        "Maintenance Department",
        "Finance Department",
        "HR Department",
        "Operations Department",
        "Sales Department"
    ];

    // Units for dropdown
    const units = ["Piece", "Pack", "Box", "Bottle", "Can", "Ream", "Set", "Kg", "Liter"];

    // Generate monthly ID
    const generateMonthlyId = () => {
        const currentYear = new Date().getFullYear();
        const lastDemand = [...demands].sort((a, b) => b.id - a.id)[0];

        if (lastDemand && lastDemand.monthlyId.includes(`MSD-${currentYear}-`)) {
            const lastNumber = parseInt(lastDemand.monthlyId.split('-').pop());
            return `MSD-${currentYear}-${String(lastNumber + 1).padStart(2, '0')}`;
        }

        return `MSD-${currentYear}-01`;
    };

    // Generate manual ID
    const generateManualId = () => {
        const lastDemand = [...demands].sort((a, b) => b.id - a.id)[0];

        if (lastDemand && lastDemand.manualId.includes('MAN-')) {
            const lastNumber = parseInt(lastDemand.manualId.split('-').pop());
            return `MAN-${String(lastNumber + 1).padStart(3, '0')}`;
        }

        return "MAN-001";
    };

    // Handle item selection
    const handleItemSelect = (e) => {
        const selectedItem = availableItems.find(item => item.name === e.target.value);
        if (selectedItem) {
            setCurrentItem({
                ...currentItem,
                itemName: selectedItem.name,
                unit: selectedItem.unit,
                specifications: selectedItem.specifications,
                rate: selectedItem.price
            });
        }
    };

    // Calculate item total
    const calculateItemTotal = () => {
        const qty = parseInt(currentItem.quantityRequire) || 0;
        const rate = parseFloat(currentItem.rate) || 0;
        return (qty * rate).toFixed(2);
    };

    // Handle add/edit item
    const handleAddItem = () => {
        if (!currentItem.itemName || !currentItem.quantityRequire || !currentItem.rate) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please select an item, enter quantity and rate",
                confirmButtonColor: "#d33",
            });
            return;
        }

        const total = parseFloat(calculateItemTotal());

        if (editingItemId) {
            // Update existing item
            const updatedItems = items.map(item =>
                item.id === editingItemId
                    ? {
                        ...item,
                        itemName: currentItem.itemName,
                        unit: currentItem.unit,
                        specifications: currentItem.specifications,
                        inHand: parseInt(currentItem.inHand) || 0,
                        quantityRequire: parseInt(currentItem.quantityRequire),
                        rate: parseFloat(currentItem.rate),
                        total: total
                    }
                    : item
            );
            setItems(updatedItems);
        } else {
            // Add new item
            const newItem = {
                id: items.length + 1,
                itemName: currentItem.itemName,
                unit: currentItem.unit,
                specifications: currentItem.specifications,
                inHand: parseInt(currentItem.inHand) || 0,
                quantityRequire: parseInt(currentItem.quantityRequire),
                rate: parseFloat(currentItem.rate),
                total: total
            };
            setItems([...items, newItem]);
        }

        // Reset form
        setCurrentItem({
            itemName: "",
            unit: "",
            specifications: "",
            inHand: "",
            quantityRequire: "",
            rate: "",
            total: ""
        });
        setEditingItemId(null);
    };

    // Remove item from form
    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Handle edit item in the form
    const handleEditItem = (item) => {
        setCurrentItem({
            itemName: item.itemName,
            unit: item.unit,
            specifications: item.specifications,
            inHand: item.inHand,
            quantityRequire: item.quantityRequire,
            rate: item.rate,
            total: item.total
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
        if (!demandDate || !subject || !forDemand || !fromVendor || items.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing Required Fields",
                text: "Please fill in all required fields and add at least one item",
                confirmButtonColor: "#d33",
            });
            return;
        }

        // Calculate totals
        const totalRequired = items.reduce((sum, item) => sum + item.quantityRequire, 0);
        const averageRate = items.length > 0 ? items.reduce((sum, item) => sum + item.rate, 0) / items.length : 0;
        const grandTotal = parseFloat(calculateGrandTotal());

        if (editingDemand) {
            // Update existing demand
            setDemands(demands.map(demand =>
                demand.id === editingDemand.id
                    ? {
                        ...demand,
                        monthlyId,
                        manualId,
                        demandDate,
                        subject,
                        for: forDemand,
                        fromVendor,
                        description,
                        createdBy,
                        items,
                        grandTotal,
                        inStock: items.reduce((sum, item) => sum + item.inHand, 0),
                        required: totalRequired,
                        rate: averageRate,
                        totals: grandTotal
                    }
                    : demand
            ));
            Swal.fire("Updated!", "Monthly demand updated successfully.", "success");
        } else {
            // Add new demand
            const newDemand = {
                id: demands.length + 1,
                sr: demands.length + 1,
                monthlyId,
                manualId,
                demandDate,
                subject,
                for: forDemand,
                fromVendor,
                description,
                createdBy: createdBy || "Current User",
                items: [...items],
                grandTotal,
                previousDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
                prevDemand: Math.floor(Math.random() * 20) + 5,
                inStock: items.reduce((sum, item) => sum + item.inHand, 0),
                required: totalRequired,
                rate: averageRate,
                totals: grandTotal
            };
            setDemands([...demands, newDemand]);
            Swal.fire("Added!", "Monthly demand added successfully.", "success");
        }

        setIsSliderOpen(false);
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        setMonthlyId(generateMonthlyId());
        setManualId(generateManualId());
        setDemandDate("");
        setSubject("");
        setForDemand("");
        setFromVendor("");
        setDescription("");
        setCreatedBy("");
        setItems([]);
        setCurrentItem({
            itemName: "",
            unit: "",
            specifications: "",
            inHand: "",
            quantityRequire: "",
            rate: "",
            total: ""
        });
        setEditingItemId(null);
        setEditingDemand(null);
    };

    // Handle edit click
    const handleEditClick = (demand) => {
        setEditingDemand(demand);
        setMonthlyId(demand.monthlyId);
        setManualId(demand.manualId);
        setDemandDate(demand.demandDate);
        setSubject(demand.subject);
        setForDemand(demand.for);
        setFromVendor(demand.fromVendor);
        setDescription(demand.description);
        setCreatedBy(demand.createdBy);
        setItems(demand.items);
        setIsSliderOpen(true);
    };

    // Handle view click
    const handleViewClick = (demand) => {
        setSelectedDemand(demand);
        setViewModalOpen(true);
    };

    // Handle delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedDemands = demands.filter((demand) => demand.id !== id)
                    .map((demand, index) => ({
                        ...demand,
                        sr: index + 1
                    }));
                setDemands(updatedDemands);
                setCurrentPage(1);

                Swal.fire(
                    "Deleted!",
                    "Monthly demand deleted successfully.",
                    "success"
                );
            }
        });
    };

    // Filter demands based on search term
    const filteredDemands = demands.filter(demand =>
        demand.monthlyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.for.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.fromVendor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredDemands.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredDemands.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page total
    const pageTotal = currentRecords.reduce((sum, demand) => sum + demand.totals, 0);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <div className="flex gap-2">
                            <Calendar size={28} className="text-newPrimary" />
                            <h1 className="text-2xl font-bold text-newPrimary">
                                Monthly Store Demand
                            </h1>
                        </div>
                        <p className="text-gray-600 mt-1">
                            Manage monthly store demands and requirements
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by monthly ID, subject, department..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[300px] pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            />
                        </div>

                        <button
                            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 flex items-center gap-2"
                            onClick={() => {
                                setMonthlyId(generateMonthlyId());
                                setManualId(generateManualId());
                                setIsSliderOpen(true);
                            }}
                        >
                            <Plus size={20} />
                            Add Demand
                        </button>
                    </div>
                </div>

                {/* Main Table */}
                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="max-h-screen overflow-y-auto custom-scrollbar">
                            <div className="inline-block w-full align-middle">
                                {/* Table Header */}
                                <div className="hidden lg:grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                    <div>SR#</div>
                                    <div>Items</div>
                                    <div>Unit</div>
                                    <div>In Stock</div>
                                    <div>Previous Date</div>
                                    <div>Prev Demand</div>
                                    <div>Required</div>
                                    <div>Rate</div>
                                    <div>Totals</div>
                                    <div className="text-center">Actions</div>
                                </div>

                                <div className="flex flex-col divide-y divide-gray-100">
                                    {loading ? (
                                        <TableSkeleton
                                            rows={recordsPerPage}
                                            cols={10}
                                            className="lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                                        />
                                    ) : currentRecords.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500 bg-white">
                                            No monthly demands found.
                                        </div>
                                    ) : (
                                        currentRecords.map((demand) => (
                                            <div
                                                key={demand.id}
                                                className="grid grid-cols-1 lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                            >
                                                <div className="font-medium text-gray-900">
                                                    {demand.sr}
                                                </div>
                                                <div className="text-gray-900 font-medium">
                                                    <div>{demand.monthlyId}</div>
                                                    <div className="text-xs text-gray-500">{demand.subject}</div>
                                                </div>
                                                <div className="text-gray-600">
                                                    {demand.items.length} items
                                                </div>
                                                <div className="text-gray-600">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${demand.inStock > 50 ? 'bg-green-100 text-green-800' : demand.inStock > 20 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {demand.inStock}
                                                    </span>
                                                </div>
                                                <div className="text-gray-600">
                                                    {demand.previousDate}
                                                </div>
                                                <div className="text-gray-600">
                                                    {demand.prevDemand}
                                                </div>
                                                <div className="text-gray-900 font-medium">
                                                    {demand.required}
                                                </div>
                                                <div className="text-gray-600">
                                                    ${demand.rate.toFixed(2)}
                                                </div>
                                                <div className="text-gray-900 font-semibold">
                                                    ${demand.totals.toFixed(2)}
                                                </div>
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleEditClick(demand)}
                                                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(demand.id)}
                                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewClick(demand)}
                                                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                                                        title="View"
                                                    >
                                                        <Eye size={18} />
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
                    <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-3 border-t bg-gray-100">
                        {/* Empty cells for first 8 columns */}
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>

                        {/* Page Total positioned exactly under TOTALS column */}
                        <div className="font-semibold text-blue-700">
                            Total: ${pageTotal.toFixed(2)}
                        </div>

                        {/* Empty cell for Actions column */}
                        <div></div>
                    </div>

                    {/* Pagination Controls */}
                    {filteredDemands.length > 0 && (
                        <div className="grid grid-cols-[1fr_auto] items-center my-4 px-6">
                            {/* Records info on left */}
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRecord + 1} to{" "}
                                {Math.min(indexOfLastRecord, filteredDemands.length)} of{" "}
                                {filteredDemands.length} records
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
                    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
                        <div className="w-full md:w-[1000px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-2xl">
                                <h2 className="text-xl font-bold text-newPrimary">
                                    {editingDemand ? "Update Monthly Demand" : "Add New Monthly Demand"}
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
                                {/* Main Form Fields */}
                                <div className="space-y-4 border p-6 rounded-lg bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Monthly ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={monthlyId}
                                                onChange={(e) => setMonthlyId(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                                required
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Manual ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={manualId}
                                                onChange={(e) => setManualId(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                                required
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Demand Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={demandDate}
                                                onChange={(e) => setDemandDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Subject <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="e.g., Office Supplies Monthly Demand"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                For <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={forDemand}
                                                onChange={(e) => setForDemand(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept, index) => (
                                                    <option key={index} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                From Vendor <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={fromVendor}
                                                onChange={(e) => setFromVendor(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Vendor</option>
                                                {vendors.map((vendor, index) => (
                                                    <option key={index} value={vendor}>{vendor}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Created By
                                            </label>
                                            <input
                                                type="text"
                                                value={createdBy}
                                                onChange={(e) => setCreatedBy(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter your name"
                                            />
                                        </div> */}
                                    </div>
                                </div>

                                {/* Items Table Section */}
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-100 p-4 border-b">
                                        <h3 className="font-semibold text-gray-700">Add Demand Items</h3>
                                    </div>
                                    <div className="p-4">
                                        {/* Add Item Form */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                                                    Unit
                                                </label>
                                                <select
                                                    value={currentItem.unit}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                >
                                                    <option value="">Select Unit</option>
                                                    {units.map((unit, index) => (
                                                        <option key={index} value={unit}>{unit}</option>
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
                                                    In Hand
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentItem.inHand}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, inHand: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                    Required Qty
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentItem.quantityRequire}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, quantityRequire: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    placeholder="0"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                    Rate
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentItem.rate}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, rate: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-end">
                                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                    Total
                                                </label>
                                                <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
                                                    ${calculateItemTotal()}
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleAddItem}
                                                    className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <Plus size={16} />
                                                    {editingItemId ? "Update Item" : "Add Item"}
                                                </button></div>
                                        </div>


                                        {/* Items Table */}
                                        {items.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">SR#</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Item Name</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Unit</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Specifications</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">In Hand</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Required Qty</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Rate</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Total</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, index) => (
                                                            <tr key={item.id} className="hover:bg-gray-50">
                                                                <td className="p-2 border-b">{index + 1}</td>
                                                                <td className="p-2 border-b">{item.itemName}</td>
                                                                <td className="p-2 border-b">{item.unit}</td>
                                                                <td className="p-2 border-b">{item.specifications}</td>
                                                                <td className="p-2 border-b">{item.inHand}</td>
                                                                <td className="p-2 border-b">{item.quantityRequire}</td>
                                                                <td className="p-2 border-b">${item.rate.toFixed(2)}</td>
                                                                <td className="p-2 border-b font-medium">${item.total.toFixed(2)}</td>
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
                                    {editingDemand ? "Update Monthly Demand" : "Add Monthly Demand"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {viewModalOpen && selectedDemand && (
                    <MonthlyDemandView
                        demand={selectedDemand}
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

export default MonthlyStoreDemand;