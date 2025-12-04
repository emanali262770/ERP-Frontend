import React from "react";
import { X } from "lucide-react";

const MonthlyDemandView = ({ demand, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-newPrimary">Monthly Store Demand Details</h2>
                        <p className="text-gray-600 mt-1">View complete demand information</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Demand Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Monthly ID</div>
                            <div className="text-lg font-semibold text-newPrimary">{demand.monthlyId}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Manual ID</div>
                            <div className="text-lg font-semibold text-gray-800">{demand.manualId}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Demand Date</div>
                            <div className="text-lg font-semibold text-gray-800">{demand.demandDate}</div>
                        </div>
                    </div>

                    {/* Subject and Vendor Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Subject</div>
                            <div className="text-lg font-semibold text-gray-800">{demand.subject}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">From Vendor</div>
                            <div className="text-lg font-semibold text-gray-800">{demand.fromVendor}</div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">For</div>
                        <div className="text-lg font-semibold text-gray-800">{demand.for}</div>
                    </div>

                    {/* Items Table */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-4 border-b">
                            <h3 className="font-semibold text-gray-700">Demand Items</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">SR#</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Item Name</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Unit</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Specifications</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">In Hand</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Required Qty</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Rate</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demand.items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 border-b">
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3 font-medium">{item.itemName}</td>
                                            <td className="p-3">{item.unit}</td>
                                            <td className="p-3">{item.specifications}</td>
                                            <td className="p-3">{item.inHand}</td>
                                            <td className="p-3">{item.quantityRequire}</td>
                                            <td className="p-3">${item.rate.toFixed(2)}</td>
                                            <td className="p-3 font-semibold">${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Grand Total */}
                        <div className="bg-gray-100 p-4 border-t">
                            <div className="flex justify-end">
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">Grand Total</div>
                                    <div className="text-2xl font-bold text-newPrimary">
                                        ${demand.grandTotal.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {demand.description && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-2">Additional Notes</div>
                            <div className="text-gray-800">{demand.description}</div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Created by: {demand.createdBy}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyDemandView;