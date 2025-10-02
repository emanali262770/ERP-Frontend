import React, { useState, useEffect, useRef, useCallback } from "react";
import { Eye, SquarePen, Trash2, X } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton"; // Ensure this component exists
import Swal from "sweetalert2";
import axios from "axios";
import ViewModel from "./ViewModel";

const GRN = () => {
  const [grns, setGrns] = useState([
    {
      _id: "grn1",
      grnId: "GRN001",
      gatePassIn: "GP001",
      supplier: { _id: "sup1", supplierName: "ABC Supplies" },
      address: "123 Main St, City",
      phone: "123-456-7890",
      date: "2025-09-20",
      items: [
        { item: "Laptop", qty: 5, description: "High-end gaming laptop" },
        { item: "Mouse", qty: 10, description: "Wireless mouse" },
      ],
    },
    {
      _id: "grn2",
      grnId: "GRN002",
      gatePassIn: "GP002",
      supplier: { _id: "sup2", supplierName: "XYZ Corp" },
      address: "456 Oak Ave, Town",
      phone: "987-654-3210",
      date: "2025-09-21",
      items: [{ item: "Monitor", qty: 3, description: "24-inch LED monitor" }],
    },
  ]);

  const [gatePassOptions, setGatePassOptions] = useState([
    { _id: "gp1", gatePassId: "GP001" },
    { _id: "gp2", gatePassId: "GP002" },
  ]);

  const [itemOptions, setItemOptions] = useState([
    { _id: "item1", itemName: "Laptop" },
    { _id: "item2", itemName: "Mouse" },
    { _id: "item3", itemName: "Monitor" },
    { _id: "item4", itemName: "Keyboard" },
  ]);

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grnId, setGrnId] = useState("");
  const [date, setDate] = useState("");
  const [gatePassIn, setGatePassIn] = useState("");
  const [supplier, setSupplier] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [description, setDescription] = useState("");
  const [isEnable, setIsEnable] = useState(true);
  const [isView, setIsView] = useState(false);
  const [editingGrn, setEditingGrn] = useState(null);
  const [selectedGrn, setSelectedGrn] = useState(null);
  const sliderRef = useRef(null);
  const [errors, setErrors] = useState({});
  

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Handle adding items to the table in the form
  const handleAddItem = () => {
    if (!item || !qty || !description) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "⚠️ Please fill in all item fields.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const newItem = {
      item,
      qty: parseInt(qty, 10),
      description,
    };

    setItemsList([...itemsList, newItem]);
    setItem("");
    setQty("");
    setDescription("");
  };

  // Fetch gate pass options
  const fetchGatePassOptions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/gate-passes`
      );
      setGatePassOptions(res.data);
    } catch (error) {
      console.error("Failed to fetch gate pass options", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, []);

  useEffect(() => {
    fetchGatePassOptions();
  }, [fetchGatePassOptions]);

  // Fetch item options
  const fetchItemOptions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/items`);
      setItemOptions(res.data);
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, []);

  useEffect(() => {
    fetchItemOptions();
  }, [fetchItemOptions]);

  // Fetch GRNs
  const fetchGrns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/grns`);
      setGrns(res.data);
    } catch (error) {
      console.error("Failed to fetch GRNs", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, []);

  useEffect(() => {
    fetchGrns();
  }, [fetchGrns]);

  // Handlers for form and table actions
  const handleAddClick = () => {
    setEditingGrn(null);
    setGrnId("");
    setDate("");
    setGatePassIn("");
    setSupplier("");
    setAddress("");
    setPhone("");
    setItemsList([]);
    setItem("");
    setQty("");
    setDescription("");
    setIsEnable(true);
    setIsSliderOpen(true);
  };

  const handleEditClick = (grn) => {
    setEditingGrn(grn);
    setGrnId(grn.grnId);
    setDate(formatDate(grn.date));
    setGatePassIn(grn.gatePassIn);
    setSupplier(grn.supplier?.supplierName || "");
    setAddress(grn.address);
    setPhone(grn.phone);
    setItemsList(grn.items || []);
    setIsEnable(grn.isEnable);
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !grnId ||
      !date ||
      !gatePassIn ||
      !supplier ||
      !address ||
      !phone ||
      itemsList.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "⚠️ Please fill in all required fields and add at least one item.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const { token } = userInfo || {};
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const newGrn = {
      grnId,
      date,
      gatePassIn,
      supplier,
      address,
      phone,
      items: itemsList,
      isEnable,
    };

    try {
      if (editingGrn) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/grns/${editingGrn._id}`,
          newGrn,
          { headers }
        );
        Swal.fire("Updated!", "GRN updated successfully.", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/grns`, newGrn, {
          headers,
        });
        Swal.fire("Added!", "GRN added successfully.", "success");
      }

      fetchGrns();
      setIsSliderOpen(false);
      setItemsList([]);
    } catch (error) {
      console.error("Error saving GRN", error);
      Swal.fire("Error!", "Something went wrong while saving.", "error");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Invalid Date";

    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = parsed.getFullYear();

    return `${year}-${month}-${day}`; // YYYY-MM-DD for input type date
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

            await axios.delete(
              `${import.meta.env.VITE_API_BASE_URL}/grns/${id}`,
              { headers }
            );

            setGrns(grns.filter((g) => g._id !== id));

            swalWithTailwindButtons.fire(
              "Deleted!",
              "GRN deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete GRN.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire("Cancelled", "GRN is safe 🙂", "error");
        }
      });
  };

  const handleView = (grn) => {
    setSelectedGrn(grn);
    setIsView(true);
  };

  const closeModal = () => {
    setIsView(false);
    setSelectedGrn(null);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Goods Received Note Details
            </h1>
          </div>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={handleAddClick}
          >
            + Add GRN
          </button>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="inline-block min-w-[1200px] w-full align-middle">
                <div className="hidden lg:grid grid-cols-7 gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                  <div>GRN ID</div>
                  <div>Gate Pass QC.</div>
                  <div>Supplier</div>
                  <div>Address</div>
                  <div>Phone</div>
                  <div>Date</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="flex flex-col divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton
                      rows={3}
                      cols={7}
                      className="lg:grid-cols-7"
                    />
                  ) : grns.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-white">
                      No GRNs found.
                    </div>
                  ) : (
                    grns.map((grn) => (
                      <div
                        key={grn._id}
                        className="grid grid-cols-1 lg:grid-cols-7 items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                      >
                        <div className="font-medium text-gray-900">
                          {grn.grnId}
                        </div>
                        <div className="text-gray-600">{grn.gatePassIn}</div>
                        <div className="text-gray-600">
                          {grn.supplier?.supplierName || "N/A"}
                        </div>
                        <div className="text-gray-600">{grn.address}</div>
                        <div className="text-gray-600">{grn.phone}</div>
                        <div className="text-gray-500">
                          {formatDate(grn.date)}
                        </div>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEditClick(grn)}
                            className="py-1 text-sm rounded text-blue-600"
                            title="Edit"
                          >
                            <SquarePen size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(grn._id)}
                            className="py-1 text-sm text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => handleView(grn)}
                            className="text-amber-600 hover:underline"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingGrn ? "Update GRN" : "Add a New GRN"}
                </h2>
                <button
                  className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                  onClick={() => {
                    setIsSliderOpen(false);
                    setGrnId("");
                    setDate("");
                    setGatePassIn("");
                    setSupplier("");
                    setAddress("");
                    setPhone("");
                    setItemsList([]);
                    setItem("");
                    setQty("");
                    setDescription("");
                    setIsEnable(true);
                    setEditingGrn(null);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      GRN ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={grnId}
                      onChange={(e) => setGrnId(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter GRN ID"
                      required
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Gate Pass QC. <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gatePassIn}
                      onChange={(e) => setGatePassIn(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      required
                    >
                      <option value="">Select Gate Pass QC </option>
                      {gatePassOptions.map((gp) => (
                        <option key={gp._id} value={gp.gatePassId}>
                          {gp.gatePassId}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter supplier name"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter address"
                      required
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                {/* Section */}
                <div className="space-y-4 border p-4 rounded-lg bg-formBgGray">
                  <div className="flex gap-4">
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-700 font-medium mb-2">
                          Item
                        </label>
                        <select
                          value={item}
                          onChange={(e) => setItem(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        >
                          <option value="">Select Item</option>
                          {itemOptions.map((opt) => (
                            <option key={opt._id} value={opt.itemName}>
                              {opt.itemName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-700 font-medium mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                          placeholder="Enter quantity"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0">
                        <label className="block text-gray-700 font-medium mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                          placeholder="Enter description"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="w-40 h-12 bg-newPrimary text-white rounded-lg hover:bg-newPrimary/80 transition"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                  {itemsList.length > 0 && (
                    <div className="overflow-x-auto">
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                          <thead className="bg-gray-100 text-gray-600 text-sm">
                            <tr>
                              <th className="px-4 py-2 border border-gray-300">
                                Sr #
                              </th>
                              <th className="px-4 py-2 border border-gray-300">
                                Item
                              </th>
                              <th className="px-4 py-2 border border-gray-300">
                                Qty
                              </th>
                              <th className="px-4 py-2 border border-gray-300">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 text-sm">
                            {itemsList.map((item, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-gray-50 text-center"
                              >
                                <td className="px-4 py-2 border border-gray-300 text-center">
                                  {idx + 1}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                  {item.item}
                                </td>
                                <td className="px-4 py-2 border border-gray-300 text-center">
                                  {item.qty}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                  {item.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading
                    ? "Saving..."
                    : editingGrn
                    ? "Update GRN"
                    : "Save GRN"}
                </button>
              </form>
            </div>
          </div>
        )}
        {isView && selectedGrn && (
          <ViewModel grn={selectedGrn} onClose={() => setIsView(false)} />
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

export default GRN;
