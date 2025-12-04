import React from "react";
import { X } from "lucide-react";

const GrnView = ({ grn, onClose }) => {
  if (!grn) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
      <div className="w-full md:w-[900px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-newPrimary">
            GRN Details - {grn.grnNo}
          </h2>
          <button
            className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* GRN Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500">GRN No.</h4>
              <p className="text-lg font-medium">{grn.grnNo}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500">GRN Date</h4>
              <p className="text-lg">{grn.grnDate}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500">Supplier</h4>
              <p className="text-lg">{grn.supplier}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500">Supplier Invoice No.</h4>
              <p className="text-lg">{grn.supplierInvoiceNo}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500">Invoice Date</h4>
              <p className="text-lg">{grn.invoiceDate}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600 border">SR#</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Category</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Item</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Details</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Price</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Qty</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {grn.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">{item.category}</td>
                      <td className="p-3 border">{item.item}</td>
                      <td className="p-3 border">{item.spec}</td>
                      <td className="p-3 border">${item.purchasePrice.toFixed(2)}</td>
                      <td className="p-3 border">{item.qty}</td>
                      <td className="p-3 border font-medium">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <span className="text-xl font-bold text-gray-800">
                Grand Total: ${grn.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Description */}
          {grn.description && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {grn.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrnView;