import React, { useState } from "react";
import { Search, Award, Filter, Download, Printer, GitCompare } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import PrintComparativeStatement from "./Print/PrintComparativeStatement";
import PDFExportComparativeStatement from "./PDF/PDFExportComparativeStatement";

const ComparativeStatement = () => {
    // Main state for comparative statements
    const [statements, setStatements] = useState([
        {
            id: 1,
            sr: 1,
            statementId: "CS-2025-001",
            date: "2025-01-10",
            forDemand: "Office Renovation",
            item: "Office Chair",
            supplier: "Office Furniture Co.",
            rate: 299.99,
            qty: 10,
            totals: 2999.90,
            status: "Pending",
            specifications: "ErgoPro 300, Black",
            deliveryTime: "7 days",
            warranty: "2 years"
        },
        {
            id: 2,
            sr: 2,
            statementId: "CS-2025-001",
            date: "2025-01-10",
            forDemand: "Office Renovation",
            item: "Office Chair",
            supplier: "Furniture Express",
            rate: 275.50,
            qty: 10,
            totals: 2755.00,
            status: "Recommended",
            specifications: "Executive Chair, Brown",
            deliveryTime: "5 days",
            warranty: "1 year"
        },
        {
            id: 3,
            sr: 3,
            statementId: "CS-2025-001",
            date: "2025-01-10",
            forDemand: "Office Renovation",
            item: "Office Chair",
            supplier: "General Supplies Corp.",
            rate: 325.00,
            qty: 10,
            totals: 3250.00,
            status: "Pending",
            specifications: "Luxury Series, Black",
            deliveryTime: "10 days",
            warranty: "3 years"
        },
        {
            id: 4,
            sr: 4,
            statementId: "CS-2025-002",
            date: "2025-01-15",
            forDemand: "IT Equipment",
            item: "Laptop",
            supplier: "Tech Supplies Inc.",
            rate: 1299.99,
            qty: 5,
            totals: 6499.95,
            status: "Awarded",
            specifications: "Dell XPS 15, i7, 16GB RAM",
            deliveryTime: "3 days",
            warranty: "3 years"
        },
        {
            id: 5,
            sr: 5,
            statementId: "CS-2025-002",
            date: "2025-01-15",
            forDemand: "IT Equipment",
            item: "Laptop",
            supplier: "Electronics Hub",
            rate: 1249.99,
            qty: 5,
            totals: 6249.95,
            status: "Pending",
            specifications: "HP Spectre x360, i7, 16GB",
            deliveryTime: "5 days",
            warranty: "2 years"
        },
        {
            id: 6,
            sr: 6,
            statementId: "CS-2025-003",
            date: "2025-01-20",
            forDemand: "Monthly Supplies",
            item: "Notebooks",
            supplier: "Stationery World",
            rate: 24.99,
            qty: 50,
            totals: 1249.50,
            status: "Awarded",
            specifications: "A4 Size, 100 pages",
            deliveryTime: "2 days",
            warranty: "N/A"
        },
        {
            id: 7,
            sr: 7,
            statementId: "CS-2025-003",
            date: "2025-01-20",
            forDemand: "Monthly Supplies",
            item: "Notebooks",
            supplier: "General Supplies Corp.",
            rate: 22.50,
            qty: 50,
            totals: 1125.00,
            status: "Pending",
            specifications: "A4 Size, 80 pages",
            deliveryTime: "3 days",
            warranty: "N/A"
        },
        {
            id: 8,
            sr: 8,
            statementId: "CS-2025-004",
            date: "2025-01-25",
            forDemand: "Cleaning Supplies",
            item: "Hand Sanitizer",
            supplier: "Cleaning Supplies Ltd.",
            rate: 12.99,
            qty: 100,
            totals: 1299.00,
            status: "Recommended",
            specifications: "500ml Gel",
            deliveryTime: "2 days",
            warranty: "N/A"
        },
        {
            id: 9,
            sr: 9,
            statementId: "CS-2025-004",
            date: "2025-01-25",
            forDemand: "Cleaning Supplies",
            item: "Hand Sanitizer",
            supplier: "General Supplies Corp.",
            rate: 11.50,
            qty: 100,
            totals: 1150.00,
            status: "Pending",
            specifications: "500ml Liquid",
            deliveryTime: "3 days",
            warranty: "N/A"
        },
        {
            id: 10,
            sr: 10,
            statementId: "CS-2025-005",
            date: "2025-01-30",
            forDemand: "Furniture Purchase",
            item: "Desk",
            supplier: "Office Furniture Co.",
            rate: 449.99,
            qty: 8,
            totals: 3599.92,
            status: "Pending",
            specifications: "Standing Desk Pro",
            deliveryTime: "14 days",
            warranty: "5 years"
        }
    ]);

    // Filter states
    const [statementId, setStatementId] = useState("");
    const [date, setDate] = useState("");
    const [forDemand, setForDemand] = useState("");
    const [item, setItem] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Available options for dropdowns
    const demandOptions = [
        "Office Renovation",
        "IT Equipment",
        "Monthly Supplies",
        "Cleaning Supplies",
        "Furniture Purchase",
        "Stationery Items",
        "Electronics"
    ];

    const itemOptions = [
        "Office Chair",
        "Laptop",
        "Notebooks",
        "Hand Sanitizer",
        "Desk",
        "Monitor",
        "Keyboard",
        "Mouse",
        "Printer",
        "Whiteboard"
    ];

    const statusOptions = ["All Status", "Pending", "Recommended", "Awarded", "Rejected"];

    // Get unique statement IDs for dropdown
    const statementIds = [...new Set(statements.map(stmt => stmt.statementId))];

    // Filter statements based on selected filters
    const filteredStatements = statements.filter(statement => {
        // Filter by statement ID
        const statementIdMatch = !statementId || statement.statementId === statementId;

        // Filter by date
        const dateMatch = !date || statement.date === date;

        // Filter by for demand
        const demandMatch = !forDemand || statement.forDemand === forDemand;

        // Filter by item
        const itemMatch = !item || statement.item === item;

        // Filter by search term
        const searchMatch = !searchTerm ||
            statement.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            statement.statementId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            statement.item.toLowerCase().includes(searchTerm.toLowerCase());

        return statementIdMatch && dateMatch && demandMatch && itemMatch && searchMatch;
    });

    // Group statements by statementId for comparison view
    const groupedStatements = filteredStatements.reduce((groups, statement) => {
        const key = statement.statementId;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(statement);
        return groups;
    }, {});

    // Handle award action
    const handleAward = (statementId, supplierId) => {
        Swal.fire({
            title: "Award Supplier",
            text: `Are you sure you want to award this contract to the selected supplier?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Award",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                // Update all statements for this statementId
                const updatedStatements = statements.map(stmt => {
                    if (stmt.statementId === statementId) {
                        // Award the selected supplier, reject others
                        return {
                            ...stmt,
                            status: stmt.id === supplierId ? "Awarded" : "Rejected"
                        };
                    }
                    return stmt;
                });

                setStatements(updatedStatements);

                Swal.fire(
                    "Awarded!",
                    "Contract has been awarded to the selected supplier.",
                    "success"
                );
            }
        });
    };

    // Handle recommend action
    const handleRecommend = (statementId, supplierId) => {
        const updatedStatements = statements.map(stmt => {
            if (stmt.statementId === statementId && stmt.id === supplierId) {
                return { ...stmt, status: "Recommended" };
            }
            return stmt;
        });

        setStatements(updatedStatements);

        Swal.fire(
            "Recommended!",
            "Supplier has been recommended for award.",
            "success"
        );
    };

    // Reset all filters
    const resetFilters = () => {
        setStatementId("");
        setDate("");
        setForDemand("");
        setItem("");
        setSearchTerm("");
        setCurrentPage(1);
    };

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredStatements.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredStatements.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page totals
    const pageTotal = currentRecords.reduce((sum, stmt) => sum + stmt.totals, 0);
    const pageTotalQty = currentRecords.reduce((sum, stmt) => sum + stmt.qty, 0);

    // Export to PDF (placeholder function)
    const handleExportPDF = () => {
        setPdfModalOpen(true);
    };

    // Print (placeholder function)
    const handlePrint = () => {
        setPrintModalOpen(true);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <div className="flex gap-2">
                            <GitCompare size={28} className="text-newPrimary" />
                            <h1 className="text-2xl font-bold text-newPrimary">
                                Comparative Statement
                            </h1>
                        </div>
                        <p className="text-gray-600 mt-1">
                            Compare supplier quotations and make award decisions
                        </p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <Filter size={20} />
                            Filters
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center gap-2"
                            >
                                Reset Filters
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
                            >
                                <Download size={16} />
                                Export PDF
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
                            >
                                <Printer size={16} />
                                Print
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Statement ID Filter */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                Statement ID
                            </label>
                            <select
                                value={statementId}
                                onChange={(e) => {
                                    setStatementId(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                            >
                                <option value="">All Statements</option>
                                {statementIds.map((id, index) => (
                                    <option key={index} value={id}>
                                        {id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                            />
                        </div>

                        {/* For Demand Filter */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                For Demand
                            </label>
                            <select
                                value={forDemand}
                                onChange={(e) => {
                                    setForDemand(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                            >
                                <option value="">All Demands</option>
                                {demandOptions.map((demand, index) => (
                                    <option key={index} value={demand}>
                                        {demand}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Item Filter */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                Item
                            </label>
                            <select
                                value={item}
                                onChange={(e) => {
                                    setItem(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                            >
                                <option value="">All Items</option>
                                {itemOptions.map((itemOption, index) => (
                                    <option key={index} value={itemOption}>
                                        {itemOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Award Button Placeholder */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    if (!statementId) {
                                        Swal.fire({
                                            icon: "warning",
                                            title: "Select Statement",
                                            text: "Please select a Statement ID to award",
                                            confirmButtonColor: "#d33",
                                        });
                                        return;
                                    }
                                    // Find the lowest rate supplier for the selected statement
                                    const statementGroup = statements.filter(stmt => stmt.statementId === statementId);
                                    if (statementGroup.length > 0) {
                                        const lowestRateSupplier = statementGroup.reduce((min, stmt) =>
                                            stmt.rate < min.rate ? stmt : min
                                        );
                                        handleAward(statementId, lowestRateSupplier.id);
                                    }
                                }}
                                className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center justify-center gap-2"
                            >
                                <Award size={18} />
                                Auto Award (Lowest)
                            </button>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by supplier, statement ID, or item..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            />
                        </div>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(statementId || date || forDemand || item) && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {statementId && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                                <span className="font-medium">Statement:</span>
                                <span className="font-semibold">{statementId}</span>
                            </div>
                        )}
                        {date && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                                <span className="font-medium">Date:</span>
                                <span className="font-semibold">{date}</span>
                            </div>
                        )}
                        {forDemand && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg">
                                <span className="font-medium">Demand:</span>
                                <span className="font-semibold">{forDemand}</span>
                            </div>
                        )}
                        {item && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg">
                                <span className="font-medium">Item:</span>
                                <span className="font-semibold">{item}</span>
                            </div>
                        )}
                        <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                            <span className="text-sm">
                                {filteredStatements.length} record{filteredStatements.length !== 1 ? 's' : ''} found
                            </span>
                        </div>
                    </div>
                )}

                {/* Grouped Statements View */}
                {Object.keys(groupedStatements).length > 0 ? (
                    Object.keys(groupedStatements).map((statementId) => (
                        <div key={statementId} className="mb-6">
                            {/* Statement Group Header */}
                            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden mb-2">
                                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {statementId} - {groupedStatements[statementId][0].forDemand}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-sm text-gray-600">
                                                    Date: {groupedStatements[statementId][0].date}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    Item: {groupedStatements[statementId][0].item}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    Suppliers: {groupedStatements[statementId].length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    // Find lowest rate in this group
                                                    const lowestRate = Math.min(...groupedStatements[statementId].map(s => s.rate));
                                                    const lowestSupplier = groupedStatements[statementId].find(s => s.rate === lowestRate);
                                                    handleAward(statementId, lowestSupplier.id);
                                                }}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 text-sm"
                                            >
                                                <Award size={16} />
                                                Award Lowest
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Table for this statement group */}
                                <div className="overflow-x-auto">
                                    <div className="min-w-full">
                                        {/* Table Header */}
                                        <div className="hidden lg:grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase border-b">
                                            <div>SR#</div>
                                            <div>Supplier</div>
                                            <div>Item</div>
                                            <div>Rate</div>
                                            <div>Qty</div>
                                            <div>Totals</div>
                                            <div>Status</div>
                                            <div className="text-center">Actions</div>
                                        </div>

                                        {/* Table Rows */}
                                        <div className="flex flex-col divide-y divide-gray-100">
                                            {groupedStatements[statementId].map((statement, index) => (
                                                <div
                                                    key={statement.id}
                                                    className="grid grid-cols-1 lg:grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                                >
                                                    <div className="font-medium text-gray-900">
                                                        {statement.sr}
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-900 font-medium">
                                                            {statement.supplier}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Specs: {statement.specifications} |
                                                            Delivery: {statement.deliveryTime} |
                                                            Warranty: {statement.warranty}
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {statement.item}
                                                    </div>
                                                    <div className="text-gray-900 font-semibold">
                                                        ${statement.rate.toFixed(2)}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {statement.qty}
                                                    </div>
                                                    <div className="text-gray-900 font-bold">
                                                        ${statement.totals.toFixed(2)}
                                                    </div>
                                                    <div>
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                                            ${statement.status === 'Awarded' ? 'bg-green-100 text-green-800' :
                                                                statement.status === 'Recommended' ? 'bg-blue-100 text-blue-800' :
                                                                    statement.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                            {statement.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-center gap-3">
                                                        {statement.status !== 'Awarded' && statement.status !== 'Rejected' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleRecommend(statementId, statement.id)}
                                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs flex items-center gap-1"
                                                                    title="Recommend"
                                                                >
                                                                    Recommend
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAward(statementId, statement.id)}
                                                                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs flex items-center gap-1"
                                                                    title="Award"
                                                                >
                                                                    <Award size={12} />
                                                                    Award
                                                                </button>
                                                            </>
                                                        )}
                                                        {statement.status === 'Awarded' && (
                                                            <span className="text-xs text-green-600 font-semibold">
                                                                ✓ Awarded
                                                            </span>
                                                        )}
                                                        {statement.status === 'Rejected' && (
                                                            <span className="text-xs text-red-600 font-semibold">
                                                                ✗ Rejected
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Group Summary */}
                                <div className="bg-gray-50 px-6 py-3 border-t">
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="text-sm">
                                            <div className="text-gray-600">Lowest Rate:</div>
                                            <div className="font-bold text-green-600">
                                                ${Math.min(...groupedStatements[statementId].map(s => s.rate)).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <div className="text-gray-600">Highest Rate:</div>
                                            <div className="font-bold text-red-600">
                                                ${Math.max(...groupedStatements[statementId].map(s => s.rate)).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <div className="text-gray-600">Average Rate:</div>
                                            <div className="font-bold text-blue-600">
                                                ${(groupedStatements[statementId].reduce((sum, s) => sum + s.rate, 0) / groupedStatements[statementId].length).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <div className="text-gray-600">Awarded Status:</div>
                                            <div className="font-bold">
                                                {groupedStatements[statementId].some(s => s.status === 'Awarded') ? (
                                                    <span className="text-green-600">Awarded ✓</span>
                                                ) : (
                                                    <span className="text-yellow-600">Pending</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* Regular Table View (when no grouping) */
                    <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="max-h-screen overflow-y-auto custom-scrollbar">
                                <div className="inline-block w-full align-middle">
                                    {/* Table Header */}
                                    <div className="hidden lg:grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                        <div>SR#</div>
                                        <div>Supplier</div>
                                        <div>Item</div>
                                        <div>Rate</div>
                                        <div>Qty</div>
                                        <div>Totals</div>
                                        <div>Status</div>
                                        <div className="text-center">Actions</div>
                                    </div>

                                    <div className="flex flex-col divide-y divide-gray-100">
                                        {loading ? (
                                            <TableSkeleton
                                                rows={recordsPerPage}
                                                cols={8}
                                                className="lg:grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr]"
                                            />
                                        ) : currentRecords.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500 bg-white">
                                                <div className="mb-2">No comparative statements found.</div>
                                                <div className="text-sm">Try adjusting your filters</div>
                                            </div>
                                        ) : (
                                            currentRecords.map((statement) => (
                                                <div
                                                    key={statement.id}
                                                    className="grid grid-cols-1 lg:grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                                >
                                                    <div className="font-medium text-gray-900">
                                                        {statement.sr}
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-900 font-medium">
                                                            {statement.supplier}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Statement: {statement.statementId} |
                                                            Demand: {statement.forDemand}
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {statement.item}
                                                    </div>
                                                    <div className="text-gray-900 font-semibold">
                                                        ${statement.rate.toFixed(2)}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {statement.qty}
                                                    </div>
                                                    <div className="text-gray-900 font-bold">
                                                        ${statement.totals.toFixed(2)}
                                                    </div>
                                                    <div>
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                                            ${statement.status === 'Awarded' ? 'bg-green-100 text-green-800' :
                                                                statement.status === 'Recommended' ? 'bg-blue-100 text-blue-800' :
                                                                    statement.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                            {statement.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-center gap-3">
                                                        {statement.status !== 'Awarded' && statement.status !== 'Rejected' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleRecommend(statement.statementId, statement.id)}
                                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs"
                                                                >
                                                                    Recommend
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAward(statement.statementId, statement.id)}
                                                                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs flex items-center gap-1"
                                                                >
                                                                    <Award size={12} />
                                                                    Award
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page Totals - Separate Row */}
                        {currentRecords.length > 0 && (
                            <div className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr] items-center gap-4 px-6 py-4 border-t bg-gray-100">
                                {/* Empty cells for first 3 columns */}
                                <div></div>
                                <div></div>
                                <div className="text-right pr-4 font-semibold text-gray-700">
                                    Page Totals:
                                </div>

                                {/* Empty cell for Rate column */}
                                <div></div>

                                {/* Total Quantity */}
                                <div className="font-semibold text-blue-700">
                                    Qty: {pageTotalQty}
                                </div>

                                {/* Total Amount */}
                                <div className="font-semibold text-blue-700">
                                    Amount: ${pageTotal.toFixed(2)}
                                </div>

                                {/* Empty cells for Status and Actions */}
                                <div></div>
                                <div></div>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {filteredStatements.length > 0 && (
                            <div className="grid grid-cols-[1fr_auto] items-center my-4 px-6">
                                {/* Records info on left */}
                                <div className="text-sm text-gray-600">
                                    Showing {indexOfFirstRecord + 1} to{" "}
                                    {Math.min(indexOfLastRecord, filteredStatements.length)} of{" "}
                                    {filteredStatements.length} records
                                </div>

                                {/* Right side - Pagination */}
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
                )}

                {/* Statistics Cards */}
                {filteredStatements.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                            <div className="text-gray-600 text-sm mb-1">Total Statements</div>
                            <div className="text-2xl font-bold text-newPrimary">
                                {Object.keys(groupedStatements).length}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                            <div className="text-gray-600 text-sm mb-1">Awarded</div>
                            <div className="text-2xl font-bold text-green-600">
                                {filteredStatements.filter(s => s.status === 'Awarded').length}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                            <div className="text-gray-600 text-sm mb-1">Pending</div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {filteredStatements.filter(s => s.status === 'Pending').length}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                            <div className="text-gray-600 text-sm mb-1">Total Value</div>
                            <div className="text-2xl font-bold text-blue-600">
                                ${filteredStatements.reduce((sum, s) => sum + s.totals, 0).toFixed(2)}
                            </div>
                        </div>
                    </div>
                )}

                {printModalOpen && (
                    <PrintComparativeStatement
                        statements={filteredStatements}
                        filters={{ statementId, date, forDemand, item }}
                        onClose={() => setPrintModalOpen(false)}
                    />
                )}

                {pdfModalOpen && (
                    <PDFExportComparativeStatement
                        statements={filteredStatements}
                        filters={{ statementId, date, forDemand, item }}
                        onClose={() => setPdfModalOpen(false)}
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

export default ComparativeStatement;