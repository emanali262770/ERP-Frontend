import React from "react";
import { X, Package, Calendar, Building, Box, ArrowRight, User, FileText, CheckCircle, Clock, AlertCircle, Truck } from "lucide-react";

const TransferViewModal = ({ transfer, onClose, onEdit }) => {
    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Transit':
                return 'bg-blue-100 text-blue-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'In Transit':
                return <Truck size={20} className="text-blue-500" />;
            case 'Pending':
                return <Clock size={20} className="text-yellow-500" />;
            case 'Cancelled':
                return <AlertCircle size={20} className="text-red-500" />;
            default:
                return <Clock size={20} className="text-gray-500" />;
        }
    };

    // Format status text
    const getStatusText = (status) => {
        switch (status) {
            case 'Completed':
                return 'Transfer has been completed successfully';
            case 'In Transit':
                return 'Items are currently in transit';
            case 'Pending':
                return 'Awaiting processing and approval';
            case 'Cancelled':
                return 'Transfer has been cancelled';
            default:
                return 'Status unknown';
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-xl font-bold">Transfer Details</h2>
                            <p className="text-sm text-gray-800">Complete transfer information</p>
                        </div>
                    </div>
                    <button
                        className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Transfer Content */}
                <div className="p-6 space-y-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {transfer.transferId}
                                </h3>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(transfer.status)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(transfer.status)}`}>
                                        {transfer.status}
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    Date: {transfer.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <User size={14} />
                                    Prepared By: {transfer.preparedBy}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">
                                {transfer.totalQuantity} units
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Total Quantity</p>
                        </div>
                    </div>

                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Transfer Information */}
                        <div className="space-y-4">
                            {/* Transfer Details Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <Package size={16} />
                                    Transfer Information
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Transfer ID</p>
                                        <p className="font-medium">{transfer.transferId}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-gray-400" />
                                                <span className="font-medium">{transfer.date}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(transfer.status)}
                                                <span className="font-medium">{transfer.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">From Unit</p>
                                        <div className="flex items-center gap-2">
                                            <Building size={16} className="text-gray-400" />
                                            <span className="font-medium">{transfer.fromUnit}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Prepared By</p>
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="font-medium">{transfer.preparedBy}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Information Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <Clock size={16} />
                                    Status Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        {getStatusIcon(transfer.status)}
                                        <div>
                                            <p className="font-medium">{transfer.status}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {getStatusText(transfer.status)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Items Information */}
                        <div className="space-y-4">
                            {/* Items List Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <Box size={16} />
                                    Items to Transfer ({transfer.items.length})
                                </h4>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {transfer.items.map((item, index) => (
                                        <div key={item.id} className="p-3 bg-gray-50 rounded-lg border">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Box size={14} className="text-gray-400" />
                                                        <span className="font-medium">{item.itemName}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{item.specifications}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {item.quantity} {item.unit}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Quantity</div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                Item #{index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Items</span>
                                        <span className="font-bold">{transfer.items.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-medium">Total Quantity</span>
                                        <span className="font-bold text-blue-600">{transfer.totalQuantity} units</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Remarks Section */}
                    {transfer.remarks && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FileText size={16} />
                                Remarks
                            </h4>
                            <p className="text-gray-700">
                                {transfer.remarks}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {/* <div className="flex justify-between items-center pt-4 border-t">
                        <div>
                            <p className="text-sm text-gray-500">
                                Transfer ID: <span className="font-medium">{transfer.transferId}</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    onClose();
                                    onEdit();
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                            >
                                <SquarePen size={16} />
                                Edit Transfer
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div> */}
                </div>

                {/* Print Styles */}
                <style jsx>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #transfer-modal-content,
                        #transfer-modal-content * {
                            visibility: visible;
                        }
                        #transfer-modal-content {
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

// You need to import SquarePen in the TransferViewModal
import { SquarePen } from "lucide-react";

export default TransferViewModal;