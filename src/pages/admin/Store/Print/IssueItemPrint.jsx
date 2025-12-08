import React from "react";
import { Printer, X, Package, Building, User, Calendar, FileText, Hash } from "lucide-react";

const IssuePrint = ({ issue, onClose }) => {
    if (!issue) return null;

    // Format numbers
    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Calculate totals
    const totalRequired = issue.items.reduce((sum, item) => sum + item.required, 0);
    const totalIssued = issue.items.reduce((sum, item) => sum + item.issued, 0);
    const totalBalance = issue.items.reduce((sum, item) => sum + item.balance, 0);

    // Get status color for print
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'yellow';
            case 'Partial': return 'orange';
            case 'Completed': return 'green';
            case 'Cancelled': return 'red';
            default: return 'gray';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" id="issue-print-content">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-2xl no-print">
                    <div className="flex items-center gap-3">
                        <Printer size={24} className="text-newPrimary" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Print Issue</h2>
                            <p className="text-sm text-gray-600">Print issue details and items</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 flex items-center gap-2"
                        >
                            <Printer size={18} />
                            Print
                        </button>
                        <button
                            className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-400"
                            onClick={onClose}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Print Content */}
                <div className="p-8 print:p-0">
                    {/* Company Header */}
                    <div className="text-center mb-8 print:mb-6 border-b pb-6 print:pb-4">
                        <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">INVENTORY MANAGEMENT SYSTEM</h1>
                        <h2 className="text-2xl font-semibold text-newPrimary mt-2 print:text-xl">ITEMS ISSUE VOUCHER</h2>
                        <p className="text-gray-600 mt-1 print:text-sm">Official Document</p>
                    </div>

                    {/* Issue Header */}
                    <div className="flex justify-between items-start mb-8 print:mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-xl font-bold text-gray-800 print:text-lg">
                                    {issue.issueId}
                                </h3>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 print:border print:border-gray-300">
                                    {issue.status}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-600 print:text-sm">
                                    <span className="font-medium">Issue Date:</span> {formatDate(issue.issueDate)}
                                </p>
                                {issue.manualId && (
                                    <p className="text-gray-600 print:text-sm">
                                        <span className="font-medium">Manual ID:</span> {issue.manualId}
                                    </p>
                                )}
                                {issue.issuedFromOtherUnit && issue.otherUnitName && (
                                    <p className="text-gray-600 print:text-sm">
                                        <span className="font-medium">Source Unit:</span> {issue.otherUnitName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Totals Box */}
                        <div className="bg-gray-50 p-4 rounded-lg border print:p-3">
                            <h4 className="font-semibold text-gray-700 mb-3 print:text-sm">Summary</h4>
                            <div className="grid grid-cols-3 gap-4 print:gap-2">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600 print:text-base">{formatNumber(totalRequired)}</div>
                                    <p className="text-xs text-gray-600">Required</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-600 print:text-base">{formatNumber(totalIssued)}</div>
                                    <p className="text-xs text-gray-600">Issued</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-amber-600 print:text-base">{formatNumber(totalBalance)}</div>
                                    <p className="text-xs text-gray-600">Balance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8 print:mb-6 print:gap-4">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4 print:p-3">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b print:text-sm">Issue Information</h4>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm text-gray-500 print:text-xs">Issue ID</p>
                                        <p className="font-medium text-gray-800">{issue.issueId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 print:text-xs">Issue Date</p>
                                        <p className="font-medium text-gray-800">{formatDate(issue.issueDate)}</p>
                                    </div>
                                    {issue.manualId && (
                                        <div>
                                            <p className="text-sm text-gray-500 print:text-xs">Manual ID</p>
                                            <p className="font-medium text-gray-800">{issue.manualId}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 print:p-3">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b print:text-sm">Demand Information</h4>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm text-gray-500 print:text-xs">Demand ID</p>
                                        <p className="font-medium text-gray-800">{issue.demandId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 print:text-xs">Demand Date</p>
                                        <p className="font-medium text-gray-800">{formatDate(issue.demandDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4 print:p-3">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b print:text-sm">Department & Employee</h4>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm text-gray-500 print:text-xs">Department</p>
                                        <p className="font-medium text-gray-800">{issue.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 print:text-xs">Employee</p>
                                        <p className="font-medium text-gray-800">{issue.employee}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 print:text-xs">Employee ID</p>
                                        <p className="font-medium text-gray-800">{issue.employeeId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 print:p-3">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b print:text-sm">Status Information</h4>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm text-gray-500 print:text-xs">Status</p>
                                        <p className="font-medium text-gray-800">{issue.status}</p>
                                    </div>
                                    {issue.issuedBy && (
                                        <div>
                                            <p className="text-sm text-gray-500 print:text-xs">Issued By</p>
                                            <p className="font-medium text-gray-800">{issue.issuedBy}</p>
                                        </div>
                                    )}
                                    {issue.issueDateFull && (
                                        <div>
                                            <p className="text-sm text-gray-500 print:text-xs">Issue Time</p>
                                            <p className="font-medium text-gray-800">{issue.issueDateFull}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8 print:mb-6">
                        <h4 className="font-semibold text-gray-700 mb-4 pb-2 border-b print:text-sm">Issued Items Details</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 print:text-sm">
                                <thead>
                                    <tr className="bg-gray-100 print:bg-gray-50">
                                        <th className="p-3 text-left font-semibold text-gray-700 border border-gray-300 print:p-2">SR#</th>
                                        <th className="p-3 text-left font-semibold text-gray-700 border border-gray-300 print:p-2">Item Name</th>
                                        <th className="p-3 text-left font-semibold text-gray-700 border border-gray-300 print:p-2">Specifications</th>
                                        <th className="p-3 text-left font-semibold text-gray-700 border border-gray-300 print:p-2">Required</th>
                                        <th className="p-3 text-left font-semibold text-gray-700 border border-gray-300 print:p-2">Issued</th>
                                        <th className="p-3 text-left font-semibold text-gray-700 border border-gray-300 print:p-2">Balance</th>
                                        <th className="p-3 text-left font-semibold text-gray-700 border border-gray-300 print:p-2">Unit</th>
                                        <th className="p-3 text-left font-semibold text-gray-700 border border-gray-300 print:p-2">In Hand</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {issue.items.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3 border border-gray-300 text-center print:p-2">{index + 1}</td>
                                            <td className="p-3 border border-gray-300 print:p-2">
                                                <div className="font-medium">{item.item}</div>
                                            </td>
                                            <td className="p-3 border border-gray-300 text-gray-600 print:p-2">{item.details}</td>
                                            <td className="p-3 border border-gray-300 text-center font-medium print:p-2">{formatNumber(item.required)}</td>
                                            <td className="p-3 border border-gray-300 text-center font-bold print:p-2">{formatNumber(item.issued)}</td>
                                            <td className="p-3 border border-gray-300 text-center font-medium print:p-2">{formatNumber(item.balance)}</td>
                                            <td className="p-3 border border-gray-300 text-center print:p-2">{item.unit}</td>
                                            <td className="p-3 border border-gray-300 text-center print:p-2">{formatNumber(item.inHand)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-100 print:bg-gray-50">
                                        <td colSpan="3" className="p-3 border border-gray-300 text-right font-semibold print:p-2">
                                            Grand Totals:
                                        </td>
                                        <td className="p-3 border border-gray-300 text-center font-bold print:p-2">
                                            {formatNumber(totalRequired)}
                                        </td>
                                        <td className="p-3 border border-gray-300 text-center font-bold print:p-2">
                                            {formatNumber(totalIssued)}
                                        </td>
                                        <td className="p-3 border border-gray-300 text-center font-bold print:p-2">
                                            {formatNumber(totalBalance)}
                                        </td>
                                        <td className="p-3 border border-gray-300 print:p-2"></td>
                                        <td className="p-3 border border-gray-300 print:p-2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Description and Notes */}
                    <div className="grid grid-cols-2 gap-6 mb-8 print:mb-6 print:gap-4">
                        {/* Description */}
                        {issue.description && (
                            <div className="border rounded-lg p-4 print:p-3">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b print:text-sm">Description</h4>
                                <p className="text-gray-700 print:text-sm">
                                    {issue.description}
                                </p>
                            </div>
                        )}

                        {/* Notes */}
                        {issue.notes && (
                            <div className="border rounded-lg p-4 print:p-3">
                                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b print:text-sm">Additional Notes</h4>
                                <p className="text-gray-700 print:text-sm">
                                    {issue.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Summary Box */}
                    <div className="border rounded-lg p-6 bg-gray-50 mb-8 print:mb-6 print:p-4">
                        <h4 className="font-semibold text-gray-700 mb-4 print:text-sm">Issue Summary</h4>
                        <div className="grid grid-cols-4 gap-4 print:grid-cols-2 print:gap-2">
                            <div className="text-center p-3 bg-white rounded-lg border print:p-2">
                                <p className="text-sm text-gray-500 print:text-xs">Issue ID</p>
                                <p className="font-bold text-lg text-newPrimary print:text-base">{issue.issueId}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border print:p-2">
                                <p className="text-sm text-gray-500 print:text-xs">Status</p>
                                <p className={`font-bold text-lg print:text-base ${issue.status === 'Completed' ? 'text-green-600' :
                                    issue.status === 'Partial' ? 'text-orange-600' :
                                        issue.status === 'Pending' ? 'text-yellow-600' :
                                            'text-red-600'}`}>
                                    {issue.status}
                                </p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border print:p-2">
                                <p className="text-sm text-gray-500 print:text-xs">Items Count</p>
                                <p className="font-bold text-lg text-blue-600 print:text-base">{issue.items.length}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border print:p-2">
                                <p className="text-sm text-gray-500 print:text-xs">Issued Quantity</p>
                                <p className="font-bold text-lg text-green-600 print:text-base">{formatNumber(totalIssued)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t pt-6 print:pt-4">
                        <div className="grid grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
                            <div className="text-center">
                                <div className="h-12 border-b border-gray-300 mb-2 print:h-10"></div>
                                <p className="text-sm text-gray-600 print:text-xs">Issued By</p>
                                <p className="font-medium">{issue.issuedBy || "Store Manager"}</p>
                            </div>
                            <div className="text-center">
                                <div className="h-12 border-b border-gray-300 mb-2 print:h-10"></div>
                                <p className="text-sm text-gray-600 print:text-xs">Received By</p>
                                <p className="font-medium">{issue.employee}</p>
                            </div>
                            <div className="text-center">
                                <div className="h-12 border-b border-gray-300 mb-2 print:h-10"></div>
                                <p className="text-sm text-gray-600 print:text-xs">Department Head</p>
                                <p className="font-medium">{issue.department} Head</p>
                            </div>
                        </div>

                        <div className="text-center mt-8 print:mt-6">
                            <p className="text-sm text-gray-500 print:text-xs">
                                Generated on: {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 print:text-xs">
                                This is a computer generated document, no signature required.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Print Styles */}
                <style jsx>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #issue-print-content,
                        #issue-print-content * {
                            visibility: visible;
                        }
                        #issue-print-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            margin: 0;
                            padding: 0;
                            box-shadow: none;
                            border-radius: 0;
                            background: white;
                        }
                        .no-print {
                            display: none !important;
                        }
                        table {
                            page-break-inside: avoid;
                        }
                        tr {
                            page-break-inside: avoid;
                        }
                        .print\\:text-sm {
                            font-size: 11px !important;
                        }
                        .print\\:text-base {
                            font-size: 12px !important;
                        }
                        .print\\:text-lg {
                            font-size: 14px !important;
                        }
                        .print\\:text-xl {
                            font-size: 16px !important;
                        }
                        .print\\:text-2xl {
                            font-size: 18px !important;
                        }
                        .print\\:p-2 {
                            padding: 0.5rem !important;
                        }
                        .print\\:p-3 {
                            padding: 0.75rem !important;
                        }
                        .print\\:p-4 {
                            padding: 1rem !important;
                        }
                        .print\\:mb-4 {
                            margin-bottom: 1rem !important;
                        }
                        .print\\:mb-6 {
                            margin-bottom: 1.5rem !important;
                        }
                        .print\\:gap-2 {
                            gap: 0.5rem !important;
                        }
                        .print\\:gap-4 {
                            gap: 1rem !important;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default IssuePrint;