import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const GatepassIn = () => {
  const [gatepasses, setGatepasses] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gatepassId, setGatepassId] = useState("");
  const [toCompany, setToCompany] = useState("");
  const [poType, setPoType] = useState("withPO"); // Default to "With PO"
  const [itemsList, setItemsList] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemUnits, setItemUnits] = useState("");
  const [category, setCategory] = useState("");
  const [againstPoNo, setAgainstPoNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editingGatepass, setEditingGatepass] = useState(null);
  const [errors, setErrors] = useState({});
  const sliderRef = useRef(null);

  // Static data for gatepasses with itemsList
  const staticData = [
    {
      _id: "1",
      gatepassId: "GP001",
      driverName: "Ali Khan",
      itemsCategory: "Electronics",
      supplier: "ABC Corp",
      items: [{ name: "Laptop", qty: 5, units: "Units" }],
      date: "2025-09-01",
      status: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      gatepassId: "GP002",
      driverName: "Ahmed Raza",
      itemsCategory: "Stationery",
      supplier: "XYZ Ltd",
      items: [{ name: "Notebooks", qty: 10, units: "Packs" }],
      date: "2025-09-15",
      status: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "3",
      gatepassId: "GP003",
      driverName: "Usman Ali",
      itemsCategory: "IT Equipment",
      supplier: "Tech Solutions",
      items: [{ name: "Monitor", qty: 3, units: "Units" }],
      date: "2025-09-20",
      status: true,
      createdAt: new Date().toISOString(),
    },
  ];

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Load static data on mount
  useEffect(() => {
    setLoading(true);
    setGatepasses(staticData);
    setTimeout(() => setLoading(false), 1000); // Simulate loading for 1 second
  }, []);

  // Reset form fields
  const resetForm = () => {
    setGatepassId("");
    setToCompany("");
    setPoType("withPO");
    setItemsList([]);
    setItemName("");
    setItemQuantity("");
    setItemUnits("");
    setCategory("");
    setAgainstPoNo("");
    setSupplier("");
    setDate("");
    setStatus("Pending");
    setEditingGatepass(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedGatepassId = gatepassId.trim();
    const trimmedToCompany = toCompany.trim();
    const trimmedAgainstPoNo = againstPoNo.trim();
    const trimmedSupplier = supplier.trim();

    if (!trimmedGatepassId) newErrors.gatepassId = "Gatepass ID is required";
    if (!trimmedToCompany) newErrors.toCompany = "To Company is required";
    if (!date) newErrors.date = "Date is required";
    if (!status) newErrors.status = "Status is required";

    if (poType === "withPO") {
      if (itemsList.length === 0)
        newErrors.itemsList = "At least one item is required";
      if (!category) newErrors.category = "Category is required";
    } else if (poType === "withoutPO") {
      if (!trimmedAgainstPoNo) newErrors.againstPoNo = "PO Number is required";
      if (!trimmedSupplier) newErrors.supplier = "Supplier is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddClick = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (gatepass) => {
    setEditingGatepass(gatepass);
    setGatepassId(gatepass.gatepassId);
    setToCompany(gatepass.toCompany || "");
    setPoType(
      gatepass.items && gatepass.items.length > 0 ? "withPO" : "withoutPO"
    );
    setItemsList(gatepass.items || []);
    setItemName("");
    setItemQuantity("");
    setItemUnits("");
    setCategory(gatepass.itemsCategory || "");
    setAgainstPoNo(gatepass.againstPoNo || "");
    setSupplier(gatepass.supplier || "");
    setDate(formatDate(gatepass.date));
    setStatus(gatepass.status ? "Active" : "Inactive");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleAddItem = () => {
    const trimmedItemName = itemName.trim();
    const parsedItemQuantity = parseInt(itemQuantity, 10);
    const trimmedItemUnits = itemUnits.trim();

    if (
      !trimmedItemName ||
      !itemQuantity ||
      isNaN(parsedItemQuantity) ||
      parsedItemQuantity <= 0 ||
      !trimmedItemUnits
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Item",
        text: "Please enter a valid item name, positive quantity, and select units.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    setItemsList([
      ...itemsList,
      {
        name: trimmedItemName,
        qty: parsedItemQuantity,
        units: trimmedItemUnits,
      },
    ]);
    setItemName("");
    setItemQuantity("");
    setItemUnits("");
    setErrors((prev) => ({ ...prev, itemsList: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "Missing or Invalid Fields",
        html: `Please correct the following errors:<br/><ul class='list-disc pl-5'>${Object.values(
          errors
        )
          .map((err) => `<li>${err}</li>`)
          .join("")}</ul>`,
        confirmButtonColor: "#d33",
      });
      return;
    }

    const newGatepass = {
      _id: editingGatepass ? editingGatepass._id : Date.now().toString(),
      gatepassId: gatepassId.trim(),
      toCompany: toCompany.trim(),
      driverName: "TBD", // Placeholder, can be dynamically set if needed
      itemsCategory: poType === "withPO" ? category : "",
      supplier: poType === "withoutPO" ? supplier : "",
      items: poType === "withPO" ? itemsList : [],
      againstPoNo: poType === "withoutPO" ? againstPoNo : "",
      date,
      status: status === "Active",
      createdAt: new Date().toISOString(),
    };

    if (editingGatepass) {
      setGatepasses(
        gatepasses.map((g) => (g._id === editingGatepass._id ? newGatepass : g))
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
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_3fr_1fr_1fr_auto] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>GatePass ID</div>
                <div>Driver Name</div>
                <div>Items Category</div>
                <div>Supplier</div>
                <div>Items</div>
                <div>Date</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton
                    rows={3}
                    cols={8}
                    className="lg:grid-cols-[1fr_1fr_1fr_1fr_3fr_1fr_1fr_auto]"
                  />
                ) : gatepasses.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No gatepasses found.
                  </div>
                ) : (
                  gatepasses.map((gatepass) => (
                    <div
                      key={gatepass._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_3fr_1fr_1fr_auto] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="font-medium text-gray-900">
                        {gatepass.gatepassId}
                      </div>
                      <div className="text-gray-600">{gatepass.driverName}</div>
                      <div className="text-gray-600">
                        {gatepass.itemsCategory}
                      </div>
                      <div className="text-gray-600">{gatepass.supplier}</div>
                      <div className="text-gray-600">
                        <div className="flex flex-wrap gap-2">
                          {gatepass.items && gatepass.items.length > 0 ? (
                            gatepass.items.map((item, idx) => (
                              <div key={idx} className="flex gap-2">
                                <span
                                  className="px-3 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `hsl(${
                                      (idx * 70) % 360
                                    }, 80%, 85%)`,
                                    color: `hsl(${(idx * 70) % 360}, 40%, 25%)`,
                                  }}
                                >
                                  {item.name}
                                </span>
                                <span
                                  className="px-3 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `hsl(${
                                      (idx * 70 + 35) % 360
                                    }, 80%, 85%)`,
                                    color: `hsl(${
                                      (idx * 70 + 35) % 360
                                    }, 40%, 25%)`,
                                  }}
                                >
                                  Qty: {item.qty} {item.units}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500">No items</span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-500">
                        {formatDate(gatepass.date)}
                      </div>
                      <div className="text-gray-600">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            gatepass.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {gatepass.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => handleEditClick(gatepass)}
                          className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
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
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[500px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingGatepass ? "Update Gatepass" : "Add Gatepass In"}
                </h2>
                <button
                  className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Gatepass ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={gatepassId}
                    onChange={(e) => setGatepassId(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.gatepassId
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-newPrimary"
                    }`}
                    placeholder="Enter gatepass ID"
                    required
                  />
                  {errors.gatepassId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.gatepassId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    To <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={toCompany}
                    onChange={(e) => setToCompany(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.toCompany
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-newPrimary"
                    }`}
                    required
                  >
                    <option value="">Select Company</option>
                    <option value="ABC Corp">ABC Corp</option>
                    <option value="XYZ Ltd">XYZ Ltd</option>
                    <option value="Tech Solutions">Tech Solutions</option>
                    <option value="Global Supplies">Global Supplies</option>
                  </select>
                  {errors.toCompany && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.toCompany}
                    </p>
                  )}
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
                        Against PO No. <span className="text-red-500">*</span>
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
                        <option value="">Select PO No</option>
                        <option value="ABC Corp">ABC Corp</option>
                        <option value="XYZ Ltd">XYZ Ltd</option>
                        <option value="Tech Solutions">Tech Solutions</option>
                        <option value="Global Supplies">Global Supplies</option>
                      </select>
                      {errors.againstPoNo && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.againstPoNo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Supplier <span className="text-red-500">*</span>
                      </label>
                      <input
                        type=""
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                          errors.supplier
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-newPrimary"
                        }`}
                        readOnly
                      />
                      {errors.supplier && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.supplier}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {poType === "withoutPO" && (
                  <>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                          errors.category
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-newPrimary"
                        }`}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Stationery">Stationery</option>
                        <option value="IT Equipment">IT Equipment</option>
                        <option value="Furniture">Furniture</option>
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between gap-2 items-end">
                        <div className="flex-1">
                          <label className="block text-gray-700 font-medium mb-2">
                            Item Name <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
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
                        <div className="flex-1">
                          <label className="block text-gray-700 font-medium mb-2">
                            Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={itemQuantity}
                            onChange={(e) => setItemQuantity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            placeholder="Enter quantity"
                            min="1"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-gray-700 font-medium mb-2">
                            Units <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={itemUnits}
                            onChange={(e) => setItemUnits(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
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
                          <button
                            type="button"
                            onClick={handleAddItem}
                            className="w-16 h-12 bg-newPrimary text-white rounded-lg hover:bg-newPrimary/80 transition"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                      {errors.itemsList && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.itemsList}
                        </p>
                      )}
                      {itemsList.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 text-gray-600 text-sm">
                              <tr>
                                <th className="px-4 py-2 border-b">Sr #</th>
                                <th className="px-4 py-2 border-b">
                                  Item Name
                                </th>
                                <th className="px-4 py-2 border-b">Quantity</th>
                                <th className="px-4 py-2 border-b">Units</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                              {itemsList.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 border-b text-center">
                                    {idx + 1}
                                  </td>
                                  <td className="px-4 py-2 border-b">
                                    {item.name}
                                  </td>
                                  <td className="px-4 py-2 border-b text-center">
                                    {item.qty}
                                  </td>
                                  <td className="px-4 py-2 border-b">
                                    {item.units}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
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
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.date
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-newPrimary"
                    }`}
                    required
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.status
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-newPrimary"
                    }`}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading
                    ? "Saving..."
                    : editingGatepass
                    ? "Update Gatepass"
                    : "Save Gatepass In"}
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
