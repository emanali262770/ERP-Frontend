import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const Estimation = () => {
    const [estimations, setEstimations] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statementId, setStatementId] = useState("");
    const [supplier, setSupplier] = useState("");
    const [item, setItem] = useState("");
    const [forDemand, setForDemand] = useState("");
    const [rate, setRate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [total, setTotal] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("Pending");
    const [editingEstimation, setEditingEstimation] = useState(null);
    const sliderRef = useRef(null);

    // Static data for estimations
    const staticData = [
        {
            _id: "1",
            statementId: "EST001",
            supplier: "ABC Corp",
            item: "Dell XPS 15",
            forDemand: "Laptops (5)",
            rate: "1500",
            quantity: "5",
            total: "7500",
            date: "2025-09-01",
            status: true,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "2",
            statementId: "EST002",
            supplier: "XYZ Ltd",
            item: "HP LaserJet",
            forDemand: "Printers (2)",
            rate: "300",
            quantity: "2",
            total: "600",
            date: "2025-09-15",
            status: false,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "3",
            statementId: "EST003",
            supplier: "Tech Solutions",
            item: "Samsung 27\"",
            forDemand: "Monitors (10)",
            rate: "200",
            quantity: "10",
            total: "2000",
            date: "2025-09-20",
            status: true,
            createdAt: new Date().toISOString(),
        },
    ];

    // Format date for display
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
    };

    // Load static data on mount
    useEffect(() => {
        setLoading(true);
        setEstimations(staticData);
        setTimeout(() => setLoading(false), 1000); // Simulate loading for 1 second
    }, []);

    // Handlers for form and table actions
    const handleAddClick = () => {
        setEditingEstimation(null);
        setStatementId("");
        setSupplier("");
        setItem("");
        setForDemand("");
        setRate("");
        setQuantity("");
        setTotal("");
        setDate("");
        setStatus("Pending");
        setIsSliderOpen(true);
    };

    const handleEditClick = (estimation) => {
        setEditingEstimation(estimation);
        setStatementId(estimation.statementId);
        setSupplier(estimation.supplier);
        setItem(estimation.item);
        setForDemand(estimation.forDemand);
        setRate(estimation.rate);
        setQuantity(estimation.quantity);
        setTotal(estimation.total);
        setDate(formatDate(estimation.date));
        setStatus(estimation.status ? "Active" : "Inactive");
        setIsSliderOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedStatementId = statementId.trim();
        const trimmedSupplier = supplier.trim();
        const trimmedItem = item.trim();
        const trimmedForDemand = forDemand.trim();
        const trimmedRate = rate.trim();
        const trimmedQuantity = quantity.trim();
        const trimmedTotal = total.trim();

        if (
            !trimmedStatementId ||
            !trimmedSupplier ||
            !trimmedItem ||
            !trimmedForDemand ||
            !trimmedRate ||
            !trimmedQuantity ||
            !trimmedTotal ||
            !date ||
            !status
        ) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "⚠️ Please fill in all required fields.",
                confirmButtonColor: "#d33",
            });
            return;
        }

        const newEstimation = {
            _id: editingEstimation ? editingEstimation._id : Date.now().toString(),
            statementId: trimmedStatementId,
            supplier: trimmedSupplier,
            item: trimmedItem,
            forDemand: trimmedForDemand,
            rate: trimmedRate,
            quantity: parseInt(trimmedQuantity, 10),
            total: trimmedTotal,
            date,
            status: status === "Active",
            createdAt: new Date().toISOString(),
        };

        if (editingEstimation) {
            setEstimations(
                estimations.map((e) =>
                    e._id === editingEstimation._id ? newEstimation : e
                )
            );
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Estimation updated successfully.",
                confirmButtonColor: "#3085d6",
            });
        } else {
            setEstimations([...estimations, newEstimation]);
            Swal.fire({
                icon: "success",
                title: "Added!",
                text: "Estimation added successfully.",
                confirmButtonColor: "#3085d6",
            });
        }

        // Reset form state
        setStatementId("");
        setSupplier("");
        setItem("");
        setForDemand("");
        setRate("");
        setQuantity("");
        setTotal("");
        setDate("");
        setStatus("Pending");
        setEditingEstimation(null);
        setIsSliderOpen(false);
    };

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
                    setEstimations(estimations.filter((e) => e._id !== id));
                    swalWithTailwindButtons.fire(
                        "Deleted!",
                        "Estimation deleted successfully.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Estimation is safe 🙂",
                        "error"
                    );
                }
            });
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">
                            Estimation Details
                        </h1>
                    </div>
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
                        onClick={handleAddClick}
                    >
                        + Add Estimation
                    </button>
                </div>

                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-y-auto lg:overflow-x-auto max-h-[400px]">
                        <div className="min-w-[1200px]">
                            {/* Table Header */}
                            <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                <div>Statement ID</div>
                                <div>Supplier</div>
                                <div>Item</div>
                                <div>For Demand</div>
                                <div>Rate</div>
                                <div>Quantity</div>
                                <div>Total</div>
                                <div>Date</div>
                                <div>Status</div>
                                <div>Actions</div>
                            </div>

                            {/* Table Body */}
                            <div className="flex flex-col divide-y divide-gray-100">
                                {loading ? (
                                    <TableSkeleton
                                        rows={3}
                                        cols={10}
                                        className="lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto]"
                                    />
                                ) : estimations.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 bg-white">
                                        No estimations found.
                                    </div>
                                ) : (
                                    estimations.map((estimation) => (
                                        <div
                                            key={estimation._id}
                                            className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                        >
                                            <div className="font-medium text-gray-900">{estimation.statementId}</div>
                                            <div className="text-gray-600">{estimation.supplier}</div>
                                            <div className="text-gray-600">{estimation.item}</div>
                                            <div className="text-gray-600">{estimation.forDemand}</div>
                                            <div className="text-gray-600">{estimation.rate}</div>
                                            <div className="text-gray-600">{estimation.quantity}</div>
                                            <div className="text-gray-600">{estimation.total}</div>
                                            <div className="text-gray-500">{formatDate(estimation.date)}</div>
                                            <div className="text-gray-600">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${estimation.status
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {estimation.status ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(estimation)}
                                                    className="px-3 py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <SquarePen size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(estimation._id)}
                                                    className="px-3 py-1 text-sm rounded text-red-600 hover:bg-red-50 transition-colors"
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

                {isSliderOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
                        <div
                            ref={sliderRef}
                            className="w-full max-w-md bg-white p-4 h-full overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-newPrimary">
                                    {editingEstimation ? "Update Estimation" : "Add a New Estimation"}
                                </h2>
                                <button
                                    className="text-2xl text-gray-500 hover:text-gray-700"
                                    onClick={() => {
                                        setIsSliderOpen(false);
                                        setStatementId("");
                                        setSupplier("");
                                        setItem("");
                                        setForDemand("");
                                        setRate("");
                                        setQuantity("");
                                        setTotal("");
                                        setDate("");
                                        setStatus("Pending");
                                        setEditingEstimation(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Statement ID <span className="text-blue-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={statementId}
                                        onChange={(e) => setStatementId(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter statement ID"
                                        required
                                    />
                                </div>
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
                                        <option value="ABC Corp">ABC Corp</option>
                                        <option value="XYZ Ltd">XYZ Ltd</option>
                                        <option value="Tech Solutions">Tech Solutions</option>
                                        <option value="Global Supplies">Global Supplies</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Item <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={item}
                                        onChange={(e) => setItem(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        required
                                    >
                                        <option value="">Select Item</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Desktop">Desktop</option>
                                        <option value="Printer">Printer</option>
                                        <option value="Scanner">Scanner</option>
                                        <option value="Projector">Projector</option>
                                        <option value="Stationery">Stationery</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        For Demand <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={forDemand}
                                        onChange={(e) => setForDemand(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        required
                                    >
                                        <option value="">Select Item</option>
                                        <option value="Office Supplies">Office Supplies</option>
                                        <option value="IT Equipment">IT Equipment</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Raw Materials">Raw Materials</option>
                                        <option value="Services">Services</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Rate <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter rate"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter quantity"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Total <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={total}
                                        onChange={(e) => setTotal(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter total"
                                        min="0"
                                        step="0.01"
                                        required
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
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                                >
                                    {loading ? "Saving..." : editingEstimation ? "Update Estimation" : "Save Estimation"}
                                </button>
                            </form>
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

export default Estimation;