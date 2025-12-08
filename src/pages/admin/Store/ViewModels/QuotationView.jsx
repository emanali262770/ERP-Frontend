import React from "react";
import { X, FileText, Calendar, Building, ShoppingCart, User, Briefcase, Package, DollarSign, Hash, ListChecks } from "lucide-react";

const QuotationView = ({ quotation, onClose }) => {
    if (!quotation) return null;

    // Format currency with commas
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Quotation Details</h2>
                            <p className="text-sm text-gray-600">Complete quotation information and items</p>
                        </div>
                    </div>
                    <button
                        className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70 transition-colors"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Quotation Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {quotation.quotationNo}
                                </h3>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Quotation
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    Date: {quotation.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Building size={14} />
                                    Supplier: {quotation.supplier}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">
                                ${formatCurrency(quotation.grandTotal)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Grand Total</p>
                        </div>
                    </div>

                    {/* Quotation Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Quotation Details */}
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <FileText size={16} />
                                    Quotation Information
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Hash size={14} />
                                            Quotation Number
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {quotation.quotationNo}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Calendar size={14} />
                                            Date
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {quotation.date}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <ShoppingCart size={14} />
                                            For Demand
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {quotation.forDemand}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - People Information */}
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <User size={16} />
                                    People Information
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Building size={14} />
                                            Supplier
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {quotation.supplier}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <User size={14} />
                                            Person
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {quotation.person}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Briefcase size={14} />
                                            Designation
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {quotation.designation}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <User size={14} />
                                            Created By
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {quotation.createdBy}
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
                            Quotation Items
                        </h4>
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
                                        <tr key={item.id} className="hover:bg-gray-50 border-b last:border-b-0">
                                            <td className="p-3 border text-center">{index + 1}</td>
                                            <td className="p-3 border">
                                                <div className="flex items-center gap-2">
                                                    <Package size={14} className="text-gray-400" />
                                                    {item.itemName}
                                                </div>
                                            </td>
                                            <td className="p-3 border text-gray-600">{item.description}</td>
                                            <td className="p-3 border font-medium">${formatCurrency(item.rate)}</td>
                                            <td className="p-3 border text-center">{item.qty}</td>
                                            <td className="p-3 border font-bold text-green-600">${formatCurrency(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td colSpan="5" className="p-3 border text-right font-semibold text-gray-700">
                                            Grand Total:
                                        </td>
                                        <td className="p-3 border font-bold text-green-600 text-lg">
                                            ${formatCurrency(quotation.grandTotal)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Description Card */}
                    {quotation.description && (
                        <div className="border rounded-lg p-4">
                            <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                <FileText size={16} />
                                Additional Description
                            </h4>
                            <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                                {quotation.description}
                            </p>
                        </div>
                    )}

                    {/* Summary Section */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <DollarSign size={16} />
                            Quotation Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Quotation No.</p>
                                <p className="font-bold text-lg text-newPrimary">{quotation.quotationNo}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-bold text-lg text-gray-800">{quotation.date}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Items Count</p>
                                <p className="font-bold text-lg text-blue-600">{quotation.items.length}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Grand Total</p>
                                <p className="font-bold text-lg text-green-600">${formatCurrency(quotation.grandTotal)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationView;