import React, { useRef } from "react";
import { Download, X, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PDFExportComparativeStatement = ({ statements, filters, onClose }) => {
    const pdfRef = useRef();

    // Group statements by statementId
    const groupedStatements = statements.reduce((groups, statement) => {
        const key = statement.statementId;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(statement);
        return groups;
    }, {});

    const generatePDF = () => {
        const input = pdfRef.current;

        html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 10;

            // Add header
            pdf.setFontSize(20);
            pdf.setTextColor(40, 40, 40);
            pdf.text("Comparative Statement Report", 105, 20, { align: 'center' });

            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

            position = 35;

            // Add content image
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

            // Save the PDF
            pdf.save(`Comparative_Statement_${new Date().getTime()}.pdf`);

            Swal.fire({
                icon: "success",
                title: "PDF Exported",
                text: "Comparative statement has been exported as PDF",
                confirmButtonColor: "#3085d6",
            });
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-newPrimary">Export Comparative Statement as PDF</h2>
                        <p className="text-gray-600 mt-1">Preview and export as PDF document</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={generatePDF}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                        >
                            <Download size={20} />
                            Export as PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* PDF Content Preview */}
                <div ref={pdfRef} className="p-8 bg-white">
                    {/* PDF Header */}
                    <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-left">
                                <div className="text-sm text-gray-500">Procurement Department</div>
                                <div className="text-sm text-gray-500">Comparative Statement Report</div>
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-800">COMPARATIVE STATEMENT</h1>
                                <div className="text-sm text-gray-600 mt-1">Supplier Quotation Analysis</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Ref: CS-REP-{new Date().getFullYear()}</div>
                                <div className="text-sm text-gray-500">Page: 1 of 1</div>
                            </div>
                        </div>

                        <div className="flex justify-center items-center gap-8 mt-4">
                            <div className="text-sm">
                                <span className="font-semibold">Date:</span> {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold">Time:</span> {new Date().toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Filters Summary */}
                    {(filters.statementId || filters.date || filters.forDemand || filters.item) && (
                        <div className="mb-6 p-4 bg-gray-100 rounded border border-gray-300">
                            <h3 className="font-semibold text-gray-700 mb-2 text-sm">APPLIED FILTERS:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filters.statementId && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs border border-blue-200">
                                        <strong>Statement:</strong> {filters.statementId}
                                    </span>
                                )}
                                {filters.date && (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs border border-green-200">
                                        <strong>Date:</strong> {filters.date}
                                    </span>
                                )}
                                {filters.forDemand && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs border border-purple-200">
                                        <strong>Demand:</strong> {filters.forDemand}
                                    </span>
                                )}
                                {filters.item && (
                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded text-xs border border-amber-200">
                                        <strong>Item:</strong> {filters.item}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Summary Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded border text-center">
                            <div className="text-xs text-gray-600 mb-1">TOTAL STATEMENTS</div>
                            <div className="text-xl font-bold text-gray-800">
                                {Object.keys(groupedStatements).length}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded border text-center">
                            <div className="text-xs text-gray-600 mb-1">AWARDED</div>
                            <div className="text-xl font-bold text-green-600">
                                {statements.filter(s => s.status === 'Awarded').length}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded border text-center">
                            <div className="text-xs text-gray-600 mb-1">PENDING</div>
                            <div className="text-xl font-bold text-yellow-600">
                                {statements.filter(s => s.status === 'Pending').length}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded border text-center">
                            <div className="text-xs text-gray-600 mb-1">TOTAL VALUE</div>
                            <div className="text-xl font-bold text-blue-600">
                                ${statements.reduce((sum, s) => sum + s.totals, 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Statements by Group */}
                    {Object.keys(groupedStatements).map((statementId) => (
                        <div key={statementId} className="mb-10 border rounded overflow-hidden">
                            {/* Group Header */}
                            <div className="bg-gray-200 px-4 py-3 border-b">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            STATEMENT: {statementId}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                                            <span><strong>Demand:</strong> {groupedStatements[statementId][0].forDemand}</span>
                                            <span><strong>Item:</strong> {groupedStatements[statementId][0].item}</span>
                                            <span><strong>Date:</strong> {groupedStatements[statementId][0].date}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs bg-white px-3 py-1 rounded border">
                                        Suppliers: {groupedStatements[statementId].length}
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-2 text-left text-xs font-semibold text-gray-700 border">SR#</th>
                                            <th className="p-2 text-left text-xs font-semibold text-gray-700 border">SUPPLIER</th>
                                            <th className="p-2 text-left text-xs font-semibold text-gray-700 border">ITEM</th>
                                            <th className="p-2 text-left text-xs font-semibold text-gray-700 border">RATE ($)</th>
                                            <th className="p-2 text-left text-xs font-semibold text-gray-700 border">QTY</th>
                                            <th className="p-2 text-left text-xs font-semibold text-gray-700 border">TOTAL ($)</th>
                                            <th className="p-2 text-left text-xs font-semibold text-gray-700 border">STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedStatements[statementId].map((statement, index) => (
                                            <tr key={statement.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2 border text-center">{index + 1}</td>
                                                <td className="p-2 border">
                                                    <div className="font-medium text-sm">{statement.supplier}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {statement.specifications}
                                                    </div>
                                                </td>
                                                <td className="p-2 border">{statement.item}</td>
                                                <td className="p-2 border text-right font-medium">
                                                    ${statement.rate.toFixed(2)}
                                                </td>
                                                <td className="p-2 border text-center">{statement.qty}</td>
                                                <td className="p-2 border text-right font-bold">
                                                    ${statement.totals.toFixed(2)}
                                                </td>
                                                <td className="p-2 border">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium inline-block
                                                        ${statement.status === 'Awarded' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                            statement.status === 'Recommended' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                                statement.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                                    'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                                        {statement.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Group Summary */}
                            <div className="bg-gray-100 px-4 py-3 border-t">
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-xs text-gray-600">LOWEST RATE</div>
                                        <div className="font-bold text-green-600 text-sm">
                                            ${Math.min(...groupedStatements[statementId].map(s => s.rate)).toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600">HIGHEST RATE</div>
                                        <div className="font-bold text-red-600 text-sm">
                                            ${Math.max(...groupedStatements[statementId].map(s => s.rate)).toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600">AVERAGE RATE</div>
                                        <div className="font-bold text-blue-600 text-sm">
                                            ${(groupedStatements[statementId].reduce((sum, s) => sum + s.rate, 0) / groupedStatements[statementId].length).toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600">AWARD STATUS</div>
                                        <div className="font-bold">
                                            {groupedStatements[statementId].some(s => s.status === 'Awarded') ? (
                                                <span className="text-green-600 text-sm">AWARDED ✓</span>
                                            ) : (
                                                <span className="text-yellow-600 text-sm">PENDING</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Total Summary */}
                    <div className="mt-10 p-6 bg-gray-100 rounded border border-gray-300">
                        <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">TOTAL SUMMARY</h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Total Statements</div>
                                <div className="text-lg font-bold">{Object.keys(groupedStatements).length}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Total Suppliers</div>
                                <div className="text-lg font-bold">{statements.length}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Grand Total Value</div>
                                <div className="text-lg font-bold text-newPrimary">
                                    ${statements.reduce((sum, s) => sum + s.totals, 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-gray-300">
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                            <div className="text-left">
                                <div className="font-semibold">Prepared By:</div>
                                <div className="mt-4 pt-6 border-t border-gray-300">_________________________</div>
                                <div>Procurement Officer</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold">Verified By:</div>
                                <div className="mt-4 pt-6 border-t border-gray-300">_________________________</div>
                                <div>Store Manager</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">Approved By:</div>
                                <div className="mt-4 pt-6 border-t border-gray-300">_________________________</div>
                                <div>Head of Department</div>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-xs text-gray-400">
                            <p>This is a computer-generated comparative statement report.</p>
                            <p className="mt-1">© {new Date().getFullYear()}Inifinity Byte ERP Management System - All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFExportComparativeStatement;