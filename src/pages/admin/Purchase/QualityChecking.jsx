
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
                  className="w-8 h-8 bg-newPrimary text-white rounded-full"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    QC ID *
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

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Date *
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

                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-gray-700 font-medium mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(e.target.value)}
                      className="w-full p-3 border rounded-md"
                      min="1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="h-12 px-4 bg-newPrimary text-white rounded-lg"
                  >
                    + Add
                  </button>
                </div>

                {itemsList.length > 0 && (
                  <table className="w-full border text-sm mt-2">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 border">#</th>
                        <th className="px-2 py-1 border">Item</th>
                        <th className="px-2 py-1 border">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsList.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1">{idx + 1}</td>
                          <td className="border px-2 py-1">{item.name}</td>
                          <td className="border px-2 py-1 text-center">
                            {item.qty}
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

                <div>
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
                </div>
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
      </div>
    </div>
  );
};

export default QualityChecking;
