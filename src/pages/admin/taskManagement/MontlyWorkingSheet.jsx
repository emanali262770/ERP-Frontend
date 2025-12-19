import React, { useState, useEffect, useCallback } from "react";
import { HashLoader } from "react-spinners";
import axios from "axios";
import { 
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiCalendar,
  FiUser,
  FiUsers,
  FiHash,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { FaTasks, FaCalendarCheck, FaChartLine } from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

const MonthlyWorkingSheet = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [workStatus, setWorkStatus] = useState({});
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
            status: "Completed",
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
            status: "Completed",
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
            status: "Pending",
            assignedTo: "Lisa Thompson",
            teamSize: 2,
            startDate: "2024-03-20",
            endDate: "2024-04-10",
            progress: 10,
            hoursWorked: 20,
            estimatedHours: 120
        },
        
    ];

    // Simplified work status options - only Complete, Pending, and In Progress
    const workStatusOptions = [
        { value: 'completed', label: '✓', color: 'bg-green-500', tooltip: 'Complete' },
        { value: 'in-progress', label: '◐', color: 'bg-blue-500', tooltip: 'In Progress' },
       
    ];

    // Initialize work status for all assignments and days
    const initializeWorkStatus = useCallback(() => {
        const status = {};
        dummyAssignments.forEach(assignment => {
            status[assignment._id] = {};
            Array.from({ length: 31 }, (_, i) => i + 1).forEach(day => {
                // Randomly assign a work status for demo (only from our 3 options)
                const randomStatus = workStatusOptions[Math.floor(Math.random() * workStatusOptions.length)];
                status[assignment._id][day] = randomStatus.value;
            });
        });
        setWorkStatus(status);
    }, []);

    // Fetch assignments
    const fetchAssignments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/assignments/monthly`, {
                params: { month: selectedMonth, year: selectedYear }
            });
            if (res.data && res.data.length > 0) {
                setAssignments(res.data);
            } else {
                setAssignments(dummyAssignments);
                console.log("Using dummy assignments data for monthly sheet");
            }
        } catch (error) {
            console.log("API failed, using dummy data");
            setAssignments(dummyAssignments);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        fetchAssignments();
        initializeWorkStatus();
    }, [fetchAssignments, initializeWorkStatus]);

    // Pagination calculations
    const totalItems = assignments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = assignments.slice(startIndex, startIndex + itemsPerPage);

    // Handle day cell click
    const handleDayCellClick = (assignmentId, day) => {
        const currentStatus = workStatus[assignmentId]?.[day];
        const currentIndex = workStatusOptions.findIndex(opt => opt.value === currentStatus);
        const nextIndex = (currentIndex + 1) % workStatusOptions.length;
        const nextStatus = workStatusOptions[nextIndex].value;
        
        setWorkStatus(prev => ({
            ...prev,
            [assignmentId]: {
                ...prev[assignmentId],
                [day]: nextStatus
            }
        }));
    };

    // Get work status display for a cell
    const getWorkStatusDisplay = (assignmentId, day) => {
        const statusValue = workStatus[assignmentId]?.[day] || 'pending';
        const statusConfig = workStatusOptions.find(opt => opt.value === statusValue);
        return statusConfig || workStatusOptions[2]; // Default to 'pending'
    };

    // Generate months for dropdown
    const generateMonths = () => {
        const months = [];
        const currentDate = new Date();
        
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

    // Generate years for dropdown
    const generateYears = () => {
        const years = [];
        const currentYear = new Date().getFullYear();
        
        for (let i = -5; i <= 2; i++) {
            const year = currentYear + i;
            years.push(year);
        }
        
        return years;
    };

    // Calculate summary for the month
    const calculateMonthlySummary = () => {
        let totalWorkDays = 0;
        let completedDays = 0;
        let inProgressDays = 0;
        let pendingDays = 0;

        assignments.forEach(assignment => {
            Array.from({ length: 31 }, (_, i) => i + 1).forEach(day => {
                const status = workStatus[assignment._id]?.[day];
                if (status) {
                    totalWorkDays++;
                    if (status === 'completed') completedDays++;
                    if (status === 'in-progress') inProgressDays++;
                 
                }
            });
        });

        return { totalWorkDays, completedDays, inProgressDays, pendingDays };
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

    const monthlySummary = calculateMonthlySummary();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <CommanHeader/>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FaCalendarCheck className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">Monthly Working Sheet</h1>
                        <p className="text-gray-500 text-sm">Track daily work status for assignments</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Year Selector */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiCalendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="pl-12 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                        >
                            {generateYears().map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

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
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="mb-6">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-green-600 font-medium">Complete Days</div>
                                <div className="text-2xl font-bold text-green-700">{monthlySummary.completedDays}</div>
                            </div>
                            <FiCheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-blue-600 font-medium">In Progress Days</div>
                                <div className="text-2xl font-bold text-blue-700">{monthlySummary.inProgressDays}</div>
                            </div>
                            <FiClock className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                  
                </div>
            </div>

            {/* Work Status Legend */}
            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Work Status Legend</h3>
                    <div className="flex flex-wrap gap-4">
                        {workStatusOptions.map((status) => (
                            <div key={status.value} className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${status.color}`}>
                                    {status.label}
                                </div>
                                <span className="text-sm text-gray-600">{status.tooltip}</span>
                            </div>
                        ))}
                        <div className="text-sm text-gray-500 ml-4">
                            <span className="font-medium">Click</span> on any day cell to change status
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Working Sheet Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-x-auto bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase tracking-wider">
                                {/* Fixed Headers */}
                                <th className="border border-gray-300 px-4 py-3 w-12 text-center font-semibold text-xs">
                                    SR.
                                </th>
                                <th className="border border-gray-300 px-4 py-3 w-40 text-left font-semibold text-xs">
                                    ASSIGNMENT #
                                </th>
                                <th className="border border-gray-300 px-4 py-3 w-56 text-left font-semibold text-xs">
                                    TASKS
                                </th>

                                {/* Days Header 1–31 */}
                                {Array.from({ length: 31 }, (_, i) => (
                                    <th
                                        key={i}
                                        className="border border-gray-300 px-2 py-3 w-8 text-center font-semibold text-xs"
                                    >
                                        {i + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {currentItems.map((assignment, index) => (
                                <tr key={assignment._id} className="hover:bg-gray-50 transition-colors duration-150">
                                    {/* SR */}
                                    <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                                        {startIndex + index + 1}
                                    </td>

                                    {/* Assignment # */}
                                    <td className="border border-gray-300 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-newPrimary/20 to-newPrimary/10 rounded-lg flex items-center justify-center">
                                                <FiHash className="w-4 h-4 text-newPrimary" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm">
                                                    {assignment.assignmentId}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate" title={assignment.assignmentName}>
                                                    {assignment.assignmentName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Tasks */}
                                    <td className="border border-gray-300 px-4 py-3">
                                        <div className="space-y-1">
                                            {assignment.tasks.slice(0, 3).map((task, taskIndex) => (
                                                <div key={taskIndex} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"></div>
                                                    <span className="text-gray-600 text-sm line-clamp-1">{task}</span>
                                                </div>
                                            ))}
                                            {assignment.tasks.length > 3 && (
                                                <div className="text-xs text-gray-500 pl-3">
                                                    +{assignment.tasks.length - 3} more tasks
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                            <FiUser className="w-3 h-3" />
                                            <span>{assignment.assignedTo}</span>
                                            <FiUsers className="w-3 h-3 ml-2" />
                                            <span>{assignment.teamSize} members</span>
                                        </div>
                                    </td>

                                    {/* Daily Cells with Work Status */}
                                    {Array.from({ length: 31 }).map((_, dayIndex) => {
                                        const day = dayIndex + 1;
                                        const statusConfig = getWorkStatusDisplay(assignment._id, day);
                                        
                                        return (
                                            <td
                                                key={dayIndex}
                                                className="border border-gray-300 h-8 w-8 text-center group relative"
                                                onClick={() => handleDayCellClick(assignment._id, day)}
                                            >
                                                <div 
                                                    className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-110 ${statusConfig.color}`}
                                                    title={`Day ${day}: ${statusConfig.tooltip}`}
                                                >
                                                    {statusConfig.label}
                                                </div>
                                                {/* Tooltip on hover */}
                                                <div className="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                    Day {day}: {statusConfig.tooltip}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

              

             
            </div>

           
        </div>
    );
};

export default MonthlyWorkingSheet;