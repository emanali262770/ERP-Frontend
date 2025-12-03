import React from "react";
import { X } from "lucide-react";

const ItemDefinitionView = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 bg-newPrimary text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-newPrimary/70"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-newPrimary mb-4">
          View Item Details
        </h2>

        <div className="space-y-3">
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Item Name:</strong> {item.itemName}</p>
          <p><strong>Model:</strong> {item.model}</p>
          <p><strong>Unit:</strong> {item.unit}</p>
          <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>

          {item.additionalData && (
            <div className="border-t pt-3 mt-3">
              <p><strong>Manufacturer:</strong> {item.additionalData.manufacturer || "N/A"}</p>
              <p><strong>Supplier:</strong> {item.additionalData.supplier || "N/A"}</p>
              <p><strong>Ledger Page No:</strong> {item.additionalData.ledgerPageNo || "N/A"}</p>
              <p><strong>Institute Name:</strong> {item.additionalData.instituteName || "N/A"}</p>
              <p><strong>Reorder Level:</strong> {item.additionalData.reorderLevel || 0}</p>
              <p><strong>Monthly Demand:</strong> {item.additionalData.requireMonthlyDemand || 0}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDefinitionView;
