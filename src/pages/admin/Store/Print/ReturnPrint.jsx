import React, { useEffect, useRef } from "react";

const ReturnPrint = ({ returnItem, onClose }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!returnItem) return;

        // Create print content
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Return ${returnItem.returnId}</title>
                <style>
                    @page { margin: 20mm; }
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        color: #000; 
                    }
                    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                    .section { margin-bottom: 15px; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12px; }
                    th, td { border: 1px solid #000; padding: 6px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Return Request</h1>
                    <p>Inventory Management System</p>
                    <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                        <div style="text-align: left;">
                            <p><strong>Return ID:</strong> ${returnItem.returnId}</p>
                            <p><strong>Date:</strong> ${returnItem.returnDate}</p>
                        </div>
                        <div style="text-align: right;">
                            <p><strong>Status:</strong> ${returnItem.status}</p>
                            ${returnItem.approvedBy ? `<p><strong>Approved By:</strong> ${returnItem.approvedBy}</p>` : ''}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>Requester Information</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
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
                    <h3>Return Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>SR#</th>
                                <th>Item</th>
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
                    <h3>Additional Notes</h3>
                    <div style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                        ${returnItem.notes}
                    </div>
                </div>
                ` : ''}

                <div class="footer">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px;">
                        <div>
                            <div style="border-top: 1px solid #000; width: 200px; margin: 30px auto 10px;"></div>
                            <p style="text-align: center">Prepared By</p>
                            <p style="text-align: center; font-weight: bold;">${returnItem.employee}</p>
                        </div>
                        <div>
                            <div style="border-top: 1px solid #000; width: 200px; margin: 30px auto 10px;"></div>
                            <p style="text-align: center">${returnItem.approvedBy ? 'Approved By' : 'Received By'}</p>
                            <p style="text-align: center; font-weight: bold;">${returnItem.approvedBy || '________________'}</p>
                            ${returnItem.approvalDate ? `<p style="text-align: center; font-size: 11px;">Date: ${returnItem.approvalDate}</p>` : ''}
                        </div>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #666;">
                        <p>Printed on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p>Document ID: ${returnItem.returnId}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Create iframe if it doesn't exist
        let iframe = iframeRef.current;
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            iframe.style.opacity = '0';
            iframe.style.pointerEvents = 'none';
            document.body.appendChild(iframe);
            iframeRef.current = iframe;
        }

        // Write content to iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(printContent);
        iframeDoc.close();

        // Print when iframe is loaded
        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Clean up and close modal
            setTimeout(() => {
                if (iframe && iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
                iframeRef.current = null;
                if (onClose) onClose();
            }, 500);
        };

        // Cleanup function
        return () => {
            if (iframeRef.current && iframeRef.current.parentNode) {
                iframeRef.current.parentNode.removeChild(iframeRef.current);
                iframeRef.current = null;
            }
        };

    }, [returnItem, onClose]);

    // This component doesn't render anything visible
    return null;
};

export default ReturnPrint;