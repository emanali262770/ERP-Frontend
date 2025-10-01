import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";
import gsap from "gsap";

const Tax = () => {
  const [taxes, setTaxes] = useState([
    {
      _id: "1",
      taxName: "GST",
      value: 18,
    },
    {
      _id: "2",
      taxName: "VAT",
      value: 12,
    },
    {
      _id: "3",
      taxName: "Sales Tax",
      value: 5,
    },
  ]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taxName, setTaxName] = useState("");
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTax, setEditingTax] = useState(null);
  const [errors, setErrors] = useState({});
  const [nextTaxId, setNextTaxId] = useState("004");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // GSAP Animation for Modal
  useEffect(() => {
    if (isSliderOpen) {
      if (sliderRef.current) {
        sliderRef.current.style.display = "block"; // ensure visible before animation
      }
      gsap.fromTo(
        sliderRef.current,
        { scale: 0.7, opacity: 0, y: -50 }, // start smaller & slightly above
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    } else {
      gsap.to(sliderRef.current, {
        scale: 0.7,
        opacity: 0,
        y: -50,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          if (sliderRef.current) {
            sliderRef.current.style.display = "none";
          }
        },
      });
    }
  }, [isSliderOpen]);

  // Simulate fetching tax data
  const fetchTaxes = useCallback(async () => {
    try {
      setLoading(true);
      // Static data already set in state
    } catch (error) {
      console.error("Failed to fetch taxes", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  // Tax search
  useEffect(() => {
    if (!searchTerm) {
      fetchTaxes();
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        setLoading(true);
        const filtered = taxes.filter((tax) =>
          tax.taxName.toUpperCase().includes(searchTerm.toUpperCase())
        );
        setTaxes(filtered);
      } catch (error) {
        console.error("Search tax failed:", error);
        setTaxes([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchTaxes, taxes]);

  // Generate next tax ID
  useEffect(() => {
    if (taxes.length > 0) {
      const maxNo = Math.max(...taxes.map((t, index) => index + 1));
      setNextTaxId((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextTaxId("001");
    }
  }, [taxes]);

  // Reset form fields
  const resetForm = () => {
    setTaxName("");
    setValue("");
    setEditingTax(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedTaxName = taxName.trim();
    const trimmedValue = value.trim();
    const parsedValue = parseFloat(value);

    if (!trimmedTaxName) newErrors.taxName = "Tax Name is required";
    if (
      !trimmedValue ||
      isNaN(parsedValue) ||
      parsedValue < 0 ||
      parsedValue > 100
    ) {
      newErrors.value = "Tax Value must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddTax = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (tax) => {
    setEditingTax(tax);
    setTaxName(tax.taxName || "");
    setValue(tax.value || "");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newTax = {
      taxName: taxName.trim(),
      value: parseFloat(value),
    };

    try {
      if (editingTax) {
        setTaxes((prev) =>
          prev.map((t) =>
            t._id === editingTax._id ? { ...t, ...newTax, _id: t._id } : t
          )
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Tax updated successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setTaxes((prev) => [...prev, { ...newTax, _id: `temp-${Date.now()}` }]);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Tax added successfully.",
          confirmButtonColor: "#3085d6",
        });
      }
      fetchTaxes();
      resetForm();
    } catch (error) {
      console.error("Error saving tax:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save tax.",
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
            setTaxes((prev) => prev.filter((t) => t._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Tax deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete tax.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire("Cancelled", "Tax is safe 🙂", "error");
        }
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = taxes.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(taxes.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">Tax Details</h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter Tax Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />
            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddTax}
            >
              + Add Tax
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
            <div className="min-w-[600px]">
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Tax Name</div>
                <div>Value (%)</div>
                <div>Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton
                    rows={recordsPerPage}
                    cols={3}
                    className="lg:grid-cols-[1fr_1fr_1fr]"
                  />
                ) : currentRecords.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No taxes found.
                  </div>
                ) : (
                  currentRecords.map((tax) => (
                    <div
                      key={tax._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">{tax.taxName}</div>
                      <div className="text-gray-600">{tax.value}</div>
                      <div className="flex gap-3 justify-start">
                        <button
                          onClick={() => handleEditClick(tax)}
                          className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(tax._id)}
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
                {Math.min(indexOfLastRecord, taxes.length)} of {taxes.length}{" "}
                records
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
              className="w-full md:w-[500px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingTax ? "Update Tax" : "Add a New Tax"}
                </h2>
                <button
                  className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="flex-1 min-w-0">
                  <label className="block text-gray-700 font-medium mb-2">
                    Tax Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={taxName}
                    onChange={(e) => setTaxName(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.taxName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-newPrimary"
                    }`}
                    placeholder="Enter tax name"
                    required
                  />
                  {errors.taxName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.taxName}
                    </p>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-gray-700 font-medium mb-2">
                    Value (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.value
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-newPrimary"
                    }`}
                    placeholder="Enter tax value"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                  {errors.value && (
                    <p className="text-red-500 text-xs mt-1">{errors.value}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading
                    ? "Saving..."
                    : editingTax
                    ? "Update Tax"
                    : "Save Tax"}
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

export default Tax;
