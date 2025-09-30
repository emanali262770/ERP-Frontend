import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2, X } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const DistributionRateList = () => {
  const [distributionRateLists, setDistributionRateLists] = useState([
    {
      _id: "1",
      distributionRateId: "DRL-001",
      itemName: "Laptop",
      customer: "Tech Corp",
      region: "North",
      distributionPrice: 950,
      minOrderQuantity: 10,
      effectiveDate: "2025-09-01",
      createdBy: "John Doe",
      finalPrice: 1045, // (950 * (1 + 0.10))
    },
    {
      _id: "2",
      distributionRateId: "DRL-002",
      itemName: "Mouse",
      customer: "Retail Inc",
      region: "South",
      distributionPrice: 18,
      minOrderQuantity: 50,
      effectiveDate: "2025-09-15",
      createdBy: "Jane Smith",
      finalPrice: 19.8, // (18 * (1 + 0.10))
    },
  ]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [distributionRateId, setDistributionRateId] = useState("");
  const [itemName, setItemName] = useState("");
  const [customer, setCustomer] = useState("");
  const [region, setRegion] = useState("");
  const [distributionPrice, setDistributionPrice] = useState("");
  const [minOrderQuantity, setMinOrderQuantity] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDistributionRateList, setEditingDistributionRateList] = useState(null);
  const [errors, setErrors] = useState({});
  const [itemList, setItemList] = useState([
    { _id: "item1", itemName: "Laptop" },
    { _id: "item2", itemName: "Mouse" },
    { _id: "item3", itemName: "Keyboard" },
  ]);
  const [customerList, setCustomerList] = useState([
    { _id: "cust1", customerName: "Tech Corp" },
    { _id: "cust2", customerName: "Retail Inc" },
    { _id: "cust3", customerName: "Global Traders" },
  ]);
  const [regionList, setRegionList] = useState([
    { _id: "region1", regionName: "North" },
    { _id: "region2", regionName: "South" },
    { _id: "region3", regionName: "West" },
  ]);
  const [nextDistributionRateId, setNextDistributionRateId] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Simulate fetching distribution rate list
  const fetchDistributionRateList = useCallback(async () => {
    try {
      setLoading(true);
      // Static data already set in state
    } catch (error) {
      console.error("Failed to fetch distribution rate lists", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchDistributionRateList();
  }, [fetchDistributionRateList]);

  // Distribution rate list search
  useEffect(() => {
    if (!searchTerm || !searchTerm.startsWith("DRL-")) {
      fetchDistributionRateList();
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        setLoading(true);
        const filtered = distributionRateLists.filter((rate) =>
          rate.distributionRateId.toUpperCase().includes(searchTerm.toUpperCase())
        );
        setDistributionRateLists(filtered);
      } catch (error) {
        console.error("Search distribution rate list failed:", error);
        setDistributionRateLists([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchDistributionRateList, distributionRateLists]);

  // Generate next distribution rate ID
  useEffect(() => {
    if (distributionRateLists.length > 0) {
      const maxNo = Math.max(
        ...distributionRateLists.map((r) => {
          const match = r.distributionRateId?.match(/DRL-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextDistributionRateId((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextDistributionRateId("001");
    }
  }, [distributionRateLists]);

  // Reset form fields
  const resetForm = () => {
    setDistributionRateId("");
    setItemName("");
    setCustomer("");
    setRegion("");
    setDistributionPrice("");
    setMinOrderQuantity("");
    setEffectiveDate("");
    setCreatedBy(userInfo.employeeName || "");
    setEditingDistributionRateList(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedDistributionRateId = distributionRateId.trim();
    const trimmedItemName = itemName.trim();
    const trimmedCustomer = customer.trim();
    const trimmedRegion = region.trim();
    const trimmedDistributionPrice = distributionPrice.trim();
    const trimmedMinOrderQuantity = minOrderQuantity.trim();
    const trimmedEffectiveDate = effectiveDate.trim();
    const parsedDistributionPrice = parseFloat(distributionPrice);
    const parsedMinOrderQuantity = parseInt(minOrderQuantity);

    if (!trimmedDistributionRateId) newErrors.distributionRateId = "Distribution Rate ID is required";
    if (!trimmedItemName) newErrors.itemName = "Item Name is required";
    if (!trimmedCustomer) newErrors.customer = "Customer is required";
    if (!trimmedRegion) newErrors.region = "Region is required";
    if (!trimmedDistributionPrice || isNaN(parsedDistributionPrice) || parsedDistributionPrice <= 0) {
      newErrors.distributionPrice = "Distribution Price must be a positive number";
    }
    if (!trimmedMinOrderQuantity || isNaN(parsedMinOrderQuantity) || parsedMinOrderQuantity <= 0) {
      newErrors.minOrderQuantity = "Minimum Order Quantity must be a positive integer";
    }
    if (!trimmedEffectiveDate) newErrors.effectiveDate = "Effective Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddDistributionRateList = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (distributionRateList) => {
    setEditingDistributionRateList(distributionRateList);
    setDistributionRateId(distributionRateList.distributionRateId || "");
    setItemName(distributionRateList.itemName || "");
    setCustomer(distributionRateList.customer || "");
    setRegion(distributionRateList.region || "");
    setDistributionPrice(distributionRateList.distributionPrice || "");
    setMinOrderQuantity(distributionRateList.minOrderQuantity || "");
    setEffectiveDate(distributionRateList.effectiveDate || "");
    setCreatedBy(distributionRateList.createdBy || userInfo.employeeName || "");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const finalPrice = parseFloat(distributionPrice) * (1 + 0.10); // Assuming 10% tax for simplicity

    const newDistributionRateList = {
      distributionRateId: editingDistributionRateList ? distributionRateId : `DRL-${nextDistributionRateId}`,
      itemName: itemName.trim(),
      customer: customer.trim(),
      region: region.trim(),
      distributionPrice: parseFloat(distributionPrice),
      minOrderQuantity: parseInt(minOrderQuantity),
      effectiveDate: effectiveDate.trim(),
      createdBy: createdBy.trim(),
      finalPrice: parseFloat(finalPrice.toFixed(2)),
    };

    try {
      if (editingDistributionRateList) {
        setDistributionRateLists((prev) =>
          prev.map((r) => (r._id === editingDistributionRateList._id ? { ...r, ...newDistributionRateList, _id: r._id } : r))
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Distribution Rate List updated successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setDistributionRateLists((prev) => [...prev, { ...newDistributionRateList, _id: `temp-${Date.now()}` }]);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Distribution Rate List added successfully.",
          confirmButtonColor: "#3085d6",
        });
      }
      fetchDistributionRateList();
      resetForm();
    } catch (error) {
      console.error("Error saving distribution rate list:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save distribution rate list.",
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
            setDistributionRateLists((prev) => prev.filter((r) => r._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Distribution Rate List deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete distribution rate list.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Distribution Rate List is safe 🙂",
            "error"
          );
        }
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = distributionRateLists.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(distributionRateLists.length / recordsPerPage);

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
              Distribution Rate List Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter Distribution Rate ID eg: DRL-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />
            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddDistributionRateList}
            >
              + Add Distribution Rate List
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
            <div className="min-w-[1400px]">
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Distribution Rate ID</div>
                <div>Item Name</div>
                <div>Customer</div>
                <div>Region</div>
                <div>Distribution Price</div>
                <div>Min Order Quantity</div>
                <div>Effective Date</div>
                <div>Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton
                    rows={recordsPerPage}
                    cols={8}
                    className="lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                  />
                ) : currentRecords.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No distribution rate lists found.
                  </div>
                ) : (
                  currentRecords.map((rateList) => (
                    <div
                      key={rateList._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">{rateList.distributionRateId}</div>
                      <div className="text-gray-600">{rateList.itemName}</div>
                      <div className="text-gray-600">{rateList.customer}</div>
                      <div className="text-gray-600">{rateList.region}</div>
                      <div className="text-gray-600">{rateList.distributionPrice}</div>
                      <div className="text-gray-600">{rateList.minOrderQuantity}</div>
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
                {Math.min(indexOfLastRecord, distributionRateLists.length)} of{" "}
                {distributionRateLists.length} records
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
                  {editingDistributionRateList ? "Update Distribution Rate List" : "Add a New Distribution Rate List"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Distribution Rate ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingDistributionRateList ? distributionRateId : `DRL-${nextDistributionRateId}`}
                      readOnly
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.distributionRateId
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter distribution rate ID"
                      required
                    />
                    {errors.distributionRateId && (
                      <p className="text-red-500 text-xs mt-1">{errors.distributionRateId}</p>
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
                      Customer <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.customer
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    >
                      <option value="">Select Customer</option>
                      {customerList?.map((cust) => (
                        <option key={cust._id} value={cust.customerName}>
                          {cust.customerName}
                        </option>
                      ))}
                    </select>
                    {errors.customer && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.region
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    >
                      <option value="">Select Region</option>
                      {regionList?.map((reg) => (
                        <option key={reg._id} value={reg.regionName}>
                          {reg.regionName}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="text-red-500 text-xs mt-1">{errors.region}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Distribution Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={distributionPrice}
                      onChange={(e) => setDistributionPrice(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.distributionPrice
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter distribution price"
                      min="0"
                      step="0.01"
                      required
                    />
                    {errors.distributionPrice && (
                      <p className="text-red-500 text-xs mt-1">{errors.distributionPrice}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Minimum Order Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={minOrderQuantity}
                      onChange={(e) => setMinOrderQuantity(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.minOrderQuantity
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter minimum order quantity"
                      min="0"
                      step="1"
                      required
                    />
                    {errors.minOrderQuantity && (
                      <p className="text-red-500 text-xs mt-1">{errors.minOrderQuantity}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
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
                    : editingDistributionRateList
                    ? "Update Distribution Rate List"
                    : "Save Distribution Rate List"}
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

export default DistributionRateList;