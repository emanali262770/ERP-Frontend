import React from "react";
import { X, Calendar, Hash, FileText, Truck, User, Package, Ruler, Layers, DollarSign, ListChecks, BookOpen } from "lucide-react";

const MonthlyDemandView = ({ demand, onClose }) => {
    // Format currency with commas
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Monthly Store Demand Details</h2>
                            <p className="text-sm text-gray-600">Complete demand information and requested items</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Demand Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {demand.monthlyId}
                                </h3>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Monthly Demand
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    Demand Date: {demand.demandDate}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Truck size={14} />
                                    Vendor: {demand.fromVendor}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">
                                ${formatCurrency(demand.grandTotal)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Grand Total</p>
                        </div>
                    </div>

                    {/* Demand Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Demand Details */}
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <Hash size={16} />
                                    Demand Information
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Hash size={14} />
                                            Monthly ID
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {demand.monthlyId}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <FileText size={14} />
                                            Manual ID
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {demand.manualId}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Calendar size={14} />
                                            Demand Date
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {demand.demandDate}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Vendor & Purpose Details */}
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <Truck size={16} />
                                    Vendor & Purpose Details
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Truck size={14} />
                                            From Vendor
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {demand.fromVendor}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <FileText size={14} />
                                            Subject
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {demand.subject}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <User size={14} />
                                            For
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {demand.for}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table Card */}
                    <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center gap-2">
                            <ListChecks size={16} />
                            Demand Items
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">SR#</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Item Name</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Unit</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Specifications</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">In Hand</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Required Qty</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Rate</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demand.items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 border-b last:border-b-0">
                                            <td className="p-3 border text-center">{index + 1}</td>
                                            <td className="p-3 border">
                                                <div className="flex items-center gap-2">
                                                    <Package size={14} className="text-gray-400" />
                                                    <span className="font-medium">{item.itemName}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 border">
                                                <div className="flex items-center gap-2">
                                                    <Ruler size={14} className="text-gray-400" />
                                                    {item.unit}
                                                </div>
                                            </td>
                                            <td className="p-3 border text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={14} className="text-gray-400" />
                                                    {item.specifications}
                                                </div>
                                            </td>
                                            <td className="p-3 border text-center font-medium text-blue-600">{item.inHand}</td>
                                            <td className="p-3 border text-center font-medium text-yellow-600">{item.quantityRequire}</td>
                                            <td className="p-3 border font-medium">${formatCurrency(item.rate)}</td>
                                            <td className="p-3 border font-bold text-green-600">${formatCurrency(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td colSpan="7" className="p-3 border text-right font-semibold text-gray-700">
                                            Grand Total:
                                        </td>
                                        <td className="p-3 border font-bold text-green-600 text-lg">
                                            ${formatCurrency(demand.grandTotal)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Description Card */}
                    {demand.description && (
                        <div className="border rounded-lg p-4">
                            <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                <BookOpen size={16} />
                                Additional Notes
                            </h4>
                            <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                                {demand.description}
                            </p>
                        </div>
                    )}

                    {/* Summary Section */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Layers size={16} />
                            Demand Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Monthly ID</p>
                                <p className="font-bold text-lg text-newPrimary">{demand.monthlyId}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Demand Date</p>
                                <p className="font-bold text-lg text-gray-800">{demand.demandDate}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Items Count</p>
                                <p className="font-bold text-lg text-blue-600">{demand.items.length}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Grand Total</p>
                                <p className="font-bold text-lg text-green-600">${formatCurrency(demand.grandTotal)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Created By Footer */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Created By</p>
                                <p className="font-medium text-gray-800">{demand.createdBy}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyDemandView;