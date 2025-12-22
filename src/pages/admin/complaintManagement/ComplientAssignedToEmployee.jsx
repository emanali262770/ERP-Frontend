import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { 
  FiEdit3, 
  FiTrash2, 
  FiCalendar, 
  FiUsers,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiHash,
  FiUser,
  FiPackage,
  FiMessageSquare,
  FiClipboard,
  FiUserCheck,
  FiUserPlus
} from "react-icons/fi";
import { FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

const ComplientAssignedToEmployee = () => {
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [assignedId, setAssignedId] = useState("");
    const [assignedDate, setAssignedDate] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const sliderRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dummy data for complaints
    const dummyComplaints = [
        {
            _id: "1",
            complaintId: "COMP001",
            date: "2024-01-15",
            customer: "John Doe - ABC Corp",
            product: "Laptop Pro",
            complaint: "Screen flickering issue",
            assignedTo: ""
        },
        {
            _id: "2",
            complaintId: "COMP002",
            date: "2024-01-16",
            customer: "Jane Smith - XYZ Ltd",
            product: "Smartphone X",
            complaint: "Battery draining too fast",
            assignedTo: ""
        },
        {
            _id: "3",
            complaintId: "COMP003",
            date: "2024-01-17",
            customer: "Robert Johnson - Tech Solutions",
            product: "Server Rack",
            complaint: "Network connectivity issues",
            assignedTo: ""
        },
        {
            _id: "4",
            complaintId: "COMP004",
            date: "2024-01-18",
            customer: "Emily Davis - Innovate Inc",
            product: "Software License",
            complaint: "Activation issues",
            assignedTo: ""
        },
        {
            _id: "5",
            complaintId: "COMP005",
            date: "2024-01-19",
            customer: "Michael Brown - Global Enterprises",
            product: "Printer Laser",
            complaint: "Paper jamming frequently",
            assignedTo: ""
        }
    ];

    // Dummy data for assigned complaints
    const dummyAssignedComplaints = [
        {
            _id: "A1",
            assignedId: "ASGN001",
            assignedDate: "2024-01-16",
            complaintId: "COMP001",
            complaintDate: "2024-01-15",
            customer: "John Doe - ABC Corp",
            employee: "Mike Johnson",
            product: "Laptop Pro",
            complaint: "Screen flickering issue",
            status: "Assigned"
        },
        {
            _id: "A2",
            assignedId: "ASGN002",
            assignedDate: "2024-01-17",
            complaintId: "COMP002",
            complaintDate: "2024-01-16",
            customer: "Jane Smith - XYZ Ltd",
            employee: "Sarah Williams",
            product: "Smartphone X",
            complaint: "Battery draining too fast",
            status: "Assigned"
        }
    ];

    // Dummy employees
    const dummyEmployees = [
        { id: 1, name: "Mike Johnson", department: "Technical Support" },
        { id: 2, name: "Sarah Williams", department: "Hardware Repair" },
        { id: 3, name: "David Brown", department: "Network Support" },
        { id: 4, name: "Lisa Anderson", department: "Software Support" },
        { id: 5, name: "Tom Wilson", department: "Customer Service" }
    ];

    // Slider animation
    useEffect(() => {
        if (isSliderOpen && sliderRef.current) {
            gsap.fromTo(
                sliderRef.current,
                { scale: 0.7, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
            );
        }
    }, [isSliderOpen]);

    // Set today's date on component mount
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setAssignedDate(today);
        generateAssignedId();
        fetchAssignedComplaints();
    }, []);

    // Generate assigned ID
    const generateAssignedId = () => {
        const randomNum = Math.floor(100 + Math.random() * 900);
        setAssignedId(`ASGN${randomNum}`);
    };

    // Fetch assigned complaints
    const fetchAssignedComplaints = useCallback(async () => {
        try {
            setLoading(true);
            // Try to fetch from API first
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/assigned-complaints`);
            if (res.data && res.data.length > 0) {
                setAssignedComplaints(res.data);
            } else {
                // If no data from API, use dummy data
                setAssignedComplaints(dummyAssignedComplaints);
                console.log("Using dummy assigned complaints data");
            }
        } catch (error) {
            // If API fails, use dummy data for demonstration
            console.log("API failed, using dummy data");
            setAssignedComplaints(dummyAssignedComplaints);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);

    // Pagination calculations
    const totalItems = assignedComplaints.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = assignedComplaints.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleAddAssignment = () => {
        setIsSliderOpen(true);
        setIsEdit(false);
        setEditId(null);
        
        // Reset form
        const today = new Date().toISOString().split('T')[0];
        setAssignedDate(today);
        generateAssignedId();
        setSelectedEmployee("");
        setSelectedRows([]);
    };

    // Handle row selection in table
    const handleRowSelect = (complaintId) => {
        setSelectedRows(prev => {
            if (prev.includes(complaintId)) {
                return prev.filter(id => id !== complaintId);
            } else {
                return [...prev, complaintId];
            }
        });
    };

    // Get selected complaints data
    const getSelectedComplaintsData = () => {
        return dummyComplaints.filter(complaint => selectedRows.includes(complaint._id));
    };

    // Handle Assign button
    const handleAssign = () => {
        if (selectedRows.length === 0) {
            toast.error("Please select at least one complaint to assign");
            return;
        }
        
        // Update selected complaints with assigned employee
        const updatedComplaints = dummyComplaints.map(complaint => {
            if (selectedRows.includes(complaint._id)) {
                const employee = dummyEmployees.find(e => e.id === parseInt(selectedEmployee));
                return {
                    ...complaint,
                    assignedTo: employee ? employee.name : ""
                };
            }
            return complaint;
        });
        
        // Update local state for demonstration
        console.log("Assigned complaints:", updatedComplaints.filter(c => selectedRows.includes(c._id)));
        toast.success(`Assigned ${selectedRows.length} complaint(s) to employee`);
    };

    // Save Assignment
    const handleSave = async () => {
        if (!selectedEmployee || selectedRows.length === 0) {
            toast.error("Please select employee and at least one complaint");
            return;
        }

        try {
            const selectedEmployeeData = dummyEmployees.find(e => e.id === parseInt(selectedEmployee));
            const selectedRowsData = getSelectedComplaintsData();

            if (isEdit && editId) {
                // Update assigned complaint
                const updatedAssignedComplaint = {
                    _id: editId,
                    assignedId: assignedId,
                    assignedDate: assignedDate,
                    complaintId: selectedRowsData[0]?.complaintId || "MULTIPLE",
                    complaintDate: selectedRowsData[0]?.date || new Date().toISOString().split('T')[0],
                    customer: selectedRowsData[0]?.customer || "Multiple Customers",
                    employee: selectedEmployeeData.name,
                    product: selectedRowsData[0]?.product || "Multiple Products",
                    complaint: selectedRowsData[0]?.complaint || "Multiple Complaints",
                    status: "Assigned"
                };

                setAssignedComplaints(assignedComplaints.map(complaint =>
                    complaint._id === editId ? updatedAssignedComplaint : complaint
                ));
                toast.success("Assignment updated successfully");
            } else {
                // Add new assignment
                selectedRowsData.forEach((complaint, index) => {
                    const newAssignedComplaint = {
                        _id: `assigned-${Date.now()}-${index}`,
                        assignedId: assignedId,
                        assignedDate: assignedDate,
                        complaintId: complaint.complaintId,
                        complaintDate: complaint.date,
                        customer: complaint.customer,
                        employee: selectedEmployeeData.name,
                        product: complaint.product,
                        complaint: complaint.complaint,
                        status: "Assigned"
                    };

                    setAssignedComplaints(prev => [newAssignedComplaint, ...prev]);
                });
                toast.success(`${selectedRowsData.length} complaint(s) assigned successfully`);
            }

            reState();
        } catch (error) {
            console.error(error);
            toast.error(`❌ ${isEdit ? "Update" : "Add"} Assignment failed`);
        }
    };

    // Reset state
    const reState = () => {
        setIsSliderOpen(false);
        setIsEdit(false);
        setEditId(null);
        setSelectedEmployee("");
        setSelectedRows([]);
    };

    // Edit Assignment
    const handleEdit = (assignment) => {
        setIsEdit(true);
        setEditId(assignment._id);
        setAssignedId(assignment.assignedId);
        setAssignedDate(assignment.assignedDate);
        
        // Find employee by name
        const employee = dummyEmployees.find(e => e.name === assignment.employee);
        if (employee) {
            setSelectedEmployee(employee.id.toString());
        }
        
        // Find and select the complaint
        const complaint = dummyComplaints.find(c => c.complaintId === assignment.complaintId);
        if (complaint) {
            setSelectedRows([complaint._id]);
        }
        
        setIsSliderOpen(true);
    };

    // Delete Assignment
    const handleDelete = async (id) => {
        const swalWithTailwindButtons = Swal.mixin({
            customClass: {
                actions: "space-x-2",
                confirmButton:
                    "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
                cancelButton:
                    "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
            },
            buttonsStyling: false,
        });

        swalWithTailwindButtons
            .fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setAssignedComplaints(assignedComplaints.filter((complaint) => complaint._id !== id));
                        swalWithTailwindButtons.fire(
                            "Deleted!",
                            "Assignment deleted successfully.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Delete error:", error);
                        swalWithTailwindButtons.fire(
                            "Error!",
                            "Failed to delete assignment.",
                            "error"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Assignment is safe 🙂",
                        "error"
                    );
                }
            });
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Show loading spinner
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
                <div className="text-center flex flex-col items-center justify-center">
                    <HashLoader
                        height="150"
                        width="150"
                        radius={1}
                        color="#84CF16"
                    />
                    <p className="mt-4 text-gray-600">Loading assigned complaints...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <CommanHeader/>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FiUserPlus className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">Complaints Assigned to Employee</h1>
                        <p className="text-gray-500 text-sm">Manage employee assignments for complaints</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
                        onClick={handleAddAssignment}
                    >
                        <FiUserPlus className="w-4 h-4" />
                        Assign Complaint
                    </button>
                </div>
            </div>

            {/* Assigned Complaints Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[1600px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_2fr_2fr_2fr_3fr_1fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Assigned ID</div>
                            <div>Assigned Date</div>
                            <div>Complaint ID</div>
                            <div>Customer</div>
                            <div>Employee</div>
                            <div>Product</div>
                            <div>Complaint</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Assigned Complaints List */}
                        <div className="flex flex-col">
                            {currentItems.map((assignment, index) => (
                                <div
                                    key={assignment._id}
                                    className={`grid grid-cols-[0.5fr_1fr_1fr_1fr_2fr_2fr_2fr_3fr_1fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                    }`}
                                >
                                    {/* Serial Number */}
                                    <div className="text-sm font-medium text-gray-900">
                                        {startIndex + index + 1}
                                    </div>

                                    {/* Assigned ID */}
                                    <div className="text-sm font-medium text-newPrimary font-mono">
                                        {assignment.assignedId}
                                    </div>

                                    {/* Assigned Date */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="w-3 h-3 text-gray-400" />
                                            {formatDate(assignment.assignedDate)}
                                        </div>
                                    </div>

                                    {/* Complaint ID */}
                                    <div className="text-sm font-medium text-gray-900 font-mono">
                                        {assignment.complaintId}
                                    </div>

                                    {/* Customer */}
                                    <div className="text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <FiUser className="w-3 h-3 text-gray-400" />
                                            <span className="truncate">{assignment.customer}</span>
                                        </div>
                                    </div>

                                    {/* Employee */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiUserCheck className="w-3 h-3 text-gray-400" />
                                            {assignment.employee}
                                        </div>
                                    </div>

                                    {/* Product */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiPackage className="w-3 h-3 text-gray-400" />
                                            {assignment.product}
                                        </div>
                                    </div>

                                    {/* Complaint */}
                                    <div className="text-sm text-gray-600">
                                        <div className="line-clamp-2">
                                            {assignment.complaint}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 justify-end">
                                        {/* EDIT ICON */}
                                        <button
                                            onClick={() => handleEdit(assignment)}
                                            className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-2 rounded-md transition"
                                        >
                                            <FiEdit3 className="w-4 h-4" />
                                        </button>
                                        {/* DELETE ICON */}
                                        <button
                                            onClick={() => handleDelete(assignment._id)}
                                            className="text-red-600 hover:bg-red-100 bg-red-50 p-2 rounded-md transition"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
             
            </div>

            {/* Slider/Modal for Assignment Form */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
                    isSliderOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-gray-600/70 backdrop-blur-0 transition-opacity duration-300 ${
                        isSliderOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={reState}
                />

                {/* Slider Content */}
                <div
                    ref={sliderRef}
                    className={`relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${
                        isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
                    }`}
                >
                    {/* Header with gradient */}
                    <div className="sticky top-0 z-10 bg-gray-200 px-8 py-4 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <FiUserPlus className="w-6 h-6 text-newPrimary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-newPrimary">
                                            {isEdit ? "Update Assignment" : "Assign Complaint to Employee"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {isEdit ? "Update assignment details" : "Fill in the assignment information below"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="p-1 hover:bg-white/20 bg-white/10 rounded-xl transition-all duration-300 group backdrop-blur-sm hover:scale-105"
                                onClick={reState}
                            >
                                <svg className="w-6 h-6 text-white bg-newPrimary rounded-lg group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-8 py-6 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-hide scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="space-y-8 pb-2">
                            {/* Section 1: Assignment Information */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Assignment Information</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Assigned ID */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Assigned ID <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiHash className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={assignedId}
                                                onChange={(e) => setAssignedId(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="ASGN001"
                                            />
                                        </div>
                                    </div>

                                    {/* Assigned Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Assigned Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiCalendar className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                value={assignedDate}
                                                onChange={(e) => setAssignedDate(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Employee Select */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Employee <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiUserCheck className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <select
                                                value={selectedEmployee}
                                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                                            >
                                                <option value="">Select Employee</option>
                                                {dummyEmployees.map(employee => (
                                                    <option key={employee.id} value={employee.id}>
                                                        {employee.name} - {employee.department}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Complaints Table - Only show when employee is selected */}
                                {selectedEmployee && (
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Select Complaints to Assign <span className="text-red-500">*</span>
                                        </label>
                                        <div className="rounded-lg border border-gray-300 overflow-hidden">
                                            <div className="grid grid-cols-[0.3fr_0.8fr_0.8fr_1.5fr_1fr_2fr] gap-4 whitespace-nowrap bg-gray-100 py-3 px-4 text-sm font-medium text-gray-700">
                                                <div>Select</div>
                                                <div>Complaint ID</div>
                                                <div>Date</div>
                                                <div>Customer</div>
                                                <div>Product</div>
                                                <div>Complaint</div>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {dummyComplaints
                                                    .filter(complaint => !complaint.assignedTo) // Only show unassigned complaints
                                                    .map((complaint, index) => (
                                                    <div
                                                        key={complaint._id}
                                                        className={`grid grid-cols-[0.3fr_0.8fr_0.8fr_1.5fr_1fr_2fr] gap-4 items-center py-3 px-4 border-b border-gray-200 hover:bg-gray-50 ${
                                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRows.includes(complaint._id)}
                                                                onChange={() => handleRowSelect(complaint._id)}
                                                                className="w-4 h-4 text-newPrimary rounded focus:ring-newPrimary border-gray-300"
                                                            />
                                                        </div>
                                                        <div className="text-sm font-medium text-newPrimary font-mono">
                                                            {complaint.complaintId}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {formatDate(complaint.date)}
                                                        </div>
                                                        <div className="text-sm text-gray-900 truncate">
                                                            {complaint.customer}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {complaint.product}
                                                        </div>
                                                        <div className="text-sm text-gray-600 truncate" title={complaint.complaint}>
                                                            {complaint.complaint}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            Selected: {selectedRows.length} complaint(s)
                                        </div>
                                    </div>
                                )}

                                {/* Assign Button */}
                                {selectedEmployee && selectedRows.length > 0 && (
                                    <div className="mt-4">
                                        <button
                                            className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                            onClick={handleAssign}
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                <FiUserCheck className="w-5 h-5" />
                                                Assign Selected Complaints
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Save Button */}
                            <div className="flex gap-4">
                                <button
                                    className="flex-1 px-8 py-4 bg-gradient-to-r from-newPrimary to-newPrimary/90 text-white font-semibold rounded-xl hover:from-newPrimary/90 hover:to-newPrimary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={handleSave}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        {isEdit ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Update Assignment
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Save Assignment
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplientAssignedToEmployee;