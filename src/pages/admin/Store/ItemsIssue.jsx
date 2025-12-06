import React, { useState, useEffect } from "react";
import { Search, Plus, Eye, SquarePen, Trash2, ChevronDown, Printer, Download, Filter, X, Package, Building, User, FileText, Calendar, Hash, CheckSquare, Square } from "lucide-react";
import Swal from "sweetalert2";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import IssueViewModal from "./ViewModels/IssueItemViewModal";
import IssuePrint from "./Print/IssueItemPrint";

const ItemsIssue = () => {
    // Main state for issues
    const [issues, setIssues] = useState([
        {
            id: 1,
            sr: 1,
            issueId: "ISS-2024-001",
            issueDate: "2024-12-01",
            manualId: "MAN-001",
            demandId: "DEM-2024-001",
            demandDate: "2024-11-28",
            department: "IT Department",
            employee: "John Doe",
            employeeId: "EMP-001",
            description: "New project setup requirements",
            issuedFromOtherUnit: false,
            otherUnitName: "",
            status: "Completed",
            items: [
                { id: 1, item: "Laptop", details: "Dell XPS 15, Core i7, 16GB RAM", required: 5, issued: 5, balance: 0, unit: "Piece", inHand: 8 },
                { id: 2, item: "Mouse", details: "Logitech MX Master 3", required: 10, issued: 8, balance: 2, unit: "Piece", inHand: 15 }
            ],
            notes: "Urgent requirement for new team",
            issuedBy: "Store Manager",
            issueDateFull: "2024-12-01 10:30 AM"
        },
        {
            id: 2,
            sr: 2,
            issueId: "ISS-2024-002",
            issueDate: "2024-12-03",
            manualId: "MAN-002",
            demandId: "DEM-2024-002",
            demandDate: "2024-11-30",
            department: "HR Department",
            employee: "Jane Smith",
            employeeId: "EMP-002",
            description: "Office furniture for new hires",
            issuedFromOtherUnit: true,
            otherUnitName: "Main Warehouse",
            status: "Partial",
            items: [
                { id: 1, item: "Office Chair", details: "Ergonomic Executive Chair", required: 8, issued: 6, balance: 2, unit: "Piece", inHand: 12 },
                { id: 2, item: "Desk", details: "Standing Desk Pro", required: 5, issued: 5, balance: 0, unit: "Piece", inHand: 4 }
            ],
            notes: "Balance to be issued next week",
            issuedBy: "Store Manager",
            issueDateFull: "2024-12-03 02:15 PM"
        },
        {
            id: 3,
            sr: 3,
            issueId: "ISS-2024-003",
            issueDate: "2024-12-04",
            manualId: "MAN-003",
            demandId: "DEM-2024-003",
            demandDate: "2024-12-01",
            department: "Finance",
            employee: "Robert Johnson",
            employeeId: "EMP-003",
            description: "Computer accessories for audit team",
            issuedFromOtherUnit: false,
            otherUnitName: "",
            status: "Pending",
            items: [
                { id: 1, item: "Monitor", details: "Samsung 27\" 4K Monitor", required: 3, issued: 0, balance: 3, unit: "Piece", inHand: 9 },
                { id: 2, item: "Keyboard", details: "Logitech MX Keys", required: 5, issued: 0, balance: 5, unit: "Piece", inHand: 18 }
            ],
            notes: "Awaiting stock arrival",
            issuedBy: "",
            issueDateFull: ""
        },
        {
            id: 4,
            sr: 4,
            issueId: "ISS-2024-004",
            issueDate: "2024-12-05",
            manualId: "MAN-004",
            demandId: "DEM-2024-004",
            demandDate: "2024-12-02",
            department: "Operations",
            employee: "Sarah Williams",
            employeeId: "EMP-004",
            description: "Equipment for maintenance team",
            issuedFromOtherUnit: true,
            otherUnitName: "North Warehouse",
            status: "Completed",
            items: [
                { id: 1, item: "Printer", details: "HP LaserJet Pro", required: 2, issued: 2, balance: 0, unit: "Piece", inHand: 3 },
                { id: 2, item: "Scanner", details: "Canon imageFORMULA", required: 1, issued: 1, balance: 0, unit: "Piece", inHand: 2 }
            ],
            notes: "All items issued successfully",
            issuedBy: "Operations Head",
            issueDateFull: "2024-12-05 11:00 AM"
        }
    ]);

    // Form state
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingIssue, setEditingIssue] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const recordsPerPage = 10;

    // Form fields
    const [issueId, setIssueId] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [manualId, setManualId] = useState("");
    const [demandId, setDemandId] = useState("");
    const [demandDate, setDemandDate] = useState("");
    const [department, setDepartment] = useState("");
    const [employee, setEmployee] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [description, setDescription] = useState("");
    const [issuedFromOtherUnit, setIssuedFromOtherUnit] = useState(false);
    const [otherUnitName, setOtherUnitName] = useState("");
    const [status, setStatus] = useState("Pending");
    const [notes, setNotes] = useState("");
    const [printModalOpen, setPrintModalOpen] = useState(false);

    // Items table in form
    const [items, setItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [currentItem, setCurrentItem] = useState({
        item: "",
        details: "",
        required: 1,
        issued: 0,
        balance: 0,
        unit: "Piece",
        inHand: ""
    });

    // Variables for View
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);

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

    // Employees data
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

    // Available items for selection
    const availableItems = [
        { id: 1, name: "Laptop", category: "Electronics", details: "Dell XPS 15, Core i7, 16GB RAM", inHand: 10, unit: "Piece" },
        { id: 2, name: "Office Chair", category: "Furniture", details: "Ergonomic Executive Chair", inHand: 15, unit: "Piece" },
        { id: 3, name: "Monitor", category: "Electronics", details: "Samsung 27\" 4K Monitor", inHand: 10, unit: "Piece" },
        { id: 4, name: "Desk", category: "Furniture", details: "Standing Desk Pro", inHand: 5, unit: "Piece" },
        { id: 5, name: "Printer", category: "Electronics", details: "HP LaserJet Pro", inHand: 4, unit: "Piece" },
        { id: 6, name: "Projector", category: "Electronics", details: "Epson EB-W52", inHand: 3, unit: "Piece" },
        { id: 7, name: "Mouse", category: "Electronics", details: "Logitech MX Master 3", inHand: 20, unit: "Piece" },
        { id: 8, name: "Keyboard", category: "Electronics", details: "Logitech MX Keys", inHand: 20, unit: "Piece" },
        { id: 9, name: "Scanner", category: "Electronics", details: "Canon imageFORMULA", inHand: 3, unit: "Piece" },
        { id: 10, name: "Conference Speaker", category: "Electronics", details: "Jabra Speak 710", inHand: 6, unit: "Piece" }
    ];

    // Units
    const units = ["Piece", "Box", "Set", "Kg", "Liter", "Meter", "Packet", "Dozen", "Carton", "Pair"];

    // Status options
    const statusOptions = [
        { value: "All", label: "All Status", color: "gray" },
        { value: "Pending", label: "Pending", color: "yellow" },
        { value: "Partial", label: "Partial", color: "orange" },
        { value: "Completed", label: "Completed", color: "green" },
        { value: "Cancelled", label: "Cancelled", color: "red" }
    ];

    // Other units
    const otherUnits = [
        "Main Warehouse",
        "North Warehouse",
        "South Warehouse",
        "East Warehouse",
        "West Warehouse",
        "Central Store",
        "Backup Storage",
        "Temporary Storage"
    ];

    // Generate Issue ID
    const generateIssueId = () => {
        const currentYear = new Date().getFullYear();
        const lastIssue = [...issues].sort((a, b) => b.id - a.id)[0];

        if (lastIssue && lastIssue.issueId.includes(`ISS-${currentYear}-`)) {
            const lastNumber = parseInt(lastIssue.issueId.split('-').pop());
            return `ISS-${currentYear}-${String(lastNumber + 1).padStart(3, '0')}`;
        }

        return `ISS-${currentYear}-001`;
    };

    // Generate Manual ID
    const generateManualId = () => {
        const lastIssue = [...issues].sort((a, b) => b.id - a.id)[0];

        if (lastIssue && lastIssue.manualId.includes('MAN-')) {
            const lastNumber = parseInt(lastIssue.manualId.split('-').pop());
            return `MAN-${String(lastNumber + 1).padStart(3, '0')}`;
        }

        return "MAN-001";
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

    // Handle item selection
    const handleItemSelect = (e) => {
        const selectedItem = availableItems.find(item => item.name === e.target.value);
        if (selectedItem) {
            setCurrentItem({
                ...currentItem,
                item: selectedItem.name,
                details: selectedItem.details,
                inHand: selectedItem.inHand,
                unit: selectedItem.unit,
                balance: selectedItem.inHand // Initially balance equals in hand
            });
        }
    };

    // Calculate balance automatically when issued quantity changes
    const handleIssuedChange = (e) => {
        const issuedQty = parseInt(e.target.value) || 0;
        const requiredQty = currentItem.required;
        const inHandQty = currentItem.inHand || 0;

        // Issued cannot exceed required or in hand
        const finalIssued = Math.min(issuedQty, requiredQty, inHandQty);
        const balance = requiredQty - finalIssued;

        setCurrentItem({
            ...currentItem,
            issued: finalIssued,
            balance: balance
        });
    };

    // Handle required quantity change
    const handleRequiredChange = (e) => {
        const requiredQty = parseInt(e.target.value) || 1;
        const issuedQty = currentItem.issued || 0;
        const inHandQty = currentItem.inHand || 0;

        // Issued cannot exceed required
        const finalIssued = Math.min(issuedQty, requiredQty, inHandQty);
        const balance = requiredQty - finalIssued;

        setCurrentItem({
            ...currentItem,
            required: requiredQty,
            issued: finalIssued,
            balance: balance
        });
    };

    // Handle add/update item
    const handleAddItem = () => {
        if (!currentItem.item || !currentItem.required || currentItem.required <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please select an item and enter required quantity",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (currentItem.issued > currentItem.required) {
            Swal.fire({
                icon: "error",
                title: "Invalid Quantity",
                text: "Issued quantity cannot exceed required quantity",
                confirmButtonColor: "#d33",
            });
            return;
        }

        if (currentItem.issued > currentItem.inHand) {
            Swal.fire({
                icon: "error",
                title: "Insufficient Stock",
                text: `Cannot issue more than available stock (${currentItem.inHand})`,
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
                        required: parseInt(currentItem.required),
                        issued: parseInt(currentItem.issued),
                        balance: parseInt(currentItem.balance),
                        unit: currentItem.unit,
                        inHand: parseInt(currentItem.inHand)
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
                required: parseInt(currentItem.required),
                issued: parseInt(currentItem.issued),
                balance: parseInt(currentItem.balance),
                unit: currentItem.unit,
                inHand: parseInt(currentItem.inHand)
            };
            setItems([...items, newItem]);
        }

        // Reset current item
        setCurrentItem({
            item: "",
            details: "",
            required: 1,
            issued: 0,
            balance: 0,
            unit: "Piece",
            inHand: ""
        });
        setEditingItemId(null);
    };

    // Remove item from form
    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Handle edit item in the form
    const handleEditItem = (item) => {
        setCurrentItem({
            item: item.item,
            details: item.details,
            required: item.required,
            issued: item.issued,
            balance: item.balance,
            unit: item.unit,
            inHand: item.inHand
        });
        setEditingItemId(item.id);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!issueId || !issueDate || !manualId || !demandId || !demandDate ||
            !department || !employee || items.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Missing Required Fields",
                text: "Please fill in all required fields and add at least one item",
                confirmButtonColor: "#d33",
            });
            return;
        }

        // Validate issued from other unit
        if (issuedFromOtherUnit && !otherUnitName) {
            Swal.fire({
                icon: "warning",
                title: "Missing Unit Name",
                text: "Please select the unit name when issuing from other unit",
                confirmButtonColor: "#d33",
            });
            return;
        }

        // Calculate overall status based on items
        const totalRequired = items.reduce((sum, item) => sum + item.required, 0);
        const totalIssued = items.reduce((sum, item) => sum + item.issued, 0);

        let overallStatus = "Pending";
        if (totalIssued === 0) {
            overallStatus = "Pending";
        } else if (totalIssued === totalRequired) {
            overallStatus = "Completed";
        } else if (totalIssued > 0 && totalIssued < totalRequired) {
            overallStatus = "Partial";
        }

        if (editingIssue) {
            // Update existing issue
            const updatedIssue = {
                ...editingIssue,
                issueId,
                issueDate,
                manualId,
                demandId,
                demandDate,
                department,
                employee,
                employeeId,
                description,
                issuedFromOtherUnit,
                otherUnitName: issuedFromOtherUnit ? otherUnitName : "",
                status: editingIssue.status === "Pending" ? overallStatus : editingIssue.status,
                items: [...items],
                notes
            };

            setIssues(issues.map(iss =>
                iss.id === editingIssue.id ? updatedIssue : iss
            ));

            Swal.fire("Updated!", "Issue updated successfully.", "success");
        } else {
            // Add new issue
            const newIssue = {
                id: issues.length + 1,
                sr: issues.length + 1,
                issueId,
                issueDate,
                manualId,
                demandId,
                demandDate,
                department,
                employee,
                employeeId,
                description,
                issuedFromOtherUnit,
                otherUnitName: issuedFromOtherUnit ? otherUnitName : "",
                status: overallStatus,
                items: [...items],
                notes,
                issuedBy: "Store Manager",
                issueDateFull: `${issueDate} ${new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })}`
            };
            setIssues([...issues, newIssue]);
            Swal.fire("Submitted!", "Issue created successfully.", "success");
        }

        setIsSliderOpen(false);
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        setIssueId(generateIssueId());
        setIssueDate("");
        setManualId(generateManualId());
        setDemandId("");
        setDemandDate("");
        setDepartment("");
        setEmployee("");
        setEmployeeId("");
        setDescription("");
        setIssuedFromOtherUnit(false);
        setOtherUnitName("");
        setStatus("Pending");
        setItems([]);
        setCurrentItem({
            item: "",
            details: "",
            required: 1,
            issued: 0,
            balance: 0,
            unit: "Piece",
            inHand: ""
        });
        setEditingItemId(null);
        setEditingIssue(null);
        setNotes("");
    };

    // Handle edit click
    const handleEditClick = (issue) => {
        setEditingIssue(issue);
        setIssueId(issue.issueId);
        setIssueDate(issue.issueDate);
        setManualId(issue.manualId);
        setDemandId(issue.demandId);
        setDemandDate(issue.demandDate);
        setDepartment(issue.department);
        setEmployee(issue.employee);
        setEmployeeId(issue.employeeId);
        setDescription(issue.description);
        setIssuedFromOtherUnit(issue.issuedFromOtherUnit);
        setOtherUnitName(issue.otherUnitName);
        setStatus(issue.status);
        setItems(issue.items);
        setNotes(issue.notes || "");
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
                const updatedIssues = issues.filter((iss) => iss.id !== id)
                    .map((iss, index) => ({
                        ...iss,
                        sr: index + 1
                    }));
                setIssues(updatedIssues);
                setCurrentPage(1);

                Swal.fire(
                    "Deleted!",
                    "Issue deleted successfully.",
                    "success"
                );
            }
        });
    };

    // Handle print click
    const handlePrintClick = (issue) => {
        setSelectedIssue(issue);
        setPrintModalOpen(true);
    };

    // Handle view click
    const handleViewClick = (issue) => {
        setSelectedIssue(issue);
        setViewModalOpen(true);
    };

    // Filter issues based on search term and status
    const filteredIssues = issues.filter(iss => {
        const matchesSearch =
            iss.issueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            iss.manualId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            iss.demandId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            iss.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            iss.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
            iss.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            iss.items.some(item => item.item.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = selectedStatus === "All" || iss.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredIssues.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredIssues.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page totals
    const pageTotalRequired = currentRecords.reduce((sum, iss) =>
        sum + iss.items.reduce((itemSum, item) => itemSum + item.required, 0), 0
    );
    const pageTotalIssued = currentRecords.reduce((sum, iss) =>
        sum + iss.items.reduce((itemSum, item) => itemSum + item.issued, 0), 0
    );
    const pageTotalBalance = currentRecords.reduce((sum, iss) =>
        sum + iss.items.reduce((itemSum, item) => itemSum + item.balance, 0), 0
    );

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

    // Get status badge
    const StatusBadge = ({ status }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
        </span>
    );

    // Initialize form
    useEffect(() => {
        if (!isSliderOpen) {
            setIssueId(generateIssueId());
            setManualId(generateManualId());
        }
    }, [isSliderOpen]);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="px-6 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <div className="flex gap-2">
                            <Package size={28} className="text-newPrimary" />
                            <h1 className="text-2xl font-bold text-newPrimary">
                                Items Issue
                            </h1>
                        </div>
                        <p className="text-gray-600 mt-1">
                            Manage inventory issuance to departments and employees
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search issues..."
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
                            New Issue
                        </button>
                    </div>
                </div>

                <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <div className="min-w-[1300px]">
                            <div className="max-h-screen overflow-y-auto custom-scrollbar">
                                <div className="inline-block w-full align-middle">
                                    {/* Table Header */}
                                    <div className="hidden lg:grid grid-cols-[0.3fr_0.7fr_0.9fr_1fr_2fr_2fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                                        <div>SR#</div>
                                        <div>Issue ID</div>
                                        <div>Department</div>
                                        <div>Employee</div>
                                        <div>Items Summary</div>
                                        <div>Description</div>
                                        <div>Status</div>
                                        <div className="text-center">Actions</div>
                                    </div>

                                    <div className="flex flex-col divide-y divide-gray-100">
                                        {loading ? (
                                            <TableSkeleton
                                                rows={recordsPerPage}
                                                cols={8}
                                                className="lg:grid-cols-[0.3fr_0.7fr_0.9fr_1fr_2fr_2fr_1fr_1fr]"
                                            />
                                        ) : currentRecords.length === 0 ? (
                                            <div className="text-center py-4 text-gray-500 bg-white">
                                                No issues found.
                                            </div>
                                        ) : (
                                            currentRecords.map((iss) => {
                                                const itemList = iss.items.map(item =>
                                                    `${item.item} (R:${item.required}/I:${item.issued})`
                                                ).join(", ");

                                                const totalRequired = iss.items.reduce((sum, item) => sum + item.required, 0);
                                                const totalIssued = iss.items.reduce((sum, item) => sum + item.issued, 0);
                                                const totalBalance = iss.items.reduce((sum, item) => sum + item.balance, 0);

                                                return (
                                                    <div
                                                        key={iss.id}
                                                        className="grid grid-cols-1 lg:grid-cols-[0.3fr_0.7fr_0.9fr_1fr_2fr_2fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                                                    >
                                                        <div className="font-medium text-gray-900">
                                                            {iss.sr}
                                                        </div>
                                                        <div className="text-gray-900 font-medium">
                                                            <div>{iss.issueId}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {iss.issueDate}
                                                            </div>
                                                            {iss.manualId && (
                                                                <div className="text-xs text-gray-500">
                                                                    Manual: {iss.manualId}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            {iss.department}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            <div>{iss.employee}</div>
                                                            <div className="text-xs text-gray-500">{iss.employeeId}</div>
                                                        </div>
                                                        <div className="text-gray-600 w-[250px] whitespace-normal break-words">
                                                            <div className="font-medium mb-1">{itemList}</div>
                                                            <div className="text-xs">
                                                                <span className="font-medium">Total:</span>
                                                                <span className="text-green-600 ml-1">R:{totalRequired}</span>
                                                                <span className="text-blue-600 ml-2">I:{totalIssued}</span>
                                                                <span className="text-amber-600 ml-2">B:{totalBalance}</span>
                                                            </div>
                                                            {iss.issuedFromOtherUnit && iss.otherUnitName && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    From: {iss.otherUnitName}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            <div className="truncate max-w-[200px]" title={iss.description}>
                                                                {iss.description}
                                                            </div>
                                                            {iss.demandId && (
                                                                <div className="text-xs text-gray-500">
                                                                    Demand: {iss.demandId}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <StatusBadge status={iss.status} />
                                                        </div>
                                                        <div className="flex justify-end gap-3">
                                                            {/* Edit Button */}
                                                            <button
                                                                onClick={() => handleEditClick(iss)}
                                                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                                                title="Edit Issue"
                                                            >
                                                                <SquarePen size={18} />
                                                            </button>

                                                            {/* View Button */}
                                                            <button
                                                                onClick={() => handleViewClick(iss)}
                                                                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                                                                title="View Details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>

                                                            {/* Print Button */}
                                                            <button
                                                                onClick={() => handlePrintClick(iss)}
                                                                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                                                                title="Print"
                                                            >
                                                                <Printer size={18} />
                                                            </button>

                                                            {/* Delete Button */}
                                                            <button
                                                                onClick={() => handleDelete(iss.id)}
                                                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
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
                        <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1.5fr_1fr_1fr] items-center gap-4 px-6 py-3 border-t bg-gray-100">
                            {/* Empty cells for first 4 columns */}
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>

                            {/* Totals in one line */}
                            <div className="font-semibold flex items-center gap-4">
                                <div className="text-blue-700 whitespace-nowrap">
                                    <span className="text-sm">Required:</span> <span className="font-bold">{pageTotalRequired}</span>
                                </div>
                                <div className="text-green-700 whitespace-nowrap">
                                    <span className="text-sm">Issued:</span> <span className="font-bold">{pageTotalIssued}</span>
                                </div>
                                <div className="text-amber-700 whitespace-nowrap">
                                    <span className="text-sm">Balance:</span> <span className="font-bold">{pageTotalBalance}</span>
                                </div>
                            </div>

                            {/* Empty cells for remaining columns */}
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredIssues.length > 0 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstRecord + 1} to{" "}
                                {Math.min(indexOfLastRecord, filteredIssues.length)} of{" "}
                                {filteredIssues.length} records
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
                    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4">
                        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-4 border-b bg-gray-100 rounded-t-2xl sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-newPrimary flex items-center gap-2">
                                    {editingIssue ? "Update Issue Item" : "Add New Issue Item"}
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
                                {/* Header Section */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                        <Hash size={16} />
                                        Issue Identification
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Issue ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={issueId}
                                                onChange={(e) => setIssueId(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                                placeholder="Auto-generated"
                                                required
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Issue Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={issueDate}
                                                onChange={(e) => setIssueDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Manual ID
                                            </label>
                                            <input
                                                type="text"
                                                value={manualId}
                                                onChange={(e) => setManualId(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter manual ID"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Demand Information Section */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                        <FileText size={16} />
                                        Demand Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Demand ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={demandId}
                                                onChange={(e) => setDemandId(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                placeholder="Enter demand ID"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Demand Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={demandDate}
                                                onChange={(e) => setDemandDate(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Department & Employee Section */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                        <Building size={16} />
                                        Department & Employee
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Department <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept, index) => (
                                                    <option key={index} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Employee <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={employee}
                                                onChange={handleEmployeeSelect}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
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

                                    <div className="mt-4">
                                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                                            Employee ID
                                        </label>
                                        <input
                                            type="text"
                                            value={employeeId}
                                            readOnly
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-50"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                                            Description
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                            placeholder="Enter issue description..."
                                            rows="2"
                                        />
                                    </div>
                                </div>

                                {/* Issue From Other Unit Checkbox */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        {issuedFromOtherUnit ? (
                                            <CheckSquare
                                                size={20}
                                                className="text-newPrimary cursor-pointer"
                                                onClick={() => setIssuedFromOtherUnit(false)}
                                            />
                                        ) : (
                                            <Square
                                                size={20}
                                                className="text-gray-400 cursor-pointer"
                                                onClick={() => setIssuedFromOtherUnit(true)}
                                            />
                                        )}
                                        <label className="text-gray-700 font-medium cursor-pointer" onClick={() => setIssuedFromOtherUnit(!issuedFromOtherUnit)}>
                                            Issue From Other Unit
                                        </label>
                                    </div>

                                    {issuedFromOtherUnit && (
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                Select Unit <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={otherUnitName}
                                                onChange={(e) => setOtherUnitName(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                                required={issuedFromOtherUnit}
                                            >
                                                <option value="">Select Unit</option>
                                                {otherUnits.map((unit, index) => (
                                                    <option key={index} value={unit}>{unit}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Items Section */}
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-4 border-b">
                                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                            <Package size={16} />
                                            Items to Issue
                                        </h4>
                                    </div>
                                    <div className="p-4">
                                        {/* Add Item Form */}
                                        <div className="grid gap-1 mb-6">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Item Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={currentItem.item}
                                                        onChange={handleItemSelect}
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    >
                                                        <option value="">Select Item</option>
                                                        {availableItems.map((item) => (
                                                            <option key={item.id} value={item.name}>
                                                                {item.name} ({item.inHand} in stock)
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
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                        placeholder="Item specifications"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Unit
                                                    </label>
                                                    <select
                                                        value={currentItem.unit}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                    >
                                                        {units.map((unit, index) => (
                                                            <option key={index} value={unit}>{unit}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Qty in Hand
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.inHand}
                                                        readOnly
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm bg-gray-50"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Qty Required <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.required}
                                                        onChange={handleRequiredChange}
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                        placeholder="Required"
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Qty to Issue
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.issued}
                                                        onChange={handleIssuedChange}
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm"
                                                        placeholder="To issue"
                                                        min="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                                        Balance
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.balance}
                                                        readOnly
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary text-sm bg-gray-50"
                                                    />
                                                </div>
                                                <div className="mt-7">
                                                    <button
                                                        type="button"
                                                        onClick={handleAddItem}
                                                        className="bg-green-500 w-full text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 text-sm"
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
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Required</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Issued</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Balance</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Unit</th>
                                                            <th className="p-2 text-left text-xs font-semibold text-gray-600 border-b">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, index) => (
                                                            <tr key={item.id} className="hover:bg-gray-50">
                                                                <td className="p-2 border-b text-center">{index + 1}</td>
                                                                <td className="p-2 border-b font-medium">{item.item}</td>
                                                                <td className="p-2 border-b text-gray-600">{item.details}</td>
                                                                <td className="p-2 border-b text-left font-medium text-blue-600">{item.required}</td>
                                                                <td className="p-2 border-b text-left font-medium text-green-600">{item.issued}</td>
                                                                <td className="p-2 border-b text-left font-medium text-amber-600">{item.balance}</td>
                                                                <td className="p-2 border-b text-left">{item.unit}</td>
                                                                <td className="p-3 border-b flex gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleEditItem(item)}
                                                                        className="text-blue-500 hover:text-blue-700"
                                                                        title="Edit"
                                                                    >
                                                                        <SquarePen size={16} />
                                                                    </button>
                                                                    {/* <button
                                                                        type="button"
                                                                        onClick={() => handleViewItem(item)}
                                                                        className="text-amber-500 hover:text-amber-700"
                                                                        title="View"
                                                                    >
                                                                        <Eye size={16} />
                                                                    </button> */}
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
                                                    <tfoot>
                                                        <tr className="bg-gray-50">
                                                            <td colSpan="3" className="p-2 border-t font-semibold text-right">Totals:</td>
                                                            <td className="p-2 border-t text-left font-bold text-blue-600">
                                                                {items.reduce((sum, item) => sum + item.required, 0)}
                                                            </td>
                                                            <td className="p-2 border-t text-left font-bold text-green-600">
                                                                {items.reduce((sum, item) => sum + item.issued, 0)}
                                                            </td>
                                                            <td className="p-2 border-t text-left font-bold text-amber-600">
                                                                {items.reduce((sum, item) => sum + item.balance, 0)}
                                                            </td>
                                                            <td className="p-2 border-t"></td>
                                                            <td className="p-2 border-t"></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No items added for issue.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
                                        <FileText size={16} />
                                        Additional Notes
                                    </h4>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
                                        placeholder="Enter any additional notes or comments..."
                                        rows="3"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors"
                                >
                                    {editingIssue ? "Update Issue" : "Submit Issue"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Print Modal */}
                {printModalOpen && selectedIssue && (
                    <IssuePrint
                        issue={selectedIssue}
                        onClose={() => {
                            setPrintModalOpen(false);
                            setSelectedIssue(null);
                        }}
                    />
                )}

                {/* View Modal */}
                {viewModalOpen && selectedIssue && (
                    <IssueViewModal
                        issue={selectedIssue}
                        onClose={() => {
                            setViewModalOpen(false);
                            setSelectedIssue(null);
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

export default ItemsIssue;