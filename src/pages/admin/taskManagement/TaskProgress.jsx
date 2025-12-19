import React, { useState, useEffect, useCallback } from "react";
import { HashLoader } from "react-spinners";
import axios from "axios";
import {
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiPauseCircle,
    FiXCircle,
    FiFileText,
    FiCalendar,
    FiUser,
    FiUsers
} from "react-icons/fi";
import { FaTasks, FaCalendarCheck, FaChartLine } from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";
// import Pagination from "../../pages/admin/pagination/Pagination";

const TaskProgress = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
    const itemsPerPage = 10;

    // Dummy data for demonstration
    const dummyAssignments = [
        {
            _id: "1",
            assignmentId: "ASSIGN001",
            assignmentName: "Website Redesign Project",
            tasks: ["UI Design", "Frontend Development", "Backend API"],
            details: "Complete redesign of company website with modern UI/UX",
            status: "In Progress",
            assignedTo: "John Smith",
            teamSize: 3,
            startDate: "2024-03-01",
            endDate: "2024-03-31",
            progress: 65,
            hoursWorked: 120,
            estimatedHours: 180
        },
        {
            _id: "2",
            assignmentId: "ASSIGN002",
            assignmentName: "Mobile App Development",
            tasks: ["React Native Setup", "UI Components", "API Integration"],
            details: "Develop cross-platform mobile application for iOS and Android",
            status: "In Progress",
            assignedTo: "Michael Chen",
            teamSize: 4,
            startDate: "2024-02-15",
            endDate: "2024-03-15",
            progress: 100,
            hoursWorked: 320,
            estimatedHours: 300
        },
        {
            _id: "3",
            assignmentId: "ASSIGN003",
            assignmentName: "Database Migration",
            tasks: ["Data Backup", "Schema Migration", "Performance Testing"],
            details: "Migrate from MySQL to PostgreSQL database system",
            status: "In Progress",
            assignedTo: "Emily Rodriguez",
            teamSize: 2,
            startDate: "2024-03-10",
            endDate: "2024-03-25",
            progress: 100,
            hoursWorked: 160,
            estimatedHours: 150
        },
        {
            _id: "4",
            assignmentId: "ASSIGN004",
            assignmentName: "API Integration",
            tasks: ["Payment Gateway", "Third-party Services", "Documentation"],
            details: "Integrate third-party payment gateway API and other services",
            status: "In Progress",
            assignedTo: "David Wilson",
            teamSize: 3,
            startDate: "2024-03-05",
            endDate: "2024-04-05",
            progress: 40,
            hoursWorked: 80,
            estimatedHours: 200
        },
        {
            _id: "5",
            assignmentId: "ASSIGN005",
            assignmentName: "Security Audit",
            tasks: ["Vulnerability Scan", "Penetration Testing", "Report Generation"],
            details: "Perform comprehensive security audit of all systems",
            status: "In Progress",
            assignedTo: "Lisa Thompson",
            teamSize: 2,
            startDate: "2024-03-20",
            endDate: "2024-04-10",
            progress: 10,
            hoursWorked: 20,
            estimatedHours: 120
        },
        {
            _id: "6",
            assignmentId: "ASSIGN006",
            assignmentName: "Performance Optimization",
            tasks: ["Code Profiling", "Database Optimization", "Caching Implementation"],
            details: "Optimize application performance and reduce load times",
            status: "In Progress",
            assignedTo: "Robert Kim",
            teamSize: 3,
            startDate: "2024-03-01",
            endDate: "2024-03-31",
            progress: 75,
            hoursWorked: 180,
            estimatedHours: 240
        },

    ];

    // Fetch assignments
    const fetchAssignments = useCallback(async () => {
        try {
            setLoading(true);
            // Try to fetch from API first
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/assignments/monthly`, {
                params: { month: selectedMonth }
            });
            if (res.data && res.data.length > 0) {
                setAssignments(res.data);
            } else {
                // If no data from API, use dummy data
                setAssignments(dummyAssignments);
                console.log("Using dummy assignments data for monthly sheet");
            }
        } catch (error) {
            // If API fails, use dummy data for demonstration
            console.log("API failed, using dummy data");
            setAssignments(dummyAssignments);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, [selectedMonth]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    // Pagination calculations
    const totalItems = assignments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = assignments.slice(startIndex, startIndex + itemsPerPage);

    // Get status badge color and icon
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Completed':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: <FiCheckCircle className="w-4 h-4" />
                };
            case 'In Progress':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    icon: <FiClock className="w-4 h-4" />
                };
            case 'Pending':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: <FiAlertCircle className="w-4 h-4" />
                };
            case 'On Hold':
                return {
                    color: 'bg-orange-100 text-orange-800',
                    icon: <FiPauseCircle className="w-4 h-4" />
                };
            case 'Cancelled':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: <FiXCircle className="w-4 h-4" />
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <FiAlertCircle className="w-4 h-4" />
                };
        }
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

    // Calculate progress bar color
    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-blue-500';
        if (progress >= 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Generate months for dropdown
    const generateMonths = () => {
        const months = [];
        const currentDate = new Date();

        // Generate last 12 months
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const value = date.toISOString().slice(0, 7);
            const label = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });
            months.push({ value, label });
        }

        return months;
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
                    <p className="mt-4 text-gray-600">Loading monthly working sheet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FaCalendarCheck className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">TaskProgress</h1>
                        <p className="text-gray-500 text-sm">
                            Monthly overview of task progress and assigned activities
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Month Selector */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiCalendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="pl-12 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                        >
                            {generateMonths().map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            {/* <div className="mb-6">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-blue-600 font-medium">Total Assignments</div>
                                <div className="text-2xl font-bold text-blue-700">{assignments.length}</div>
                            </div>
                            <FaTasks className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-green-600 font-medium">Completed</div>
                                <div className="text-2xl font-bold text-green-700">
                                    {assignments.filter(assignment => assignment.status === 'Completed').length}
                                </div>
                            </div>
                            <FiCheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-yellow-600 font-medium">In Progress</div>
                                <div className="text-2xl font-bold text-yellow-700">
                                    {assignments.filter(assignment => assignment.status === 'In Progress').length}
                                </div>
                            </div>
                            <FiClock className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>
                   
                </div>
            </div> */}

            {/* Assignments Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[1400px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_1.5fr_1.5fr_2fr_2fr_1.5fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Assignment ID</div>
                            <div>Assignment</div>
                            <div>Tasks</div>
                            <div>Details</div>

                            <div>Status</div>
                        </div>

                        {/* Assignments List */}
                        <div className="flex flex-col">
                            {currentItems.map((assignment, index) => {
                                const statusConfig = getStatusConfig(assignment.status);

                                return (
                                    <div
                                        key={assignment._id}
                                        className={`grid grid-cols-[0.5fr_1.5fr_1.5fr_2fr_2fr_1.5fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                    >
                                        {/* Serial Number */}
                                        <div className="text-sm font-medium text-gray-900">
                                            {startIndex + index + 1}
                                        </div>

                                        {/* Assignment ID */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-newPrimary/20 to-newPrimary/10 rounded-lg flex items-center justify-center">
                                                    <FiFileText className="w-4 h-4 text-newPrimary" />
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900 font-mono">
                                                    {assignment.assignmentId}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
                                            </div>
                                        </div>

                                        {/* Assignment Name */}
                                        <div className="text-sm text-gray-900 font-medium">
                                            <div className="line-clamp-2" title={assignment.assignmentName}>
                                                {assignment.assignmentName}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <FiUsers className="w-3 h-3" />
                                                {assignment.teamSize} members
                                            </div>
                                        </div>

                                        {/* Tasks */}
                                        <div className="text-sm text-gray-600">
                                            <div className="space-y-1">
                                                {assignment.tasks.slice(0, 3).map((task, taskIndex) => (
                                                    <div key={taskIndex} className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                        <span className="line-clamp-1">{task}</span>
                                                    </div>
                                                ))}
                                                {assignment.tasks.length > 3 && (
                                                    <div className="text-xs text-gray-500 pl-3">
                                                        +{assignment.tasks.length - 3} more tasks
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="text-sm text-gray-600">
                                            <div className="line-clamp-3" title={assignment.details}>
                                                {assignment.details}
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <FiClock className="w-3 h-3" />
                                                    {assignment.hoursWorked}/{assignment.estimatedHours} hrs
                                                </div>
                                            </div>
                                        </div>



                                        {/* Status */}
                                        <div className="text-sm">
                                            <div className="flex items-center gap-2">
                                                {statusConfig.icon}
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                    {assignment.status}
                                                </span>
                                            </div>
                                        </div>


                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

               

                {/* <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    compact={true}
                /> */}
            </div>
        </div>
    );
};

export default TaskProgress;