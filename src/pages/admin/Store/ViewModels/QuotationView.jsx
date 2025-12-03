import React from "react";
import { X } from "lucide-react";

const QuotationView = ({ quotation, onClose }) => {
    if (!quotation) return null;

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                    <h2 className="text-xl font-bold text-newPrimary">
                        Quotation Details - {quotation.quotationNo}
                    </h2>
                    <button
                        className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Quotation Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500">Quotation No.</h4>
                            <p className="text-lg font-medium">{quotation.quotationNo}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500">Date</h4>
                            <p className="text-lg">{quotation.date}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500">Supplier</h4>
                            <p className="text-lg">{quotation.supplier}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500">For Demand</h4>
                            <p className="text-lg">{quotation.forDemand}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500">Person</h4>
                            <p className="text-lg">{quotation.person}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500">Created By</h4>
                            <p className="text-lg">{quotation.createdBy}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500">Designation</h4>
                            <p className="text-lg">{quotation.designation}</p>
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
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Item</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Description</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Rate</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Qty</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotation.items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="p-3 border">{index + 1}</td>
                                            <td className="p-3 border">{item.itemName}</td>
                                            <td className="p-3 border">{item.description}</td>
                                            <td className="p-3 border">${item.rate.toFixed(2)}</td>
                                            <td className="p-3 border">{item.qty}</td>
                                            <td className="p-3 border font-medium">${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-right">
                            <span className="text-xl font-bold text-gray-800">
                                Grand Total: ${quotation.grandTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    {quotation.description && (
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                                {quotation.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuotationView;