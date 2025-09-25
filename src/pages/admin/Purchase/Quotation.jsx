import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const Quotation = () => {
    const [quotations, setQuotations] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [quotationNo, setQuotationNo] = useState("");
    const [quotationDate, setQuotationDate] = useState("");
    const [supplier, setSupplier] = useState("");
    const [forDemand, setForDemand] = useState("");
    const [person, setPerson] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [designation, setDesignation] = useState("");
    const [itemsList, setItemsList] = useState([]);
    const [itemName, setItemName] = useState("");
    const [itemQuantity, setItemQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [total, setTotal] = useState("");
    const [editingQuotation, setEditingQuotation] = useState(null);
    const [errors, setErrors] = useState({});
    const sliderRef = useRef(null);

    // Static data for quotations
    const staticData = [
        {
            _id: "1",
            quotationNo: "Q001",
            quotationDate: "2025-09-25",
            supplier: "ABC Corp",
            forDemand: "Laptops (5)",
            person: "John Doe",
            createdBy: "Jane Smith",
            designation: "Manager",
            items: [{ name: "Dell XPS 15", qty: 5 }],
            price: "1500",
            total: "7500",
            createdAt: new Date().toISOString(),
        },
        {
            _id: "2",
            quotationNo: "Q002",
            quotationDate: "2025-09-24",
            supplier: "XYZ Ltd",
            forDemand: "Printers (2)",
            person: "Alice Brown",
            createdBy: "Bob Johnson",
            designation: "Supervisor",
            items: [{ name: "HP LaserJet", qty: 2 }],
            price: "300",
            total: "600",
            createdAt: new Date().toISOString(),
        },
        {
            _id: "3",
            quotationNo: "Q003",
            quotationDate: "2025-09-23",
            supplier: "Tech Solutions",
            forDemand: "Monitors (10)",
            person: "Henry Smith",
            createdBy: "Emma Wilson",
            designation: "Coordinator",
            items: [{ name: "Samsung 27\"", qty: 10 }],
            price: "200",
            total: "2000",
            createdAt: new Date().toISOString(),
        },
    ];

    // Load static data on mount
    useEffect(() => {
        setLoading(true);
        setQuotations(staticData);
        setTimeout(() => setLoading(false), 1000); // Simulate loading for 1 second
    }, []);

    // Reset form fields
    const resetForm = () => {
        setQuotationNo("");
        setQuotationDate("");
        setSupplier("");
        setForDemand("");
        setPerson("");
        setCreatedBy("");
        setDesignation("");
        setItemsList([]);
        setItemName("");
        setItemQuantity("");
        setPrice("");
        setTotal("");
        setEditingQuotation(null);
        setErrors({});
        setIsSliderOpen(false);
    };

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};
        const trimmedQuotationNo = quotationNo.trim();
        const trimmedQuotationDate = quotationDate.trim();
        const trimmedSupplier = supplier.trim();
        const trimmedForDemand = forDemand.trim();
        const trimmedPerson = person.trim();
        const trimmedCreatedBy = createdBy.trim();
        const trimmedDesignation = designation.trim();
        const trimmedPrice = price.trim();
        const trimmedTotal = total.trim();
        const parsedPrice = parseFloat(price);
        const parsedTotal = parseFloat(total);

        if (!trimmedQuotationNo) newErrors.quotationNo = "Quotation No. is required";
        if (!trimmedQuotationDate) newErrors.quotationDate = "Quotation Date is required";
        if (!trimmedSupplier) newErrors.supplier = "Supplier is required";
        if (!trimmedForDemand) newErrors.forDemand = "For Demand is required";
        if (!trimmedPerson) newErrors.person = "Person is required";
        if (!trimmedCreatedBy) newErrors.createdBy = "Created By is required";
        if (!trimmedDesignation) newErrors.designation = "Designation is required";
        if (itemsList.length === 0) newErrors.itemsList = "At least one item is required";
        if (!trimmedPrice || isNaN(parsedPrice) || parsedPrice <= 0) {
            newErrors.price = "Price must be a positive number";
        }
        if (!trimmedTotal || isNaN(parsedTotal) || parsedTotal <= 0) {
            newErrors.total = "Total must be a positive number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handlers for form and table actions
    const handleAddQuotation = () => {
        resetForm();
        setIsSliderOpen(true);
    };

    const handleEditClick = (quotation) => {
        setEditingQuotation(quotation);
        setQuotationNo(quotation.quotationNo);
        setQuotationDate(quotation.quotationDate);
        setSupplier(quotation.supplier);
        setForDemand(quotation.forDemand);
        setPerson(quotation.person);
        setCreatedBy(quotation.createdBy);
        setDesignation(quotation.designation);
        setItemsList(quotation.items);
        setItemName("");
        setItemQuantity("");
        setPrice(quotation.price);
        setTotal(quotation.total);
        setErrors({});
        setIsSliderOpen(true);
    };

    const handleAddItem = () => {
        const trimmedItemName = itemName.trim();
        const parsedItemQuantity = parseInt(itemQuantity, 10);

        if (!trimmedItemName || !itemQuantity || isNaN(parsedItemQuantity) || parsedItemQuantity <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Item",
                text: "Please enter a valid item name and a positive quantity.",
                confirmButtonColor: "#d33",
            });
            return;
        }

        setItemsList([...itemsList, { name: trimmedItemName, qty: parsedItemQuantity }]);
        setItemName("");
        setItemQuantity("");
        setErrors((prev) => ({ ...prev, itemsList: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire({
                icon: "warning",
                title: "Missing or Invalid Fields",
                html: `Please correct the following errors:<br/><ul class='list-disc pl-5'>${Object.values(errors)
                    .map((err) => `<li>${err}</li>`)
                    .join("")}</ul>`,
                confirmButtonColor: "#d33",
            });
            return;
        }

        const newQuotation = {
            _id: editingQuotation ? editingQuotation._id : Date.now().toString(),
            quotationNo: quotationNo.trim(),
            quotationDate: quotationDate.trim(),
            supplier: supplier.trim(),
            forDemand: forDemand.trim(),
            person: person.trim(),
            createdBy: createdBy.trim(),
            designation: designation.trim(),
            items: itemsList,
            price: price.trim(),
            total: total.trim(),
            createdAt: new Date().toISOString(),
        };

        if (editingQuotation) {
            setQuotations(
                quotations.map((q) =>
                    q._id === editingQuotation._id ? newQuotation : q
                )
            );
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Quotation updated successfully.",
                confirmButtonColor: "#3085d6",
            });
        } else {
            setQuotations([...quotations, newQuotation]);
            Swal.fire({
                icon: "success",
                title: "Added!",
                text: "Quotation added successfully.",
                confirmButtonColor: "#3085d6",
            });
        }

        resetForm();
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
                    setQuotations((prev) => prev.filter((q) => q._id !== id));
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

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">
                            Quotation Details
                        </h1>
                    </div>
                    <button
                        onClick={handleAddQuotation}
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors"
                    >
                        Add Quotation
                    </button>
                </div>

                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-y-auto lg:overflow-x-auto max-h-[400px]">
                        <div className="min-w-[1200px]">
                            {/* Table Header */}
                            <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_3fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                <div>Quotation No.</div>
                                <div>Date</div>
                                <div>Supplier</div>
                                <div>For Demand</div>
                                <div>Person</div>
                                <div>Created By</div>
                                <div>Designation</div>
                                <div>Items</div>
                                <div>Price</div>
                                <div>Actions</div>
                            </div>

                            {/* Table Body */}
                            <div className="flex flex-col divide-y divide-gray-100">
                                {loading ? (
                                    <TableSkeleton
                                        rows={3}
                                        cols={10}
                                        className="lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_3fr_1fr_1fr]"
                                    />
                                ) : quotations.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 bg-white">
                                        No quotations found.
                                    </div>
                                ) : (
                                    quotations.map((quotation) => (
                                        <div
                                            key={quotation._id}
                                            className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_3fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                        >
                                            <div className="text-gray-600">{quotation.quotationNo}</div>
                                            <div className="text-gray-600">{quotation.quotationDate}</div>
                                            <div className="text-gray-600">{quotation.supplier}</div>
                                            <div className="text-gray-600">{quotation.forDemand}</div>
                                            <div className="text-gray-600">{quotation.person}</div>
                                            <div className="text-gray-600">{quotation.createdBy}</div>
                                            <div className="text-gray-600">{quotation.designation}</div>
                                            <div className="text-gray-600">
                                                <div className="flex flex-wrap gap-2">
                                                    {quotation.items.map((item, idx) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <span
                                                                className="px-3 py-1 rounded-full text-xs font-medium"
                                                                style={{
                                                                    backgroundColor: `hsl(${(idx * 70) % 360}, 80%, 85%)`,
                                                                    color: `hsl(${(idx * 70) % 360}, 40%, 25%)`,
                                                                }}
                                                            >
                                                                {item.name}
                                                            </span>
                                                            <span
                                                                className="px-3 py-1 rounded-full text-xs font-medium"
                                                                style={{
                                                                    backgroundColor: `hsl(${(idx * 70 + 35) % 360}, 80%, 85%)`,
                                                                    color: `hsl(${(idx * 70 + 35) % 360}, 40%, 25%)`,
                                                                }}
                                                            >
                                                                Qty: {item.qty}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-gray-600">{quotation.price}</div>
                                            <div>
                                                <button
                                                    onClick={() => handleEditClick(quotation)}
                                                    className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <SquarePen size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(quotation._id)}
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
                                    {editingQuotation ? "Update Quotation" : "Add a New Quotation"}
                                </h2>
                                <button
                                    className="text-2xl text-gray-500 hover:text-gray-700"
                                    onClick={resetForm}
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Quotation No */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Quotation No. <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={quotationNo}
                                        onChange={(e) => setQuotationNo(e.target.value)}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.quotationNo
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-newPrimary"
                                        }`}
                                        placeholder="Enter quotation number"
                                        required
                                    />
                                    {errors.quotationNo && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.quotationNo}
                                        </p>
                                    )}
                                </div>

                                {/* Quotation Date */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Quotation Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={quotationDate}
                                        onChange={(e) => setQuotationDate(e.target.value)}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.quotationDate
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-newPrimary"
                                        }`}
                                        required
                                    />
                                    {errors.quotationDate && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.quotationDate}
                                        </p>
                                    )}
                                </div>

                                {/* Supplier */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Supplier <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={supplier}
                                        onChange={(e) => setSupplier(e.target.value)}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.supplier
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-newPrimary"
                                        }`}
                                        required
                                    >
                                        <option value="">Select Supplier</option>
                                        <option value="supplier1">ABC Traders</option>
                                        <option value="supplier2">XYZ Enterprises</option>
                                        <option value="supplier3">Global Supplies</option>
                                    </select>
                                </div>

                                {/* For Demand */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        For Demand <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={forDemand}
                                        onChange={(e) => setForDemand(e.target.value)}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.forDemand
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-newPrimary"
                                        }`}
                                        required
                                    >
                                        <option value="">Select Demand Item</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Person */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Person <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={person}
                                        onChange={(e) => setPerson(e.target.value)}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.person
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-newPrimary"
                                        }`}
                                        placeholder="Enter person name"
                                        required
                                    />
                                </div>

                                {/* Created By */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Created By <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={createdBy}
                                        onChange={(e) => setCreatedBy(e.target.value)}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.createdBy
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-newPrimary"
                                        }`}
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        <option value="employee1">John Doe</option>
                                        <option value="employee2">Maryum Akmal</option>
                                        <option value="employee3">Ali Khan</option>
                                        <option value="employee4">Ayesha Ahmed</option>
                                    </select>
                                </div>

                                {/* Designation */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Designation <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                            errors.designation
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-newPrimary"
                                        }`}
                                        placeholder="Enter designation"
                                        required
                                    />
                                </div>

                                {/* Items Section */}
                                <div className="space-y-3">
                                    <div className="flex gap-2 flex-wrap items-end">
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Item Name <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={itemName}
                                                onChange={(e) => setItemName(e.target.value)}
                                                className="w-full p-3 border rounded-md"
                                            >
                                                <option value="">Select Item</option>
                                                <option value="Mobile">Mobile</option>
                                                <option value="Laptop">Laptop</option>
                                                <option value="Accessories">Accessories</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="flex-1 min-w-[100px]">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={itemQuantity}
                                                onChange={(e) => setItemQuantity(e.target.value)}
                                                className="w-full p-3 border rounded-md"
                                                placeholder="Qty"
                                                min="1"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[100px]">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Price <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="w-full p-3 border rounded-md"
                                                placeholder="Price"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[100px]">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Total
                                            </label>
                                            <input
                                                type="number"
                                                value={itemQuantity && price ? itemQuantity * price : ""}
                                                readOnly
                                                className="w-full p-3 border rounded-md bg-gray-100"
                                                placeholder="Auto-calculated"
                                            />
                                        </div>

                                        <div className="min-w-[100px]">
                                            <button
                                                type="button"
                                                onClick={handleAddItem}
                                                disabled={!itemName || !itemQuantity || !price}
                                                className="h-12 px-4 bg-newPrimary text-white rounded-lg hover:bg-newPrimary/80 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    {itemsList.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                                <thead className="bg-gray-100 text-gray-600 text-sm">
                                                    <tr>
                                                        <th className="px-4 py-2 border-b">Sr #</th>
                                                        <th className="px-4 py-2 border-b">Item Name</th>
                                                        <th className="px-4 py-2 border-b">Quantity</th>
                                                        <th className="px-4 py-2 border-b">Price</th>
                                                        <th className="px-4 py-2 border-b">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-700 text-sm">
                                                    {itemsList.map((item, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="px-4 py-2 border-b text-center">
                                                                {idx + 1}
                                                            </td>
                                                            <td className="px-4 py-2 border-b">{item.name}</td>
                                                            <td className="px-4 py-2 border-b text-center">
                                                                {item.qty}
                                                            </td>
                                                            <td className="px-4 py-2 border-b text-center">
                                                                ${item.price}
                                                            </td>
                                                            <td className="px-4 py-2 border-b text-center font-medium">
                                                                ${item.total}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                                >
                                    {loading
                                        ? "Saving..."
                                        : editingQuotation
                                        ? "Update Quotation"
                                        : "Save Quotation"}
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

export default Quotation;