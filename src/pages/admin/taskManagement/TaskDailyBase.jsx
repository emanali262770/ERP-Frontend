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
    FiPlayCircle,
    FiCheckCircle,
    FiPauseCircle,
    FiHash
} from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";
import Select from 'react-select';
import CommanHeader from "../../../components/CommanHeader";

const DailyTaskTracker = () => {
    const [taskList, setTaskList] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("In Progress");
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const sliderRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Available assignments (would come from API in real app)
    const [assignments, setAssignments] = useState([
        {
            id: "ASSIGN001",
            name: "Website Redesign - Phase 1",
            startDate: "2024-03-01",
            endDate: "2024-03-31",
            customer: "Tech Solutions Inc.",
            status: "In Progress"
        },
        {
            id: "ASSIGN002",
            name: "Mobile App Development",
            startDate: "2024-02-15",
            endDate: "2024-03-15",
            customer: "Global Pharmaceuticals",
            status: "Completed"
        },
        {
            id: "ASSIGN003",
            name: "Operations Efficiency Analysis",
            startDate: "2024-03-10",
            endDate: "2024-04-10",
            customer: "Green Energy Corp",
            status: "In Progress"
        },
        {
            id: "ASSIGN004",
            name: "Sales CRM Implementation",
            startDate: "2024-02-01",
            endDate: "2024-02-29",
            customer: "Urban Logistics Ltd",
            status: "Completed"
        },
        {
            id: "ASSIGN005",
            name: "Branding Campaign Launch",
            startDate: "2024-03-05",
            endDate: "2024-04-05",
            customer: "Creative Designs Studio",
            status: "In Progress"
        },
        {
            id: "ASSIGN006",
            name: "Financial Report System",
            startDate: "2024-03-15",
            endDate: "2024-04-30",
            customer: "Financial Trust Bank",
            status: "In Progress"
        }
    ]);

    // Dummy daily tasks data
    const dummyTasks = [
        {
            _id: "1",
            date: "2024-03-20",
            assignmentId: "ASSIGN001",
            assignmentName: "Website Redesign - Phase 1",
            startDate: "2024-03-01",
            endDate: "2024-03-31",
            status: "In Progress",
            notes: "Working on homepage redesign"
        },
        {
            _id: "2",
            date: "2024-03-20",
            assignmentId: "ASSIGN003",
            assignmentName: "Operations Efficiency Analysis",
            startDate: "2024-03-10",
            endDate: "2024-04-10",
            status: "Completed",
            notes: "Completed data collection phase"
        },
        {
            _id: "3",
            date: "2024-03-19",
            assignmentId: "ASSIGN005",
            assignmentName: "Branding Campaign Launch",
            startDate: "2024-03-05",
            endDate: "2024-04-05",
            status: "On Hold",
            notes: "Waiting for client approval"
        },
        {
            _id: "4",
            date: "2024-03-18",
            assignmentId: "ASSIGN006",
            assignmentName: "Financial Report System",
            startDate: "2024-03-15",
            endDate: "2024-04-30",
            status: "In Progress",
            notes: "Database setup completed"
        },
        {
            _id: "5",
            date: "2024-03-17",
            assignmentId: "ASSIGN002",
            assignmentName: "Mobile App Development",
            startDate: "2024-02-15",
            endDate: "2024-03-15",
            status: "Completed",
            notes: "Final testing phase"
        }
    ];

    // Format assignments for react-select
    const assignmentOptions = assignments.map(assignment => ({
        value: assignment.id,
        label: `${assignment.id} - ${assignment.name}`,
        data: assignment
    }));

    // Status options with icons (Removed "Pending")
    const statusOptions = [
        { value: "In Progress", label: "In Progress", icon: "▶️" },
        { value: "Completed", label: "Completed", icon: "✅" },
        { value: "On Hold", label: "On Hold", icon: "⏸️" }
    ];

    // Custom styles for react-select
    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            padding: '2px 0',
            borderColor: state.isFocused ? '#84CF16' : '#D1D5DB',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(132, 207, 22, 0.3)' : 'none',
            '&:hover': {
                borderColor: '#9CA3AF'
            },
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            minHeight: '48px'
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '12px',
            zIndex: 9999
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#84CF16' : state.isFocused ? '#F0F9FF' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:active': {
                backgroundColor: '#84CF16'
            },
            padding: '12px 16px'
        }),
        singleValue: (base) => ({
            ...base,
            color: '#374151',
            fontWeight: '500'
        })
    };

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

    // Fetch daily tasks
    const fetchDailyTasks = useCallback(async () => {
        try {
            setLoading(true);
            // In real app, this would be an API call
            // const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/daily-tasks`);
            // if (res.data && res.data.length > 0) {
            //     setTaskList(res.data);
            // } else {
            setTaskList(dummyTasks);
            console.log("Using dummy daily tasks data");
            // }
        } catch (error) {
            console.log("API failed, using dummy data");
            setTaskList(dummyTasks);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);

    useEffect(() => {
        fetchDailyTasks();
    }, [fetchDailyTasks]);

    // Handle assignment selection - auto-fill dates
    const handleAssignmentSelect = (option) => {
        setSelectedAssignment(option);
        if (option && option.data) {
            setStartDate(option.data.startDate);
            setEndDate(option.data.endDate);
        } else {
            setStartDate("");
            setEndDate("");
        }
    };

    // Add new daily task
    const handleAddDailyTask = () => {
        setIsSliderOpen(true);
        setIsEdit(false);
        setEditId(null);

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);

        // Reset other fields
        setSelectedAssignment(null);
        setStartDate("");
        setEndDate("");
        setStatus("In Progress");
    };

    // Save or Update Daily Task
    const handleSave = async () => {
        if (!selectedDate || !selectedAssignment) {
            toast.error("Date and Assignment are required");
            return;
        }

        try {
            if (isEdit && editId) {
                const updatedTask = {
                    _id: editId,
                    date: selectedDate,
                    assignmentId: selectedAssignment.data.id,
                    assignmentName: selectedAssignment.data.name,
                    startDate: startDate,
                    endDate: endDate,
                    status: status
                };

                setTaskList(taskList.map(task =>
                    task._id === editId ? updatedTask : task
                ));
                toast.success("Daily task updated successfully");
            } else {
                const newTask = {
                    _id: `daily-${Date.now()}`,
                    date: selectedDate,
                    assignmentId: selectedAssignment.data.id,
                    assignmentName: selectedAssignment.data.name,
                    startDate: startDate,
                    endDate: endDate,
                    status: status,
                    notes: ""
                };

                setTaskList([newTask, ...taskList]);
                toast.success("Daily task added successfully");
            }

            reState();
        } catch (error) {
            console.error(error);
            toast.error(`❌ ${isEdit ? "Update" : "Add"} daily task failed`);
        }
    };

    // Reset state
    const reState = () => {
        setIsSliderOpen(false);
        setIsEdit(false);
        setEditId(null);
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setSelectedAssignment(null);
        setStartDate("");
        setEndDate("");
        setStatus("In Progress");
    };

    // Edit Daily Task
    const handleEdit = (task) => {
        setIsEdit(true);
        setEditId(task._id);
        setSelectedDate(task.date);

        // Find and set the assignment
        const assignmentOption = assignmentOptions.find(
            option => option.value === task.assignmentId
        );
        setSelectedAssignment(assignmentOption);

        setStartDate(task.startDate);
        setEndDate(task.endDate);
        setStatus(task.status || "In Progress");
        setIsSliderOpen(true);
    };

    // Delete Daily Task
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
                        setTaskList(taskList.filter((task) => task._id !== id));
                        swalWithTailwindButtons.fire(
                            "Deleted!",
                            "Daily task deleted successfully.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Delete error:", error);
                        swalWithTailwindButtons.fire(
                            "Error!",
                            "Failed to delete daily task.",
                            "error"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Daily task is safe 🙂",
                        "error"
                    );
                }
            });
    };

    // Quick status update
    const handleQuickStatusUpdate = (taskId, newStatus) => {
        setTaskList(taskList.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
        ));
        toast.success(`Status updated to ${newStatus}`);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format date range
    const formatDateRange = (startDate, endDate) => {
        if (!startDate || !endDate) return "N/A";
        const start = new Date(startDate);
        const end = new Date(endDate);
        return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
    };

    // Calculate days remaining
    const calculateDaysRemaining = (endDate) => {
        if (!endDate) return null;
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'On Hold':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <FiCheckCircle className="w-4 h-4" />;
            case 'In Progress':
                return <FiPlayCircle className="w-4 h-4" />;
            case 'On Hold':
                return <FiPauseCircle className="w-4 h-4" />;
            default:
                return <FiPlayCircle className="w-4 h-4" />;
        }
    };

    // Pagination calculations
    const totalItems = taskList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = taskList.slice(startIndex, startIndex + itemsPerPage);

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
                    <p className="mt-4 text-gray-600">Loading daily tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">Daily Task Tracker</h1>
                        <p className="text-gray-500 text-sm">Track and manage daily work assignments</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
                        onClick={handleAddDailyTask}
                    >
                        <FiCheckCircle className="w-4 h-4" />
                        Add Daily Task
                    </button>
                </div>
            </div>

            {/* Daily Tasks Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[1400px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_1fr_2fr_1.2fr_1fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Date</div>
                            <div>Assignment</div>
                            <div>Date Range</div>
                            <div>Status</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Tasks List */}
                        <div className="flex flex-col">
                            {currentItems.map((task, index) => {

                                return (
                                    <div
                                        key={task._id}
                                        className={`grid grid-cols-[0.5fr_1fr_2fr_1.2fr_1fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                    >
                                        {/* Serial Number */}
                                        <div className="text-sm font-medium text-gray-900">
                                            {startIndex + index + 1}
                                        </div>

                                        {/* Date */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                                {formatDate(task.date)}
                                            </div>
                                        </div>

                                        {/* Assignment */}
                                        <div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-newPrimary/20 to-newPrimary/10 rounded-lg flex items-center justify-center">
                                                        <FiHash className="w-4 h-4 text-newPrimary" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {task.assignmentId}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[300px]">
                                                            {task.assignmentName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date Range */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="w-3 h-3 text-gray-400" />
                                                    {formatDateRange(task.startDate, task.endDate)}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {formatDate(task.startDate)} - {formatDate(task.endDate)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(task.status)}`}>
                                                {getStatusIcon(task.status)}
                                                {task.status}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 justify-end">
                                            {/* EDIT ICON */}
                                            <button
                                                onClick={() => handleEdit(task)}
                                                className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-2 rounded-md transition"
                                            >
                                                <FiEdit3 className="w-4 h-4" />
                                            </button>
                                            {/* DELETE ICON */}
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                className="text-red-600 hover:bg-red-100 bg-red-50 p-2 rounded-md transition"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 px-4">
                        <div className="text-sm text-gray-600">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === pageNum
                                                ? 'bg-newPrimary text-white'
                                                : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Slider/Modal for Add/Edit Task */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${isSliderOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-gray-600/70 backdrop-blur-0 transition-opacity duration-300 ${isSliderOpen ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={reState}
                />

                {/* Slider Content */}
                <div
                    ref={sliderRef}
                    className={`relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
                        }`}
                >
                    {/* Header with gradient */}
                    <div className="sticky top-0 z-10 bg-gray-200 px-8 py-4 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <FaCalendarAlt className="w-6 h-6 text-newPrimary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-newPrimary">
                                            {isEdit ? "Update Daily Task" : "Add Daily Task"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {isEdit ? "Update task details" : "Add new daily work assignment"}
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
                    <div className="px-8 py-6 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-hide scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="space-y-8 pb-2">
                            {/* Section 1: Basic Details */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Task Details</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                required
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Assignment Selection */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Assignment <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Select
                                                value={selectedAssignment}
                                                onChange={handleAssignmentSelect}
                                                options={assignmentOptions}
                                                styles={customSelectStyles}
                                                placeholder="Select an assignment..."
                                                className=""
                                                classNamePrefix="select"
                                                isClearable
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Auto-filled Dates (Read-only) */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Assignment Timeline</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Start Date (Read-only) */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Start Date
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiCalendar className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={startDate ? formatDate(startDate) : ""}
                                                readOnly
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* End Date (Read-only) */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            End Date
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiCalendar className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={endDate ? formatDate(endDate) : ""}
                                                readOnly
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Status */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Status</h3>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {statusOptions.map((statusOption) => (
                                        <button
                                            key={statusOption.value}
                                            type="button"
                                            onClick={() => setStatus(statusOption.value)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${status === statusOption.value
                                                    ? 'border-newPrimary bg-gradient-to-br from-green-50 to-green-100 shadow-md'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="text-2xl mb-2">{statusOption.icon}</span>
                                            <span className={`text-sm font-medium ${status === statusOption.value ? 'text-newPrimary' : 'text-gray-700'
                                                }`}>
                                                {statusOption.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
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
                                                Update Daily Task
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Daily Task
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

export default DailyTaskTracker;