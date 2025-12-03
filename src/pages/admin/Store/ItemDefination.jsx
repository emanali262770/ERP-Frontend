import React, { useState } from "react";
import { SquarePen, Trash2, Eye, Plus } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";

const ItemDefinition = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([
    {
      id: 1,
      sr: 1,
      category: "Electronics",
      itemName: "Laptop",
      model: "Dell XPS 15",
      unit: "Piece",
      price: 1299.99,
      description: "High-performance laptop for professionals"
    },
    {
      id: 2,
      sr: 2,
      category: "Office Supplies",
      itemName: "Office Chair",
      model: "ErgoPro 300",
      unit: "Piece",
      price: 299.99,
      description: "Ergonomic office chair with lumbar support"
    },
    {
      id: 3,
      sr: 3,
      category: "Electronics",
      itemName: "Monitor",
      model: "Samsung 27\" 4K",
      unit: "Piece",
      price: 399.99,
      description: "27-inch 4K UHD monitor"
    },
    {
      id: 4,
      sr: 4,
      category: "Stationery",
      itemName: "Notebooks",
      model: "Premium A4",
      unit: "Dozen",
      price: 24.99,
      description: "Premium quality notebooks, pack of 12"
    },
    {
      id: 5,
      sr: 5,
      category: "IT Equipment",
      itemName: "Router",
      model: "TP-Link Archer AX50",
      unit: "Piece",
      price: 129.99,
      description: "Wi-Fi 6 router with dual-band"
    },
    {
      id: 6,
      sr: 6,
      category: "Furniture",
      itemName: "Desk",
      model: "Standing Desk Pro",
      unit: "Piece",
      price: 449.99,
      description: "Electric height-adjustable standing desk"
    },
    {
      id: 7,
      sr: 7,
      category: "Electronics",
      itemName: "Keyboard",
      model: "Logitech MX Keys",
      unit: "Piece",
      price: 99.99,
      description: "Wireless illuminated keyboard"
    },
    {
      id: 8,
      sr: 8,
      category: "Electronics",
      itemName: "Mouse",
      model: "Logitech MX Master 3",
      unit: "Piece",
      price: 89.99,
      description: "Wireless ergonomic mouse"
    },
    {
      id: 9,
      sr: 9,
      category: "Office Supplies",
      itemName: "Printer Paper",
      model: "A4 80gsm",
      unit: "Ream",
      price: 8.99,
      description: "Standard printer paper, 500 sheets"
    },
    {
      id: 10,
      sr: 10,
      category: "Cleaning Supplies",
      itemName: "Hand Sanitizer",
      model: "500ml Gel",
      unit: "Liter",
      price: 12.99,
      description: "Alcohol-based hand sanitizer"
    },
    {
      id: 11,
      sr: 11,
      category: "Electronics",
      itemName: "Webcam",
      model: "Logitech C920",
      unit: "Piece",
      price: 79.99,
      description: "HD Pro Webcam 1080p"
    },
    {
      id: 12,
      sr: 12,
      category: "IT Equipment",
      itemName: "Switch",
      model: "Cisco 8-Port",
      unit: "Piece",
      price: 89.99,
      description: "8-port Gigabit Ethernet switch"
    },
    {
      id: 13,
      sr: 13,
      category: "Stationery",
      itemName: "Pens",
      model: "Ballpoint Black",
      unit: "Dozen",
      price: 9.99,
      description: "Pack of 12 black ballpoint pens"
    },
    {
      id: 14,
      sr: 14,
      category: "Furniture",
      itemName: "Filing Cabinet",
      model: "2-Drawer Steel",
      unit: "Piece",
      price: 199.99,
      description: "Two-drawer letter size filing cabinet"
    },
    {
      id: 15,
      sr: 15,
      category: "Electronics",
      itemName: "Headphones",
      model: "Sony WH-1000XM4",
      unit: "Piece",
      price: 349.99,
      description: "Noise cancelling wireless headphones"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const recordsPerPage = 10;

  // NEW FORM STATE - All fields from your image
  const [itemCategory, setItemCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [stockUnit, setStockUnit] = useState("");
  const [stockLoose, setStockLoose] = useState("");
  const [supplier, setSupplier] = useState("");
  const [modelSpec, setModelSpec] = useState("");
  const [ledgerPageNo, setLedgerPageNo] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [itemName, setItemName] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [requireMonthlyDemand, setRequireMonthlyDemand] = useState("");

  // Categories for dropdown
  const categories = [
    { id: 1, categoryName: "Electronics" },
    { id: 2, categoryName: "Office Supplies" },
    { id: 3, categoryName: "Stationery" },
    { id: 4, categoryName: "IT Equipment" },
    { id: 5, categoryName: "Furniture" },
    { id: 6, categoryName: "Cleaning Supplies" },
    { id: 7, categoryName: "Software" },
    { id: 8, categoryName: "Hardware" }
  ];

  // Units for dropdown
  const units = [
    "Piece", "Kg", "Liter", "Meter", "Box", "Set", "Dozen", "Ream", "Pack", "Carton"
  ];

  const handleAddClick = () => {
    setEditingItem(null);
    // Reset all form fields
    setItemCategory("");
    setManufacturer("");
    setStockUnit("");
    setStockLoose("");
    setSupplier("");
    setModelSpec("");
    setLedgerPageNo("");
    setPurchasePrice("");
    setItemName("");
    setInstituteName("");
    setReorderLevel("");
    setRequireMonthlyDemand("");
    setIsSliderOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    // For editing, we'll still use the old form fields for compatibility
    setItemCategory(item.category || "");
    setItemName(item.itemName || "");
    setModelSpec(item.model || "");
    setStockUnit(item.unit || "");
    setPurchasePrice(item.price || "");
    setIsSliderOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!itemCategory || !itemName || !purchasePrice) {
      Swal.fire({
        icon: "warning",
        title: "Missing Required Fields",
        text: "Please fill in Item Category, Item Name, and Purchase Price",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (editingItem) {
      // Update existing item (keep old structure for table compatibility)
      setItems(items.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              category: itemCategory,
              itemName: itemName,
              model: modelSpec,
              unit: stockUnit,
              price: parseFloat(purchasePrice),
            }
          : item
      ));
      Swal.fire("Updated!", "Item updated successfully.", "success");
    } else {
      // Add new item with all fields
      const newItem = {
        id: items.length + 1,
        sr: items.length + 1,
        category: itemCategory,
        itemName: itemName,
        model: modelSpec,
        unit: stockUnit,
        price: parseFloat(purchasePrice),
        description: `Manufacturer: ${manufacturer}, Supplier: ${supplier}`,
        // Store additional fields in description for now
        additionalData: {
          manufacturer,
          stockLoose: stockLoose ? parseInt(stockLoose) : 0,
          supplier,
          ledgerPageNo,
          instituteName,
          reorderLevel: reorderLevel ? parseInt(reorderLevel) : 0,
          requireMonthlyDemand: requireMonthlyDemand ? parseInt(requireMonthlyDemand) : 0
        }
      };
      setItems([...items, newItem]);
      Swal.fire("Added!", "Item added successfully.", "success");
    }

    setIsSliderOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setItemCategory("");
    setManufacturer("");
    setStockUnit("");
    setStockLoose("");
    setSupplier("");
    setModelSpec("");
    setLedgerPageNo("");
    setPurchasePrice("");
    setItemName("");
    setInstituteName("");
    setReorderLevel("");
    setRequireMonthlyDemand("");
    setEditingItem(null);
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
      .then((result) => {
        if (result.isConfirmed) {
          setItems(items.filter((item) => item.id !== id));

          // Update serial numbers
          const updatedItems = items.filter((item) => item.id !== id)
            .map((item, index) => ({
              ...item,
              sr: index + 1
            }));
          setItems(updatedItems);

          setCurrentPage(1);

          swalWithTailwindButtons.fire(
            "Deleted!",
            "Item deleted successfully.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Item is safe 🙂",
            "error"
          );
        }
      });
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredItems.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredItems.length / recordsPerPage);

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
              Item Definition
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by item name, model or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />

            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 flex items-center gap-2"
              onClick={handleAddClick}
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-screen overflow-y-auto custom-scrollbar">
              <div className="inline-block w-full align-middle">
                {/* Table Header - Showing only original fields */}
                <div className="hidden lg:grid grid-cols-[80px,200px,200px,200px,120px,120px,150px] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                  <div>SR#</div>
                  <div>Category</div>
                  <div>Item</div>
                  <div>Model</div>
                  <div>Unit</div>
                  <div>Price</div>
                  <div className="text-center">Actions</div>
                </div>

                <div className="flex flex-col divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton
                      rows={recordsPerPage}
                      cols={7}
                      className="lg:grid-cols-[80px,200px,200px,200px,120px,120px,150px]"
                    />
                  ) : currentRecords.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-white">
                      No items found.
                    </div>
                  ) : (
                    currentRecords.map((item, index) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 lg:grid-cols-[80px,200px,200px,200px,120px,120px,150px] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                      >
                        <div className="font-medium text-gray-900">
                          {item.sr}
                        </div>
                        <div className="text-gray-600">
                          {item.category}
                        </div>
                        <div className="text-gray-600">
                          {item.itemName}
                        </div>
                        <div className="text-gray-600">
                          {item.model}
                        </div>
                        <div className="text-gray-600">
                          {item.unit}
                        </div>
                        <div className="text-gray-600">
                          ${parseFloat(item.price).toFixed(2)}
                        </div>
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <SquarePen size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                            title="View"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between my-4 px-10">
              {/* Records info */}
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstRecord + 1} to{" "}
                {Math.min(indexOfLastRecord, filteredItems.length)} of{" "}
                {filteredItems.length} records
              </div>

              {/* Pagination buttons */}
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

        {/* Add/Edit Slider Modal with NEW FIELDS */}
        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingItem ? "Update Item" : "Add New Item"}
                </h2>
                <button
                  className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                  onClick={() => {
                    setIsSliderOpen(false);
                    resetForm();
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50 px-4 py-6">
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Item Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={itemCategory}
                        onChange={(e) => setItemCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.categoryName}>
                            {cat.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Manufacturer
                      </label>
                      <input
                        type="text"
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter manufacturer name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Stock Unit <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={stockUnit}
                        onChange={(e) => setStockUnit(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        required
                      >
                        <option value="">Select Unit</option>
                        {units.map((unitOption, index) => (
                          <option key={index} value={unitOption}>
                            {unitOption}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Stock Loose
                      </label>
                      <input
                        type="number"
                        value={stockLoose}
                        onChange={(e) => setStockLoose(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter stock quantity"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Supplier
                      </label>
                      <input
                        type="text"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter supplier name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Model/Spec
                      </label>
                      <input
                        type="text"
                        value={modelSpec}
                        onChange={(e) => setModelSpec(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter model or specification"
                      />
                    </div>
                  </div>

                  {/* Third Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Ledger Page No.
                      </label>
                      <input
                        type="text"
                        value={ledgerPageNo}
                        onChange={(e) => setLedgerPageNo(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter ledger page number"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Purchase Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter item name"
                        required
                      />
                    </div>
                  </div>

                  {/* Fourth Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Institute Name
                      </label>
                      <input
                        type="text"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter institute name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Reorder Level
                      </label>
                      <input
                        type="number"
                        value={reorderLevel}
                        onChange={(e) => setReorderLevel(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter reorder level"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Require Monthly Demand
                      </label>
                      <input
                        type="number"
                        value={requireMonthlyDemand}
                        onChange={(e) => setRequireMonthlyDemand(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter monthly demand"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors"
                >
                  {editingItem ? "Update Item" : "Add Item"}
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

export default ItemDefinition;