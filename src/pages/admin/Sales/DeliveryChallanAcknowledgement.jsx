import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const DeliveryChallanAcknowledgement = () => {
  const [acknowledgements, setAcknowledgements] = useState([
    {
      _id: "1",
      ackId: "ACK-001",
      challanId: "DC-001",
      itemName: "Laptop",
      qtyReceived: 5,
      ackDate: "2025-09-01",
      receivedBy: "John Doe",
      status: "Full",
    },
    {
      _id: "2",
      ackId: "ACK-002",
      challanId: "DC-002",
      itemName: "Mouse",
      qtyReceived: 20,
      ackDate: "2025-09-15",
      receivedBy: "Jane Smith",
      status: "Partial",
    },
  ]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ackId, setAckId] = useState("");
  const [challanId, setChallanId] = useState("");
  const [itemName, setItemName] = useState("");
  const [qtyReceived, setQtyReceived] = useState("");
  const [ackDate, setAckDate] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAcknowledgement, setEditingAcknowledgement] = useState(null);
  const [errors, setErrors] = useState({});
  const [itemList, setItemList] = useState([
    { _id: "item1", itemName: "Laptop" },
    { _id: "item2", itemName: "Mouse" },
    { _id: "item3", itemName: "Keyboard" },
  ]);
  const [nextAckId, setNextAckId] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Simulate fetching acknowledgements
  const fetchAcknowledgements = useCallback(async () => {
    try {
      setLoading(true);
      // Static data already set in state
    } catch (error) {
      console.error("Failed to fetch acknowledgements", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchAcknowledgements();
  }, [fetchAcknowledgements]);

  // Acknowledgement search
  useEffect(() => {
    if (!searchTerm || !searchTerm.startsWith("ACK-")) {
      fetchAcknowledgements();
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        setLoading(true);
        const filtered = acknowledgements.filter((ack) =>
          ack.ackId.toUpperCase().includes(searchTerm.toUpperCase())
        );
        setAcknowledgements(filtered);
      } catch (error) {
        console.error("Search acknowledgement failed:", error);
        setAcknowledgements([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchAcknowledgements, acknowledgements]);

  // Generate next acknowledgement ID
  useEffect(() => {
    if (acknowledgements.length > 0) {
      const maxNo = Math.max(
        ...acknowledgements.map((a) => {
          const match = a.ackId?.match(/ACK-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextAckId((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextAckId("001");
    }
  }, [acknowledgements]);

  // Reset form fields
  const resetForm = () => {
    setAckId("");
    setChallanId("");
    setItemName("");
    setQtyReceived("");
    setAckDate("");
    setReceivedBy(userInfo.employeeName || "");
    setStatus("");
    setEditingAcknowledgement(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedAckId = ackId.trim();
    const trimmedChallanId = challanId.trim();
    const trimmedItemName = itemName.trim();
    const trimmedQtyReceived = qtyReceived.trim();
    const trimmedAckDate = ackDate.trim();
    const trimmedStatus = status.trim();
    const parsedQtyReceived = parseFloat(qtyReceived);

    if (!trimmedAckId) newErrors.ackId = "Acknowledgement ID is required";
    if (!trimmedChallanId) newErrors.challanId = "Delivery Challan ID is required";
    if (!trimmedItemName) newErrors.itemName = "Item Name is required";
    if (!trimmedQtyReceived || isNaN(parsedQtyReceived) || parsedQtyReceived <= 0) {
      newErrors.qtyReceived = "Quantity Received must be a positive number";
    }
    if (!trimmedAckDate) newErrors.ackDate = "Acknowledgement Date is required";
    if (!trimmedStatus) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddAcknowledgement = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (acknowledgement) => {
    setEditingAcknowledgement(acknowledgement);
    setAckId(acknowledgement.ackId || "");
    setChallanId(acknowledgement.challanId || "");
    setItemName(acknowledgement.itemName || "");
    setQtyReceived(acknowledgement.qtyReceived || "");
    setAckDate(acknowledgement.ackDate || "");
    setReceivedBy(acknowledgement.receivedBy || userInfo.employeeName || "");
    setStatus(acknowledgement.status || "");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newAcknowledgement = {
      ackId: editingAcknowledgement ? ackId : `ACK-${nextAckId}`,
      challanId: challanId.trim(),
      itemName: itemName.trim(),
      qtyReceived: parseFloat(qtyReceived),
      ackDate: ackDate.trim(),
      receivedBy: receivedBy.trim(),
      status: status.trim(),
    };

    try {
      if (editingAcknowledgement) {
        setAcknowledgements((prev) =>
          prev.map((a) => (a._id === editingAcknowledgement._id ? { ...a, ...newAcknowledgement, _id: a._id } : a))
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Acknowledgement updated successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setAcknowledgements((prev) => [...prev, { ...newAcknowledgement, _id: `temp-${Date.now()}` }]);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Acknowledgement added successfully.",
          confirmButtonColor: "#3085d6",
        });
      }
      fetchAcknowledgements();
      resetForm();
    } catch (error) {
      console.error("Error saving acknowledgement:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save acknowledgement.",
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
            setAcknowledgements((prev) => prev.filter((a) => a._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Acknowledgement deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete acknowledgement.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Acknowledgement is safe 🙂",
            "error"
          );
        }
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = acknowledgements.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(acknowledgements.length / recordsPerPage);

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
              Delivery Challan Acknowledgement Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter Acknowledgement ID eg: ACK-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />
            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddAcknowledgement}
            >
              + Add Acknowledgement
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
            <div className="min-w-[1200px]">
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Acknowledgement ID</div>
                <div>Delivery Challan ID</div>
                <div>Item Name</div>
                <div>Quantity Received</div>
                <div>Acknowledgement Date</div>
                <div>Received By</div>
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
                    No acknowledgements found.
                  </div>
                ) : (
                  currentRecords.map((acknowledgement) => (
                    <div
                      key={acknowledgement._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">{acknowledgement.ackId}</div>
                      <div className="text-gray-600">{acknowledgement.challanId}</div>
                      <div className="text-gray-600">{acknowledgement.itemName}</div>
                      <div className="text-gray-600">{acknowledgement.qtyReceived}</div>
                      <div className="text-gray-600">{acknowledgement.ackDate}</div>
                      <div className="text-gray-600">{acknowledgement.receivedBy}</div>
                      <div className="flex gap-3 justify-start">
                        <button
                          onClick={() => handleEditClick(acknowledgement)}
                          className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(acknowledgement._id)}
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
                {Math.min(indexOfLastRecord, acknowledgements.length)} of{" "}
                {acknowledgements.length} records
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
                  {editingAcknowledgement ? "Update Acknowledgement" : "Add a New Acknowledgement"}
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
                      Acknowledgement ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingAcknowledgement ? ackId : `ACK-${nextAckId}`}
                      readOnly
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.ackId
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter acknowledgement ID"
                      required
                    />
                    {errors.ackId && (
                      <p className="text-red-500 text-xs mt-1">{errors.ackId}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Delivery Challan ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={challanId}
                      onChange={(e) => setChallanId(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.challanId
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter delivery challan ID"
                      required
                    />
                    {errors.challanId && (
                      <p className="text-red-500 text-xs mt-1">{errors.challanId}</p>
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
                      Quantity Received <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={qtyReceived}
                      onChange={(e) => setQtyReceived(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.qtyReceived
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter quantity received"
                      min="0"
                      step="1"
                      required
                    />
                    {errors.qtyReceived && (
                      <p className="text-red-500 text-xs mt-1">{errors.qtyReceived}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Acknowledgement Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={ackDate}
                      onChange={(e) => setAckDate(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.ackDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    />
                    {errors.ackDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.ackDate}</p>
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
                      <option value="Full">Full</option>
                      <option value="Partial">Partial</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Received By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={receivedBy}
                      readOnly
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.receivedBy
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter received by"
                      required
                    />
                    {errors.receivedBy && (
                      <p className="text-red-500 text-xs mt-1">{errors.receivedBy}</p>
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
                    : editingAcknowledgement
                    ? "Update Acknowledgement"
                    : "Save Acknowledgement"}
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

export default DeliveryChallanAcknowledgement;