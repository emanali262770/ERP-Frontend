import React, { useState } from "react";
import { Search } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";

const ProductsOpeningBalances = () => {
    // Main state for opening balances with categories
    const [openingBalances, setOpeningBalances] = useState([
        {
            id: 1,
            sr: 1,
            item: "Laptop",
            description: "Dell XPS 15",
            price: 1299.99,
            stock: 25,
            category: "Electronics",
            openingDate: "2024-01-01"
        },
        {
            id: 2,
            sr: 2,
            item: "Office Chair",
            description: "ErgoPro 300",
            price: 299.99,
            stock: 42,
            category: "Furniture",
            openingDate: "2024-01-01"
        },
        {
            id: 3,
            sr: 3,
            item: "Monitor",
            description: "Samsung 27\" 4K",
            price: 399.99,
            stock: 18,
            category: "Electronics",
            openingDate: "2024-01-15"
        },
        {
            id: 4,
            sr: 4,
            item: "Notebooks",
            description: "Premium A4",
            price: 24.99,
            stock: 150,
            category: "Stationery",
            openingDate: "2024-01-10"
        },
        {
            id: 5,
            sr: 5,
            item: "Desk",
            description: "Standing Desk Pro",
            price: 449.99,
            stock: 12,
            category: "Furniture",
            openingDate: "2024-01-20"
        },
        {
            id: 6,
            sr: 6,
            item: "Router",
            description: "TP-Link Archer AX50",
            price: 129.99,
            stock: 30,
            category: "IT Equipment",
            openingDate: "2024-02-01"
        },
        {
            id: 7,
            sr: 7,
            item: "Keyboard",
            description: "Logitech MX Keys",
            price: 99.99,
            stock: 45,
            category: "IT Equipment",
            openingDate: "2024-02-05"
        },
        {
            id: 8,
            sr: 8,
            item: "Mouse",
            description: "Logitech MX Master 3",
            price: 89.99,
            stock: 38,
            category: "IT Equipment",
            openingDate: "2024-02-05"
        },
        {
            id: 9,
            sr: 9,
            item: "Printer Paper",
            description: "A4 80gsm",
            price: 8.99,
            stock: 200,
            category: "Office Supplies",
            openingDate: "2024-01-25"
        },
        {
            id: 10,
            sr: 10,
            item: "Hand Sanitizer",
            description: "500ml Gel",
            price: 12.99,
            stock: 85,
            category: "Cleaning Supplies",
            openingDate: "2024-01-30"
        },
        {
            id: 11,
            sr: 11,
            item: "Desk Lamp",
            description: "LED Adjustable",
            price: 49.99,
            stock: 25,
            category: "Office Supplies",
            openingDate: "2024-02-10"
        },
        {
            id: 12,
            sr: 12,
            item: "Whiteboard",
            description: "4x6 Feet Magnetic",
            price: 89.99,
            stock: 8,
            category: "Office Supplies",
            openingDate: "2024-02-15"
        }
    ]);

    // Filter states
    const [itemCategory, setItemCategory] = useState("");
    const [openingDate, setOpeningDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Item categories for dropdown (extracted from data)
    const categories = [
        "All Categories",
        "Electronics",
        "Furniture",
        "Stationery",
        "IT Equipment",
        "Office Supplies",
        "Cleaning Supplies"
    ];

    // Filter products based on selected filters
    const filteredProducts = openingBalances.filter(product => {
        // Filter by category
        let categoryMatch = true;
        if (itemCategory && itemCategory !== "All Categories") {
            categoryMatch = product.category === itemCategory;
        }

        // Filter by date
        let dateMatch = true;
        if (openingDate) {
            dateMatch = product.openingDate === openingDate;
        }

        return categoryMatch && dateMatch;
    });

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredProducts.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredProducts.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page totals
    const pageStockTotal = currentRecords.reduce((sum, product) => sum + product.stock, 0);
    const pageValueTotal = currentRecords.reduce((sum, product) => sum + (product.price * product.stock), 0);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">
                            Products Opening Balances
                        </h1>
                        <p className="text-gray-600 mt-1">
                            View and manage opening stock balances for products
                        </p>
                    </div>
                </div>

                {/* Filters Section - Both Filters Visible */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Item Category Filter */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Item Category
                            </label>
                            <select
                                value={itemCategory}
                                onChange={(e) => {
                                    setItemCategory(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Opening Date Filter - NOW VISIBLE */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Opening Date
                            </label>
                            <input
                                type="date"
                                value={openingDate}
                                onChange={(e) => {
                                    setOpeningDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            />
                        </div>

                        {/* Reset Filters Button */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setItemCategory("");
                                    setOpeningDate("");
                                    setCurrentPage(1);
                                }}
                                className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(itemCategory || openingDate) && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {itemCategory && itemCategory !== "All Categories" && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                                <span className="font-medium">Category:</span>
                                <span className="font-semibold">{itemCategory}</span>
                            </div>
                        )}
                        {openingDate && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                                <span className="font-medium">Date:</span>
                                <span className="font-semibold">
                                    {new Date(openingDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        )}
                        <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                            <span className="text-sm">
                                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                            </span>
                        </div>
                    </div>
                )}

                {/* Products Table */}
                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="max-h-screen overflow-y-auto custom-scrollbar">
                            <div className="inline-block w-full align-middle">
                                {/* Table Header */}
                                <div className="hidden lg:grid grid-cols-[0.5fr_1fr_1.5fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                    <div>SR#</div>
                                    <div>Item</div>
                                    <div>Description</div>
                                    <div>Price</div>
                                    <div>Stock</div>
                                </div>

                                <div className="flex flex-col divide-y divide-gray-100">
                                    {loading ? (
                                        <TableSkeleton
                                            rows={recordsPerPage}
                                            cols={5}
                                            className="lg:grid-cols-[0.5fr_1fr_1.5fr_1fr_1fr]"
                                        />
                                    ) : currentRecords.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 bg-white">
                                            <div className="mb-2">No products found.</div>
                                            <div className="text-sm">Try adjusting your filters</div>
                                        </div>
                                    ) : (
                                        currentRecords.map((product) => (
                                            <div
                                                key={product.id}
                                                className="grid grid-cols-1 lg:grid-cols-[0.5fr_1fr_1.5fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                            >
                                                <div className="font-medium text-gray-900">
                                                    {product.sr}
                                                </div>
                                                <div className="text-gray-900 font-medium">
                                                    {product.item}
                                                </div>
                                                <div className="text-gray-600">
                                                    {product.description}
                                                </div>
                                                <div className="text-gray-900 font-semibold">
                                                    ${product.price.toFixed(2)}
                                                </div>
                                                <div className="text-gray-900 font-medium">
                                                    <span className={`px-3 py-1 rounded-full text-xs ${product.stock > 50 ? 'bg-green-100 text-green-800' : product.stock > 20 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {product.stock} units
                                                    </span>
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
                        <div className="grid grid-cols-[0.5fr_1fr_1.5fr_1fr_1fr] items-center gap-4 px-6 py-4 border-t bg-gray-100">
                            {/* Empty cells for first 3 columns */}
                            <div></div>
                            <div></div>
                            <div></div>

                            {/* Total Value */}
                            <div className="font-semibold text-blue-700">
                                Total: ${pageValueTotal.toFixed(2)}
                            </div>

                            {/* Total Stock */}
                            <div className="font-semibold text-blue-700">
                                Stock: {pageStockTotal} units
                            </div>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredProducts.length > 0 && (
                        <div className="grid grid-cols-[1fr_auto] items-center my-4 px-6">
                            {/* Records info on left */}
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRecord + 1} to{" "}
                                {Math.min(indexOfLastRecord, filteredProducts.length)} of{" "}
                                {filteredProducts.length} products
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

                {/* Summary Stats */}
                {filteredProducts.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                            <div className="text-gray-600 text-sm mb-1">Total Products</div>
                            <div className="text-2xl font-bold text-newPrimary">{filteredProducts.length}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                            <div className="text-gray-600 text-sm mb-1">Total Stock</div>
                            <div className="text-2xl font-bold text-green-600">
                                {filteredProducts.reduce((sum, product) => sum + product.stock, 0)} units
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                            <div className="text-gray-600 text-sm mb-1">Total Value</div>
                            <div className="text-2xl font-bold text-blue-600">
                                ${filteredProducts.reduce((sum, product) => sum + (product.price * product.stock), 0).toFixed(2)}
                            </div>
                        </div>
                    </div>
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

export default ProductsOpeningBalances;