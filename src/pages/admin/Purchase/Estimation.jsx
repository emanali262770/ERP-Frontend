import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const Estimation = () => {
  const [quotations, setQuotations] = useState([]);
  const [estimations, setEstimations] = useState([]);
  const [quotationItems, setQuotationItems] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [estimationId, setEstimationId] = useState("");
  const [supplier, setSupplier] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [forDemand, setForDemand] = useState("");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editingEstimation, setEditingEstimation] = useState(null);
  const [errors, setErrors] = useState({});
   const [searchTerm, setSearchTerm] = useState("");
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [nextRequisitionId, setNextRequisitionId] = useState("001");

  // Fetch quotations
  const fetchQuotationList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/quotations`
      );
      setQuotations(res.data);
      console.log("quotations", res.data);
    } catch (error) {
      console.error("Failed to fetch quotations", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchQuotationList();
  }, [fetchQuotationList]);

   
  // Fetch quotation items and supplier when forDemand changes
  useEffect(() => {
   setLoading(true)
    const fetchQuotationItems = async () => {
      if (!forDemand) {
        setQuotationItems([]);
        setItemsList([]);
        setTotal("");
        setSupplier("");
        return;
      }
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/quotations/${forDemand}`
        );
        setQuotationItems(res.data.items || []);
        setItemsList(res.data.items || []);
        setTotal(res.data.totalAmount?.toString() || "");
        setSupplier(res.data.supplier?.supplierName || "");
      } catch (error) {
        console.error("Error fetching quotation items:", error);
        setQuotationItems([]);
        setItemsList([]);
        setTotal("");
        setSupplier("");
      }
      finally{
        setTimeout(() => {
        setLoading(false);
      }, 2000);
      }
    };
    fetchQuotationItems();
  }, [forDemand]);

  // Fetch estimations
  const fetchEstimationList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/estimations`
      );
      setEstimations(res.data);
      console.log("estimations", res.data);
    } catch (error) {
      console.error("Failed to fetch estimations", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchEstimationList();
  }, [fetchEstimationList]);

  // serach filter
  
useEffect(() => {
  if (!searchTerm || !searchTerm.startsWith("EST-")) {
    // if search empty or not starting with REQ-, load all
    fetchEstimationList();
    return;
  }

  const delayDebounce = setTimeout(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/estimations/search/${searchTerm}`
      );
      setEstimations(Array.isArray(res.data) ? res.data : [res.data]); 
     
    } catch (error) {
      console.error("Search estimations failed:", error);
      setEstimations([]);
    } finally {
      setLoading(false);
    }
  }, 1000); 

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);

   useEffect(() => {
      if (estimations.length > 0) {
        const maxNo = Math.max(
          ...estimations.map((r) => {
            const match = r.estimationId?.match(/EST-(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          })
        );
        setNextRequisitionId((maxNo + 1).toString().padStart(3, "0"));
      } else {
        setNextRequisitionId("001"); // first requisition
      }
    }, [estimations]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // Reset form fields
  const resetForm = () => {
    setEstimationId("");
    setSupplier("");
    setItemsList([]);
    setForDemand("");
    setTotal("");
    setDate("");
    setStatus("Pending");
    setEditingEstimation(null);
    setErrors({});
    setIsSliderOpen(false);
    setQuotationItems([]);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedEstimationId = estimationId.trim();
    console.log({trimmedEstimationId});
    
    const trimmedSupplier = supplier.trim();
    const trimmedForDemand = forDemand.trim();
    const trimmedTotal = total.trim();
    const parsedTotal = parseFloat(total);

    if (!trimmedEstimationId) newErrors.estimationId = "Estimation ID is required";
    if (!trimmedSupplier) newErrors.supplier = "Supplier is required";
    if (!trimmedForDemand) newErrors.forDemand = "For Demand is required";
    if (itemsList.length === 0) newErrors.itemsList = "At least one item is required";
    if (!trimmedTotal || isNaN(parsedTotal) || parsedTotal <= 0) {
      newErrors.total = "Total must be a positive number";
    }
    if (!date) newErrors.date = "Date is required";
    if (!status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddClick = () => {
    resetForm();
    setEstimationId(`EST-${nextRequisitionId}`);
    setIsSliderOpen(true);
  };

  const handleEditClick = (estimation) => {
    setEditingEstimation(estimation);
    setEstimationId(estimation.estimationId || ""); // Use quotationNo as estimationId for display
    setSupplier(estimation.supplier?.supplierName || "");
    setItemsList(estimation.items || []);
    setForDemand(estimation.demandItem?._id || "");
    setTotal(estimation.totalAmount?.toString() || "");
    setDate(formatDate(estimation.date));
    setStatus(estimation.status ); // Map boolean to string for form
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { token } = userInfo || {};

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

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

    const selectedQuotation = quotations.find((q) => q._id === forDemand);

    if (!selectedQuotation) {
      Swal.fire({
        icon: "error",
        title: "Invalid Selection",
        text: "Please select a valid quotation.",
      });
      return;
    }

    const newEstimation = {
      estimationId: editingEstimation
        ? estimationId
        : `EST-${nextRequisitionId}`,

      demandItem: forDemand,
      status,
      
    };


    console.log("Payload being sent:", newEstimation);

    try {
      if (editingEstimation) {
        // Update estimation
        const res = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/estimations/${editingEstimation._id}`,
          newEstimation,
          { headers }   // ✅ Pass headers here
        );

        setEstimations((prev) =>
          prev.map((e) =>
            e._id === editingEstimation._id ? { ...e, ...res.data } : e
          )
        );

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Estimation updated successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        // Create estimation
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/estimations`,
          newEstimation,
          { headers }   // ✅ Pass headers here
        );

        setEstimations([...estimations, res.data]);

        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Estimation added successfully.",
          confirmButtonColor: "#3085d6",
        });
      }

      resetForm();
    } catch (error) {
      console.error("Error saving estimation:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to save estimation.",
        confirmButtonColor: "#d33",
      });
    }
  };

console.log("Not ", forDemand);

// Handle Delete
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

    try {
      const result = await swalWithTailwindButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/estimations/${id}`);
        setEstimations(estimations.filter((e) => e._id !== id));
        swalWithTailwindButtons.fire({
          icon: "success",
          title: "Deleted!",
          text: "Estimation deleted successfully.",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error deleting estimation:", error.response?.data || error.message);
      swalWithTailwindButtons.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete estimation.",
        confirmButtonColor: "#d33",
      });
    }
  };


  // Map quotation _id to quotationNo for display
  const getQuotationNo = (quotationId) => {
    const quotation = quotations.find((q) => q._id === quotationId);
    return quotation ? quotation.quotationNo : quotationId;
  };



  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* common Header */}
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Estimation Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* ✅ Search Input */}
            <input
              type="text"
              placeholder="Enter EST No eg: EST-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />

            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddClick}
            >
                + Add Estimation
            </button>
          </div>
         
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[400px]">
            <div className="min-w-[1200px]">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-8 gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Estimation ID</div>
                <div>Supplier</div>
                <div>Created By</div>
                <div>For Demand</div>
                <div>Total Amount</div>
                <div>Date</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton
                    rows={estimations.length || 5}
                    cols={8}
                    className="lg:grid-cols-8"
                  />
                ) : estimations.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No estimations found.
                  </div>
                ) : (
                  estimations.map((estimation) => (
                    <div
                      key={estimation._id}
                      className="grid grid-cols-1 lg:grid-cols-8 items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="font-medium text-gray-900">{estimation.estimationId}</div>
                      <div className="text-gray-600">{estimation?.demandItem?.supplier?.supplierName}</div>
                      <div className="text-gray-600">{estimation?.demandItem?.createdBy}</div>
                       {estimation?.demandItem?.quotationNo}
                      {/* <div className="text-gray-600">{estimation.rate}</div> */}
                      <div className="text-gray-600">{estimation?.totalAmount}</div>
                      <div className="text-gray-500">{formatDate(estimation.date)}</div>
                      <div className="text-gray-600">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${estimation.status==="Pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                            }`}
                        >
                          {estimation.status}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => handleEditClick(estimation)}
                          className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
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
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Estimation ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                      value={estimationId}
                    onChange={(e) => setEstimationId(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${errors.estimationId
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-newPrimary"
                      }`}
                    placeholder="Enter estimation ID"
                    required
                  />
                  {errors.estimationId && (
                    <p className="text-red-500 text-xs mt-1">{errors.estimationId}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${errors.date
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
                    For Demand <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={forDemand}
                    onChange={(e) => setForDemand(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${errors.forDemand
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-newPrimary"
                      }`}
                  >
                    <option value="">Select Quotation</option>
                    {quotations.map((q) => (
                      <option key={q._id} value={q._id}>
                        {q.quotationNo} - {q.supplier?.supplierName}
                      </option>
                    ))}
                  </select>
                  {errors.forDemand && (
                    <p className="text-red-500 text-xs mt-1">{errors.forDemand}</p>
                  )}
                </div>
                {quotationItems.length > 0 && (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 border">Item Name</th>
                          <th className="px-4 py-2 border">Quantity</th>
                          <th className="px-4 py-2 border">Price</th>
                          <th className="px-4 py-2 border">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotationItems.map((item) => (
                          <tr key={item._id}>
                            <td className="px-4 text-center py-2 border">{item.itemName}</td>
                            <td className="px-4 text-center py-2 border">{item.qty}</td>
                            <td className="px-4 text-center py-2 border">{item.price}</td>
                            <td className="px-4 text-center py-2 border">{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-2 text-right font-semibold">
                      Total Amount: {total}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Supplier <span className="text-red-500">*</span>
                  </label>

                  <input
                    list="suppliers"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${errors.supplier
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-newPrimary"
                      }`}
                    disabled={!!forDemand} // Disable when a quotation is selected
                    required
                    readOnly={!!forDemand} // Make read-only when a quotation is selected
                  />



                  {errors.supplier && (
                    <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
                  )}
                </div>


                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${errors.status
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
                    : editingEstimation
                      ? "Update Estimation"
                      : "Save Estimation"}
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