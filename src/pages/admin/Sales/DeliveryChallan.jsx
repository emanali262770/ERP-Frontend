import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const DeliveryChallan = () => {
  const [challans, setChallans] = useState([
    {
      _id: "1",
      challanId: "DC-001",
      customerName: "Acme Corp",
      itemName: "Laptop",
      quantity: 5,
      deliveryDate: "2025-09-01",
      status: "Delivered",
      createdBy: "John Doe",
    },
    {
      _id: "2",
      challanId: "DC-002",
      customerName: "Tech Solutions",
      itemName: "Mouse",
      quantity: 50,
      deliveryDate: "2025-09-15",
      status: "Pending",
      createdBy: "Jane Smith",
    },
  ]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [challanId, setChallanId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingChallan, setEditingChallan] = useState(null);
  const [errors, setErrors] = useState({});
  const [itemList, setItemList] = useState([
    { _id: "item1", itemName: "Laptop" },
    { _id: "item2", itemName: "Mouse" },
    { _id: "item3", itemName: "Keyboard" },
  ]);
  const [nextChallanId, setNextChallanId] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Simulate fetching delivery challans
  const fetchChallans = useCallback(async () => {
    try {
      setLoading(true);
      // Static data already set in state
    } catch (error) {
      console.error("Failed to fetch delivery challans", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchChallans();
  }, [fetchChallans]);

  // Delivery challan search
  useEffect(() => {
    if (!searchTerm || !searchTerm.startsWith("DC-")) {
      fetchChallans();
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        setLoading(true);
        const filtered = challans.filter((challan) =>
          challan.challanId.toUpperCase().includes(searchTerm.toUpperCase())
        );
        setChallans(filtered);
      } catch (error) {
        console.error("Search delivery challan failed:", error);
        setChallans([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchChallans, challans]);

  // Generate next challan ID
  useEffect(() => {
    if (challans.length > 0) {
      const maxNo = Math.max(
        ...challans.map((c) => {
          const match = c.challanId?.match(/DC-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextChallanId((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextChallanId("001");
    }
  }, [challans]);

  // Reset form fields
  const resetForm = () => {
    setChallanId("");
    setCustomerName("");
    setItemName("");
    setQuantity("");
    setDeliveryDate("");
    setStatus("");
    setCreatedBy(userInfo.employeeName || "");
    setEditingChallan(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedChallanId = challanId.trim();
    const trimmedCustomerName = customerName.trim();
    const trimmedItemName = itemName.trim();
    const trimmedQuantity = quantity.trim();
    const trimmedDeliveryDate = deliveryDate.trim();
    const trimmedStatus = status.trim();
    const parsedQuantity = parseInt(quantity);

    if (!trimmedChallanId) newErrors.challanId = "Challan ID is required";
    if (!trimmedCustomerName) newErrors.customerName = "Customer Name is required";
    if (!trimmedItemName) newErrors.itemName = "Item Name is required";
    if (!trimmedQuantity || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }
    if (!trimmedDeliveryDate) newErrors.deliveryDate = "Delivery Date is required";
    if (!trimmedStatus) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddChallan = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (challan) => {
    setEditingChallan(challan);
    setChallanId(challan.challanId || "");
    setCustomerName(challan.customerName || "");
    setItemName(challan.itemName || "");
    setQuantity(challan.quantity || "");
    setDeliveryDate(challan.deliveryDate || "");
    setStatus(challan.status || "");
    setCreatedBy(challan.createdBy || userInfo.employeeName || "");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newChallan = {
      challanId: editingChallan ? challanId : `DC-${nextChallanId}`,
      customerName: customerName.trim(),
      itemName: itemName.trim(),
      quantity: parseInt(quantity),
      deliveryDate: deliveryDate.trim(),
      status: status.trim(),
      createdBy: createdBy.trim(),
    };

    try {
      if (editingChallan) {
        setChallans((prev) =>
          prev.map((c) => (c._id === editingChallan._id ? { ...c, ...newChallan, _id: c._id } : c))
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Delivery Challan updated successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setChallans((prev) => [...prev, { ...newChallan, _id: `temp-${Date.now()}` }]);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Delivery Challan added successfully.",
          confirmButtonColor: "#3085d6",
        });
      }
      fetchChallans();
      resetForm();
    } catch (error) {
      console.error("Error saving delivery challan:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save delivery challan.",
        confirmButtonColor: "#d33",
      });
    }
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
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            setChallans((prev) => prev.filter((c) => c._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Delivery Challan deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete delivery challan.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Delivery Challan is safe 🙂",
            "error"
          );
        }
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = challans.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(challans.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Delivery Challan Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter Challan ID eg: DC-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />
            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddChallan}
            >
              + Add Delivery Challan
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
            <div className="min-w-[1200px]">
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Challan ID</div>
                <div>Customer Name</div>
                <div>Item Name</div>
                <div>Quantity</div>
                <div>Delivery Date</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton
                    rows={recordsPerPage}
                    cols={7}
                    className="lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                  />
                ) : currentRecords.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No delivery challans found.
                  </div>
                ) : (
                  currentRecords.map((challan) => (
                    <div
                      key={challan._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">{challan.challanId}</div>
                      <div className="text-gray-600">{challan.customerName}</div>
                      <div className="text-gray-600">{challan.itemName}</div>
                      <div className="text-gray-600">{challan.quantity}</div>
                      <div className="text-gray-600">{challan.deliveryDate}</div>
                      <div className="text-gray-600">{challan.status}</div>
                      <div className="flex gap-3 justify-start">
                        <button
                          onClick={() => handleEditClick(challan)}
                          className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(challan._id)}
                          className="py-1 text-sm rounded text-red-600 hover:bg-red-50 transition-colors"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between my-4 px-10">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstRecord + 1} to{" "}
                {Math.min(indexOfLastRecord, challans.length)} of{" "}
                {challans.length} records
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-newPrimary text-white hover:bg-newPrimary/80"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-newPrimary text-white hover:bg-newPrimary/80"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingChallan ? "Update Delivery Challan" : "Add a New Delivery Challan"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Challan ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingChallan ? challanId : `DC-${nextChallanId}`}
                      readOnly
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.challanId
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter challan ID"
                      required
                    />
                    {errors.challanId && (
                      <p className="text-red-500 text-xs mt-1">{errors.challanId}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.customerName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter customer name"
                      required
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.itemName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    >
                      <option value="">Select Item</option>
                      {itemList?.map((item) => (
                        <option key={item._id} value={item.itemName}>
                          {item.itemName}
                        </option>
                      ))}
                    </select>
                    {errors.itemName && (
                      <p className="text-red-500 text-xs mt-1">{errors.itemName}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.quantity
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter quantity"
                      min="1"
                      required
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Delivery Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.deliveryDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    />
                    {errors.deliveryDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
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
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Created By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={createdBy}
                      readOnly
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.createdBy
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter created by"
                      required
                    />
                    {errors.createdBy && (
                      <p className="text-red-500 text-xs mt-1">{errors.createdBy}</p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading
                    ? "Saving..."
                    : editingChallan
                    ? "Update Delivery Challan"
                    : "Save Delivery Challan"}
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

export default DeliveryChallan;