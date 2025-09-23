import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../components/CommanHeader";
import TableSkeleton from "./Skeleton";
import Swal from "sweetalert2";

const GatepassIn = () => {
    const [gatepasses, setGatepasses] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gatepassId, setGatepassId] = useState("");
    const [toCompany, setToCompany] = useState("");
    const [poType, setPoType] = useState("withPO"); // Default to "With PO"
    const [item, setItem] = useState("");
    const [units, setUnits] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("");
    const [againstPoNo, setAgainstPoNo] = useState("");
    const [supplier, setSupplier] = useState("");
    const [date, setDate] = useState("");
    //   const [time, setTime] = useState("");
    const [status, setStatus] = useState("Pending");
    const [editingGatepass, setEditingGatepass] = useState(null);
    const sliderRef = useRef(null);

    // Static data for gatepasses with new fields
    const staticData = [
        {
            _id: "1",
            gatepassId: "GP001",
            driverName: "Ali Khan",
            itemsCategory: "Electronics",
            supplier: "ABC Corp",
            units: "Units",
            quantity: "5",
            date: "2025-09-01",
            //   time: "14:30",

            status: true,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "2",
            gatepassId: "GP002",
            driverName: "Ahmed Raza",
            itemsCategory: "Stationery",
            supplier: "XYZ Ltd",
            units: "Packs",
            quantity: "10",
            date: "2025-09-15",
            //   time: "09:15",
            status: false,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "3",
            gatepassId: "GP003",
            driverName: "Usman Ali",
            itemsCategory: "IT Equipment",
            supplier: "Tech Solutions",
            units: "Units",
            quantity: "3",
            date: "2025-09-20",
            //   time: "16:45",
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
        setGatepasses(staticData);
        setTimeout(() => setLoading(false), 1000); // Simulate loading for 1 second
    }, []);

    // Handlers for form and table actions
    const handleAddClick = () => {
        setEditingGatepass(null);
        setGatepassId("");
        setToCompany("");
        setPoType("withPO");
        setItem("");
        setUnits("");
        setQuantity("");
        setCategory("");
        setAgainstPoNo("");
        setSupplier("");
        setDate("");
        // setTime("");
        setStatus("Pending");
        setIsSliderOpen(true);
    };

    const handleEditClick = (gatepass) => {
        setEditingGatepass(gatepass);
        setGatepassId(gatepass.gatepassId);
        setToCompany(gatepass.toCompany || "");
        setPoType(gatepass.item ? "withPO" : "withoutPO"); // Determine PO type based on presence of item
        setItem(gatepass.item || "");
        setUnits(gatepass.units || "");
        setQuantity(gatepass.quantity || "");
        setCategory(gatepass.itemsCategory || "");
        setAgainstPoNo(gatepass.againstPoNo || "");
        setSupplier(gatepass.supplier || "");
        setDate(formatDate(gatepass.date));
        // setTime(gatepass.time || "");
        setStatus(gatepass.status ? "Active" : "Inactive");
        setIsSliderOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedGatepassId = gatepassId.trim();
        const trimmedToCompany = toCompany.trim();

        if (
            !trimmedGatepassId ||
            !trimmedToCompany ||
            !date ||
            //   !time ||
            !status ||
            (poType === "withPO" && (!item || !units || !quantity || !category)) ||
            (poType === "withoutPO" && (!againstPoNo || !supplier))
        ) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "⚠️ Please fill in all required fields.",
                confirmButtonColor: "#d33",
            });
            return;
        }

        const newGatepass = {
            _id: editingGatepass ? editingGatepass._id : Date.now().toString(),
            gatepassId: trimmedGatepassId,
            toCompany: trimmedToCompany,
            driverName: "TBD", // Placeholder, can be dynamically set if needed
            itemsCategory: poType === "withPO" ? category : "",
            supplier: poType === "withoutPO" ? supplier : "",
            units: poType === "withPO" ? units : "",
            quantity: poType === "withPO" ? parseInt(quantity, 10) : "",
            againstPoNo: poType === "withoutPO" ? againstPoNo : "",
            item: poType === "withPO" ? item : "",
            date,
            //   time,
            status: status === "Active",
            createdAt: new Date().toISOString(),
        };

        if (editingGatepass) {
            setGatepasses(
                gatepasses.map((g) =>
                    g._id === editingGatepass._id ? newGatepass : g
                )
            );
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Gatepass updated successfully.",
                confirmButtonColor: "#3085d6",
            });
        } else {
            setGatepasses([...gatepasses, newGatepass]);
            Swal.fire({
                icon: "success",
                title: "Added!",
                text: "Gatepass added successfully.",
                confirmButtonColor: "#3085d6",
            });
        }

        // Reset form state
        setGatepassId("");
        setToCompany("");
        setPoType("withPO");
        setItem("");
        setUnits("");
        setQuantity("");
        setCategory("");
        setAgainstPoNo("");
        setSupplier("");
        setDate("");
        // setTime("");
        setStatus("Pending");
        setEditingGatepass(null);
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
                    setGatepasses(gatepasses.filter((g) => g._id !== id));
                    swalWithTailwindButtons.fire(
                        "Deleted!",
                        "Gatepass deleted successfully.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Gatepass is safe 🙂",
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
                            Gatepass In Details
                        </h1>
                    </div>
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
                        onClick={handleAddClick}
                    >
                        + Add Gatepass
                    </button>
                </div>

                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-y-auto lg:overflow-x-auto max-h-[400px]">
                        <div className="min-w-[1200px]">
                            {/* Table Header */}
                            <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                <div>GatePass ID</div>
                                <div>Driver Name</div>
                                <div>Items Category</div>
                                <div>Supplier</div>
                                <div>Units</div>
                                <div>Quantity</div>
                                <div>Date</div>
                                {/* <div>Time</div> */}
                                <div>Status</div>
                                <div className="text-right">Actions</div>
                            </div>

                            {/* Table Body */}
                            <div className="flex flex-col divide-y divide-gray-100">
                                {loading ? (
                                    <TableSkeleton
                                        rows={3}
                                        cols={10}
                                        className="lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto]"
                                    />
                                ) : gatepasses.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 bg-white">
                                        No gatepasses found.
                                    </div>
                                ) : (
                                    gatepasses.map((gatepass) => (
                                        <div
                                            key={gatepass._id}
                                            className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                        >
                                            <div className="font-medium text-gray-900">{gatepass.gatepassId}</div>
                                            <div className="text-gray-600">{gatepass.driverName}</div>
                                            <div className="text-gray-600">{gatepass.itemsCategory}</div>
                                            <div className="text-gray-600">{gatepass.supplier}</div>
                                            <div className="text-gray-600">{gatepass.units}</div>
                                            <div className="text-gray-600">{gatepass.quantity}</div>
                                            <div className="text-gray-500">{formatDate(gatepass.date)}</div>
                                            {/* <div className="text-gray-600">{gatepass.time}</div> */}
                                            <div className="text-gray-600">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${gatepass.status
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {gatepass.status ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(gatepass)}
                                                    className="px-3 py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <SquarePen size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(gatepass._id)}
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
                                    {editingGatepass ? "Update Gatepass" : "Add a New Gatepass"}
                                </h2>
                                <button
                                    className="text-2xl text-gray-500 hover:text-gray-700"
                                    onClick={() => {
                                        setIsSliderOpen(false);
                                        setGatepassId("");
                                        setToCompany("");
                                        setPoType("withPO");
                                        setItem("");
                                        setUnits("");
                                        setQuantity("");
                                        setCategory("");
                                        setAgainstPoNo("");
                                        setSupplier("");
                                        setDate("");
                                        // setTime("");
                                        setStatus("Pending");
                                        setEditingGatepass(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Gatepass ID <span className="text-blue-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={gatepassId}
                                        onChange={(e) => setGatepassId(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter gatepass ID"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        To <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={toCompany}
                                        onChange={(e) => setToCompany(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        required
                                    >
                                        <option value="">Select Company</option>
                                        <option value="ABC Corp">ABC Corp</option>
                                        <option value="XYZ Ltd">XYZ Ltd</option>
                                        <option value="Tech Solutions">Tech Solutions</option>
                                        <option value="Global Supplies">Global Supplies</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="block text-gray-700 font-medium">
                                        <input
                                            type="radio"
                                            value="withPO"
                                            checked={poType === "withPO"}
                                            onChange={(e) => setPoType(e.target.value)}
                                            className="mr-2"
                                        />
                                        With PO
                                    </label>
                                    <label className="block text-gray-700 font-medium">
                                        <input
                                            type="radio"
                                            value="withoutPO"
                                            checked={poType === "withoutPO"}
                                            onChange={(e) => setPoType(e.target.value)}
                                            className="mr-2"
                                        />
                                        Without PO
                                    </label>
                                </div>
                                {poType === "withPO" && (
                                    <>
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
                                                <option value="">Select Item </option>
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
                                                Units <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={units}
                                                onChange={(e) => setUnits(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Unit</option>
                                                <option value="Piece">Piece</option>
                                                <option value="Box">Box</option>
                                                <option value="Packet">Packet</option>
                                                <option value="Kg">Kg</option>
                                                <option value="Liters">Liters</option>
                                                <option value="Dozen">Dozen</option>
                                            </select>
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
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Electronics">Electronics</option>
                                                <option value="Stationery">Stationery</option>
                                                <option value="IT Equipment">IT Equipment</option>
                                                <option value="Furniture">Furniture</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                {poType === "withoutPO" && (
                                    <>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Against PO No. <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={againstPoNo}
                                                onChange={(e) => setAgainstPoNo(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter PO number"
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
                                    </>
                                )}
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
                                {/* <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    required
                  />
                </div> */}
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
                                    {loading ? "Saving..." : editingGatepass ? "Update Gatepass" : "Save Gatepass"}
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

export default GatepassIn;