import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../components/CommanHeader"; // Ensure this component exists
import TableSkeleton from "./Skeleton"; // Ensure this component exists
import Swal from "sweetalert2";
import axios from "axios";
const PurchaseRequisition = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requisitionId, setRequisitionId] = useState("");
  const [date, setDate] = useState("");
  const [department, setDepartment] = useState("");
  const [employee, setEmployee] = useState("");
  const [requirement, setRequirement] = useState("");
  const [details, setDetails] = useState("");
  const [items, setItems] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isEnable, setIsEnable] = useState(true);
  const [editingRequisition, setEditingRequisition] = useState(null);
  const sliderRef = useRef(null);

  // Static data to ensure rendering
  const staticData = [
    {
      _id: "1",
      requisitionId: "REQ001",
      date: "2025-09-01",
      department: "IT",
      employee: "John Doe",
      requirement: "Laptops",
      details: "High-performance laptops for development team",
      items: "Dell XPS 15",
      category: "Electronics",
      quantity: 5,
      isEnable: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      requisitionId: "REQ002",
      date: "2025-09-15",
      department: "HR",
      employee: "Jane Smith",
      requirement: "Office Supplies",
      details: "Stationery for new hires",
      items: "Pens, Notebooks",
      category: "Stationery",
      quantity: 100,
      isEnable: false,
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
    setRequisitions(staticData); // Use static data directly
    setTimeout(() => setLoading(false), 1000); // Simulate loading for 1 second
  }, []);

  // Handlers for form and table actions
  const handleAddClick = () => {
    setEditingRequisition(null);
    setRequisitionId("");
    setDate("");
    setDepartment("");
    setEmployee("");
    setRequirement("");
    setDetails("");
    setItems("");
    setCategory("");
    setQuantity("");
    setIsEnable(true);
    setIsSliderOpen(true);
  };

  const handleEditClick = (requisition) => {
    setEditingRequisition(requisition);
    setRequisitionId(requisition.requisitionId);
    setDate(formatDate(requisition.date));
    setDepartment(requisition.department);
    setEmployee(requisition.employee);
    setRequirement(requisition.requirement);
    setDetails(requisition.details || "");
    setItems(requisition.items);
    setCategory(requisition.category);
    setQuantity(requisition.quantity);
    setIsEnable(requisition.isEnable);
    setIsSliderOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedRequisitionId = requisitionId.trim();
    const trimmedDepartment = department.trim();
    const trimmedEmployee = employee.trim();
    const trimmedRequirement = requirement.trim();
    const trimmedDetails = details.trim();
    const trimmedItems = items.trim();
    const trimmedCategory = category.trim();

    if (
      !trimmedRequisitionId ||
      !date ||
      !trimmedDepartment ||
      !trimmedEmployee ||
      !trimmedRequirement ||
      !trimmedDetails ||
      !trimmedItems ||
      !trimmedCategory ||
      !quantity
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "⚠️ Please fill in all required fields.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const newRequisition = {
      _id: editingRequisition ? editingRequisition._id : Date.now().toString(),
      requisitionId: trimmedRequisitionId,
      date,
      department: trimmedDepartment,
      employee: trimmedEmployee,
      requirement: trimmedRequirement,
      details: trimmedDetails,
      items: trimmedItems,
      category: trimmedCategory,
      quantity: parseInt(quantity, 10),
      isEnable,
      createdAt: new Date().toISOString(),
    };

    if (editingRequisition) {
      setRequisitions(
        requisitions.map((r) =>
          r._id === editingRequisition._id ? newRequisition : r
        )
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Requisition updated successfully.",
        confirmButtonColor: "#3085d6",
      });
    } else {
      setRequisitions([...requisitions, newRequisition]);

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Requisition added successfully.",
        confirmButtonColor: "#3085d6",
      });
    }

    // ✅ Reset form state
    setRequisitionId("");
    setDate("");
    setDepartment("");
    setEmployee("");
    setRequirement("");
    setDetails("");
    setItems("");
    setCategory("");
    setQuantity("");
    setIsEnable(true);
    setEditingRequisition(null);
    setIsSliderOpen(false);
  };


  const handleToggleEnable = (requisition) => {
    setRequisitions(
      requisitions.map((r) =>
        r._id === requisition._id ? { ...r, isEnable: !r.isEnable } : r
      )
    );
    alert(`Requisition ${!requisition.isEnable ? "enabled" : "disabled"}.`);
  };
  const handleDelete = async (id) => {
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
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { token } = userInfo || {};
            const headers = {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            };

            // ✅ Delete from backend
            await axios.delete(`${API_URL}/${id}`, { headers });

            // ✅ Update UI
            setPromotions(promotions.filter((p) => p._id !== id));

            swalWithTailwindButtons.fire(
              "Deleted!",
              "Promotion deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete promotion.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Promotion is safe 🙂",
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
              Purchase Requisition Details
            </h1>
          </div>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={handleAddClick}
          >
            + Add Requisition
          </button>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[400px]">
            <div className="min-w-[1200px]">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Requisition ID</div>

                <div>Department</div>
                <div>Employee</div>
                <div>Requirement</div>
                <div>Details</div>
                <div>Items</div>
                <div>Category</div>
                <div>Quantity</div>
                <div>Date</div>
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
                ) : requisitions.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No requisitions found.
                  </div>
                ) : (
                  requisitions.map((requisition) => (
                    <div
                      key={requisition._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="font-medium text-gray-900">
                        {requisition.requisitionId}
                      </div>

                      <div className="text-gray-600">{requisition.department}</div>
                      <div className="text-gray-600">{requisition.employee}</div>
                      <div className="text-gray-600">{requisition.requirement}</div>
                      <div className="text-gray-600 truncate">{requisition.details}</div>
                      <div className="text-gray-600">{requisition.items}</div>
                      <div className="text-gray-600">{requisition.category}</div>
                      <div className="text-gray-600">{requisition.quantity}</div>
                      <div className="text-gray-500">{formatDate(requisition.date)}</div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(requisition)}
                          className="px-3 py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <SquarePen size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(requisition._id)}
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
                  {editingRequisition ? "Update Requisition" : "Add a New Requisition"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setIsSliderOpen(false);
                    setRequisitionId("");
                    setDate("");
                    setDepartment("");
                    setEmployee("");
                    setRequirement("");
                    setDetails("");
                    setItems("");
                    setCategory("");
                    setQuantity("");
                    setIsEnable(true);
                    setEditingRequisition(null);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Requisition ID <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={requisitionId}
                    onChange={(e) => setRequisitionId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter requisition ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Procurement">Procurement</option>
                    <option value="IT">IT</option>
                    <option value="Admin">Admin</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={employee}
                    onChange={(e) => setEmployee(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    required
                  >
                    <option value="">Select Employee </option>
                    <option value="Ali">Ali</option>
                    <option value="Ayesha">Ayesha</option>
                    <option value="Ahmed">Ahmed</option>
                    <option value="Fatima">Fatima</option>
                    <option value="Usman">Usman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Requirement <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    required
                  >
                    <option value="">Select Requirement</option>
                    <option value="Regular Purchase">Regular Purchase</option>
                    <option value="Emergency Purchase">Emergency Purchase</option>
                    <option value="One-time Purchase">One-time Purchase</option>
                    <option value="Bulk Purchase">Bulk Purchase</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Details
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter requisition details"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Items
                  </label>
                  <input
                    type="text"
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter items"
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
                    <option value="Furniture">Furniture</option>
                    <option value="Stationery">Stationery</option>
                    <option value="IT Equipment">IT Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter quantity"
                    min="1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium">Status</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEnable(!isEnable)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isEnable ? "bg-newPrimary/80" : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isEnable ? "translate-x-6" : "translate-x-0"
                          }`}
                      />
                    </button>
                    <span
                      className={`text-sm font-medium ${isEnable ? "text-newPrimary" : "text-gray-500"
                        }`}
                    >
                      {isEnable ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading ? "Saving..." : editingRequisition ? "Update Requisition" : "Save Requisition"}
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

export default PurchaseRequisition;