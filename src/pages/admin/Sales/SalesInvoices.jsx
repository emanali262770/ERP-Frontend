import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const SalesInvoices = () => {
  const [invoices, setInvoices] = useState([
    {
      _id: "1",
      invoiceId: "INV-001",
      customerName: "Acme Corp",
      itemName: "Laptop",
      quantity: 2,
      unitPrice: 1000,
      totalAmount: 2070, // (2 * 1000 * (1 + 0.035))
      invoiceDate: "2025-09-01",
      status: "Paid",
      createdBy: "John Doe",
    },
    {
      _id: "2",
      invoiceId: "INV-002",
      customerName: "Tech Solutions",
      itemName: "Mouse",
      quantity: 10,
      unitPrice: 20,
      totalAmount: 207, // (10 * 20 * (1 + 0.035))
      invoiceDate: "2025-09-15",
      status: "Pending",
      createdBy: "Jane Smith",
    },
  ]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invoiceId, setInvoiceId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [status, setStatus] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [errors, setErrors] = useState({});
  const [itemList, setItemList] = useState([
    { _id: "item1", itemName: "Laptop" },
    { _id: "item2", itemName: "Mouse" },
    { _id: "item3", itemName: "Keyboard" },
  ]);
  const [nextInvoiceId, setNextInvoiceId] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Simulate fetching invoices
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      // Static data already set in state
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Invoice search
  useEffect(() => {
    if (!searchTerm || !searchTerm.startsWith("INV-")) {
      fetchInvoices();
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        setLoading(true);
        const filtered = invoices.filter((invoice) =>
          invoice.invoiceId.toUpperCase().includes(searchTerm.toUpperCase())
        );
        setInvoices(filtered);
      } catch (error) {
        console.error("Search invoice failed:", error);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchInvoices, invoices]);

  // Generate next invoice ID
  useEffect(() => {
    if (invoices.length > 0) {
      const maxNo = Math.max(
        ...invoices.map((inv) => {
          const match = inv.invoiceId?.match(/INV-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextInvoiceId((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextInvoiceId("001");
    }
  }, [invoices]);

  // Reset form fields
  const resetForm = () => {
    setInvoiceId("");
    setCustomerName("");
    setItemName("");
    setQuantity("");
    setUnitPrice("");
    setInvoiceDate("");
    setStatus("");
    setCreatedBy(userInfo.employeeName || "");
    setEditingInvoice(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedInvoiceId = invoiceId.trim();
    const trimmedCustomerName = customerName.trim();
    const trimmedItemName = itemName.trim();
    const trimmedQuantity = quantity.trim();
    const trimmedUnitPrice = unitPrice.trim();
    const trimmedInvoiceDate = invoiceDate.trim();
    const trimmedStatus = status.trim();
    const parsedQuantity = parseInt(quantity);
    const parsedUnitPrice = parseFloat(unitPrice);

    if (!trimmedInvoiceId) newErrors.invoiceId = "Invoice ID is required";
    if (!trimmedCustomerName) newErrors.customerName = "Customer Name is required";
    if (!trimmedItemName) newErrors.itemName = "Item Name is required";
    if (!trimmedQuantity || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }
    if (!trimmedUnitPrice || isNaN(parsedUnitPrice) || parsedUnitPrice <= 0) {
      newErrors.unitPrice = "Unit Price must be a positive number";
    }
    if (!trimmedInvoiceDate) newErrors.invoiceDate = "Invoice Date is required";
    if (!trimmedStatus) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddInvoice = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (invoice) => {
    setEditingInvoice(invoice);
    setInvoiceId(invoice.invoiceId || "");
    setCustomerName(invoice.customerName || "");
    setItemName(invoice.itemName || "");
    setQuantity(invoice.quantity || "");
    setUnitPrice(invoice.unitPrice || "");
    setInvoiceDate(invoice.invoiceDate || "");
    setStatus(invoice.status || "");
    setCreatedBy(invoice.createdBy || userInfo.employeeName || "");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const totalAmount = parseFloat(quantity) * parseFloat(unitPrice) * (1 + 0.035); // Assuming 3.5% tax

    const newInvoice = {
      invoiceId: editingInvoice ? invoiceId : `INV-${nextInvoiceId}`,
      customerName: customerName.trim(),
      itemName: itemName.trim(),
      quantity: parseInt(quantity),
      unitPrice: parseFloat(unitPrice),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      invoiceDate: invoiceDate.trim(),
      status: status.trim(),
      createdBy: createdBy.trim(),
    };

    try {
      if (editingInvoice) {
        setInvoices((prev) =>
          prev.map((inv) => (inv._id === editingInvoice._id ? { ...inv, ...newInvoice, _id: inv._id } : inv))
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Sales Invoice updated successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setInvoices((prev) => [...prev, { ...newInvoice, _id: `temp-${Date.now()}` }]);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Sales Invoice added successfully.",
          confirmButtonColor: "#3085d6",
        });
      }
      fetchInvoices();
      resetForm();
    } catch (error) {
      console.error("Error saving sales invoice:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save sales invoice.",
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
            setInvoices((prev) => prev.filter((inv) => inv._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Sales Invoice deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete sales invoice.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Sales Invoice is safe 🙂",
            "error"
          );
        }
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = invoices.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(invoices.length / recordsPerPage);

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
              Sales Invoice Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter Invoice ID eg: INV-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />
            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddInvoice}
            >
              + Add Sales Invoice
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
            <div className="min-w-[1200px]">
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Invoice ID</div>
                <div>Customer Name</div>
                <div>Item Name</div>
                <div>Quantity</div>
                <div>Unit Price</div>
                <div>Total Amount</div>
                <div>Invoice Date</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton
                    rows={recordsPerPage}
                    cols={9}
                    className="lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                  />
                ) : currentRecords.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No sales invoices found.
                  </div>
                ) : (
                  currentRecords.map((invoice) => (
                    <div
                      key={invoice._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">{invoice.invoiceId}</div>
                      <div className="text-gray-600">{invoice.customerName}</div>
                      <div className="text-gray-600">{invoice.itemName}</div>
                      <div className="text-gray-600">{invoice.quantity}</div>
                      <div className="text-gray-600">{invoice.unitPrice}</div>
                      <div className="text-gray-600">{invoice.totalAmount}</div>
                      <div className="text-gray-600">{invoice.invoiceDate}</div>
                      <div className="text-gray-600">{invoice.status}</div>
                      <div className="flex gap-3 justify-start">
                        <button
                          onClick={() => handleEditClick(invoice)}
                          className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice._id)}
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
                {Math.min(indexOfLastRecord, invoices.length)} of{" "}
                {invoices.length} records
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
                  {editingInvoice ? "Update Sales Invoice" : "Add a New Sales Invoice"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Invoice ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingInvoice ? invoiceId : `INV-${nextInvoiceId}`}
                      readOnly
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.invoiceId
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter invoice ID"
                      required
                    />
                    {errors.invoiceId && (
                      <p className="text-red-500 text-xs mt-1">{errors.invoiceId}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.customerName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter customer name"
                      required
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
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
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.quantity
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter quantity"
                      min="1"
                      required
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
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
                      Invoice Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.invoiceDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    />
                    {errors.invoiceDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.invoiceDate}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.status
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-xs mt-1">{errors.status}</p>
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
                    : editingInvoice
                    ? "Update Sales Invoice"
                    : "Save Sales Invoice"}
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

export default SalesInvoices;