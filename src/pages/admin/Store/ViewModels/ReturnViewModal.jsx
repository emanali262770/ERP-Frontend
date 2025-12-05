import React from "react";
import { X, Calendar, User, Building, FileText, Package, AlertCircle, CheckCircle, XCircle, Clock, Archive, MessageSquare } from "lucide-react";

const ReturnViewModal = ({ returnItem, onClose }) => {
    if (!returnItem) return null;

    // Get status icon and color
    const getStatusInfo = (status) => {
        switch (status) {
            case 'Approved':
                return { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
            case 'Rejected':
                return { icon: <XCircle className="w-5 h-5" />, color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
            case 'Pending':
                return { icon: <Clock className="w-5 h-5" />, color: 'text-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
            case 'Processed':
                return { icon: <Archive className="w-5 h-5" />, color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
            case 'Completed':
                return { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
            default:
                return { icon: <AlertCircle className="w-5 h-5" />, color: 'text-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
        }
    };

    const statusInfo = getStatusInfo(returnItem.status);

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b rounded-t-2xl">
                    <div className="flex justify-between items-center p-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Return Request Details</h2>
                            <p className="text-gray-600 mt-1">View complete information about this return request</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Status Banner */}
                    <div className={`mb-6 p-4 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} flex items-center gap-3`}>
                        {statusInfo.icon}
                        <div>
                            <h3 className="font-semibold text-gray-800">Status: {returnItem.status}</h3>
                            {returnItem.approvedBy && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Approved by {returnItem.approvedBy} on {returnItem.approvalDate}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Return Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FileText size={18} />
                                Return Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-gray-400 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Return ID</p>
                                        <p className="font-medium">{returnItem.returnId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-gray-400 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Return Date</p>
                                        <p className="font-medium">{returnItem.returnDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-gray-400 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Return Reason</p>
                                        <p className="font-medium">{returnItem.reason}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Department & Employee */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <User size={18} />
                                Requester Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Building className="text-gray-400 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Department</p>
                                        <p className="font-medium">{returnItem.department}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <User className="text-gray-400 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Employee</p>
                                        <p className="font-medium">{returnItem.employee}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FileText className="text-gray-400 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Employee ID</p>
                                        <p className="font-medium">{returnItem.employeeId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Package size={18} />
                            Return Items ({returnItem.items.length})
                        </h3>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">SR#</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Item</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Specifications</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Quantity</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">In Stock</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Return Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {returnItem.items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 border-b last:border-b-0">
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3 font-medium">{item.item}</td>
                                            <td className="p-3 text-gray-600">{item.details}</td>
                                            <td className="p-3">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                                    {item.inStock}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-3 py-1 rounded-full text-sm ${item.returnType === 'Full Return' ? 'bg-blue-100 text-blue-800' :
                                                    item.returnType === 'Exchange' ? 'bg-purple-100 text-purple-800' :
                                                        item.returnType === 'Replacement' ? 'bg-green-100 text-green-800' :
                                                            item.returnType === 'Partial Return' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {item.returnType}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Total Items</span>
                            <span className="font-bold text-lg text-blue-700">
                                {returnItem.items.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        </div>
                    </div>

                    {/* Notes Section */}
                    {returnItem.notes && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <MessageSquare size={18} />
                                Additional Notes
                            </h3>
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-wrap">{returnItem.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                // Create a print-only version of the content
                                const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Return ${returnItem.returnId}</title>
                    <style>
                        @page {
                            size: A4;
                            margin: 0.5in;
                        }
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                            color: #000;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            border-bottom: 2px solid #000;
                            padding-bottom: 15px;
                        }
                        .section {
                            margin-bottom: 20px;
                            page-break-inside: avoid;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 15px 0;
                            font-size: 12px;
                        }
                        th, td {
                            border: 1px solid #000;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f0f0f0;
                        }
                        .footer {
                            margin-top: 50px;
                        }
                        .signature {
                            margin-top: 60px;
                        }
                        @media print {
                            body {
                                -webkit-print-color-adjust: exact;
                            }
                        }
                    </style>
                </head>
                <body>
                  <div class="header">
    <h1>RETURN REQUEST DETAILS</h1>
    <p><strong>Company Inventory System</strong></p>
    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <div style="text-align: left; padding-left: 0;">
            <p style="margin: 5px 0; text-align: left;"><strong>Return ID:</strong> ${returnItem.returnId}</p>
            <p style="margin: 5px 0; text-align: left;"><strong>Date:</strong> ${returnItem.returnDate}</p>
        </div>
        <div style="text-align: right; padding-right: 0;">
            <p style="margin: 5px 0; text-align: right;"><strong>Status:</strong> ${returnItem.status}</p>
            ${returnItem.approvedBy ? `<p style="margin: 5px 0; text-align: right;"><strong>Approved By:</strong> ${returnItem.approvedBy}</p>` : ''}
        </div>
    </div>
</div>

                    <div class="section">
                        <h3>REQUESTER INFORMATION</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <p><strong>Department:</strong> ${returnItem.department}</p>
                                <p><strong>Employee:</strong> ${returnItem.employee}</p>
                            </div>
                            <div>
                                <p><strong>Employee ID:</strong> ${returnItem.employeeId}</p>
                                <p><strong>Return Reason:</strong> ${returnItem.reason}</p>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h3>RETURN ITEMS (${returnItem.items.length})</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>SR#</th>
                                    <th>Item Name</th>
                                    <th>Specifications</th>
                                    <th>Quantity</th>
                                    <th>In Stock</th>
                                    <th>Return Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${returnItem.items.map((item, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${item.item}</td>
                                        <td>${item.details}</td>
                                        <td style="text-align: center">${item.quantity}</td>
                                        <td style="text-align: center">${item.inStock}</td>
                                        <td>${item.returnType}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div style="text-align: right; margin-top: 10px;">
                            <p><strong>Total Items:</strong> ${returnItem.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        </div>
                    </div>

                    ${returnItem.notes ? `
                    <div class="section">
                        <h3>ADDITIONAL NOTES</h3>
                        <div style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            ${returnItem.notes}
                        </div>
                    </div>
                    ` : ''}

                    <div class="footer">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 30px;">
                            <div class="signature">
                                <div style="border-top: 1px solid #000; width: 200px; margin: 40px auto 10px;"></div>
                                <p style="text-align: center">Prepared By</p>
                                <p style="text-align: center; font-weight: bold;">${returnItem.employee}</p>
                            </div>
                            <div class="signature">
                                <div style="border-top: 1px solid #000; width: 200px; margin: 40px auto 10px;"></div>
                                <p style="text-align: center">${returnItem.approvedBy ? 'Approved By' : 'Received By'}</p>
                                <p style="text-align: center; font-weight: bold;">${returnItem.approvedBy || '________________'}</p>
                                ${returnItem.approvalDate ? `<p style="text-align: center; font-size: 11px;">Date: ${returnItem.approvalDate}</p>` : ''}
                            </div>
                        </div>
                        
                        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #666;">
                            <p>Printed on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p>Document ID: ${returnItem.returnId}</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

                                // Open new window for printing
                                const printWindow = window.open('', '_blank');
                                printWindow.document.open();
                                printWindow.document.write(printContent);
                                printWindow.document.close();

                                // Wait for content to load and print
                                printWindow.onload = function () {
                                    printWindow.focus();
                                    printWindow.print();

                                    // Close the print window after printing
                                    setTimeout(() => {
                                        printWindow.close();
                                    }, 500);
                                };
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnViewModal;