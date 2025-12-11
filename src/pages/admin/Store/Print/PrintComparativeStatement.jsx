import React, { useRef } from "react";
import { Printer, X } from "lucide-react";

const PrintComparativeStatement = ({ statements, filters, onClose }) => {
    const printRef = useRef();

    // Group statements by statementId
    const groupedStatements = statements.reduce((groups, statement) => {
        const key = statement.statementId;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(statement);
        return groups;
    }, {});

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-newPrimary">Print Comparative Statement</h2>
                        <p className="text-gray-600 mt-1">Preview before printing</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                        >
                            <Printer size={20} />
                            Print Now
                        </button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div ref={printRef} className="p-6">
                    {/* Print Header */}
                    <div className="text-center mb-8 border-b pb-4">
                        <h1 className="text-3xl font-bold text-gray-800">Comparative Statement Report</h1>
                        <div className="flex justify-center items-center gap-6 mt-4">
                            <div className="text-sm text-gray-600">
                                <strong>Date:</strong> {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="text-sm text-gray-600">
                                <strong>Time:</strong> {new Date().toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Filters Summary */}
                    {(filters.statementId || filters.date || filters.forDemand || filters.item) && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Applied Filters:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filters.statementId && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                        Statement: {filters.statementId}
                                    </span>
                                )}
                                {filters.date && (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                                        Date: {filters.date}
                                    </span>
                                )}
                                {filters.forDemand && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                                        Demand: {filters.forDemand}
                                    </span>
                                )}
                                {filters.item && (
                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                                        Item: {filters.item}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Summary Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded text-center">
                            <div className="text-sm text-gray-600">Total Statements</div>
                            <div className="text-2xl font-bold text-gray-800">
                                {Object.keys(groupedStatements).length}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded text-center">
                            <div className="text-sm text-gray-600">Awarded</div>
                            <div className="text-2xl font-bold text-green-600">
                                {statements.filter(s => s.status === 'Awarded').length}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded text-center">
                            <div className="text-sm text-gray-600">Pending</div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {statements.filter(s => s.status === 'Pending').length}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded text-center">
                            <div className="text-sm text-gray-600">Total Value</div>
                            <div className="text-2xl font-bold text-blue-600">
                                ${statements.reduce((sum, s) => sum + s.totals, 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Statements by Group */}
                    {Object.keys(groupedStatements).map((statementId) => (
                        <div key={statementId} className="mb-8 border rounded-lg overflow-hidden print:break-inside-avoid">
                            {/* Group Header */}
                            <div className="bg-gray-100 px-6 py-4 border-b">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            Statement: {statementId}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                            <span>Demand: {groupedStatements[statementId][0].forDemand}</span>
                                            <span>Item: {groupedStatements[statementId][0].item}</span>
                                            <span>Date: {groupedStatements[statementId][0].date}</span>
                                            <span>Suppliers: {groupedStatements[statementId].length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">SR#</th>
                                            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Supplier</th>
                                            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Item</th>
                                            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Rate ($)</th>
                                            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Qty</th>
                                            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Total ($)</th>
                                            <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedStatements[statementId].map((statement, index) => (
                                            <tr key={statement.id} className="hover:bg-gray-50 border-b">
                                                <td className="p-3">{index + 1}</td>
                                                <td className="p-3">
                                                    <div className="font-medium">{statement.supplier}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {statement.specifications}
                                                    </div>
                                                </td>
                                                <td className="p-3">{statement.item}</td>
                                                <td className="p-3 font-medium">
                                                    ${statement.rate.toFixed(2)}
                                                </td>
                                                <td className="p-3">{statement.qty}</td>
                                                <td className="p-3 font-bold">
                                                    ${statement.totals.toFixed(2)}
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium
                                                        ${statement.status === 'Awarded' ? 'bg-green-100 text-green-800' :
                                                            statement.status === 'Recommended' ? 'bg-blue-100 text-blue-800' :
                                                                statement.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                        {statement.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Group Summary */}
                            <div className="bg-gray-50 px-6 py-4 border-t">
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Lowest Rate:</div>
                                        <div className="font-bold text-green-600">
                                            ${Math.min(...groupedStatements[statementId].map(s => s.rate)).toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Highest Rate:</div>
                                        <div className="font-bold text-red-600">
                                            ${Math.max(...groupedStatements[statementId].map(s => s.rate)).toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Average Rate:</div>
                                        <div className="font-bold text-blue-600">
                                            ${(groupedStatements[statementId].reduce((sum, s) => sum + s.rate, 0) / groupedStatements[statementId].length).toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Awarded Status:</div>
                                        <div className="font-bold">
                                            {groupedStatements[statementId].some(s => s.status === 'Awarded') ? (
                                                <span className="text-green-600">Awarded ✓</span>
                                            ) : (
                                                <span className="text-yellow-600">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Total Summary */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-4">Total Summary</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <div className="text-sm text-gray-600">Total Statements</div>
                                <div className="text-lg font-bold">{Object.keys(groupedStatements).length}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Total Suppliers</div>
                                <div className="text-lg font-bold">{statements.length}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Grand Total Value</div>
                                <div className="text-lg font-bold text-newPrimary">
                                    ${statements.reduce((sum, s) => sum + s.totals, 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
                        <p>Inifinity Byte ERP Statement Report - Generated on {new Date().toLocaleDateString()}</p>
                        <p className="mt-1">© {new Date().getFullYear()}Inifinity Byte  ERP Management System</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintComparativeStatement;