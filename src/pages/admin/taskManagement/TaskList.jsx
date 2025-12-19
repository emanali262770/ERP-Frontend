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
  FiHash
} from "react-icons/fi";
import { FaTasks, FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";
// import Pagination from "../../pages/admin/pagination/Pagination";

const TaskList = () => {
    const [taskList, setTaskList] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [taskId, setTaskId] = useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDetail, setTaskDetail] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [resourcesRequired, setResourcesRequired] = useState("");
    const [taskStatus, setTaskStatus] = useState("Pending");
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const sliderRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dummy data for demonstration
    const dummyTasks = [
        {
            _id: "1",
            taskCode: "TASK001",
            taskTitle: "Website Redesign",
            taskDetail: "Complete redesign of company website with modern UI/UX",
            startDate: "2024-01-15",
            endDate: "2024-02-28",
            resourcesRequired: 5,
            status: "In Progress"
        },
        {
            _id: "2",
            taskCode: "TASK002",
            taskTitle: "Mobile App Development",
            taskDetail: "Develop cross-platform mobile application for iOS and Android",
            startDate: "2024-02-01",
            endDate: "2024-04-30",
            resourcesRequired: 8,
            status: "Pending"
        },
        {
            _id: "3",
            taskCode: "TASK003",
            taskTitle: "Database Migration",
            taskDetail: "Migrate from MySQL to PostgreSQL database system",
            startDate: "2024-01-10",
            endDate: "2024-01-31",
            resourcesRequired: 3,
            status: "Completed"
        },
       
    ];

    // Status options
    const statusOptions = ["Pending", "In Progress", "Completed", "On Hold", "Cancelled"];

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

    // Fetch tasks
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            // Try to fetch from API first
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks`);
            if (res.data && res.data.length > 0) {
                setTaskList(res.data);
            } else {
                // If no data from API, use dummy data
                setTaskList(dummyTasks);
                console.log("Using dummy tasks data");
            }
        } catch (error) {
            // If API fails, use dummy data for demonstration
            console.log("API failed, using dummy data");
            setTaskList(dummyTasks);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Pagination calculations
    const totalItems = taskList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = taskList.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleAddTask = () => {
        setIsSliderOpen(true);
        setIsEdit(false);
        setEditId(null);
        
        // Generate next task code
        const nextCode = generateNextTaskCode();
        setTaskId(nextCode);
        
        setTaskTitle("");
        setTaskDetail("");
        setStartDate("");
        setEndDate("");
        setResourcesRequired("");
        setTaskStatus("Pending");
    };

    // Generate next task code in format TASK001
    const generateNextTaskCode = () => {
        if (taskList.length === 0) {
            return "TASK001";
        }

        // Extract all numeric parts from existing codes
        const codes = taskList
            .map(task => {
                const code = task.taskCode || "";
                // Remove all non-digit characters
                const numbers = code.replace(/\D/g, '');
                return numbers ? parseInt(numbers, 10) : 0;
            })
            .filter(num => !isNaN(num) && num > 0);

        // Find the highest number
        const maxCode = codes.length > 0 ? Math.max(...codes) : 0;

        // Generate next code with leading zeros
        const nextNumber = maxCode + 1;
        const formattedNumber = nextNumber.toString().padStart(3, '0');
        return `TASK${formattedNumber}`;
    };

    // Save or Update Task
    const handleSave = async () => {
        if (!taskTitle || !taskDetail || !startDate || !endDate) {
            toast.error("Task Title, Detail, Start Date, and End Date are required");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("Start Date cannot be later than End Date");
            return;
        }

        try {
            if (isEdit && editId) {
                // For dummy data, update locally
                const updatedTask = {
                    _id: editId,
                    taskCode: taskId || generateNextTaskCode(),
                    taskTitle,
                    taskDetail,
                    startDate,
                    endDate,
                    resourcesRequired: parseInt(resourcesRequired) || 0,
                    status: taskStatus
                };

                setTaskList(taskList.map(task =>
                    task._id === editId ? updatedTask : task
                ));
                toast.success("Task updated successfully");
            } else {
                // For dummy data, add new task locally
                const newTask = {
                    _id: `task-${Date.now()}`,
                    taskCode: taskId || generateNextTaskCode(),
                    taskTitle,
                    taskDetail,
                    startDate,
                    endDate,
                    resourcesRequired: parseInt(resourcesRequired) || 0,
                    status: taskStatus
                };

                setTaskList([newTask, ...taskList]);
                toast.success("Task added successfully");
            }

            reState();
        } catch (error) {
            console.error(error);
            toast.error(`❌ ${isEdit ? "Update" : "Add"} Task failed`);
        }
    };

    // Reset state
    const reState = () => {
        setIsSliderOpen(false);
        setIsEdit(false);
        setEditId(null);
        setTaskId("");
        setTaskTitle("");
        setTaskDetail("");
        setStartDate("");
        setEndDate("");
        setResourcesRequired("");
        setTaskStatus("Pending");
    };

    // Edit Task
    const handleEdit = (task) => {
        setIsEdit(true);
        setEditId(task._id);
        setTaskId(task.taskCode);
        setTaskTitle(task.taskTitle);
        setTaskDetail(task.taskDetail);
        setStartDate(task.startDate);
        setEndDate(task.endDate);
        setResourcesRequired(task.resourcesRequired.toString());
        setTaskStatus(task.status || "Pending");
        setIsSliderOpen(true);
    };

    // Delete Task
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
                        // For dummy data, delete locally
                        setTaskList(taskList.filter((task) => task._id !== id));
                        swalWithTailwindButtons.fire(
                            "Deleted!",
                            "Task deleted successfully.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Delete error:", error);
                        swalWithTailwindButtons.fire(
                            "Error!",
                            "Failed to delete task.",
                            "error"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Task is safe 🙂",
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

    // Calculate days remaining
    const calculateDaysRemaining = (endDate) => {
        if (!endDate) return null;
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
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
                    <p className="mt-4 text-gray-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <CommanHeader/>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FaTasks className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">Tasks</h1>
                        <p className="text-gray-500 text-sm">Manage your tasks and their details</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
                        onClick={handleAddTask}
                    >
                        <FiFileText className="w-4 h-4" />
                        Add Task
                    </button>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[1400px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_2fr_3fr_1.5fr_1.5fr_1.5fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Task</div>
                            <div>Detail</div>
                            <div>Start Date</div>
                            <div>End Date</div>
                            <div>Resources Required</div>
                            
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Tasks List */}
                        <div className="flex flex-col">
                            {currentItems.map((task, index) => {
                                const daysRemaining = calculateDaysRemaining(task.endDate);
                                const isOverdue = daysRemaining !== null && daysRemaining < 0;
                                
                                return (
                                    <div
                                        key={task._id}
                                        className={`grid grid-cols-[0.5fr_2fr_3fr_1.5fr_1.5fr_1.5fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                    >
                                        {/* Serial Number */}
                                        <div className="text-sm font-medium text-gray-900">
                                            {startIndex + index + 1}
                                        </div>

                                        {/* Task Title */}
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-newPrimary/20 to-newPrimary/10 rounded-lg flex items-center justify-center">
                                                    <FiFileText className="w-4 h-4 text-newPrimary" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {task.taskTitle}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-mono">
                                                        {task.taskCode}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Task Detail */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-start gap-2">
                                                <FiFileText className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                                                <div className="line-clamp-2" title={task.taskDetail}>
                                                    {task.taskDetail}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Start Date */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                                {formatDate(task.startDate)}
                                            </div>
                                        </div>

                                        {/* End Date */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="w-3 h-3 text-gray-400" />
                                                    {formatDate(task.endDate)}
                                                </div>
                                                
                                            </div>
                                        </div>

                                        {/* Resources Required */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaUserFriends className="w-3 h-3 text-gray-400" />
                                                <span className="font-medium">{task.resourcesRequired}</span>
                                                <span className="text-gray-500 text-xs">resources</span>
                                            </div>
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

               

                {/* <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    compact={true}
                /> */}
            </div>

            {/* Slider/Modal */}
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
                    className={`relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
                        }`}
                >
                    {/* Header with gradient */}
                    <div className="sticky top-0 z-10 bg-gray-200 px-8 py-4 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <FaTasks className="w-6 h-6 text-newPrimary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-newPrimary">
                                            {isEdit ? "Update Task" : "Add New Task"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {isEdit ? "Update task details" : "Fill in the task information below"}
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
                            {/* Section 1: Basic Information */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Task Code */}
                                    <div className="space-y-2">
                                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Task Code <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiHash className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={taskId}
                                                disabled
                                                className="w-full bg-gray-50 pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="TASK001"
                                            />
                                        </div>
                                    </div>

                                    {/* Task Title */}
                                    <div className="space-y-2">
                                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Task Title <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiFileText className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={taskTitle}
                                                required
                                                onChange={(e) => setTaskTitle(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="Enter task title"
                                            />
                                        </div>
                                    </div>

                                  
                                </div>

                                {/* Task Detail */}
                                <div className="space-y-2">
                                    <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                                        Task Detail <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <FiFileText className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            value={taskDetail}
                                            required
                                            onChange={(e) => setTaskDetail(e.target.value)}
                                            rows="4"
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 resize-none"
                                            placeholder="Enter task details and description..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Timeline & Resources */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Timeline & Resources</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Start Date */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Start Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                value={startDate}
                                                required
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* End Date */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                            End Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiCalendar className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                value={endDate}
                                                required
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Resources Required */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            No. of Resources Required
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaUserFriends className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                min="0"
                                                value={resourcesRequired}
                                                onChange={(e) => setResourcesRequired(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="Enter number of resources"
                                            />
                                        </div>
                                    </div>
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
                                                Update Task
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Save Task
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

export default TaskList;