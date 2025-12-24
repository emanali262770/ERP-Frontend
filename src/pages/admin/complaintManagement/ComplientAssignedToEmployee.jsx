import React, { useState, useEffect, useCallback } from "react";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { 
  FiEdit3, 
  FiTrash2, 
  FiCalendar, 
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiHash,
  FiUser,
  FiPackage,
  FiClipboard,
  FiUserCheck,
  FiUserPlus,
  FiCheck,
  FiX
} from "react-icons/fi";
import CommanHeader from "../../../components/CommanHeader";

const ComplientAssignedToEmployee = () => {
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [showEmployeeList, setShowEmployeeList] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

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

    // Set today's date on component mount
    useEffect(() => {
        fetchAssignedComplaints();
    }, []);

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

    // Handle Assign button click
    const handleAssignClick = (complaint) => {
        setSelectedComplaint(complaint);
        setShowEmployeeList(true);
    };

    // Handle Employee selection for assignment
    const handleEmployeeSelect = async (employee) => {
        if (!selectedComplaint) return;

        try {
            // Generate assigned ID
            const randomNum = Math.floor(100 + Math.random() * 900);
            const assignedId = `ASGN${randomNum}`;
            const assignedDate = new Date().toISOString().split('T')[0];

            // Create new assigned complaint
            const newAssignedComplaint = {
                _id: `assigned-${Date.now()}`,
                assignedId: assignedId,
                assignedDate: assignedDate,
                complaintId: selectedComplaint.complaintId || selectedComplaint._id,
                complaintDate: selectedComplaint.date || new Date().toISOString().split('T')[0],
                customer: selectedComplaint.customer,
                employee: employee.name,
                product: selectedComplaint.product,
                complaint: selectedComplaint.complaint,
                status: "Assigned"
            };

            // Add to assigned complaints
            setAssignedComplaints(prev => [newAssignedComplaint, ...prev]);
            
            // Update the original complaint to mark as assigned
            setAssignedComplaints(prev => 
                prev.map(c => 
                    c._id === selectedComplaint._id 
                    ? { ...c, assignedTo: employee.name } 
                    : c
                )
            );

            toast.success(`Complaint assigned to ${employee.name}`);
            setShowEmployeeList(false);
            setSelectedComplaint(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to assign complaint");
        }
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
                            {currentItems.map((complaint, index) => (
                                <div
                                    key={complaint._id}
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
                                        {complaint.assignedId || "Not Assigned"}
                                    </div>

                                    {/* Assigned Date */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="w-3 h-3 text-gray-400" />
                                            {complaint.assignedDate ? formatDate(complaint.assignedDate) : "N/A"}
                                        </div>
                                    </div>

                                    {/* Complaint ID */}
                                    <div className="text-sm font-medium text-gray-900 font-mono">
                                        {complaint.complaintId}
                                    </div>

                                    {/* Customer */}
                                    <div className="text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <FiUser className="w-3 h-3 text-gray-400" />
                                            <span className="truncate">{complaint.customer}</span>
                                        </div>
                                    </div>

                                    {/* Employee */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiUserCheck className="w-3 h-3 text-gray-400" />
                                            {complaint.employee || complaint.assignedTo || "Unassigned"}
                                        </div>
                                    </div>

                                    {/* Product */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiPackage className="w-3 h-3 text-gray-400" />
                                            {complaint.product}
                                        </div>
                                    </div>

                                    {/* Complaint */}
                                    <div className="text-sm text-gray-600">
                                        <div className="line-clamp-2">
                                            {complaint.complaint}
                                        </div>
                                    </div>

                                    {/* Actions - ONLY SHOW ASSIGN ICON */}
                                    <div className="flex items-center gap-3 justify-end">
                                        {/* Always show ASSIGN ICON only */}
                                        <button
                                            onClick={() => handleAssignClick(complaint)}
                                            className="text-green-600 hover:bg-green-100 bg-green-50 p-2 rounded-md transition"
                                            title="Assign Complaint"
                                        >
                                            <FiUserPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee List Modal */}
            {showEmployeeList && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-gray-600/70 backdrop-blur-sm"
                        onClick={() => setShowEmployeeList(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                        {/* Header */}
                        <div className="sticky top-0 bg-gray-200 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FiUserPlus className="w-6 h-6 text-newPrimary" />
                                    <div>
                                        <h2 className="text-xl font-bold text-newPrimary">
                                            Assign to Employee
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Select an employee to assign this complaint
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="p-1 hover:bg-white/20 bg-white/10 rounded-lg transition-all group"
                                    onClick={() => setShowEmployeeList(false)}
                                >
                                    <FiX className="w-5 h-5 text-newPrimary" />
                                </button>
                            </div>
                        </div>

                        {/* Employee List */}
                        <div className="px-6 py-4 max-h-96 overflow-y-auto">
                            <div className="space-y-3">
                                {dummyEmployees.map((employee) => (
                                    <button
                                        key={employee.id}
                                        onClick={() => handleEmployeeSelect(employee)}
                                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-newPrimary hover:bg-green-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">{employee.name}</div>
                                            <div className="text-sm text-gray-600">{employee.department}</div>
                                        </div>
                                        <FiCheck className="w-5 h-5 text-gray-300 group-hover:text-newPrimary" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplientAssignedToEmployee;