import React from "react";
import { X, Package, Calendar, Hash, FileText, Building, User, CheckCircle, XCircle, AlertCircle, Box, Ruler, Layers, DollarSign, ListChecks, ClipboardCheck } from "lucide-react";

const IssueViewModal = ({ issue, onClose }) => {
    if (!issue) return null;

    // Format numbers
    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Calculate totals
    const totalRequired = issue.items.reduce((sum, item) => sum + item.required, 0);
    const totalIssued = issue.items.reduce((sum, item) => sum + item.issued, 0);
    const totalBalance = issue.items.reduce((sum, item) => sum + item.balance, 0);

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Partial': return 'bg-orange-100 text-orange-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle size={20} className="text-green-500" />;
            case 'Partial': return <AlertCircle size={20} className="text-orange-500" />;
            case 'Pending': return <AlertCircle size={20} className="text-yellow-500" />;
            case 'Cancelled': return <XCircle size={20} className="text-red-500" />;
            default: return <AlertCircle size={20} className="text-gray-500" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Issue Details</h2>
                            <p className="text-sm text-gray-600">Complete issue information and items</p>
                        </div>
                    </div>
                    <button
                        className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70 transition-colors"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Issue Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {issue.issueId}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                                    {issue.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    Issue Date: {issue.issueDate}
                                </span>
                                {issue.manualId && (
                                    <span className="flex items-center gap-1">
                                        <Hash size={14} />
                                        Manual ID: {issue.manualId}
                                    </span>
                                )}
                                {issue.issuedFromOtherUnit && issue.otherUnitName && (
                                    <span className="flex items-center gap-1">
                                        <Building size={14} />
                                        From: {issue.otherUnitName}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-3">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">{formatNumber(totalRequired)}</div>
                                    <p className="text-xs text-gray-600">Required</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">{formatNumber(totalIssued)}</div>
                                    <p className="text-xs text-gray-600">Issued</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-amber-600">{formatNumber(totalBalance)}</div>
                                    <p className="text-xs text-gray-600">Balance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issue Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Issue Details */}
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <Hash size={16} />
                                    Issue Information
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Hash size={14} />
                                            Issue ID
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {issue.issueId}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Calendar size={14} />
                                            Issue Date
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {issue.issueDate}
                                        </p>
                                    </div>
                                    {issue.manualId && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                                <FileText size={14} />
                                                Manual ID
                                            </p>
                                            <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                                {issue.manualId}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Demand Information Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <FileText size={16} />
                                    Demand Information
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <FileText size={14} />
                                            Demand ID
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {issue.demandId}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Calendar size={14} />
                                            Demand Date
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {issue.demandDate}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Department & Status */}
                        <div className="space-y-4">
                            {/* Department & Employee Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <Building size={16} />
                                    Department & Employee
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Building size={14} />
                                            Department
                                        </p>
                                        <p className="font-medium text-gray-800 p-2 bg-gray-50 rounded-lg">
                                            {issue.department}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <User size={14} />
                                            Employee
                                        </p>
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                            <User size={16} className="text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-800">{issue.employee}</p>
                                                <p className="text-xs text-gray-500">{issue.employeeId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status & Source Card */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                    <ClipboardCheck size={16} />
                                    Status & Source
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(issue.status)}
                                        <div>
                                            <p className="font-medium text-gray-800">{issue.status}</p>
                                            <p className="text-xs text-gray-500">
                                                {issue.status === 'Completed'
                                                    ? 'All items issued successfully'
                                                    : issue.status === 'Partial'
                                                        ? 'Partial items issued'
                                                        : issue.status === 'Pending'
                                                            ? 'Awaiting issuance'
                                                            : 'Issue cancelled'}
                                            </p>
                                        </div>
                                    </div>
                                    {issue.issuedFromOtherUnit && issue.otherUnitName && (
                                        <div className="pt-3 border-t">
                                            <p className="text-sm text-gray-500 mb-2">Issued From</p>
                                            <div className="flex items-center gap-2">
                                                <Building size={16} className="text-gray-400" />
                                                <p className="font-medium text-gray-800">{issue.otherUnitName}</p>
                                            </div>
                                        </div>
                                    )}
                                    {issue.issuedBy && (
                                        <div className="pt-3 border-t">
                                            <p className="text-sm text-gray-500 mb-2">Issued By</p>
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-gray-400" />
                                                <p className="font-medium text-gray-800">{issue.issuedBy}</p>
                                            </div>
                                        </div>
                                    )}
                                    {issue.issueDateFull && (
                                        <div className="pt-3 border-t">
                                            <p className="text-sm text-gray-500 mb-2">Issue Date & Time</p>
                                            <p className="font-medium text-gray-800">{issue.issueDateFull}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table Card */}
                    <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center gap-2">
                            <ListChecks size={16} />
                            Issued Items
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">SR#</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Item</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Details</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Required</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Issued</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Balance</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">Unit</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600 border">In Hand</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {issue.items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 border-b last:border-b-0">
                                            <td className="p-3 border text-center">{index + 1}</td>
                                            <td className="p-3 border">
                                                <div className="flex items-center gap-2">
                                                    <Package size={14} className="text-gray-400" />
                                                    <span className="font-medium">{item.item}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 border text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Box size={14} className="text-gray-400" />
                                                    {item.details}
                                                </div>
                                            </td>
                                            <td className="p-3 border text-center font-medium text-blue-600">{formatNumber(item.required)}</td>
                                            <td className="p-3 border text-center font-bold text-green-600">{formatNumber(item.issued)}</td>
                                            <td className="p-3 border text-center font-medium text-amber-600">{formatNumber(item.balance)}</td>
                                            <td className="p-3 border text-center">
                                                <div className="flex items-center gap-1 justify-center">
                                                    <Ruler size={14} className="text-gray-400" />
                                                    {item.unit}
                                                </div>
                                            </td>
                                            <td className="p-3 border text-center">
                                                <div className="flex items-center gap-1 justify-center">
                                                    <Layers size={14} className="text-gray-400" />
                                                    {formatNumber(item.inHand)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td colSpan="3" className="p-3 border text-right font-semibold text-gray-700">
                                            Grand Totals:
                                        </td>
                                        <td className="p-3 border text-center font-bold text-blue-600 text-lg">
                                            {formatNumber(totalRequired)}
                                        </td>
                                        <td className="p-3 border text-center font-bold text-green-600 text-lg">
                                            {formatNumber(totalIssued)}
                                        </td>
                                        <td className="p-3 border text-center font-bold text-amber-600 text-lg">
                                            {formatNumber(totalBalance)}
                                        </td>
                                        <td className="p-3 border"></td>
                                        <td className="p-3 border"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Description Card */}
                    {issue.description && (
                        <div className="border rounded-lg p-4">
                            <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                <FileText size={16} />
                                Description
                            </h4>
                            <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                                {issue.description}
                            </p>
                        </div>
                    )}

                    {/* Notes Card */}
                    {issue.notes && (
                        <div className="border rounded-lg p-4">
                            <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                <FileText size={16} />
                                Additional Notes
                            </h4>
                            <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                                {issue.notes}
                            </p>
                        </div>
                    )}

                    {/* Summary Section */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <DollarSign size={16} />
                            Issue Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Issue ID</p>
                                <p className="font-bold text-lg text-newPrimary">{issue.issueId}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Status</p>
                                <p className={`font-semibold text-lg px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                                    {issue.status}
                                </p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Items Count</p>
                                <p className="font-bold text-lg text-blue-600">{issue.items.length}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-sm text-gray-500">Issued Qty</p>
                                <p className="font-bold text-lg text-green-600">{formatNumber(totalIssued)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueViewModal;