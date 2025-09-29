import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2, X } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const BookingOrders = () => {
  const [bookingOrders, setBookingOrders] = useState([
    {
      _id: "1",
      orderId: "BO-001",
      itemName: "Laptop",
      customer: "Tech Corp",
      orderQuantity: 5,
      unitPrice: 1000,
      deliveryDate: "2025-10-01",
      orderStatus: "Pending",
      createdBy: "John Doe",
      totalAmount: 5000, // (5 * 1000)
    },
    {
      _id: "2",
      orderId: "BO-002",
      itemName: "Mouse",
      customer: "Retail Inc",
      orderQuantity: 20,
      unitPrice: 20,
      deliveryDate: "2025-10-15",
      orderStatus: "Confirmed",
      createdBy: "Jane Smith",
      totalAmount: 400, // (20 * 20)
    },
  ]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState("");
  const [itemName, setItemName] = useState("");
  const [customer, setCustomer] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBookingOrder, setEditingBookingOrder] = useState(null);
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
  const [statusList, setStatusList] = useState([
    { _id: "status1", statusName: "Pending" },
    { _id: "status2", statusName: "Confirmed" },
    { _id: "status3", statusName: "Shipped" },
  ]);
  const [nextOrderId, setNextOrderId] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Simulate fetching booking orders
  const fetchBookingOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Static data already set in state
    } catch (error) {
      console.error("Failed to fetch booking orders", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchBookingOrders();
  }, [fetchBookingOrders]);

  // Booking order search
  useEffect(() => {
    if (!searchTerm || !searchTerm.startsWith("BO-")) {
      fetchBookingOrders();
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        setLoading(true);
        const filtered = bookingOrders.filter((order) =>
          order.orderId.toUpperCase().includes(searchTerm.toUpperCase())
        );
        setBookingOrders(filtered);
      } catch (error) {
        console.error("Search booking order failed:", error);
        setBookingOrders([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchBookingOrders, bookingOrders]);

  // Generate next order ID
  useEffect(() => {
    if (bookingOrders.length > 0) {
      const maxNo = Math.max(
        ...bookingOrders.map((o) => {
          const match = o.orderId?.match(/BO-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextOrderId((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextOrderId("001");
    }
  }, [bookingOrders]);

  // Reset form fields
  const resetForm = () => {
    setOrderId("");
    setItemName("");
    setCustomer("");
    setOrderQuantity("");
    setUnitPrice("");
    setDeliveryDate("");
    setOrderStatus("");
    setCreatedBy(userInfo.employeeName || "");
    setEditingBookingOrder(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedOrderId = orderId.trim();
    const trimmedItemName = itemName.trim();
    const trimmedCustomer = customer.trim();
    const trimmedOrderQuantity = orderQuantity.trim();
    const trimmedUnitPrice = unitPrice.trim();
    const trimmedDeliveryDate = deliveryDate.trim();
    const trimmedOrderStatus = orderStatus.trim();
    const parsedOrderQuantity = parseInt(orderQuantity);
    const parsedUnitPrice = parseFloat(unitPrice);

    if (!trimmedOrderId) newErrors.orderId = "Order ID is required";
    if (!trimmedItemName) newErrors.itemName = "Item Name is required";
    if (!trimmedCustomer) newErrors.customer = "Customer is required";
    if (!trimmedOrderQuantity || isNaN(parsedOrderQuantity) || parsedOrderQuantity <= 0) {
      newErrors.orderQuantity = "Order Quantity must be a positive integer";
    }
    if (!trimmedUnitPrice || isNaN(parsedUnitPrice) || parsedUnitPrice <= 0) {
      newErrors.unitPrice = "Unit Price must be a positive number";
    }
    if (!trimmedDeliveryDate) newErrors.deliveryDate = "Delivery Date is required";
    if (!trimmedOrderStatus) newErrors.orderStatus = "Order Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddBookingOrder = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (bookingOrder) => {
    setEditingBookingOrder(bookingOrder);
    setOrderId(bookingOrder.orderId || "");
    setItemName(bookingOrder.itemName || "");
    setCustomer(bookingOrder.customer || "");
    setOrderQuantity(bookingOrder.orderQuantity || "");
    setUnitPrice(bookingOrder.unitPrice || "");
    setDeliveryDate(bookingOrder.deliveryDate || "");
    setOrderStatus(bookingOrder.orderStatus || "");
    setCreatedBy(bookingOrder.createdBy || userInfo.employeeName || "");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const totalAmount = parseInt(orderQuantity) * parseFloat(unitPrice);

    const newBookingOrder = {
      orderId: editingBookingOrder ? orderId : `BO-${nextOrderId}`,
      itemName: itemName.trim(),
      customer: customer.trim(),
      orderQuantity: parseInt(orderQuantity),
      unitPrice: parseFloat(unitPrice),
      deliveryDate: deliveryDate.trim(),
      orderStatus: orderStatus.trim(),
      createdBy: createdBy.trim(),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    };

    try {
      if (editingBookingOrder) {
        setBookingOrders((prev) =>
          prev.map((o) => (o._id === editingBookingOrder._id ? { ...o, ...newBookingOrder, _id: o._id } : o))
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Booking Order updated successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setBookingOrders((prev) => [...prev, { ...newBookingOrder, _id: `temp-${Date.now()}` }]);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Booking Order added successfully.",
          confirmButtonColor: "#3085d6",
        });
      }
      fetchBookingOrders();
      resetForm();
    } catch (error) {
      console.error("Error saving booking order:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save booking order.",
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
            setBookingOrders((prev) => prev.filter((o) => o._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Booking Order deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete booking order.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Booking Order is safe 🙂",
            "error"
          );
        }
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = bookingOrders.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(bookingOrders.length / recordsPerPage);

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
              Booking Order Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter Order ID eg: BO-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />
            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddBookingOrder}
            >
              + Add Booking Order
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
            <div className="min-w-[1400px]">
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Order ID</div>
                <div>Item Name</div>
                <div>Customer</div>
                <div>Order Quantity</div>
                <div>Unit Price</div>
                <div>Delivery Date</div>
                <div>Order Status</div>
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
                    No booking orders found.
                  </div>
                ) : (
                  currentRecords.map((order) => (
                    <div
                      key={order._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">{order.orderId}</div>
                      <div className="text-gray-600">{order.itemName}</div>
                      <div className="text-gray-600">{order.customer}</div>
                      <div className="text-gray-600">{order.orderQuantity}</div>
                      <div className="text-gray-600">{order.unitPrice}</div>
                      <div className="text-gray-600">{order.deliveryDate}</div>
                      <div className="text-gray-600">{order.orderStatus}</div>
                      <div className="flex gap-3 justify-start">
                        <button
                          onClick={() => handleEditClick(order)}
                          className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
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
                {Math.min(indexOfLastRecord, bookingOrders.length)} of{" "}
                {bookingOrders.length} records
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
              className="w-full max-w-[600px] mx-auto bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[80vh]"
            >
              <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingBookingOrder ? "Update Booking Order" : "Add a New Booking Order"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Order ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingBookingOrder ? orderId : `BO-${nextOrderId}`}
                      readOnly
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.orderId
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter order ID"
                      required
                    />
                    {errors.orderId && (
                      <p className="text-red-500 text-xs mt-1">{errors.orderId}</p>
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
                      Order Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.orderQuantity
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter order quantity"
                      min="0"
                      step="1"
                      required
                    />
                    {errors.orderQuantity && (
                      <p className="text-red-500 text-xs mt-1">{errors.orderQuantity}</p>
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
                      Delivery Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.deliveryDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    />
                    {errors.deliveryDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Order Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.orderStatus
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    >
                      <option value="">Select Status</option>
                      {statusList?.map((status) => (
                        <option key={status._id} value={status.statusName}>
                          {status.statusName}
                        </option>
                      ))}
                    </select>
                    {errors.orderStatus && (
                      <p className="text-red-500 text-xs mt-1">{errors.orderStatus}</p>
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
                    : editingBookingOrder
                    ? "Update Booking Order"
                    : "Save Booking Order"}
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

export default BookingOrders;