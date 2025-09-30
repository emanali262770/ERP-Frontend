import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";

const QualityChecking = () => {
  const [qualityChecks, setQualityChecks] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qcId, setQcId] = useState("");
  const [gpId, setGpId] = useState("");
  const [date, setDate] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [result, setResult] = useState("");
  const [editingQC, setEditingQC] = useState(null);
  const [errors, setErrors] = useState({});
  const sliderRef = useRef(null);
  // 🔹 QC Modal states
  const [qcModalOpen, setQcModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalRemarks, setModalRemarks] = useState("");
  const [modalResult, setModalResult] = useState("");

  // 🔹 Open per-item QC Modal
  const openQcModal = (item) => {
    setSelectedItem(item);
    setModalRemarks(item.remarks || "");
    setModalResult(item.result || "");
    setQcModalOpen(true);
  };

  // 🔹 Save per-item QC Modal
  const saveQcModal = () => {
    setItemsList((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id
          ? { ...i, remarks: modalRemarks, result: modalResult }
          : i
      )
    );
    setQcModalOpen(false);
  };
  // 🔹 Add this static mapping at the top of your component
  const gatePassItems = {
    GP001: [
      { id: 1, name: "Laptop", qty: 5, price: 50000 },
      { id: 2, name: "Notebook", qty: 10, price: 200 },
    ],
    GP002: [
      { id: 3, name: "Keyboard", qty: 15, price: 1500 },
      { id: 4, name: "Mouse", qty: 20, price: 700 },
    ],
  };

  // 🔹 Whenever gpId changes, load items
  useEffect(() => {
    if (gpId && gatePassItems[gpId]) {
      setItemsList(gatePassItems[gpId]);
    } else {
      setItemsList([]);
    }
  }, [gpId]);

  // Static data
  const staticData = [
    {
      _id: "1",
      qcId: "QC001",
      date: "2025-09-01",
      items: [{ name: "Laptop", qty: 5 }],
      description: "Laptop batch inspection",
      remarks: "Looks fine",
      result: "uptoStandard",
    },
    {
      _id: "2",
      qcId: "QC002",
      date: "2025-09-15",
      items: [{ name: "Notebooks", qty: 10 }],
      description: "Stationery quality check",
      remarks: "Few damaged covers",
      result: "damage",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    setLoading(true);
    setQualityChecks(staticData);
    setTimeout(() => setLoading(false), 800);
  }, []);

  const resetForm = () => {
    setQcId("");
    setDate("");
    setItemsList([]);
    setItemName("");
    setItemQuantity("");
    setDescription("");
    setRemarks("");
    setResult("");
    setEditingQC(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  const handleAddClick = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (qc) => {
    setEditingQC(qc);
    setQcId(qc.qcId);
    setQcId(qc.gpId);
    setDate(qc.date);
    setItemsList(qc.items);
    setDescription(qc.description);
    setRemarks(qc.remarks);
    setResult(qc.result);
    setIsSliderOpen(true);
  };

  // ✅ Right here (line ~118 in your paste)
  const handleAddItem = () => {
    if (!itemName || !itemQuantity || parseInt(itemQuantity, 10) <= 0) {
      Swal.fire(
        "Invalid Item",
        "Please enter valid item and quantity.",
        "warning"
      );
      return;
    }
    setItemsList([
      ...itemsList,
      { name: itemName, qty: parseInt(itemQuantity, 10) },
    ]);
    setItemName("");
    setItemQuantity("");

    if (!itemName || !itemQuantity || parseInt(itemQuantity, 10) <= 0) {
      Swal.fire(
        "Invalid Item",
        "Please enter valid item and quantity.",
        "warning"
      );
      return;
    }
    setItemsList([
      ...itemsList,
      { name: itemName, qty: parseInt(itemQuantity, 10) },
    ]);
    setItemName("");
    setItemQuantity("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!qcId.trim()) newErrors.qcId = "QC ID is required";
    if (!gpId.trim()) newErrors.gpId = "Gate Pass ID is required";
    if (!date) newErrors.date = "Date is required";
    if (itemsList.length === 0)
      newErrors.itemsList = "At least one item is required";
    if (!result) newErrors.result = "Result is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newQC = {
      _id: editingQC ? editingQC._id : Date.now().toString(),
      qcId: qcId.trim(),
      date,
      items: itemsList,
      description,
      remarks,
      result,
    };

    if (editingQC) {
      setQualityChecks(
        qualityChecks.map((q) => (q._id === editingQC._id ? newQC : q))
      );
      Swal.fire("Updated!", "Quality check updated successfully.", "success");
    } else {
      setQualityChecks([...qualityChecks, newQC]);
      Swal.fire("Added!", "Quality check added successfully.", "success");
    }

    resetForm();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setQualityChecks(qualityChecks.filter((q) => q._id !== id));
        Swal.fire("Deleted!", "Record has been deleted.", "success");
      }
    });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-newPrimary">
            Quality Checking Details
          </h1>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={handleAddClick}
          >
            + Add Quality Checking
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[400px]">
            <div className="min-w-[900px]">
              <div className="hidden lg:grid grid-cols-[1fr_2fr_2fr_2fr_1fr_1fr_auto] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0">
                <div>QC ID</div>
                <div>Items</div>
                <div>Description</div>
                <div>Remarks</div>
                <div>Date</div>
                <div>Result</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton rows={3} cols={7} />
                ) : qualityChecks.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No records found.
                  </div>
                ) : (
                  qualityChecks.map((qc) => (
                    <div
                      key={qc._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_2fr_2fr_1fr_1fr_auto] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50"
                    >
                      <div className="font-medium">{qc.qcId}</div>
                      <div>
                        {qc.items.map((i, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 rounded mr-2"
                          >
                            {i.name} ({i.qty})
                          </span>
                        ))}
                      </div>
                      <div>{qc.description}</div>
                      <div>{qc.remarks}</div>
                      <div>{formatDate(qc.date)}</div>
                      <div className="capitalize">{qc.result}</div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEditClick(qc)}
                          className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(qc._id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
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

        {/* Slider Form */}
        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[500px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingQC ? "Update Quality Check" : "Add Quality Check"}
                </h2>
                <button
                  className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div className="grid grid-cols-2 items-center gap-4">
                  {/* QC ID */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      QC ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={qcId}
                      onChange={(e) => setQcId(e.target.value)}
                      className="w-full p-3 border rounded-md"
                    />
                    {errors.qcId && (
                      <p className="text-red-500 text-xs">{errors.qcId}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 border rounded-md"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs">{errors.date}</p>
                    )}
                  </div>
                </div>

                {/* Gate Pass In ID */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Gate Pass In Id <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gpId}
                    onChange={(e) => setGpId(e.target.value)}
                    className="w-full p-3 border rounded-md"
                    required
                  >
                    <option value="">Select Gate Pass</option>
                    <option value="GP001">GP001</option>
                  </select>

                  {errors.gpId && (
                    <p className="text-red-500 text-xs">{errors.gpId}</p>
                  )}
                </div>

                {gpId && itemsList.length > 0 && (
                  <table className="w-full border mt-4">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Item</th>
                        <th className="border p-2">Quantity</th>
                        <th className="border p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsList.map((item) => (
                        <tr key={item.id} className="text-center">
                          <td className="border p-2">{item.name}</td>
                          <td className="border p-2">{item.qty}</td>
                          <td className="border p-2 text-center">
                            {item.result === "uptoStandard" ? (
                              <div
                                className="w-6 h-6 mx-auto rounded-full bg-green-500 text-white cursor-pointer"
                                onClick={() => openQcModal(item)}
                              >
                                ✓
                              </div>
                            ) : item.result === "damage" ||
                              item.result === "rejected" ? (
                              <div
                                className="w-6 h-6 mx-auto rounded-full bg-red-500 text-white cursor-pointer"
                                onClick={() => openQcModal(item)}
                              >
                                ✕
                              </div>
                            ) : (
                              <div
                                className="w-6 h-6 border rounded-full cursor-pointer mx-auto"
                                onClick={() => openQcModal(item)}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                {/* <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="qcResult"
                      value="uptoStandard"
                      checked={result === "uptoStandard"}
                      onChange={(e) => setResult(e.target.value)}
                    />
                    Upto Standard
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="qcResult"
                      value="damage"
                      checked={result === "damage"}
                      onChange={(e) => setResult(e.target.value)}
                    />
                    Damage
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="qcResult"
                      value="rejected"
                      checked={result === "rejected"}
                      onChange={(e) => setResult(e.target.value)}
                    />
                    Rejected
                  </label>
                </div> */}
                {errors.result && (
                  <p className="text-red-500 text-xs">{errors.result}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white py-3 rounded-lg"
                >
                  {editingQC ? "Update" : "Save"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* QC Modal */}
        {qcModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-lg font-semibold text-newPrimary">
                  Quality Check
                </h2>
                <button
                  onClick={() => setQcModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white"
                >
                  ×
                </button>
              </div>

              <label className="block text-gray-700 font-medium mb-1">
                Remarks
              </label>
              <input
                type="text"
                value={modalRemarks}
                onChange={(e) => setModalRemarks(e.target.value)}
                className="w-full p-3 border rounded-md mb-4"
                placeholder="Enter remarks..."
              />

              <div className="flex gap-4 mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="qcResult"
                    value="uptoStandard"
                    checked={modalResult === "uptoStandard"}
                    onChange={(e) => setModalResult(e.target.value)}
                  />
                  Upto Standard
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="qcResult"
                    value="damage"
                    checked={modalResult === "damage"}
                    onChange={(e) => setModalResult(e.target.value)}
                  />
                  Damage
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="qcResult"
                    value="rejected"
                    checked={modalResult === "rejected"}
                    onChange={(e) => setModalResult(e.target.value)}
                  />
                  Rejected
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setQcModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveQcModal}
                  className="px-4 py-2 rounded-lg bg-newPrimary text-white hover:bg-newPrimary/80"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityChecking;
