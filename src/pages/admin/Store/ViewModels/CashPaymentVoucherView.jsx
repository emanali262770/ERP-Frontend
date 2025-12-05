import React from "react";
import { SquarePen, X, FileText, Clock, Calendar, User, DollarSign, Printer, Download, CheckCircle, AlertCircle, Building, FileCheck, CreditCard, Receipt } from "lucide-react";

const CPVViewModal = ({ cpv, onClose, onEdit }) => {
    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format amount with commas
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Print voucher
    const handlePrint = () => {
        window.print();
    };

    // Download as PDF
    const handleDownload = () => {
        Swal.fire({
            title: 'Download Voucher',
            text: 'Downloading voucher as PDF...',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false
        });
        // In a real app, you would implement PDF generation here
    };

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl 
     max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-2x sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <Receipt size={24} />
                        <div>
                            <h2 className="text-xl font-bold">Cash Payment Voucher</h2>
                            <p className="text-sm text-gray-600">Detailed view and actions</p>
                        </div>
                    </div>
                    <button
                        className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Voucher Content */}
                <div className="p-6 space-y-6">
                    {/* Voucher Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {cpv.cpvNo}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(cpv.status)}`}>
                                    {cpv.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    Date: {cpv.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    Time: {cpv.time}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">
                                ${formatAmount(cpv.amount)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Total Amount</p>
                        </div>
                    </div>

                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Voucher Information */}
                        <div className="space-y-4">
                            {/* Voucher Details Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <FileText size={16} />
                                    Voucher Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Created By</p>
                                            <p className="font-medium">{cpv.createdBy}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(cpv.status)}`}>
                                                {cpv.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Description</p>
                                        <p className="font-medium text-gray-700 p-3 bg-gray-50 rounded-lg mt-1">
                                            {cpv.description || "No description provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <CreditCard size={16} />
                                    Payment Information
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Expense Head</p>
                                        <p className="font-medium">{cpv.expenseHead}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Expense By</p>
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="font-medium">{cpv.expenseBy}</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <p className="text-sm text-gray-500">Amount Paid</p>
                                        <p className="text-2xl font-bold text-green-600">${formatAmount(cpv.amount)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Purchase Order Information */}
                        <div className="space-y-4">
                            {/* Purchase Order Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <FileCheck size={16} />
                                    Purchase Order Details
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">PO Number</p>
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-gray-400" />
                                            <span className="font-medium">{cpv.purchaseOrderNo}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">PO Date</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span className="font-medium">{cpv.poDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Supplier Information Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <Building size={16} />
                                    Supplier Information
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Supplier Name</p>
                                        <p className="font-medium">{cpv.supplier}</p>
                                    </div>
                                    <div className="pt-3 border-t">
                                        <p className="text-sm text-gray-500 mb-2">Payment Status</p>
                                        <div className="flex items-center gap-2">
                                            {cpv.status === 'Paid' ? (
                                                <CheckCircle size={20} className="text-green-500" />
                                            ) : cpv.status === 'Pending' ? (
                                                <AlertCircle size={20} className="text-yellow-500" />
                                            ) : (
                                                <AlertCircle size={20} className="text-red-500" />
                                            )}
                                            <div>
                                                <p className="font-medium">{cpv.status}</p>
                                                <p className="text-xs text-gray-500">
                                                    {cpv.status === 'Paid'
                                                        ? 'Payment has been completed successfully'
                                                        : cpv.status === 'Pending'
                                                            ? 'Payment is awaiting processing'
                                                            : 'Payment has been cancelled'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <DollarSign size={16} />
                            Payment Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Voucher Number</p>
                                <p className="font-bold text-lg text-newPrimary">{cpv.cpvNo}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Payment Date</p>
                                <p className="font-bold text-lg text-gray-800">{cpv.date}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-bold text-lg text-green-600">${formatAmount(cpv.amount)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end items-center pt-4 border-t">
                        {/* <div className="flex gap-3">
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Printer size={16} />
                                Print
                            </button>
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Download size={16} />
                                Download PDF
                            </button>
                        </div> */}
                        {/* <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    onClose();
                                    onEdit();
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                            >
                                <SquarePen size={16} />
                                Edit Voucher
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div> */}
                    </div>
                </div>

                {/* Print Styles */}
                <style jsx>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #voucher-modal-content,
                        #voucher-modal-content * {
                            visibility: visible;
                        }
                        #voucher-modal-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default CPVViewModal;