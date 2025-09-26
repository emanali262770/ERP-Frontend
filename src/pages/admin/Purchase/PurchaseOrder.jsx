import React, { useState, useEffect, useRef, useCallback } from "react";
import { Eye, SquarePen, Trash2, X } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton"; // Ensure this component exists
import Swal from "sweetalert2";
import axios from "axios";
import ViewModel from "./ViewModel";

const PurchaseOrder = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);

    const [demandItems, setDemandItems] = useState([
        { _id: "di1", itemName: "Laptop Order", supplier: { _id: "sup1", supplierName: "ABC Supplies" } },
        { _id: "di2", itemName: "Desk Order", supplier: { _id: "sup2", supplierName: "XYZ Corp" } },
    ]);
    const [forDemand, setForDemand] = useState("");
    const [estimationItems, setEstimationItems] = useState([]);
  const [quotations, setQuotations] = useState([]);

    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [poNo, setPoNo] = useState("");
    const [date, setDate] = useState("");
    const [demandItem, setDemandItem] = useState("");
    const [supplier, setSupplier] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [tax, setTax] = useState("10%");
    const [totalAmount, setTotalAmount] = useState("1000");
    const [itemsList, setItemsList] = useState([]);
    const [itemCategory, setItemCategory] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemRate, setItemRate] = useState("");
    const [itemQty, setItemQty] = useState("");
    const [isEnable, setIsEnable] = useState(true);
    const [isView, setIsView] = useState(false);
    const [editingPurchaseOrder, setEditingPurchaseOrder] = useState(null);
    const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
    const sliderRef = useRef(null);
      const [errors, setErrors] = useState({});
    

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // Handle adding items to the table in the form
    const handleAddItem = () => {
        if (!itemCategory || !itemName || !itemRate || !itemQty) return;

        const newItem = {
            category: itemCategory,
            name: itemName,
            rate: parseFloat(itemRate),
            qty: parseInt(itemQty, 10),
            total: parseFloat(itemRate) * parseInt(itemQty, 10),
        };

        setItemsList([...itemsList, newItem]);
        setItemCategory("");
        setItemName("");
        setItemRate("");
        setItemQty("");
    };


      // Fetch quotations
  const fetchEstimationList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/estimations`
      );
      setQuotations(res.data);
    //   console.log("quotations", res.data);
    } catch (error) {
      console.error("Failed to fetch quotations", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchEstimationList();
  }, [fetchEstimationList]);

    // Demand Item 
   useEffect(() => {
  const fetchQuotationItems = async () => {
    if (!forDemand) {
      setEstimationItems([]);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/estimations/${forDemand}`
      );

      // ✅ Fix: items are inside demandItem
      setEstimationItems(res.data.demandItem?.items || []);

      console.log("Fetched items: ", res.data.demandItem?.items);
    } catch (error) {
      console.error("Error fetching quotation items:", error);
      setEstimationItems([]);
    }
  };

  fetchQuotationItems();
}, [forDemand]);

    console.log("For ", forDemand);
    console.log("estimationItems ", estimationItems);
    


    // Fetch demand items
    const fetchDemandItems = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/demand-items`);
            setDemandItems(res.data);
        } catch (error) {
            console.error("Failed to fetch demand items", error);
        } finally {
            setTimeout(() => setLoading(false), 2000);
        }
    }, []);

    useEffect(() => {
        fetchDemandItems();
    }, [fetchDemandItems]);

    // Fetch purchase orders
    const fetchPurchaseOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/purchaseOrder`);
            setPurchaseOrders(res.data);
            console.log("Purchase ", res.data);

        } catch (error) {
            console.error("Failed to fetch purchase orders", error);
        } finally {
            setTimeout(() => setLoading(false), 2000);
        }
    }, []);

    useEffect(() => {
        fetchPurchaseOrders();
    }, [fetchPurchaseOrders]);

    // Auto-fill supplier based on demand item
    useEffect(() => {
        if (demandItem) {
            const selectedDemand = demandItems.find((item) => item._id === demandItem);
            if (selectedDemand && selectedDemand.supplier) {
                setSupplier(selectedDemand.supplier._id);
            }
        }
    }, [demandItem, demandItems]);

    // Handlers for form and table actions
    const handleAddClick = () => {
        setEditingPurchaseOrder(null);
        setPoNo("");
        setDate("");
        setDemandItem("");
        setSupplier("");
        setDeliveryDate("");
        setTax("");
        setTotalAmount("");
        setItemsList([]);
        setIsEnable(true);
        setIsSliderOpen(true);
    };

    const handleEditClick = (order) => {
        setEditingPurchaseOrder(order);
        setPoNo(order.poNo);
        setDate(formatDate(order.date));
        setDemandItem(order.demandItem?._id || "");
        setSupplier(order.supplier?._id || "");
        setDeliveryDate(formatDate(order.deliveryDate));
        setTax(order.tax);
        setTotalAmount(order.totalAmount);
        setItemsList(order.items || []);
        setIsEnable(order.isEnable);
        setIsSliderOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!poNo || !date || !demandItem || !supplier || !deliveryDate || itemsList.length === 0) {
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

        const newPurchaseOrder = {
            poNo,
            date,
            demandItem,
            supplier,
            deliveryDate,
            tax,
            totalAmount,
            items: itemsList,
            isEnable,
        };

        try {
            if (editingPurchaseOrder) {
                await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/purchase-orders/${editingPurchaseOrder._id}`,
                    newPurchaseOrder,
                    { headers }
                );
                Swal.fire("Updated!", "Purchase order updated successfully.", "success");
            } else {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/purchase-orders`,
                    newPurchaseOrder,
                    { headers }
                );
                Swal.fire("Added!", "Purchase order added successfully.", "success");
            }

            fetchPurchaseOrders();
            setIsSliderOpen(false);
            setItemsList([]);
        } catch (error) {
            console.error("Error saving purchase order", error);
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

        return `${day}-${month}-${year}`; // DD-MM-YYYY
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

                        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/purchase-orders/${id}`, { headers });

                        setPurchaseOrders(purchaseOrders.filter((p) => p._id !== id));

                        swalWithTailwindButtons.fire(
                            "Deleted!",
                            "Purchase order deleted successfully.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Delete error:", error);
                        swalWithTailwindButtons.fire(
                            "Error!",
                            "Failed to delete purchase order.",
                            "error"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Purchase order is safe 🙂",
                        "error"
                    );
                }
            });
    };

    const handleView = (order) => {
        setSelectedPurchaseOrder(order);
        setIsView(true);
    };

    const closeModal = () => {
        setIsView(false);
        setSelectedPurchaseOrder(null);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">
                            Purchase Order Details
                        </h1>
                    </div>
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
                        onClick={handleAddClick}
                    >
                        + Add Purchase Order
                    </button>
                </div>

                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            <div className="inline-block min-w-[1200px] w-full align-middle">
                                <div className="hidden lg:grid grid-cols-6 gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                    <div>PO No.</div>
                                    <div>Employee</div>
                                    <div>Supplier</div>
                                    <div>Total Amount</div>
                                    <div>Delivery Date</div>
                                    <div className="text-right">Actions</div>
                                </div>

                                <div className="flex flex-col divide-y divide-gray-100">
                                    {loading ? (
                                        <TableSkeleton rows={3} cols={6} className="lg:grid-cols-6" />
                                    ) : purchaseOrders.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500 bg-white">
                                            No purchase orders found.
                                        </div>
                                    ) : (
                                        purchaseOrders.map((order) => (
                                            <div
                                                key={order._id}
                                                className="grid grid-cols-1 lg:grid-cols-6 items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                            >
                                                <div className="font-medium text-gray-900">{order.purchaseOrderId}</div>
                                                <div className="text-gray-600">{order.demandItem?.demandItem?.createdBy || "N/A"}</div>
                                                <div className="text-gray-600">{order.demandItem?.demandItem?.supplier?.supplierName || "N/A"}</div>
                                                <div className="text-gray-600">{order?.totalAmount}</div>
                                                <div className="text-gray-500">{formatDate(order?.deliveryDate)}</div>
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => handleEditClick(order)}
                                                        className="py-1 text-sm rounded text-blue-600"
                                                        title="Edit"
                                                    >
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order._id)}
                                                        className="py-1 text-sm text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleView(order)}
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
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
                        <div
                            ref={sliderRef}
                            className="w-full max-w-md bg-white p-4 h-full overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-newPrimary">
                                    {editingPurchaseOrder ? "Update Purchase Order" : "Add a New Purchase Order"}
                                </h2>
                                <button
                                    className="text-2xl text-gray-500 hover:text-gray-700"
                                    onClick={() => {
                                        setIsSliderOpen(false);
                                        setPoNo("");
                                        setDate("");
                                        setDemandItem("");
                                        setSupplier("");
                                        setDeliveryDate("");
                                        setTax("");
                                        setTotalAmount("");
                                        setItemsList([]);
                                        setIsEnable(true);
                                        setEditingPurchaseOrder(null);
                                    }}
                                >
                                    <X />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        PO No. <span className="text-blue-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={poNo}
                                        onChange={(e) => setPoNo(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Enter PO No."
                                        required
                                    />
                                </div>

                                <div>
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
                                                {q.estimationId} 
                                            </option>
                                        ))}
                                    </select>
                                    {errors.forDemand && (
                                        <p className="text-red-500 text-xs mt-1">{errors.forDemand}</p>
                                    )}
                                </div>
                                {estimationItems.length > 0 && (
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
                                                {estimationItems.map((item) => (
                                                    <tr key={item._id}>
                                                        <td className="px-4 text-center py-2 border">{item.itemName}</td>
                                                        <td className="px-4 text-center py-2 border">{item.qty}</td>
                                                        <td className="px-4 text-center py-2 border">{item.price}</td>
                                                        <td className="px-4 text-center py-2 border">{item.total}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* <div className="mt-2 text-right font-semibold">
                                            Total Amount: {total}
                                        </div> */}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Supplier <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={supplier?.supplierName || ""}
                                        disabled
                                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                        placeholder="Supplier"
                                        required
                                    />
                                </div>


                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Category
                                            </label>
                                            <input
                                                type="text"
                                                value={itemCategory}
                                                // disabled
                                                onChange={(e) => setItemCategory(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter category"
                                            // required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Item Name
                                            </label>
                                            <input
                                                type="text"
                                                value={itemName}
                                                onChange={(e) => setItemName(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter item name"
                                            // required
                                            // disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Rate
                                            </label>
                                            <input
                                                type="number"
                                                value={itemRate}
                                                onChange={(e) => setItemRate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter rate"
                                                min="0"
                                            // required
                                            // disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                value={itemQty}
                                                onChange={(e) => setItemQty(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter quantity"
                                                min="1"
                                            // required
                                            // disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="w-16 h-12 bg-newPrimary text-white rounded-lg hover:bg-newPrimary/80 transition"
                                        >
                                            + Add
                                        </button>
                                    </div>

                                    {itemsList.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                                <thead className="bg-gray-100 text-gray-600 text-sm">
                                                    <tr>
                                                        <th className="px-4 py-2 border-b">Sr #</th>
                                                        <th className="px-4 py-2 border-b">Category</th>
                                                        <th className="px-4 py-2 border-b">Item</th>
                                                        <th className="px-4 py-2 border-b">Rate</th>
                                                        <th className="px-4 py-2 border-b">Qty</th>
                                                        <th className="px-4 py-2 border-b">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-700 text-sm">
                                                    {itemsList.map((item, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
                                                            <td className="px-4 py-2 border-b">{item.category}</td>
                                                            <td className="px-4 py-2 border-b">{item.name}</td>
                                                            <td className="px-4 py-2 border-b">{item.rate}</td>
                                                            <td className="px-4 py-2 border-b text-center">{item.qty}</td>
                                                            <td className="px-4 py-2 border-b">{item.total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Delivery Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Tax</label>
                                    <input
                                        type="text"
                                        value={tax}
                                        onChange={(e) => setTax(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter tax"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Total Amount</label>
                                    <input
                                        type="text"
                                        value={totalAmount}
                                        onChange={(e) => setTotalAmount(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter total amount"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-gray-700 font-medium">Status</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEnable(!isEnable)}
                                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isEnable ? "bg-newPrimary/80" : "bg-gray-300"
                                                }`}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isEnable ? "translate-x-6" : "translate-x-0"
                                                    }`}
                                            />
                                        </button>
                                        <span
                                            className={`text-sm font-medium ${isEnable ? "text-newPrimary" : "text-gray-500"
                                                }`}
                                        >
                                            {isEnable ? "Enabled" : "Disabled"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                                >
                                    {loading
                                        ? "Saving..."
                                        : editingPurchaseOrder
                                            ? "Update Purchase Order"
                                            : "Save Purchase Order"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {isView && selectedPurchaseOrder && (
                    <ViewModel
                        purchaseOrder={selectedPurchaseOrder}
                        onClose={() => setIsView(false)}
                    />
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

export default PurchaseOrder;