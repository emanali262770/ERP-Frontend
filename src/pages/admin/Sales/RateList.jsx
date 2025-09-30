import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const RateList = () => {
  const [rateLists, setRateLists] = useState([
    {
      _id: "1",
      rateListId: "RL-001",
      itemName: "Laptop",
      unitPrice: 1000,
      discount: 10,
      taxRate: 15,
      effectiveDate: "2025-09-01",
      createdBy: "John Doe",
      totalPrice: 935, // (1000 * (1 - 0.1) * (1 + 0.15))
    },
    {
      _id: "2",
      rateListId: "RL-002",
      itemName: "Mouse",
      unitPrice: 20,
      discount: 5,
      taxRate: 10,
      effectiveDate: "2025-09-15",
      createdBy: "Jane Smith",
      totalPrice: 20.9, // (20 * (1 - 0.05) * (1 + 0.1))
    },
  ]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rateListId, setRateListId] = useState("");
  const [itemName, setItemName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRateList, setEditingRateList] = useState(null);
  const [errors, setErrors] = useState({});
  const [itemList, setItemList] = useState([
    { _id: "item1", itemName: "Laptop" },
    { _id: "item2", itemName: "Mouse" },
    { _id: "item3", itemName: "Keyboard" },
  ]);
  const [nextRateListId, setNextRateListId] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Simulate fetching rate list
  const fetchRateList = useCallback(async () => {
    try {
      setLoading(true);
      // Static data already set in state
    } catch (error) {
      console.error("Failed to fetch rate lists", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchRateList();
  }, [fetchRateList]);

  // Rate list search
  useEffect(() => {
    if (!searchTerm || !searchTerm.startsWith("RL-")) {
      fetchRateList();
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        setLoading(true);
        const filtered = rateLists.filter((rate) =>
          rate.rateListId.toUpperCase().includes(searchTerm.toUpperCase())
        );
        setRateLists(filtered);
      } catch (error) {
        console.error("Search rate list failed:", error);
        setRateLists([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchRateList, rateLists]);

  // Generate next rate list ID
  useEffect(() => {
    if (rateLists.length > 0) {
      const maxNo = Math.max(
        ...rateLists.map((r) => {
          const match = r.rateListId?.match(/RL-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextRateListId((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextRateListId("001");
    }
  }, [rateLists]);

  // Reset form fields
  const resetForm = () => {
    setRateListId("");
    setItemName("");
    setUnitPrice("");
    setDiscount("");
    setTaxRate("");
    setEffectiveDate("");
    setCreatedBy(userInfo.employeeName || "");
    setEditingRateList(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedRateListId = rateListId.trim();
    const trimmedItemName = itemName.trim();
    const trimmedUnitPrice = unitPrice.trim();
    const trimmedDiscount = discount.trim();
    const trimmedTaxRate = taxRate.trim();
    const trimmedEffectiveDate = effectiveDate.trim();
    const parsedUnitPrice = parseFloat(unitPrice);
    const parsedDiscount = parseFloat(discount);
    const parsedTaxRate = parseFloat(taxRate);

    if (!trimmedRateListId) newErrors.rateListId = "Rate List ID is required";
    if (!trimmedItemName) newErrors.itemName = "Item Name is required";
    if (!trimmedUnitPrice || isNaN(parsedUnitPrice) || parsedUnitPrice <= 0) {
      newErrors.unitPrice = "Unit Price must be a positive number";
    }
    if (trimmedDiscount && (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100)) {
      newErrors.discount = "Discount must be between 0 and 100";
    }
    if (trimmedTaxRate && (isNaN(parsedTaxRate) || parsedTaxRate < 0 || parsedTaxRate > 100)) {
      newErrors.taxRate = "Tax Rate must be between 0 and 100";
    }
    if (!trimmedEffectiveDate) newErrors.effectiveDate = "Effective Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddRateList = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (rateList) => {
    setEditingRateList(rateList);
    setRateListId(rateList.rateListId || "");
    setItemName(rateList.itemName || "");
    setUnitPrice(rateList.unitPrice || "");
    setDiscount(rateList.discount || "");
    setTaxRate(rateList.taxRate || "");
    setEffectiveDate(rateList.effectiveDate || "");
    setCreatedBy(rateList.createdBy || userInfo.employeeName || "");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const totalPrice = parseFloat(unitPrice) * (1 - (parseFloat(discount || 0) / 100)) * (1 + (parseFloat(taxRate || 0) / 100));

    const newRateList = {
      rateListId: editingRateList ? rateListId : `RL-${nextRateListId}`,
      itemName: itemName.trim(),
      unitPrice: parseFloat(unitPrice),
      discount: parseFloat(discount || 0),
      taxRate: parseFloat(taxRate || 0),
      effectiveDate: effectiveDate.trim(),
      createdBy: createdBy.trim(),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    };

    try {
      if (editingRateList) {
        setRateLists((prev) =>
          prev.map((r) => (r._id === editingRateList._id ? { ...r, ...newRateList, _id: r._id } : r))
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Rate List updated successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setRateLists((prev) => [...prev, { ...newRateList, _id: `temp-${Date.now()}` }]);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Rate List added successfully.",
          confirmButtonColor: "#3085d6",
        });
      }
      fetchRateList();
      resetForm();
    } catch (error) {
      console.error("Error saving rate list:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save rate list.",
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
            setRateLists((prev) => prev.filter((r) => r._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Rate List deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete rate list.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Rate List is safe 🙂",
            "error"
          );
        }
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = rateLists.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(rateLists.length / recordsPerPage);

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
              Rate List Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter Rate List ID eg: RL-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />
            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddRateList}
            >
              + Add Rate List
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
            <div className="min-w-[1200px]">
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Rate List ID</div>
                <div>Item Name</div>
                <div>Unit Price</div>
                <div>Discount (%)</div>
                <div>Tax Rate (%)</div>
                <div>Effective Date</div>
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
                    No rate lists found.
                  </div>
                ) : (
                  currentRecords.map((rateList) => (
                    <div
                      key={rateList._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">{rateList.rateListId}</div>
                      <div className="text-gray-600">{rateList.itemName}</div>
                      <div className="text-gray-600">{rateList.unitPrice}</div>
                      <div className="text-gray-600">{rateList.discount}</div>
                      <div className="text-gray-600">{rateList.taxRate}</div>
                      <div className="text-gray-600">{rateList.effectiveDate}</div>
                      <div className="flex gap-3 justify-start">
                        <button
                          onClick={() => handleEditClick(rateList)}
                          className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(rateList._id)}
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
                {Math.min(indexOfLastRecord, rateLists.length)} of{" "}
                {rateLists.length} records
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
                  {editingRateList ? "Update Rate List" : "Add a New Rate List"}
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
                      Rate List ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingRateList ? rateListId : `RL-${nextRateListId}`}
                      readOnly
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.rateListId
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter rate list ID"
                      required
                    />
                    {errors.rateListId && (
                      <p className="text-red-500 text-xs mt-1">{errors.rateListId}</p>
                    )}
                  </div>
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
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Unit Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.unitPrice
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter unit price"
                      min="0"
                      step="0.01"
                      required
                    />
                    {errors.unitPrice && (
                      <p className="text-red-500 text-xs mt-1">{errors.unitPrice}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.discount
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter discount percentage"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    {errors.discount && (
                      <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.taxRate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter tax rate percentage"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    {errors.taxRate && (
                      <p className="text-red-500 text-xs mt-1">{errors.taxRate}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Effective Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.effectiveDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    />
                    {errors.effectiveDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.effectiveDate}</p>
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
                    : editingRateList
                    ? "Update Rate List"
                    : "Save Rate List"}
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

export default RateList;