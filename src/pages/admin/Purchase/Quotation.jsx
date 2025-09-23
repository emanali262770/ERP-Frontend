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
    const [supplier, setSupplier] = useState("");
    const [forDemand, setForDemand] = useState("");
    const [person, setPerson] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [designation, setDesignation] = useState("");
    const [item, setItem] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [total, setTotal] = useState("");
    const [editingQuotation, setEditingQuotation] = useState(null);
    const sliderRef = useRef(null);

    // Static data for quotations
    const staticData = [
        {
            _id: "1",
            quotationNo: "Q001",
            supplier: "ABC Corp",
            forDemand: "Laptops (5)",
            person: "John Doe",
            createdBy: "Jane Smith",
            designation: "Manager",
            item: "Dell XPS 15",
            price: "1500",
            quantity: "5",
            total: "7500",
            createdAt: new Date().toISOString(),
        },
        {
            _id: "2",
            quotationNo: "Q002",
            supplier: "XYZ Ltd",
            forDemand: "Printers (2)",
            person: "Alice Brown",
            createdBy: "Bob Johnson",
            designation: "Supervisor",
            item: "HP LaserJet",
            price: "300",
            quantity: "2",
            total: "600",
            createdAt: new Date().toISOString(),
        },
        {
            _id: "3",
            quotationNo: "Q003",
            supplier: "Tech Solutions",
            forDemand: "Monitors (10)",
            person: "Henry Smith",
            createdBy: "Emma Wilson",
            designation: "Coordinator",
            item: "Samsung 27\"",
            price: "200",
            quantity: "10",
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

    // Handlers for form and table actions
    const handleEditClick = (quotation) => {
        setEditingQuotation(quotation);
        setQuotationNo(quotation.quotationNo);
        setSupplier(quotation.supplier);
        setForDemand(quotation.forDemand);
        setPerson(quotation.person);
        setCreatedBy(quotation.createdBy);
        setDesignation(quotation.designation);
        setItem(quotation.item);
        setPrice(quotation.price);
        setQuantity(quotation.quantity);
        setTotal(quotation.total);
        setIsSliderOpen(true);
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

    const handleAddQuotation = () => {
        setEditingQuotation(null);
        setQuotationNo("");
        setSupplier("");
        setForDemand("");
        setPerson("");
        setCreatedBy("");
        setDesignation("");
        setItem("");
        setPrice("");
        setQuantity("");
        setTotal("");
        setIsSliderOpen(true);
    };

const handleSubmit = (e) => {
  e.preventDefault();

  const trimmedQuotationNo = quotationNo.trim();
  const trimmedSupplier = supplier.trim();
  const trimmedForDemand = forDemand.trim();
  const trimmedPerson = person.trim();
  const trimmedCreatedBy = createdBy.trim();
  const trimmedDesignation = designation.trim();
  const trimmedItem = item.trim();
  const trimmedPrice = price.trim();
  const trimmedQuantity = quantity.trim();
  const trimmedTotal = total.trim();

  if (
    !trimmedQuotationNo ||
    !trimmedSupplier ||
    !trimmedForDemand ||
    !trimmedPerson ||
    !trimmedCreatedBy ||
    !trimmedDesignation ||
    !trimmedItem ||
    !trimmedPrice ||
    !trimmedQuantity ||
    !trimmedTotal
  ) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "⚠️ All fields are required.",
      confirmButtonColor: "#d33",
    });
    return;
  }

  const newQuotation = {
    _id: editingQuotation ? editingQuotation._id : Date.now().toString(),
    quotationNo: trimmedQuotationNo,
    supplier: trimmedSupplier,
    forDemand: trimmedForDemand,
    person: trimmedPerson,
    createdBy: trimmedCreatedBy,
    designation: trimmedDesignation,
    item: trimmedItem,
    price: trimmedPrice,
    quantity: trimmedQuantity,
    total: trimmedTotal,
    createdAt: new Date().toISOString(),
  };

  if (editingQuotation) {
    // ✅ Update existing quotation in state
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
    // ✅ Add new quotation in state
    setQuotations([...quotations, newQuotation]);

    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Quotation added successfully.",
      confirmButtonColor: "#3085d6",
    });
  }

  // Reset form state
  setQuotationNo("");
  setSupplier("");
  setForDemand("");
  setPerson("");
  setCreatedBy("");
  setDesignation("");
  setItem("");
  setPrice("");
  setQuantity("");
  setTotal("");
  setEditingQuotation(null);
  setIsSliderOpen(false);
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
                            <div className="hidden lg:grid grid-cols-11 gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                <div>Quotation No.</div>
                                <div>Supplier</div>
                                <div>For Demand</div>
                                <div>Person</div>
                                <div>Created By</div>
                                <div>Designation</div>
                                <div>Item</div>
                                <div>Price</div>
                                <div>Quantity</div>
                                <div>Total</div>
                                <div className="text-right">Actions</div>
                            </div>

                            {/* Table Body */}
                            <div className="flex flex-col divide-y divide-gray-100">
                                {loading ? (
                                    <TableSkeleton
                                        rows={3}
                                        cols={11}
                                        className="lg:grid-cols-11"
                                    />
                                ) : quotations.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 bg-white">
                                        No quotations found.
                                    </div>
                                ) : (
                                    quotations.map((quotation) => (
                                        <div
                                            key={quotation._id}
                                            className="grid grid-cols-1 lg:grid-cols-11 items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                        >
                                            <div className="text-gray-600">{quotation.quotationNo}</div>
                                            <div className="text-gray-600">{quotation.supplier}</div>
                                            <div className="text-gray-600">{quotation.forDemand}</div>
                                            <div className="text-gray-600">{quotation.person}</div>
                                            <div className="text-gray-600">{quotation.createdBy}</div>
                                            <div className="text-gray-600">{quotation.designation}</div>
                                            <div className="text-gray-600">{quotation.item}</div>
                                            <div className="text-gray-600">{quotation.price}</div>
                                            <div className="text-gray-600">{quotation.quantity}</div>
                                            <div className="text-gray-600">{quotation.total}</div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(quotation)}
                                                    className="px-3 py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
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
                                    onClick={() => {
                                        setIsSliderOpen(false);
                                        setQuotationNo("");
                                        setSupplier("");
                                        setForDemand("");
                                        setPerson("");
                                        setCreatedBy("");
                                        setDesignation("");
                                        setItem("");
                                        setPrice("");
                                        setQuantity("");
                                        setTotal("");
                                        setEditingQuotation(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Quotation No. <span className="text-newPrimary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={quotationNo}
                                        onChange={(e) => setQuotationNo(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter quotation number"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Supplier <span className="text-newPrimary">*</span>
                                    </label>
                                    <select
                                        value={supplier}
                                        onChange={(e) => setSupplier(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        required
                                    >
                                        <option value="">Select Supplier</option>
                                        <option value="supplier1">ABC Traders</option>
                                        <option value="supplier2">XYZ Enterprises</option>
                                        <option value="supplier3">Global Supplies</option>
                                    </select>

                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        For Demand <span className="text-newPrimary">*</span>
                                    </label>
                                    <select
                                        value={forDemand}
                                        onChange={(e) => setForDemand(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        required
                                    >
                                        <option value="">Select Demand Item</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Person <span className="text-newPrimary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={person}
                                        onChange={(e) => setPerson(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter person name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Created By <span className="text-newPrimary">*</span>
                                    </label>
                                    <select
                                        value={createdBy}
                                        onChange={(e) => setCreatedBy(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        <option value="employee1">John Doe</option>
                                        <option value="employee2">Maryum Akmal</option>
                                        <option value="employee3">Ali Khan</option>
                                        <option value="employee4">Ayesha Ahmed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Designation <span className="text-newPrimary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter designation"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Item <span className="text-newPrimary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => setItem(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Select item"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Price <span className="text-newPrimary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter price"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Quantity <span className="text-newPrimary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter quantity"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Total <span className="text-newPrimary">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={total}
                                        onChange={(e) => setTotal(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter total"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                                >
                                    {loading ? "Saving..." : editingQuotation ? "Update Quotation" : "Save Quotation"}
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