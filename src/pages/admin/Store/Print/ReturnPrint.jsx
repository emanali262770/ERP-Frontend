import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ReturnPrint = ({ returnItem, onClose }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Return_${returnItem.returnId}`,
        onAfterPrint: () => onClose && onClose(),
    });

    // Auto-print when component mounts
    React.useEffect(() => {
        handlePrint();
    }, []);

    if (!returnItem) return null;

    return (
        <div className="hidden">
            <div ref={componentRef} className="p-8 bg-white">
                {/* Print Styles */}
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #print-content, #print-content * {
                            visibility: visible;
                        }
                        #print-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}</style>

                <div id="print-content">
                    {/* Header */}
                    <div className="text-center mb-8 border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Return Request</h1>
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                            <div className="text-left">
                                <p><strong>Return ID:</strong> {returnItem.returnId}</p>
                                <p><strong>Date:</strong> {returnItem.returnDate}</p>
                            </div>
                            <div className="text-right">
                                <p><strong>Status:</strong> {returnItem.status}</p>
                                {returnItem.approvedBy && (
                                    <p><strong>Approved By:</strong> {returnItem.approvedBy}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Company Info (if needed) */}
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold">Company Name</h2>
                        <p className="text-gray-600">Inventory Management System</p>
                    </div>

                    {/* Requester Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 border-b pb-2">Requester Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Department:</strong> {returnItem.department}</p>
                                <p><strong>Employee:</strong> {returnItem.employee}</p>
                            </div>
                            <div>
                                <p><strong>Employee ID:</strong> {returnItem.employeeId}</p>
                                <p><strong>Return Reason:</strong> {returnItem.reason}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 border-b pb-2">Return Items</h3>
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">SR#</th>
                                    <th className="border p-2 text-left">Item</th>
                                    <th className="border p-2 text-left">Specifications</th>
                                    <th className="border p-2 text-left">Quantity</th>
                                    <th className="border p-2 text-left">In Stock</th>
                                    <th className="border p-2 text-left">Return Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returnItem.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="border p-2">{index + 1}</td>
                                        <td className="border p-2">{item.item}</td>
                                        <td className="border p-2">{item.details}</td>
                                        <td className="border p-2 text-center">{item.quantity}</td>
                                        <td className="border p-2 text-center">{item.inStock}</td>
                                        <td className="border p-2">{item.returnType}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 flex justify-between items-center">
                            <div></div>
                            <div className="text-right">
                                <p><strong>Total Items:</strong> {returnItem.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {returnItem.notes && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                            <div className="border p-4 rounded">
                                <p className="text-gray-700">{returnItem.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="mb-4 border-t pt-4 text-center">_______________________</p>
                                <p className="text-center">Prepared By</p>
                                <p className="text-center text-sm text-gray-600">{returnItem.employee}</p>
                            </div>
                            <div>
                                {returnItem.approvedBy && (
                                    <>
                                        <p className="mb-4 border-t pt-4 text-center">_______________________</p>
                                        <p className="text-center">Approved By</p>
                                        <p className="text-center text-sm text-gray-600">{returnItem.approvedBy}</p>
                                        <p className="text-center text-xs text-gray-500">{returnItem.approvalDate}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Print timestamp */}
                    <div className="mt-8 text-center text-xs text-gray-500">
                        <p>Printed on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                        <p>Document ID: {returnItem.returnId}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnPrint;