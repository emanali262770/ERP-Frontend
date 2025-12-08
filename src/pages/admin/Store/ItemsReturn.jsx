import React, { useState, useEffect } from "react";
import { Search, Plus, Eye, SquarePen, Trash2, ChevronDown, MoreVertical, Printer, Download, Filter, X, Undo2 } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import ReturnViewModal from "./ViewModels/ReturnViewModal";
import ReturnPrint from "./Print/ReturnPrint";

const ItemsReturn = () => {
    // Main state for returns
    const [returns, setReturns] = useState([
        {
            id: 1,
            sr: 1,
            returnId: "RET-2024-001",
            returnDate: "2024-12-01",
            department: "IT Department",
            employee: "John Doe",
            employeeId: "EMP-001",
            reason: "Defective Item",
            status: "Approved",
            items: [
                { id: 1, item: "Laptop", details: "Dell XPS 15, Core i7, 16GB RAM", quantity: 2, inStock: 8, returnType: "Full Return" },
                { id: 2, item: "Mouse", details: "Logitech MX Master 3", quantity: 5, inStock: 15, returnType: "Partial Return" }
            ],
            notes: "Screen flickering issue",
            approvedBy: "Manager",
            approvalDate: "2024-12-02"
        },
        {
            id: 2,
            sr: 2,
            returnId: "RET-2024-002",
            returnDate: "2024-12-03",
            department: "HR Department",
            employee: "Jane Smith",
            employeeId: "EMP-002",
            reason: "Excess Quantity",
            status: "Pending",
            items: [
                { id: 1, item: "Office Chair", details: "Ergonomic Executive Chair", quantity: 3, inStock: 12, returnType: "Full Return" },
                { id: 2, item: "Desk", details: "Standing Desk Pro", quantity: 1, inStock: 4, returnType: "Full Return" }
            ],
            notes: "Ordered extra by mistake",
            approvedBy: "",
            approvalDate: ""
        },
        {
            id: 3,
            sr: 3,
            returnId: "RET-2024-003",
            returnDate: "2024-12-04",
            department: "Finance",
            employee: "Robert Johnson",
            employeeId: "EMP-003",
            reason: "Wrong Item",
            status: "Rejected",
            items: [
                { id: 1, item: "Monitor", details: "Samsung 27\" 4K Monitor", quantity: 1, inStock: 9, returnType: "Full Return" },
                { id: 2, item: "Keyboard", details: "Logitech MX Keys", quantity: 2, inStock: 18, returnType: "Exchange" }
            ],
            notes: "Received wrong model",
            approvedBy: "Manager",
            approvalDate: "2024-12-04"
        },
        {
            id: 4,
            sr: 4,
            returnId: "RET-2024-004",
            returnDate: "2024-12-05",
            department: "Operations",
            employee: "Sarah Williams",
            employeeId: "EMP-004",
            reason: "Damaged on Delivery",
            status: "Approved",
            items: [
                { id: 1, item: "Printer", details: "HP LaserJet Pro", quantity: 1, inStock: 3, returnType: "Full Return" },
                { id: 2, item: "Scanner", details: "Canon imageFORMULA", quantity: 1, inStock: 2, returnType: "Replacement" }
            ],
            notes: "Physical damage during shipping",
            approvedBy: "Operations Head",
            approvalDate: "2024-12-06"
        },
        {
            id: 5,
            sr: 5,
            returnId: "RET-2024-005",
            returnDate: "2024-12-07",
            department: "Marketing",
            employee: "Michael Brown",
            employeeId: "EMP-005",
            reason: "Specification Mismatch",
            status: "Pending",
            items: [
                { id: 1, item: "Projector", details: "Epson EB-W52", quantity: 1, inStock: 2, returnType: "Exchange" },
                { id: 2, item: "Conference Speaker", details: "Jabra Speak 710", quantity: 1, inStock: 5, returnType: "Full Return" }
            ],
            notes: "Doesn't meet required specifications",
            approvedBy: "",
            approvalDate: ""
        }
    ]);

    // Form state
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingReturn, setEditingReturn] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const recordsPerPage = 10;

    // Form fields
    const [returnId, setReturnId] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [department, setDepartment] = useState("");
    const [employee, setEmployee] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("Pending");
    const [notes, setNotes] = useState("");

    // Variables for View and Print
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);

    // Items table in form
    const [items, setItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [currentItem, setCurrentItem] = useState({
        item: "",
        details: "",
        quantity: 1,
        inStock: "",
        returnType: "Full Return"
    });

    // Departments for dropdown
    const departments = [
        "IT Department",
        "HR Department",
        "Finance",
        "Operations",
        "Marketing",
        "Sales",
        "Procurement",
        "Administration",
        "Customer Service",
        "Research & Development"
    ];

    // Employees data (would typically come from API)
    const employees = [
        { id: "EMP-001", name: "John Doe", department: "IT Department" },
        { id: "EMP-002", name: "Jane Smith", department: "HR Department" },
        { id: "EMP-003", name: "Robert Johnson", department: "Finance" },
        { id: "EMP-004", name: "Sarah Williams", department: "Operations" },
        { id: "EMP-005", name: "Michael Brown", department: "Marketing" },
        { id: "EMP-006", name: "Emily Davis", department: "Sales" },
        { id: "EMP-007", name: "David Wilson", department: "Procurement" },
        { id: "EMP-008", name: "Lisa Anderson", department: "Administration" },
        { id: "EMP-009", name: "James Taylor", department: "Customer Service" },
        { id: "EMP-010", name: "Jennifer Martinez", department: "Research & Development" }
    ];

    // Return reasons
    const returnReasons = [
        "Defective Item",
        "Wrong Item",
        "Excess Quantity",
        "Damaged on Delivery",
        "Specification Mismatch",
        "No Longer Needed",
        "Quality Issues",
        "Late Delivery",
        "Wrong Size/Color",
        "Customer Return"
    ];

    // Return types
    const returnTypes = [
        "Full Return",
        "Partial Return",
        "Exchange",
        "Replacement",
        "Repair",
        "Credit Note"
    ];

    // Available items for selection
    const availableItems = [
        { id: 1, name: "Laptop", category: "Electronics", details: "Dell XPS 15, Core i7, 16GB RAM", inStock: 10 },
        { id: 2, name: "Office Chair", category: "Furniture", details: "Ergonomic Executive Chair", inStock: 15 },
        { id: 3, name: "Monitor", category: "Electronics", details: "Samsung 27\" 4K Monitor", inStock: 10 },
        { id: 4, name: "Desk", category: "Furniture", details: "Standing Desk Pro", inStock: 5 },
        { id: 5, name: "Printer", category: "Electronics", details: "HP LaserJet Pro", inStock: 4 },
        { id: 6, name: "Projector", category: "Electronics", details: "Epson EB-W52", inStock: 3 },
        { id: 7, name: "Mouse", category: "Electronics", details: "Logitech MX Master 3", inStock: 20 },
        { id: 8, name: "Keyboard", category: "Electronics", details: "Logitech MX Keys", inStock: 20 },
        { id: 9, name: "Scanner", category: "Electronics", details: "Canon imageFORMULA", inStock: 3 },
        { id: 10, name: "Conference Speaker", category: "Electronics", details: "Jabra Speak 710", inStock: 6 }
    ];

    // Status options
    const statusOptions = [
        { value: "All", label: "All Status", color: "gray" },
        { value: "Pending", label: "Pending", color: "yellow" },
        { value: "Approved", label: "Approved", color: "green" },
        { value: "Rejected", label: "Rejected", color: "red" },
        { value: "Processed", label: "Processed", color: "blue" },
        { value: "Completed", label: "Completed", color: "green" }
    ];

    // Generate Return ID
    const generateReturnId = () => {
        const currentYear = new Date().getFullYear();
        const lastReturn = [...returns].sort((a, b) => b.id - a.id)[0];

        if (lastReturn && lastReturn.returnId.includes(`RET-${currentYear}-`)) {
            const lastNumber = parseInt(lastReturn.returnId.split('-').pop());
            return `RET-${currentYear}-${String(lastNumber + 1).padStart(3, '0')}`;
        }

        return `RET-${currentYear}-001`;
    };

    // Handle employee selection
    const handleEmployeeSelect = (e) => {
        const selectedEmployee = employees.find(emp => emp.name === e.target.value);
        if (selectedEmployee) {
            setEmployee(selectedEmployee.name);
            setEmployeeId(selectedEmployee.id);
            setDepartment(selectedEmployee.department);
        }
    };

    // Handle add item to return form
    const handleAddItem = () => {
        if (!currentItem.item || !currentItem.quantity || currentItem.quantity <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please select an item and enter valid quantity",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (parseInt(currentItem.quantity) > parseInt(currentItem.inStock)) {
            Swal.fire({
                icon: "error",
                title: "Insufficient Stock",
                text: `Cannot return more than available stock (${currentItem.inStock})`,
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (editingItemId) {
            // Update existing item
            const updatedItems = items.map(item =>
                item.id === editingItemId
                    ? {
                        ...item,
                        item: currentItem.item,
                        details: currentItem.details,
                        quantity: parseInt(currentItem.quantity),
                        inStock: parseInt(currentItem.inStock),
                        returnType: currentItem.returnType
                    }
                    : item
            );
            setItems(updatedItems);
        } else {
            // Add new item
            const newItem = {
                id: items.length + 1,
                item: currentItem.item,
                details: currentItem.details,
                quantity: parseInt(currentItem.quantity),
                inStock: parseInt(currentItem.inStock),
                returnType: currentItem.returnType
            };
            setItems([...items, newItem]);
        }

        setCurrentItem({
            item: "",
            details: "",
            quantity: 1,
            inStock: "",
            returnType: "Full Return"
        });
        setEditingItemId(null);
    };

    // Remove item from return form
    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Handle edit item in the form
    const handleEditItem = (item) => {
        setCurrentItem({
            item: item.item,
            details: item.details,
            quantity: item.quantity,
            inStock: item.inStock,
            returnType: item.returnType
        });
        setEditingItemId(item.id);
    };

    // Handle item selection from dropdown
    const handleItemSelect = (e) => {
        const selectedItem = availableItems.find(item => item.name === e.target.value);
        if (selectedItem) {
            setCurrentItem({
                ...currentItem,
                item: selectedItem.name,
                details: selectedItem.details,
                inStock: selectedItem.inStock
            });
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!returnId || !returnDate || !department || !employee || !reason || items.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing Required Fields",
                text: "Please fill in all required fields and add at least one item",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (editingReturn) {
            // Update existing return
            const updatedReturn = {
                ...editingReturn,
                returnId,
                returnDate,
                department,
                employee,
                employeeId,
                reason,
                status,
                items: [...items],
                notes,
                approvedBy: status === "Approved" ? "Admin" : "",
                approvalDate: status === "Approved" ? new Date().toISOString().split('T')[0] : ""
            };

            setReturns(returns.map(ret =>
                ret.id === editingReturn.id ? updatedReturn : ret
            ));

            Swal.fire("Updated!", "Return request updated successfully.", "success");
        } else {
            // Add new return
            const newReturn = {
                id: returns.length + 1,
                sr: returns.length + 1,
                returnId,
                returnDate,
                department,
                employee,
                employeeId,
                reason,
                status,
                items: [...items],
                notes,
                approvedBy: "",
                approvalDate: ""
            };
            setReturns([...returns, newReturn]);
            Swal.fire("Submitted!", "Return request submitted successfully.", "success");
        }

        setIsSliderOpen(false);
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        setReturnId(generateReturnId());
        setReturnDate("");
        setDepartment("");
        setEmployee("");
        setEmployeeId("");
        setReason("");
        setStatus("Pending");
        setItems([]);
        setCurrentItem({
            item: "",
            details: "",
            quantity: 1,
            inStock: "",
            returnType: "Full Return"
        });
        setEditingItemId(null);
        setEditingReturn(null);
        setNotes("");
    };

    // Handle edit click
    const handleEditClick = (returnItem) => {
        setEditingReturn(returnItem);
        setReturnId(returnItem.returnId);
        setReturnDate(returnItem.returnDate);
        setDepartment(returnItem.department);
        setEmployee(returnItem.employee);
        setEmployeeId(returnItem.employeeId);
        setReason(returnItem.reason);
        setStatus(returnItem.status);
        setItems(returnItem.items);
        setNotes(returnItem.notes || "");
        setIsSliderOpen(true);
    };

    // Handle delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedReturns = returns.filter((ret) => ret.id !== id)
                    .map((ret, index) => ({
                        ...ret,
                        sr: index + 1
                    }));
                setReturns(updatedReturns);
                setCurrentPage(1);

                Swal.fire(
                    "Deleted!",
                    "Return request deleted successfully.",
                    "success"
                );
            }
        });
    };

    // Handle status update
    const handleStatusUpdate = (id, newStatus) => {
        setReturns(returns.map(ret =>
            ret.id === id ? { ...ret, status: newStatus } : ret
        ));
        Swal.fire("Updated!", `Status updated to ${newStatus}`, "success");
    };

    // Filter returns based on search term and status
    const filteredReturns = returns.filter(ret => {
        const matchesSearch =
            ret.returnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.items.some(item => item.item.toLowerCase().includes(searchTerm.toLowerCase())) ||
            ret.items.some(item => item.details.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = selectedStatus === "All" || ret.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredReturns.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredReturns.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page totals
    const pageTotalItems = currentRecords.reduce((sum, ret) =>
        sum + ret.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Processed': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status badge
    const StatusBadge = ({ status }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
        </span>
    );

    // Handle view click
    const handleViewClick = (returnItem) => {
        setSelectedReturn(returnItem);
        setViewModalOpen(true);
    };

    // Handle print click
    const handlePrintClick = (returnItem) => {
        setSelectedReturn(returnItem);
        setPrintModalOpen(true);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Undo2 size={28} className="text-newPrimary" />
                        <div>
                            <h1 className="text-2xl font-bold text-newPrimary">
                                Items Return
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search returns..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-[300px] pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary appearance-none bg-white"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>

                        <button
                            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 flex items-center gap-2"
                            onClick={() => {
                                resetForm();
                                setIsSliderOpen(true);
                            }}
                        >
                            <Plus size={18} />
                            New Return
                        </button>
                    </div>
                </div>

                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <div className="min-w-[1200px]">
                            <div className="max-h-screen overflow-y-auto custom-scrollbar">
                                <div className="inline-block w-full align-middle">
                                    {/* Table Header */}
                                    <div className="hidden lg:grid grid-cols-[0.5fr_0.8fr_1fr_1fr_1fr_2fr_1.5fr_1.5fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                        <div>SR#</div>
                                        <div>Return ID</div>
                                        <div>Department</div>
                                        <div>Employee</div>
                                        <div>Reason</div>
                                        <div>Items</div>
                                        <div>Status</div>
                                        <div className="text-center">Actions</div>
                                    </div>

                                    <div className="flex flex-col divide-y divide-gray-100">
                                        {loading ? (
                                            <TableSkeleton
                                                rows={recordsPerPage}
                                                cols={8}
                                                className="lg:grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_2fr_1.5fr_1fr]"
                                            />
                                        ) : currentRecords.length === 0 ? (
                                            <div className="text-center py-4 text-gray-500 bg-white">
                                                No return requests found.
                                            </div>
                                        ) : (
                                            currentRecords.map((ret) => {
                                                const itemList = ret.items.map(item =>
                                                    `${item.item} (${item.quantity})`
                                                ).join(", ");

                                                const itemDetails = ret.items.map(item =>
                                                    `${item.details}`
                                                ).join(", ");

                                                return (
                                                    <div
                                                        key={ret.id}
                                                        className="grid grid-cols-1 lg:grid-cols-[0.5fr_0.8fr_1fr_1fr_1fr_2fr_1.5fr_1.5fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                                    >
                                                        <div className="font-medium text-gray-900">
                                                            {ret.sr}
                                                        </div>
                                                        <div className="text-gray-900 font-medium">
                                                            {ret.returnId}
                                                            <div className="text-xs text-gray-500">
                                                                {ret.returnDate}
                                                            </div>
                                                        </div>
                                                        <div className="text-gray-600">
                                                            {ret.department}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            <div>{ret.employee}</div>
                                                            <div className="text-xs text-gray-500">{ret.employeeId}</div>
                                                        </div>
                                                        <div className="text-gray-600">
                                                            {ret.reason}
                                                        </div>
                                                        <div className="text-gray-600 w-[300px] whitespace-normal break-words">
                                                            <div className="font-medium">{itemList}</div>
                                                            <div className="text-xs text-gray-500 truncate">{itemDetails}</div>
                                                        </div>
                                                        <div>
                                                            <StatusBadge status={ret.status} />
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <div className="flex justify-end gap-3">
                                                                {/* Edit Button */}
                                                                <button
                                                                    onClick={() => handleEditClick(ret)}
                                                                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                                                    title="Edit Return"
                                                                >
                                                                    <SquarePen size={18} />
                                                                </button>

                                                                {/* Status Buttons - Only show for Pending items */}
                                                                {ret.status === 'Pending' ? (
                                                                    <>
                                                                        {/* Approve Button */}
                                                                        <button
                                                                            onClick={() => handleStatusUpdate(ret.id, 'Approved')}
                                                                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50"
                                                                            title="Approve Return"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </button>

                                                                        {/* Reject Button */}
                                                                        <button
                                                                            onClick={() => handleStatusUpdate(ret.id, 'Rejected')}
                                                                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                                                            title="Reject Return"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    // Show status-specific icons for non-pending items
                                                                    <button
                                                                        className="p-1.5 rounded-lg cursor-default"
                                                                        title={`Status: ${ret.status}`}
                                                                    >
                                                                        {ret.status === 'Approved' ? (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                            </svg>
                                                                        ) : ret.status === 'Rejected' ? (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                            </svg>
                                                                        ) : ret.status === 'Processed' ? (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                            </svg>
                                                                        ) : ret.status === 'Completed' ? (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                )}

                                                                {/* View Details Button */}
                                                                <button
                                                                    onClick={() => handleViewClick(ret)}
                                                                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={18} />
                                                                </button>


                                                                {/* Print Button */}
                                                                <button
                                                                    onClick={() => handlePrintClick(ret)}
                                                                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                                                                    title="Print"
                                                                >
                                                                    <Printer size={18} />
                                                                </button>

                                                                {/* Delete Button */}
                                                                <button
                                                                    onClick={() => handleDelete(ret.id)}
                                                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page Total */}
                    {currentRecords.length > 0 && (
                        <div className="grid grid-cols-[0.5fr_0.8fr_1fr_1fr_1fr_2fr_1.5fr_1.5fr] items-center gap-4 px-6 py-3 border-t bg-gray-100">
                            {/* Empty cells for first 5 columns */}
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>

                            {/* Total Items Returned */}
                            <div className="font-semibold text-blue-700">
                                Total Items: {pageTotalItems}
                            </div>

                            {/* Empty cells for remaining columns */}
                            <div></div>
                            <div></div>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredReturns.length > 0 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRecord + 1} to{" "}
                                {Math.min(indexOfLastRecord, filteredReturns.length)} of{" "}
                                {filteredReturns.length} records
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded-md ${currentPage === 1
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-newPrimary text-white hover:bg-newPrimary/80"
                                        }`}
                                >
                                    Previous
                                </button>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded-md ${currentPage === totalPages
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-newPrimary text-white hover:bg-newPrimary/80"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add/Edit Slider Modal */}
                {isSliderOpen && (
                    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
                        <div className="w-full md:w-[900px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                                <h2 className="text-xl font-bold text-newPrimary">
                                    {editingReturn ? "Update Return Request" : "New Return Request"}
                                </h2>
                                <button
                                    className="w-7 h-7 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                                    onClick={() => {
                                        setIsSliderOpen(false);
                                        resetForm();
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                                {/* Header Fields - Return ID and Date */}
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Return ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={returnId}
                                                onChange={(e) => setReturnId(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                                placeholder="Auto-generated"
                                                required
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Return Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={returnDate}
                                                onChange={(e) => setReturnDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Department and Employee Selection */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Department <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept, index) => (
                                                    <option key={index} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Employee <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={employee}
                                                onChange={handleEmployeeSelect}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Employee</option>
                                                {employees.map((emp) => (
                                                    <option key={emp.id} value={emp.name}>
                                                        {emp.name} ({emp.id}) - {emp.department}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Employee ID (auto-filled) and Return Reason */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Employee ID
                                            </label>
                                            <input
                                                type="text"
                                                value={employeeId}
                                                readOnly
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Return Reason <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Reason</option>
                                                {returnReasons.map((reason, index) => (
                                                    <option key={index} value={reason}>{reason}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Status (only for editing) */}
                                    {editingReturn && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2">
                                                    Status
                                                </label>
                                                <select
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                >
                                                    {statusOptions.filter(opt => opt.value !== 'All').map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Items Return Section */}
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-4 border-b">
                                        <h3 className="font-semibold text-gray-700">Return Items</h3>
                                    </div>
                                    <div className="p-4">
                                        {/* Add Item Form */}
                                        <div className="grid gap-1 mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Item Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={currentItem.item}
                                                        onChange={handleItemSelect}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    >
                                                        <option value="">Select Item</option>
                                                        {availableItems.map((item) => (
                                                            <option key={item.id} value={item.name}>
                                                                {item.name} ({item.inStock} in stock)
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Specifications
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={currentItem.details}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, details: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                        placeholder="Item specifications"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Quantity <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.quantity}
                                                        onChange={(e) => setCurrentItem({
                                                            ...currentItem,
                                                            quantity: e.target.value
                                                        })}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                        placeholder="Quantity to return"
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Quantity in Hand
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.inStock}
                                                        readOnly
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm bg-gray-50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Return Type
                                                    </label>
                                                    <select
                                                        value={currentItem.returnType}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, returnType: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    >
                                                        {returnTypes.map((type, index) => (
                                                            <option key={index} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={handleAddItem}
                                                        className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-2 text-sm"
                                                    >
                                                        <Plus size={16} />
                                                        {editingItemId ? "Update Item" : "Add Item"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Table */}
                                        {items.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">SR#</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Item</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Details</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Quantity</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">In Stock</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Return Type</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, index) => (
                                                            <tr key={item.id} className="hover:bg-gray-50">
                                                                <td className="p-2 border-b">{index + 1}</td>
                                                                <td className="p-2 border-b">{item.item}</td>
                                                                <td className="p-2 border-b">{item.details}</td>
                                                                <td className="p-2 border-b">{item.quantity}</td>
                                                                <td className="p-2 border-b">{item.inStock}</td>
                                                                <td className="p-2 border-b">
                                                                    <span className={`px-2 py-1 rounded text-xs ${item.returnType === 'Full Return' ? 'bg-blue-100 text-blue-800' :
                                                                        item.returnType === 'Exchange' ? 'bg-purple-100 text-purple-800' :
                                                                            item.returnType === 'Replacement' ? 'bg-green-100 text-green-800' :
                                                                                'bg-gray-100 text-gray-800'
                                                                        }`}>
                                                                        {item.returnType}
                                                                    </span>
                                                                </td>
                                                                <td className="p-2 border-b flex gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleEditItem(item)}
                                                                        className="text-blue-500 hover:text-blue-700"
                                                                        title="Edit"
                                                                    >
                                                                        <SquarePen size={16} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveItem(item.id)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                        title="Remove"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="mt-4 text-right pr-4">
                                                    <span className="text-lg font-semibold text-gray-800">
                                                        Total Items: {items.reduce((sum, item) => sum + item.quantity, 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No items added to return.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Notes Field */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Additional notes or comments..."
                                        rows="3"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors"
                                >
                                    {editingReturn ? "Update Return Request" : "Submit Return Request"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {viewModalOpen && selectedReturn && (
                    <ReturnViewModal
                        returnItem={selectedReturn}
                        onClose={() => {
                            setViewModalOpen(false);
                            setSelectedReturn(null);
                        }}
                    />
                )}

                {/* Print Modal */}
                {printModalOpen && selectedReturn && (
                    <ReturnPrint
                        returnItem={selectedReturn}
                        onClose={() => {
                            setPrintModalOpen(false);
                            setSelectedReturn(null);
                        }}
                    />
                )}

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #edf2f7;
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #a0aec0;
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #718096;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ItemsReturn;