import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import { SquarePen, Trash2, X } from "lucide-react";
import TableSkeleton from "../Skeleton";

const PurchaseReturn = () => {
  const [returnList, setReturnList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form states
  const [returnId, setReturnId] = useState("");
  const [date, setDate] = useState("");
  const [gatePass, setGatePass] = useState("");
  const [supplier, setSupplier] = useState("");
  const [poId, setPoId] = useState("");
  const [items, setItems] = useState([]);

  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState("");
  const [damageQty, setDamageQty] = useState("");
  const [goodQty, setGoodQty] = useState("");

  const sliderRef = useRef(null);

  // Animate Slider
  useEffect(() => {
    if (isSliderOpen) {
      gsap.fromTo(
        sliderRef.current,
        { scale: 0.7, opacity: 0, y: -50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isSliderOpen]);

  // Handlers
  const handleAddReturn = () => {
    resetForm();
    setIsSliderOpen(true);
    setIsEdit(false);
  };

  const resetForm = () => {
    setReturnId("");
    setDate("");
    setGatePass("");
    setSupplier("");
    setPoId("");
    setItems([]);
    setItemName("");
    setQty("");
    setDamageQty("");
    setGoodQty("");
    setEditId(null);
  };

  const handleAddItem = () => {
    if (!itemName || !qty) return;
    setItems([
      ...items,
      {
        id: Date.now(),
        name: itemName,
        qty: parseInt(qty),
        damage: parseInt(damageQty) || 0,
        good: parseInt(goodQty) || 0,
      },
    ]);
    setItemName("");
    setQty("");
    setDamageQty("");
    setGoodQty("");
  };

  const handleSave = () => {
    const newReturn = {
      id: isEdit ? editId : Date.now(),
      returnId,
      date,
      gatePass,
      supplier,
      poId,
      items,
    };

    if (isEdit) {
      setReturnList(returnList.map((r) => (r.id === editId ? newReturn : r)));
      Swal.fire("Updated!", "Purchase return updated successfully", "success");
    } else {
      setReturnList([...returnList, newReturn]);
      Swal.fire("Added!", "Purchase return added successfully", "success");
    }

    setIsSliderOpen(false);
    resetForm();
  };

  const handleEdit = (ret) => {
    setIsEdit(true);
    setIsSliderOpen(true);
    setEditId(ret.id);
    setReturnId(ret.returnId);
    setDate(ret.date);
    setGatePass(ret.gatePass);
    setSupplier(ret.supplier);
    setPoId(ret.poId);
    setItems(ret.items);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This return will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        setReturnList(returnList.filter((r) => r.id !== id));
        Swal.fire("Deleted!", "Purchase return deleted", "success");
      }
    });
  };

  function handleRemoveItem(idx) {
    const updatedItems =items.filter((_,index)=> index !== idx);
    setItems(updatedItems)
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CommanHeader />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Purchase Returns</h1>
          <p className="text-gray-500 text-sm">
            Manage your purchase return entries
          </p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
          onClick={handleAddReturn}
        >
          + Add Return
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-[120px_120px_150px_150px_150px_auto] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
              <div>Return ID</div>
              <div>Date</div>
              <div>Gate Pass</div>
              <div>Supplier</div>
              <div>PO ID</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {returnList.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-white">
                  No returns found.
                </div>
              ) : (
                returnList.map((r) => (
                  <div
                    key={r.id}
                    className="hidden lg:grid grid-cols-[120px_120px_150px_150px_150px_auto] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50"
                  >
                    <div>{r.returnId}</div>
                    <div>{r.date}</div>
                    <div>{r.gatePass}</div>
                    <div>{r.supplier}</div>
                    <div>{r.poId}</div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(r)}
                        className="text-blue-600 hover:underline"
                      >
                        <SquarePen size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 hover:underline"
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
            className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-newPrimary">
                {isEdit ? "Update Return" : "Add New Return"}
              </h2>
              <button
                className="w-8 h-8 bg-newPrimary text-white rounded-full"
                onClick={() => setIsSliderOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 font-medium">Return ID</label>
                  <input
                    type="text"
                    value={returnId}
                    onChange={(e) => setReturnId(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium">Gate Pass In</label>
                  <select
                    value={gatePass}
                    onChange={(e) => setGatePass(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Gate Pass</option>
                    <option value="GP001">GP001</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 font-medium">Supplier</label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium">PO ID</label>
                  <input
                    type="text"
                    value={poId}
                    onChange={(e) => setPoId(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
                <div className="flex gap-3 mb-3">

                  <select onClick={itemName} name="" id="" className="w-full p-2 border rounded">
                    <option value="">Select Item Name</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Qty"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-24 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Damage"
                    value={damageQty}
                    onChange={(e) => setDamageQty(e.target.value)}
                    className="w-24 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Good"
                    value={goodQty}
                    onChange={(e) => setGoodQty(e.target.value)}
                    className="w-24 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 bg-newPrimary text-white rounded"
                  >
                    + Add
                  </button>
                </div>

                {/* Items Table */}
                {items.length > 0 && (
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Item</th>
                        <th className="border px-2 py-1">Qty</th>
                        <th className="border px-2 py-1">Damage</th>
                        <th className="border px-2 py-1">Good</th>
                        <th className="border px-2 py-1">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it,idx) => (
                        <tr key={it.id}>
                          <td className="border text-center px-2 py-1">{it.name}</td>
                          <td className="border text-center px-2 py-1">{it.qty}</td>
                          <td className="border text-center px-2 py-1">{it.damage}</td>
                          <td className="border text-center px-2 py-1">{it.good}</td>
                          <td className="px-4 py-2 border-b text-center">
                              <button onClick={() => handleRemoveItem(idx)}>
                                <X size={18} className="text-red-600" />
                              </button>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full bg-newPrimary text-white py-2 rounded-lg"
              >
                {isEdit ? "Update Return" : "Save Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseReturn;
