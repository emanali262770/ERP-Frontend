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
  FiUser,
  FiUsers,
  FiBriefcase,
  FiCheckSquare,
  FiHash,
  FiFileText
} from "react-icons/fi";
import { FaTasks, FaCalendarAlt, FaUserFriends, FaBuilding } from "react-icons/fa";
import { IoPerson, IoPeople } from "react-icons/io5";
import Select from 'react-select';
import CommanHeader from "../../../components/CommanHeader";
// import Pagination from "../../pages/admin/pagination/Pagination";

const AssignTaskToStaff = () => {
    const [assignmentList, setAssignmentList] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [assignmentId, setAssignmentId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [department, setDepartment] = useState("");
    const [employee, setEmployee] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [taskDetails, setTaskDetails] = useState("");
    const [status, setStatus] = useState("Pending");
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const sliderRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dummy data for dropdowns
    const customers = [
        { value: "cust1", label: "Tech Solutions Inc." },
        { value: "cust2", label: "Global Pharmaceuticals" },
        { value: "cust3", label: "Green Energy Corp" },
        { value: "cust4", label: "Urban Logistics Ltd" },
        { value: "cust5", label: "Creative Designs Studio" },
        { value: "cust6", label: "Financial Trust Bank" }
    ];

    const departments = [
        { value: "eng", label: "Engineering" },
        { value: "mkt", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "hr", label: "Human Resources" },
        { value: "finance", label: "Finance" },
        { value: "ops", label: "Operations" }
    ];

    const employees = [
        { value: "emp1", label: "John Smith" },
        { value: "emp2", label: "Sarah Johnson" },
        { value: "emp3", label: "Michael Chen" },
        { value: "emp4", label: "Emily Rodriguez" },
        { value: "emp5", label: "David Wilson" },
        { value: "emp6", label: "Lisa Thompson" }
    ];

    const teamMembersOptions = [
        { value: "tm1", label: "Robert Kim" },
        { value: "tm2", label: "Jessica Lee" },
        { value: "tm3", label: "Thomas Brown" },
        { value: "tm4", label: "Amanda Clark" },
        { value: "tm5", label: "James Wilson" },
        { value: "tm6", label: "Maria Garcia" },
        { value: "tm7", label: "David Miller" },
        { value: "tm8", label: "Sarah Davis" }
    ];

    // Dummy data for demonstration
    const dummyAssignments = [
        {
            _id: "1",
            assignmentId: "ASSIGN001",
            startDate: "2024-03-01",
            endDate: "2024-03-31",
            customer: "Tech Solutions Inc.",
            department: "Engineering",
            employee: "John Smith",
            teamMembers: ["Robert Kim", "Jessica Lee", "Thomas Brown"],
            taskDetails: "Website Redesign Project - Phase 1",
            status: "In Progress"
        },
        {
            _id: "2",
            assignmentId: "ASSIGN002",
            startDate: "2024-02-15",
            endDate: "2024-03-15",
            customer: "Global Pharmaceuticals",
            department: "Research & Development",
            employee: "Michael Chen",
            teamMembers: ["Amanda Clark", "James Wilson"],
            taskDetails: "Mobile App Development for Research Data",
            status: "Completed"
        },
        {
            _id: "3",
            assignmentId: "ASSIGN003",
            startDate: "2024-03-10",
            endDate: "2024-04-10",
            customer: "Green Energy Corp",
            department: "Operations",
            employee: "Emily Rodriguez",
            teamMembers: ["Maria Garcia", "David Miller"],
            taskDetails: "Operations Efficiency Analysis",
            status: "In Progress"
        },
        {
            _id: "4",
            assignmentId: "ASSIGN004",
            startDate: "2024-02-01",
            endDate: "2024-02-29",
            customer: "Urban Logistics Ltd",
            department: "Sales",
            employee: "David Wilson",
            teamMembers: ["Sarah Davis", "Robert Kim"],
            taskDetails: "Sales CRM Implementation",
            status: "Completed"
        },
        {
            _id: "5",
            assignmentId: "ASSIGN005",
            startDate: "2024-03-05",
            endDate: "2024-04-05",
            customer: "Creative Designs Studio",
            department: "Marketing",
            employee: "Lisa Thompson",
            teamMembers: ["Jessica Lee", "Thomas Brown", "Amanda Clark"],
            taskDetails: "Branding Campaign Launch",
            status: "Pending"
        },
       
    ];

    // Status options
    const statusOptions = ["Pending", "In Progress", "Completed", "On Hold", "Cancelled"];

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
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#E5E7EB',
            borderRadius: '6px',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#374151',
            fontWeight: '500'
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#6B7280',
            '&:hover': {
                backgroundColor: '#DC2626',
                color: 'white'
            }
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

    // Fetch assignments
    const fetchAssignments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/assignments`);
            if (res.data && res.data.length > 0) {
                setAssignmentList(res.data);
            } else {
                setAssignmentList(dummyAssignments);
                console.log("Using dummy assignments data");
            }
        } catch (error) {
            console.log("API failed, using dummy data");
            setAssignmentList(dummyAssignments);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    // Pagination calculations
    const totalItems = assignmentList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = assignmentList.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleAddAssignment = () => {
        setIsSliderOpen(true);
        setIsEdit(false);
        setEditId(null);
        
        // Generate next assignment ID
        const nextId = generateNextAssignmentId();
        setAssignmentId(nextId);
        
        setStartDate("");
        setEndDate("");
        setSelectedCustomer(null);
        setDepartment("");
        setEmployee("");
        setTeamMembers([]);
        setTaskDetails("");
        setStatus("Pending");
    };

    // Generate next assignment ID in format ASSIGN001
    const generateNextAssignmentId = () => {
        if (assignmentList.length === 0) {
            return "ASSIGN001";
        }

        const codes = assignmentList
            .map(assignment => {
                const code = assignment.assignmentId || "";
                const numbers = code.replace(/\D/g, '');
                return numbers ? parseInt(numbers, 10) : 0;
            })
            .filter(num => !isNaN(num) && num > 0);

        const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
        const nextNumber = maxCode + 1;
        const formattedNumber = nextNumber.toString().padStart(3, '0');
        return `ASSIGN${formattedNumber}`;
    };

    // Save or Update Assignment
    const handleSave = async () => {
        if (!selectedCustomer || !startDate || !endDate) {
            toast.error("Customer, Start Date, and End Date are required");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("Start Date cannot be later than End Date");
            return;
        }

        try {
            const customerName = selectedCustomer ? selectedCustomer.label : "Unknown Customer";
            const teamMemberNames = teamMembers.map(member => member.label);

            if (isEdit && editId) {
                const updatedAssignment = {
                    _id: editId,
                    assignmentId: assignmentId || generateNextAssignmentId(),
                    startDate,
                    endDate,
                    customer: customerName,
                    department: department ? department.label : "",
                    employee: employee ? employee.label : "",
                    teamMembers: teamMemberNames,
                    taskDetails,
                    status
                };

                setAssignmentList(assignmentList.map(assignment =>
                    assignment._id === editId ? updatedAssignment : assignment
                ));
                toast.success("Assignment updated successfully");
            } else {
                const newAssignment = {
                    _id: `assign-${Date.now()}`,
                    assignmentId: assignmentId || generateNextAssignmentId(),
                    startDate,
                    endDate,
                    customer: customerName,
                    department: department ? department.label : "",
                    employee: employee ? employee.label : "",
                    teamMembers: teamMemberNames,
                    taskDetails,
                    status
                };

                setAssignmentList([newAssignment, ...assignmentList]);
                toast.success("Assignment added successfully");
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
        setAssignmentId("");
        setStartDate("");
        setEndDate("");
        setSelectedCustomer(null);
        setDepartment("");
        setEmployee("");
        setTeamMembers([]);
        setTaskDetails("");
        setStatus("Pending");
    };

    // Edit Assignment
    const handleEdit = (assignment) => {
        setIsEdit(true);
        setEditId(assignment._id);
        setAssignmentId(assignment.assignmentId);
        setStartDate(assignment.startDate);
        setEndDate(assignment.endDate);
        setSelectedCustomer(customers.find(c => c.label === assignment.customer));
        setDepartment(departments.find(d => d.label === assignment.department));
        setEmployee(employees.find(e => e.label === assignment.employee));
        setTeamMembers(assignment.teamMembers.map(member => 
            teamMembersOptions.find(tm => tm.label === member)
        ).filter(Boolean));
        setTaskDetails(assignment.taskDetails || "");
        setStatus(assignment.status || "Pending");
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
                        setAssignmentList(assignmentList.filter((assignment) => assignment._id !== id));
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
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'On Hold':
                return 'bg-orange-100 text-orange-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
                    <p className="mt-4 text-gray-600">Loading assignments...</p>
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
                        <h1 className="text-2xl font-bold text-newPrimary">Assign Task To Staff</h1>
                        <p className="text-gray-500 text-sm">Assign tasks to staff members and teams</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
                        onClick={handleAddAssignment}
                    >
                        <FiCheckSquare className="w-4 h-4" />
                        Assign Task
                    </button>
                </div>
            </div>

            {/* Assignments Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[1600px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_1.5fr_2fr_1.5fr_1.5fr_1.5fr_2fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Assignment ID</div>
                            <div>Customer</div>
                            <div>Start Date</div>
                            <div>End Date</div>
                            <div>Department</div>
                            <div>Employee</div>
                            
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Assignments List */}
                        <div className="flex flex-col">
                            {currentItems.map((assignment, index) => {
                                const daysRemaining = calculateDaysRemaining(assignment.endDate);
                                const isOverdue = daysRemaining !== null && daysRemaining < 0;
                                
                                return (
                                    <div
                                        key={assignment._id}
                                        className={`grid grid-cols-[0.5fr_1.5fr_2fr_1.5fr_1.5fr_1.5fr_2fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
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
                                                    <FiHash className="w-4 h-4 text-newPrimary" />
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900 font-mono">
                                                    {assignment.assignmentId}
                                                </div>
                                            </div>
                                          
                                        </div>

                                        {/* Customer */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                              
                                                <div className="line-clamp-2" title={assignment.customer}>
                                                    {assignment.customer}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Start Date */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                                {formatDate(assignment.startDate)}
                                            </div>
                                        </div>

                                        {/* End Date */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="w-3 h-3 text-gray-400" />
                                                    {formatDate(assignment.endDate)}
                                                </div>
                                               
                                            </div>
                                        </div>

                                        {/* Department */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                               
                                                {assignment.department || "N/A"}
                                            </div>
                                        </div>

                                        {/* Employee */}
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FiUser className="w-3 h-3 text-gray-400" />
                                                {assignment.employee || "N/A"}
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
                    className={`relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
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
                                            {isEdit ? "Update Assignment" : "Assign Task to Staff"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {isEdit ? "Update assignment details" : "Assign task to staff members"}
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
                            {/* Section 1: Assignment Header */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Assignment Details</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Assignment ID */}
                                    <div className="space-y-2">
                                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Assignment ID <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiHash className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={assignmentId}
                                                disabled
                                                className="w-full bg-gray-50 pl-12 pr-4 py-[11px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="ASSIGN001"
                                            />
                                        </div>
                                    </div>

                                     <div className="space-y-2 ">
                                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                                           Task Assigned <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                           
                                            <Select
                                                value={selectedCustomer}
                                                onChange={setSelectedCustomer}
                                                options={customers}
                                                styles={customSelectStyles}
                                                placeholder="Select a customer..."
                                                className=""
                                                classNamePrefix="select"
                                                isClearable
                                            />
                                        </div>
                                    </div>
                                </div>

                               
                            </div>

                            {/* Section 2: Timeline & Customer */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Timeline & Customer</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Start Date */}
                                    <div className="space-y-2">
                                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
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
                                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
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

                                  
                                </div>
                            </div>

                            {/* Section 3: Staff Assignment */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Staff Assignment</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Department */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Department
                                        </label>
                                        <div className="relative">
                                            
                                            <Select
                                                value={department}
                                                onChange={setDepartment}
                                                options={departments}
                                                styles={customSelectStyles}
                                                placeholder="Select department..."
                                                className=""
                                                classNamePrefix="select"
                                                isClearable
                                            />
                                        </div>
                                    </div>

                                    {/* Employee */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Employee
                                        </label>
                                        <div className="relative">
                                          
                                            <Select
                                                value={employee}
                                                onChange={setEmployee}
                                                options={employees}
                                                styles={customSelectStyles}
                                                placeholder="Select employee..."
                                                className=""
                                                classNamePrefix="select"
                                                isClearable
                                            />
                                        </div>
                                    </div>

                                    {/* Multiple Team members
                                    <div className="space-y-2 col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Multiple Team Members
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none z-10">
                                                <IoPeople className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <Select
                                                value={teamMembers}
                                                onChange={setTeamMembers}
                                                options={teamMembersOptions}
                                                styles={customSelectStyles}
                                                placeholder="Select team members..."
                                                className="pl-10"
                                                classNamePrefix="select"
                                                isMulti
                                                isClearable
                                            />
                                        </div>
                                    </div> */}
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
                                                Update Assignment
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Assign Task
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

export default AssignTaskToStaff;