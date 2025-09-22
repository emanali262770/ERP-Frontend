import React, { useState, useEffect, useCallback, useRef } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CommanHeader from "../../components/CommanHeader";
import { SquarePen, Trash2 } from "lucide-react";
import TableSkeleton from "./Skeleton";

const Promotion = () => {
  const [categories, setCategories] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isEnable, setIsEnable] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const sliderRef = useRef(null);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/categories`;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // ✅ Static data for now
  useEffect(() => {
    setCategories([
      {
        _id: "1",
        categoryName: "Summer Sale",
        details: "Flat 30% off on all summer items",
        startDate: "2025-06-01",
        endDate: "2025-06-30",
        isEnable: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        categoryName: "Winter Clearance",
        details: "Up to 50% off on jackets",
        startDate: "2025-12-01",
        endDate: "2025-12-31",
        isEnable: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // Slider animation
  useEffect(() => {
    if (isSliderOpen && sliderRef.current) {
      gsap.fromTo(
        sliderRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.2, ease: "expo.out" }
      );
    }
  }, [isSliderOpen]);

  // Handlers
  const handleAddClick = () => {
    setEditingCategory(null);
    setCategoryName("");
    setDetails("");
    setStartDate("");
    setEndDate("");
    setIsEnable(true);
    setIsSliderOpen(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setCategoryName(category.categoryName);
    setIsEnable(category.isEnable);
    setDetails(category.details || "");
    setStartDate(category.startDate || "");
    setEndDate(category.endDate || "");
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      toast.error("❌ Category name cannot be empty.");
      return;
    }

    setLoading(true);

    // 🔹 Payload
    const payload = {
      categoryName: trimmedName,
      isEnable,
      details,
      startDate,
      endDate,
    };

    try {
      if (editingCategory) {
        setCategories(
          categories.map((c) =>
            c._id === editingCategory._id
              ? {
                  ...payload,
                  _id: editingCategory._id,
                  createdAt: editingCategory.createdAt,
                }
              : c
          )
        );
        toast.success("✅ Promotion updated!");
      } else {
        setCategories([
          ...categories,
          {
            ...payload,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          },
        ]);
        toast.success("✅ Promotion added!");
      }

      // Reset form state
      setIsSliderOpen(false);
      setCategoryName("");
      setDetails("");
      setStartDate("");
      setEndDate("");
      setIsEnable(true);
      setEditingCategory(null);
    } catch (error) {
      console.error(error);
      toast.error(
        `❌ Failed to ${editingCategory ? "update" : "add"} promotion.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnable = async (category) => {
    setCategories(
      categories.map((c) =>
        c._id === category._id ? { ...c, isEnable: !c.isEnable } : c
      )
    );
    toast.success(
      `✅ Promotion ${!category.isEnable ? "enabled" : "disabled"}.`
    );
  };

  const handleDelete = async (categoryId) => {
    setCategories(categories.filter((c) => c._id !== categoryId));
    toast.success("✅ Promotion deleted!");
  };

  //   if (loading) {
  //     return (
  //       <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
  //         <div className="text-center">
  //           <HashLoader height="150" width="150" radius={1} color="#84CF16" />
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Coomon header */}
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Promotion Details
            </h1>
          </div>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={handleAddClick}
          >
            + Add Promotions
          </button>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[400px]">
            <div className="min-w-[800px]">
              {/* ✅ Table Header */}
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Promotion Name</div>
                <div>Details</div>
                <div>Start Date</div>
                <div>End Date</div>
                <div className="text-right">Actions</div>
              </div>

              {/* ✅ Table Body */}
              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  // Skeleton shown while loading
                  <TableSkeleton
                    rows={categories.length > 0 ? categories.length : 5}
                    cols={userInfo?.isAdmin ? 5 : 6}
                    className="lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
                  />
                ) : categories.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No promotions found.
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category._id}
                      className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      {/* Promotion Name */}
                      <div className="font-medium text-gray-900">
                        {category.categoryName}
                      </div>

                      {/* Details */}
                      <div className="text-gray-600 truncate">
                        {category.details}
                      </div>

                      {/* Start Date */}
                      <div className="text-gray-500 text-end  max-w-32">
                        {category.startDate}
                      </div>

                      {/* End Date */}
                      <div className="text-gray-500 text-end max-w-40">
                        {category.endDate}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="px-3 py-1 text-sm rounded  text-blue-600 "
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleEnable(category)}
                          className={`px-3 py-1 text-sm rounded ${
                            category.isEnable
                              ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                        >
                          {category.isEnable ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="px-3 py-1 text-sm rounded  text-red-600 "
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
              className="w-full max-w-md bg-white p-4 h-full overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingCategory ? "Update Promotion" : "Add a New Promotion"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setIsSliderOpen(false);
                    setCategoryName("");
                    setDetails("");
                    setStartDate("");
                    setEndDate("");
                    setIsEnable(true);
                    setEditingCategory(null);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Promotion Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-4">
                    Promotion Name <span className="text-newPrimary">*</span>
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter promotion name"
                    required
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-gray-700 font-medium mb-4">
                    Details
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter promotion details"
                    rows="3"
                  />
                </div>

                {/* Start / End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    />
                  </div>
                </div>

                {/* Status Enable */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium">Status</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEnable(!isEnable)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        isEnable ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          isEnable ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-sm font-medium ${
                        isEnable ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isEnable ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-4 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-newPrimary/50"
                >
                  {loading ? "Saving..." : "Save Promotion"}
                </button>
              </form>
            </div>
          </div>
        )}

        <style jsx>{`
          .table-container {
            max-width: 100%;
          }
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
          @media (max-width: 1024px) {
            .grid-cols-\[60px_2fr_1fr_2fr_1fr\] {
              grid-template-columns: 60px 1.5fr 0.8fr 1.5fr 0.8fr;
            }
          }
          @media (max-width: 640px) {
            .grid-cols-\[60px_2fr_1fr_2fr_1fr\] {
              grid-template-columns: 50px 1.2fr 0.6fr 1.2fr 0.6fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Promotion;
