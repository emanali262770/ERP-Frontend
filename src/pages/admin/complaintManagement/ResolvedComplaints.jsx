import React, { useState, useEffect, useCallback } from "react";
import { HashLoader } from "react-spinners";
import { 
  FiCalendar, 
  FiCheckCircle,
  FiFilter,
  FiUser,
  FiPackage,
  FiUserCheck
} from "react-icons/fi";
import CommanHeader from "../../../components/CommanHeader";

const ResolvedComplaints = () => {
    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dummy data for resolved complaints
    const dummyResolvedComplaints = [
        {
            _id: "1",
            complaintId: "COMP001",
            date: "2024-01-15",
            customer: "John Doe - ABC Corp",
            assignedEmployee: "Mike Johnson",
            product: "Laptop Pro",
            complaint: "Screen flickering issue - Replaced display panel",
            status: "Resolved"
        },
        {
            _id: "2",
            complaintId: "COMP002",
            date: "2024-01-16",
            customer: "Jane Smith - XYZ Ltd",
            assignedEmployee: "Sarah Williams",
            product: "Smartphone X",
            complaint: "Battery draining too fast - Updated firmware and replaced battery",
            status: "Resolved"
        },
        {
            _id: "3",
            complaintId: "COMP003",
            date: "2024-01-17",
            customer: "Robert Johnson - Tech Solutions",
            assignedEmployee: "David Brown",
            product: "Server Rack",
            complaint: "Network connectivity issues - Reconfigured network settings",
            status: "Resolved"
        },
        {
            _id: "4",
            complaintId: "COMP004",
            date: "2024-01-18",
            customer: "Emily Davis - Innovate Inc",
            assignedEmployee: "Lisa Anderson",
            product: "Software License",
            complaint: "Activation issues - Provided new activation key",
            status: "Resolved"
        },
        {
            _id: "5",
            complaintId: "COMP005",
            date: "2024-01-19",
            customer: "Michael Brown - Global Enterprises",
            assignedEmployee: "Tom Wilson",
            product: "Printer Laser",
            complaint: "Paper jamming frequently - Cleaned and serviced printer",
            status: "Resolved"
        },
        {
            _id: "6",
            complaintId: "COMP006",
            date: "2024-01-15",
            customer: "Alex Turner - Tech World",
            assignedEmployee: "Mike Johnson",
            product: "Monitor 27inch",
            complaint: "Dead pixels on screen - Replaced monitor under warranty",
            status: "Resolved"
        },
        {
            _id: "7",
            complaintId: "COMP007",
            date: "2024-01-16",
            customer: "Sophia Garcia - Digital Solutions",
            assignedEmployee: "Sarah Williams",
            product: "Tablet Pro",
            complaint: "Touch screen not responsive - Calibrated touch screen",
            status: "Resolved"
        },
        {
            _id: "8",
            complaintId: "COMP008",
            date: "2024-01-17",
            customer: "Daniel Miller - Cloud Systems",
            assignedEmployee: "David Brown",
            product: "Network Switch",
            complaint: "Port connectivity issues - Replaced faulty network switch",
            status: "Resolved"
        },
        {
            _id: "9",
            complaintId: "COMP009",
            date: "2024-01-20",
            customer: "Laura Martinez - Digital Hub",
            assignedEmployee: "Lisa Anderson",
            product: "Wireless Router",
            complaint: "Intermittent connection drops - Updated firmware",
            status: "Resolved"
        },
        {
            _id: "10",
            complaintId: "COMP010",
            date: "2024-01-21",
            customer: "Chris Evans - Tech Innovations",
            assignedEmployee: "Tom Wilson",
            product: "External Hard Drive",
            complaint: "Not recognized by system - Provided replacement cable",
            status: "Resolved"
        }
    ];

    // Dummy employees
    const dummyEmployees = [
        { id: "all", name: "All Employees" },
        { id: "1", name: "Mike Johnson", department: "Technical Support" },
        { id: "2", name: "Sarah Williams", department: "Hardware Repair" },
        { id: "3", name: "David Brown", department: "Network Support" },
        { id: "4", name: "Lisa Anderson", department: "Software Support" },
        { id: "5", name: "Tom Wilson", department: "Customer Service" }
    ];

    // Fetch resolved complaints
    const fetchResolvedComplaints = useCallback(async () => {
        try {
            setLoading(true);
            setResolvedComplaints(dummyResolvedComplaints);
            setFilteredComplaints(dummyResolvedComplaints);
        } catch (error) {
            console.log("Error loading data");
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);

    useEffect(() => {
        fetchResolvedComplaints();
    }, [fetchResolvedComplaints]);

    // Filter complaints by employee
    useEffect(() => {
        if (!selectedEmployee || selectedEmployee === "all") {
            setFilteredComplaints(resolvedComplaints);
        } else {
            const employee = dummyEmployees.find(e => e.id === selectedEmployee);
            if (employee) {
                const filtered = resolvedComplaints.filter(
                    complaint => complaint.assignedEmployee === employee.name
                );
                setFilteredComplaints(filtered);
            }
        }
        setCurrentPage(1);
    }, [selectedEmployee, resolvedComplaints]);

    // Pagination calculations
    const totalItems = filteredComplaints.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

    // Handle employee filter change
    const handleEmployeeFilterChange = (employeeId) => {
        setSelectedEmployee(employeeId);
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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
                <div className="text-center flex flex-col items-center justify-center">
                    <HashLoader height="150" width="150" radius={1} color="#84CF16" />
                    <p className="mt-4 text-gray-600">Loading resolved complaints...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <CommanHeader/>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FiCheckCircle className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">Resolved Complaints</h1>
                        <p className="text-gray-500 text-sm">View all resolved customer complaints</p>
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    Total: {resolvedComplaints.length} complaints
                </div>
            </div>

            {/* Filter Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FiFilter className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Filter by:</span>
                        </div>
                        
                        {/* Employee Filter */}
                        <div className="flex items-center gap-2">
                            <FiUserCheck className="w-4 h-4 text-gray-400" />
                            <select
                                value={selectedEmployee}
                                onChange={(e) => handleEmployeeFilterChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary transition-all duration-200 hover:border-gray-400 appearance-none min-w-[200px] bg-white"
                            >
                                {dummyEmployees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Active filter badge */}
                        {selectedEmployee && selectedEmployee !== "all" && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                <FiUserCheck className="w-3 h-3" />
                                {dummyEmployees.find(e => e.id === selectedEmployee)?.name}
                                <button
                                    onClick={() => setSelectedEmployee("all")}
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-gray-600">
                        Showing {filteredComplaints.length} of {resolvedComplaints.length} complaints
                    </div>
                </div>
            </div>

            {/* Resolved Complaints Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[1400px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_1fr_1fr_2fr_1.5fr_1.5fr_3fr_1fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Complaint ID</div>
                            <div>Date</div>
                            <div>Customer</div>
                            <div>Employee</div>
                            <div>Product</div>
                            <div>Complaint</div>
                            <div>Status</div>
                        </div>

                        {/* Resolved Complaints List */}
                        <div className="flex flex-col">
                            {currentItems.length > 0 ? (
                                currentItems.map((complaint, index) => (
                                    <div
                                        key={complaint._id}
                                        className={`grid grid-cols-[0.5fr_1fr_1fr_2fr_1.5fr_1.5fr_3fr_1fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                        }`}
                                    >
                                        {/* Serial Number */}
                                        <div className="text-sm font-medium text-gray-900">
                                            {startIndex + index + 1}
                                        </div>

                                        {/* Complaint ID */}
                                        <div className="text-sm font-medium text-newPrimary font-mono">
                                            {complaint.complaintId}
                                        </div>

                                        {/* Date */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className="w-3 h-3 text-gray-400" />
                                                {formatDate(complaint.date)}
                                            </div>
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
                                                <span className="font-medium">{complaint.assignedEmployee}</span>
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

                                        {/* Status */}
                                        <div>
                                            <span className="px-3 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200 inline-flex items-center gap-1">
                                                <FiCheckCircle className="w-3 h-3" />
                                                {complaint.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-8 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <FiCheckCircle className="w-12 h-12 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Resolved Complaints</h3>
                                        <p className="text-gray-500 max-w-md">
                                            {selectedEmployee && selectedEmployee !== "all" 
                                                ? "No resolved complaints found for this employee."
                                                : "No complaints have been resolved yet."}
                                        </p>
                                        {selectedEmployee && selectedEmployee !== "all" && (
                                            <button
                                                onClick={() => setSelectedEmployee("all")}
                                                className="mt-4 text-newPrimary hover:text-newPrimary/80 font-medium"
                                            >
                                                View all complaints →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
              
            </div>
        </div>
    );
};

export default ResolvedComplaints;