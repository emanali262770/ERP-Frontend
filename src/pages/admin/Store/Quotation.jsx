import React, { useState } from "react";
import { SquarePen, Trash2, Eye, Plus, Search, X } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import QuotationView from "./ViewModels/QuotationView";

const Quotation = () => {
    // Main state for quotations
    const [quotations, setQuotations] = useState([
        {
            id: 1,
            sr: 1,
            quotationNo: "QUO-2025-001",
            date: "2025-12-03",
            supplier: "Tech Supplies Inc.",
            forDemand: "Office Renovation",
            person: "John Smith",
            createdBy: "Admin User",
            designation: "Procurement Manager",
            description: "IT equipment for new office setup",
            items: [
                { id: 1, itemName: "Laptop", description: "Dell XPS 15", rate: 1299.99, qty: 2, total: 2599.98 },
                { id: 2, itemName: "Monitor", description: "Samsung 27\" 4K", rate: 399.99, qty: 2, total: 799.98 }
            ],
            grandTotal: 3399.96
        },
        {
            id: 2,
            sr: 2,
            quotationNo: "QUO-2025-002",
            date: "2025-12-04",
            supplier: "Office Furniture Co.",
            forDemand: "Furniture Purchase",
            person: "Sarah Johnson",
            createdBy: "Admin User",
            designation: "Office Manager",
            description: "Ergonomic furniture for employees",
            items: [
                { id: 1, itemName: "Office Chair", description: "ErgoPro 300", rate: 299.99, qty: 5, total: 1499.95 },
                { id: 2, itemName: "Desk", description: "Standing Desk Pro", rate: 449.99, qty: 3, total: 1349.97 }
            ],
            grandTotal: 2849.92
        },
        {
            id: 3,
            sr: 3,
            quotationNo: "QUO-2025-003",
            date: "2025-12-05",
            supplier: "Stationery World",
            forDemand: "Monthly Supplies",
            person: "Robert Wilson",
            createdBy: "Store Manager",
            designation: "Store Incharge",
            description: "Regular office stationery",
            items: [
                { id: 1, itemName: "Notebooks", description: "Premium A4", rate: 24.99, qty: 10, total: 249.90 },
                { id: 2, itemName: "Pens", description: "Ballpoint Black", rate: 9.99, qty: 20, total: 199.80 }
            ],
            grandTotal: 449.70
        }
    ]);

    // Form state
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingQuotation, setEditingQuotation] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const recordsPerPage = 10;

    // Form fields
    const [quotationNo, setQuotationNo] = useState("");
    const [date, setDate] = useState("");
    const [supplier, setSupplier] = useState("");
    const [forDemand, setForDemand] = useState("");
    const [person, setPerson] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [designation, setDesignation] = useState("");
    const [description, setDescription] = useState("");

    // Items table in form
    const [items, setItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [currentItem, setCurrentItem] = useState({
        itemName: "",
        description: "",
        rate: "",
        qty: 1
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

    // Persons for dropdown
    const persons = [
        "John Smith",
        "Sarah Johnson",
        "Robert Wilson",
        "Emily Davis",
        "Michael Brown",
        "Jessica Miller"
    ];

    // Available items for selection
    const availableItems = [
        { id: 1, name: "Laptop", description: "Dell XPS 15", price: 1299.99 },
        { id: 2, name: "Office Chair", description: "ErgoPro 300", price: 299.99 },
        { id: 3, name: "Monitor", description: "Samsung 27\" 4K", price: 399.99 },
        { id: 4, name: "Notebooks", description: "Premium A4", price: 24.99 },
        { id: 5, name: "Desk", description: "Standing Desk Pro", price: 449.99 },
        { id: 6, name: "Router", description: "TP-Link Archer AX50", price: 129.99 },
        { id: 7, name: "Keyboard", description: "Logitech MX Keys", price: 99.99 },
        { id: 8, name: "Mouse", description: "Logitech MX Master 3", price: 89.99 },
        { id: 9, name: "Printer Paper", description: "A4 80gsm", price: 8.99 },
        { id: 10, name: "Hand Sanitizer", description: "500ml Gel", price: 12.99 }
    ];

    // Add this function to generate quotation number
    const generateQuotationNo = () => {
        const currentYear = new Date().getFullYear();
        const lastQuotation = [...quotations].sort((a, b) => b.id - a.id)[0];

        if (lastQuotation && lastQuotation.quotationNo.includes(`QUO-${currentYear}-`)) {
            const lastNumber = parseInt(lastQuotation.quotationNo.split('-').pop());
            return `QUO-${currentYear}-${String(lastNumber + 1).padStart(3, '0')}`;
        }

        return `QUO-${currentYear}-001`;
    };

    // Handle add/edit item to quotation form
    const handleAddItem = () => {
        if (!currentItem.itemName || !currentItem.rate) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please select an item and enter rate",
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
                        description: currentItem.description,
                        rate: parseFloat(currentItem.rate),
                        qty: parseInt(currentItem.qty) || 1,
                        total: parseFloat(currentItem.rate) * (parseInt(currentItem.qty) || 1)
                    }
                    : item
            );
            setItems(updatedItems);
        } else {
            // Add new item
            const newItem = {
                id: items.length + 1,
                itemName: currentItem.itemName,
                description: currentItem.description,
                rate: parseFloat(currentItem.rate),
                qty: parseInt(currentItem.qty) || 1,
                total: parseFloat(currentItem.rate) * (parseInt(currentItem.qty) || 1)
            };
            setItems([...items, newItem]);
        }

        // Reset form
        setCurrentItem({ itemName: "", description: "", rate: "", qty: 1 });
        setEditingItemId(null);
    };

    // Remove item from quotation form
    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Handle edit item in the form
    const handleEditItem = (item) => {
        setCurrentItem({
            itemName: item.itemName,
            description: item.description,
            rate: item.rate,
            qty: item.qty
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
        if (!date || !supplier || !forDemand || items.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing Required Fields",
                text: "Please fill in Quotation No., Date, Supplier, For Demand and add at least one item",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (editingQuotation) {
            // Update existing quotation
            setQuotations(quotations.map(quo =>
                quo.id === editingQuotation.id
                    ? {
                        ...quo,
                        quotationNo,
                        date,
                        supplier,
                        forDemand,
                        person,
                        createdBy,
                        designation,
                        description,
                        items,
                        grandTotal: parseFloat(calculateGrandTotal())
                    }
                    : quo
            ));
            Swal.fire("Updated!", "Quotation updated successfully.", "success");
        } else {
            // Add new quotation
            const newQuotation = {
                id: quotations.length + 1,
                sr: quotations.length + 1,
                quotationNo,
                date,
                supplier,
                forDemand,
                person,
                createdBy,
                designation,
                description,
                items: [...items],
                grandTotal: parseFloat(calculateGrandTotal())
            };
            setQuotations([...quotations, newQuotation]);
            Swal.fire("Added!", "Quotation added successfully.", "success");
        }

        setIsSliderOpen(false);
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        if (editingQuotation) {
            return;
        } else {
            setQuotationNo(generateQuotationNo());
            setDate("");
            setSupplier("");
            setForDemand("");
            setPerson("");
            setCreatedBy("");
            setDesignation("");
            setDescription("");
            setItems([]);
            setCurrentItem({ itemName: "", description: "", rate: "", qty: 1 });
            setEditingItemId(null); // Add this
            setEditingQuotation(null);
        }
    };

    // Handle edit click
    const handleEditClick = (quotation) => {
        setEditingQuotation(quotation);
        setQuotationNo(quotation.quotationNo);
        setDate(quotation.date);
        setSupplier(quotation.supplier);
        setForDemand(quotation.forDemand);
        setPerson(quotation.person);
        setCreatedBy(quotation.createdBy);
        setDesignation(quotation.designation);
        setDescription(quotation.description);
        setItems(quotation.items);
        setIsSliderOpen(true);
    };

    // Handle view click
    const handleViewClick = (quotation) => {
        setSelectedQuotation(quotation);
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
                    const updatedQuotations = quotations.filter((quo) => quo.id !== id)
                        .map((quo, index) => ({
                            ...quo,
                            sr: index + 1
                        }));
                    setQuotations(updatedQuotations);
                    setCurrentPage(1);

                    swalWithTailwindButtons.fire(
                        "Deleted!",
                        "Quotation deleted successfully.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Quotation is safe 🙂",
                        "error"
                    );
                }
            });
    };

    // Filter quotations based on search term
    const filteredQuotations = quotations.filter(quotation =>
        quotation.quotationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.forDemand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.person.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredQuotations.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredQuotations.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page total
    const pageTotal = currentRecords.reduce((sum, quo) => sum + quo.grandTotal, 0);

    // Handle item selection
    const handleItemSelect = (e) => {
        const selectedItem = availableItems.find(item => item.name === e.target.value);
        if (selectedItem) {
            setCurrentItem({
                ...currentItem,
                itemName: selectedItem.name,
                description: selectedItem.description,
                rate: selectedItem.price
            });
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">
                            Quotations
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by quotation no, supplier, demand..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[300px] pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            />
                        </div>

                        <button
                            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 flex items-center gap-2"
                            onClick={() => {
                                // Generate quotation number first
                                setQuotationNo(generateQuotationNo());
                                // Reset other form fields
                                setDate("");
                                setSupplier("");
                                setForDemand("");
                                setPerson("");
                                setCreatedBy("");
                                setDesignation("");
                                setDescription("");
                                setItems([]);
                                setCurrentItem({ itemName: "", description: "", rate: "", qty: 1 });
                                setEditingQuotation(null);
                                setIsSliderOpen(true);
                            }}
                        >
                            <Plus size={20} />
                            Add Quotation
                        </button>
                    </div>
                </div>

                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="max-h-screen overflow-y-auto custom-scrollbar">
                            <div className="inline-block w-full align-middle">
                                {/* Table Header */}
                                <div className="hidden lg:grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                    <div>SR#</div>
                                    <div>Quotation No.</div>
                                    <div>Date</div>
                                    <div>Supplier</div>
                                    <div>For Demand</div>
                                    <div>Person</div>
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
                                            No quotations found.
                                        </div>
                                    ) : (
                                        currentRecords.map((quotation) => (
                                            <div
                                                key={quotation.id}
                                                className="grid grid-cols-1 lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                            >
                                                <div className="font-medium text-gray-900">
                                                    {quotation.sr}
                                                </div>
                                                <div className="text-gray-900 font-medium">
                                                    {quotation.quotationNo}
                                                </div>
                                                <div className="text-gray-600">
                                                    {quotation.date}
                                                </div>
                                                <div className="text-gray-600">
                                                    {quotation.supplier}
                                                </div>
                                                <div className="text-gray-600">
                                                    {quotation.forDemand}
                                                </div>
                                                <div className="text-gray-600">
                                                    {quotation.person}
                                                </div>
                                                <div className="text-gray-900 font-semibold">
                                                    ${quotation.grandTotal.toFixed(2)}
                                                </div>
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleEditClick(quotation)}
                                                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(quotation.id)}
                                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewClick(quotation)}
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
                    <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-3 border-t bg-gray-100">
                        {/* Empty cells for first 6 columns */}
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>

                        {/* Page Total positioned exactly under TOTAL column */}
                        <div className="font-semibold text-blue-700">
                            Total: ${pageTotal.toFixed(2)}
                        </div>

                        {/* Empty cell for Actions column */}
                        <div></div>
                    </div>


                    {/* Pagination Controls */}
                    {filteredQuotations.length > 0 && (
                        <div className="grid grid-cols-[1fr_auto] items-center my-4 px-6">
                            {/* Records info on left */}
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRecord + 1} to{" "}
                                {Math.min(indexOfLastRecord, filteredQuotations.length)} of{" "}
                                {filteredQuotations.length} records
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
                                <h2 className="text-xl font-bold text-newPrimary">
                                    {editingQuotation ? "Update Quotation" : "Add New Quotation"}
                                </h2>
                                <button
                                    className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                                    onClick={() => {
                                        setIsSliderOpen(false);
                                        // Reset form completely when closing
                                        setQuotationNo("");
                                        setDate("");
                                        setSupplier("");
                                        setForDemand("");
                                        setPerson("");
                                        setCreatedBy("");
                                        setDesignation("");
                                        setDescription("");
                                        setItems([]);
                                        setCurrentItem({ itemName: "", description: "", rate: "", qty: 1 });
                                        setEditingItemId(null); // Add this
                                        setEditingQuotation(null);
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
                                                Quotation No. <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={quotationNo}
                                                onChange={(e) => setQuotationNo(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                                placeholder="e.g., QUO-2024-001"
                                                required
                                                readOnly // Make it read-only
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
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
                                                For Demand <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={forDemand}
                                                onChange={(e) => setForDemand(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="e.g., Office Renovation"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Person
                                            </label>
                                            <select
                                                value={person}
                                                onChange={(e) => setPerson(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                            >
                                                <option value="">Select Person</option>
                                                {persons.map((per, index) => (
                                                    <option key={index} value={per}>{per}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Created By
                                            </label>
                                            <input
                                                type="text"
                                                value={createdBy}
                                                onChange={(e) => setCreatedBy(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter name"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Designation
                                            </label>
                                            <input
                                                type="text"
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter designation"
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
                                        {/* Add Item Form */}
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                    Item
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
                                                    Description
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentItem.description}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    placeholder="Item description"
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
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                    Qty
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentItem.qty}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, qty: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    placeholder="1"
                                                    min="1"
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

                                        {/* Items Table */}
                                        {items.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">SR#</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Item</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Description</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Rate</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Qty</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Total</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, index) => (
                                                            <tr key={item.id} className="hover:bg-gray-50">
                                                                <td className="p-2 border-b">{index + 1}</td>
                                                                <td className="p-2 border-b">{item.itemName}</td>
                                                                <td className="p-2 border-b">{item.description}</td>
                                                                <td className="p-2 border-b">${item.rate.toFixed(2)}</td>
                                                                <td className="p-2 border-b">{item.qty}</td>
                                                                <td className="p-2 border-b font-medium">${item.total.toFixed(2)}</td>
                                                                <td className="p-3 border-b gap-2 flex">
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
                                                No items added yet. Add items using the form above.
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
                                    {editingQuotation ? "Update Quotation" : "Add Quotation"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {viewModalOpen && selectedQuotation && (
                    <QuotationView
                        quotation={selectedQuotation}
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

export default Quotation;