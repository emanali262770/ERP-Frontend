import React from "react";
import { X, Package, Tag, Box, Ruler, DollarSign, Factory, Truck, BookOpen, Building, AlertCircle, TrendingUp } from "lucide-react";

const ItemDefinitionView = ({ item, onClose }) => {
  if (!item) return null;

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(price));
  };

  return (
    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Item Details</h2>
              <p className="text-sm text-gray-600">Complete item information and specifications</p>
            </div>
          </div>
          <button
            className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Item Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information Card */}
          <div className="border rounded-lg p-5">
            <h4 className="font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center gap-2">
              <Tag size={16} />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Tag size={14} />
                    Category
                  </p>
                  <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">{item.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Package size={14} />
                    Item Name
                  </p>
                  <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">{item.itemName}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Box size={14} />
                    Model
                  </p>
                  <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">{item.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Ruler size={14} />
                    Unit
                  </p>
                  <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">{item.unit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="border rounded-lg p-5">
            <h4 className="font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center gap-2">
              <DollarSign size={16} />
              Pricing Information
            </h4>
            <div className="flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Unit Price</p>
                <p className="text-3xl font-bold text-green-600">${formatPrice(item.price)}</p>
                <p className="text-xs text-gray-500 mt-1">Per {item.unit}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {item.additionalData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Supplier & Manufacturer Card */}
              <div className="border rounded-lg p-5">
                <h4 className="font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center gap-2">
                  <Factory size={16} />
                  Supplier & Manufacturer
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Factory size={14} />
                      Manufacturer
                    </p>
                    <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                      {item.additionalData.manufacturer || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Truck size={14} />
                      Supplier
                    </p>
                    <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                      {item.additionalData.supplier || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inventory & Institute Card */}
              <div className="border rounded-lg p-5">
                <h4 className="font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center gap-2">
                  <Building size={16} />
                  Inventory & Institute
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <BookOpen size={14} />
                      Ledger Page No.
                    </p>
                    <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                      {item.additionalData.ledgerPageNo || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Building size={14} />
                      Institute Name
                    </p>
                    <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                      {item.additionalData.instituteName || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demand & Reorder Section */}
          {item.additionalData && (
            <div className="border rounded-lg p-5 bg-gray-50">
              <h4 className="font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center gap-2">
                <TrendingUp size={16} />
                Inventory Management
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={18} className="text-yellow-500" />
                    <p className="text-sm font-medium text-gray-700">Reorder Level</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{item.additionalData.reorderLevel || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Minimum stock level</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={18} className="text-blue-500" />
                    <p className="text-sm font-medium text-gray-700">Monthly Demand</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{item.additionalData.requireMonthlyDemand || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Average monthly requirement</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Package size={16} />
              Item Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-bold text-lg text-newPrimary">{item.category}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-500">Unit</p>
                <p className="font-bold text-lg text-gray-800">{item.unit}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-500">Unit Price</p>
                <p className="font-bold text-lg text-green-600">${formatPrice(item.price)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDefinitionView;