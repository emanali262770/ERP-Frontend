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
    FiMessageSquare
} from "react-icons/fi";
import { FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import CommanHeader from "../../../components/CommanHeader";

const ComplaintFrom = () => {
    const [complaints, setComplaints] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [complaintDate, setComplaintDate] = useState("");
    const [complaintId, setComplaintId] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productComplaints, setProductComplaints] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const sliderRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dummy data
    const dummyCustomers = [
        { id: 1, name: "John Doe", company: "ABC Corp" },
        { id: 2, name: "Jane Smith", company: "XYZ Ltd" },
        { id: 3, name: "Robert Johnson", company: "Tech Solutions" },
        { id: 4, name: "Emily Davis", company: "Innovate Inc" },
        { id: 5, name: "Michael Brown", company: "Global Enterprises" }
    ];

    const dummyProducts = {
        1: [
            { id: 1, name: "Laptop Pro", serial: "LP001" },
            { id: 2, name: "Monitor 27inch", serial: "MN001" },
            { id: 3, name: "Keyboard Wireless", serial: "KB001" }
        ],
        2: [
            { id: 4, name: "Smartphone X", serial: "SP001" },
            { id: 5, name: "Tablet Pro", serial: "TB001" },
            { id: 6, name: "Smart Watch", serial: "SW001" }
        ],
        3: [
            { id: 7, name: "Server Rack", serial: "SR001" },
            { id: 8, name: "Network Switch", serial: "NS001" },
            { id: 9, name: "Router Advanced", serial: "RT001" }
        ],
        4: [
            { id: 10, name: "Software License", serial: "SL001" },
            { id: 11, name: "Antivirus Pro", serial: "AV001" }
        ],
        5: [
            { id: 12, name: "Printer Laser", serial: "PR001" },
            { id: 13, name: "Scanner HD", serial: "SC001" }
        ]
    };

    const dummyComplaints = [
        {
            _id: "1",
            complaintId: "COMP001",
            customer: "John Doe",
            products: ["Laptop Pro", "Monitor 27inch"],
            complaint: "Screen flickering issue with both devices",
            date: "2024-01-15"
        },
        {
            _id: "2",
            complaintId: "COMP002",
            customer: "Jane Smith",
            products: ["Smartphone X"],
            complaint: "Battery draining too fast",
            date: "2024-01-16"
        },
        {
            _id: "3",
            complaintId: "COMP003",
            customer: "Robert Johnson",
            products: ["Server Rack", "Network Switch"],
            complaint: "Network connectivity issues",
            date: "2024-01-17"
        }
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
        setComplaintDate(today);
        generateComplaintId();
        fetchComplaints();
    }, []);

    // Generate complaint ID
    const generateComplaintId = () => {
        const randomNum = Math.floor(100 + Math.random() * 900);
        setComplaintId(`COMP${randomNum}`);
    };

    // Fetch complaints
    const fetchComplaints = useCallback(async () => {
        try {
            setLoading(true);
            // Try to fetch from API first
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/complaints`);
            if (res.data && res.data.length > 0) {
                setComplaints(res.data);
            } else {
                // If no data from API, use dummy data
                setComplaints(dummyComplaints);
                console.log("Using dummy complaints data");
            }
        } catch (error) {
            // If API fails, use dummy data for demonstration
            console.log("API failed, using dummy data");
            setComplaints(dummyComplaints);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);

    // Pagination calculations
    const totalItems = complaints.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = complaints.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleAddComplaint = () => {
        setIsSliderOpen(true);
        setIsEdit(false);
        setEditId(null);

        // Reset form
        const today = new Date().toISOString().split('T')[0];
        setComplaintDate(today);
        generateComplaintId();
        setSelectedCustomer("");
        setSelectedProducts([]);
        setComplaintText("");
    };

    // Handle product selection
    // Handle product selection
    const handleProductSelect = (productId) => {
        // Toggle selection - if already selected, deselect it, otherwise select only this one
        if (selectedProducts.includes(productId)) {
            // If clicking an already selected checkbox, deselect it
            setSelectedProducts([]);
        } else {
            // If selecting a new checkbox, select only this one (clear others)
            setSelectedProducts([productId]);
        }
    };


    // Get selected products names
    const getSelectedProductNames = () => {
        if (!selectedCustomer || !dummyProducts[selectedCustomer]) return [];
        return dummyProducts[selectedCustomer]
            .filter(product => selectedProducts.includes(product.id))
            .map(product => product.name);
    };

    // Save or Update Complaint
  
    const handleSave = async () => {
        if (!selectedCustomer || selectedProducts.length === 0) {
            toast.error("Please select customer and at least one product");
            return;
        }

        // Check if all SELECTED products have complaint text
        const missingComplaints = selectedProducts.filter(
            productId => !productComplaints[productId]?.trim()  // Fixed: should be productId not product.id
        );

        if (missingComplaints.length > 0) {
            toast.error("Please enter complaint text for all selected products");
            return;
        }

        try {
            const selectedCustomerData = dummyCustomers.find(c => c.id === parseInt(selectedCustomer));
            const productNames = getSelectedProductNames();

            // Combine all product complaints into one text
            const combinedComplaint = selectedProducts
                .map(productId => {
                    const product = dummyProducts[selectedCustomer].find(p => p.id === productId);
                    return `${product.name}: ${productComplaints[productId]}`;
                })
                .join('\n');

            if (isEdit && editId) {
                // Update complaint
                const updatedComplaint = {
                    _id: editId,
                    complaintId: complaintId,
                    customer: selectedCustomerData.name,
                    products: productNames,
                    complaint: combinedComplaint,
                    date: complaintDate
                };

                setComplaints(complaints.map(complaint =>
                    complaint._id === editId ? updatedComplaint : complaint
                ));
                toast.success("Complaint updated successfully");
            } else {
                // Add new complaint
                const newComplaint = {
                    _id: `complaint-${Date.now()}`,
                    complaintId: complaintId,
                    customer: selectedCustomerData.name,
                    products: productNames,
                    complaint: combinedComplaint,
                    date: complaintDate
                };

                setComplaints([newComplaint, ...complaints]);
                toast.success("Complaint added successfully");
            }

            // Clear all selected products after saving
            setSelectedProducts([]); // Add this line

            reState();
        } catch (error) {
            console.error(error);
            toast.error(`❌ ${isEdit ? "Update" : "Add"} Complaint failed`);
        }
    };
    // Reset state
    // In the reState function, add:
    const reState = () => {
        setIsSliderOpen(false);
        setIsEdit(false);
        setEditId(null);
        setSelectedCustomer("");
        setSelectedProducts([]);

        setProductComplaints({}); // Add this line
    };
    // Edit Complaint
    // In handleEdit function (around line 230-250), you'll need to parse the combined complaint back:
    const handleEdit = (complaint) => {
        setIsEdit(true);
        setEditId(complaint._id);
        setComplaintId(complaint.complaintId);
        setComplaintDate(complaint.date);

        // Find customer by name
        const customer = dummyCustomers.find(c => c.name === complaint.customer);
        setSelectedCustomer(customer ? customer.id.toString() : "");

        // Parse the combined complaint text back to product complaints
        // This assumes format: "Product Name: complaint text"
        const complaintsObj = {};
        if (customer && dummyProducts[customer.id]) {
            dummyProducts[customer.id].forEach(product => {
                if (complaint.products.includes(product.name)) {
                    // Find this product's complaint in the combined text
                    const lines = complaint.complaint.split('\n');
                    const productLine = lines.find(line => line.startsWith(product.name + ':'));
                    if (productLine) {
                        complaintsObj[product.id] = productLine.replace(`${product.name}: `, '');
                    }
                }
            });
        }
        setProductComplaints(complaintsObj);

        // Set selected products based on product names
        if (customer && dummyProducts[customer.id]) {
            const selectedIds = dummyProducts[customer.id]
                .filter(product => complaint.products.includes(product.name))
                .map(product => product.id);
            setSelectedProducts(selectedIds);
        }

        setIsSliderOpen(true);
    };

    // Delete Complaint
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
                        setComplaints(complaints.filter((complaint) => complaint._id !== id));
                        swalWithTailwindButtons.fire(
                            "Deleted!",
                            "Complaint deleted successfully.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Delete error:", error);
                        swalWithTailwindButtons.fire(
                            "Error!",
                            "Failed to delete complaint.",
                            "error"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Complaint is safe 🙂",
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
                    <p className="mt-4 text-gray-600">Loading complaints...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <CommanHeader />
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FiFileText className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">Complaint From</h1>
                        <p className="text-gray-500 text-sm">Manage customer complaints and issues</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
                        onClick={handleAddComplaint}
                    >
                        <FiFileText className="w-4 h-4" />
                        Add Complaint
                    </button>
                </div>
            </div>

            {/* Complaints Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[1400px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_3fr_1fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Complaint ID</div>
                            <div>Customer</div>
                            <div>Products</div>
                            <div>Complaint</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Complaints List */}
                        <div className="flex flex-col">
                            {currentItems.map((complaint, index) => (
                                <div
                                    key={complaint._id}
                                    className={`grid grid-cols-[0.5fr_1fr_1fr_1fr_3fr_1fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
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

                                    {/* Customer */}
                                    <div className="text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <FiUser className="w-3 h-3 text-gray-400" />
                                            {complaint.customer}
                                        </div>
                                    </div>

                                    {/* Products */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex flex-wrap gap-1">
                                            {complaint.products.map((product, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                                >
                                                    {product}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Complaint */}
                                    <div className="text-sm text-gray-600">
                                        <div className="line-clamp-2">
                                            {complaint.complaint}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 justify-end">
                                        {/* EDIT ICON */}
                                        <button
                                            onClick={() => handleEdit(complaint)}
                                            className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-2 rounded-md transition"
                                        >
                                            <FiEdit3 className="w-4 h-4" />
                                        </button>
                                        {/* DELETE ICON */}
                                        <button
                                            onClick={() => handleDelete(complaint._id)}
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


            </div>

            {/* Slider/Modal for Complaint Form */}
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
                                        <FiFileText className="w-6 h-6 text-newPrimary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-newPrimary">
                                            {isEdit ? "Update Complaint" : "Add New Complaint"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {isEdit ? "Update complaint details" : "Fill in the complaint information below"}
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
                                    <h3 className="text-lg font-semibold text-gray-800">Complaint Information</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Complaint Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Complaint Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiCalendar className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                value={complaintDate}
                                                onChange={(e) => setComplaintDate(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Complaint ID */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Complaint ID <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiHash className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={complaintId}
                                                onChange={(e) => setComplaintId(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="COMP001"
                                            />
                                        </div>
                                    </div>

                                    {/* Customer Select */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Customer <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiUser className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <select
                                                value={selectedCustomer}
                                                onChange={(e) => {
                                                    setSelectedCustomer(e.target.value);
                                                    setSelectedProducts([]); // Reset products when customer changes
                                                }}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                                            >
                                                <option value="">Select Customer</option>
                                                {dummyCustomers.map(customer => (
                                                    <option key={customer.id} value={customer.id}>
                                                        {customer.name} - {customer.company}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Products Table - Only show when customer is selected */}
                                {/* Products Table - Only show when customer is selected */}
                                {selectedCustomer && dummyProducts[selectedCustomer] && (
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Select Products for Complaint <span className="text-red-500">*</span>
                                        </label>
                                        <div className="rounded-lg border border-gray-300 overflow-hidden">
                                            <div className="grid grid-cols-[0.2fr_0.5fr_2fr_3fr] gap-4 bg-gray-100 py-3 px-4 text-sm font-medium text-gray-700">
                                                <div>Select</div>
                                                <div>Sr#</div>
                                                <div>Product</div>
                                                <div>Complaint</div>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {dummyProducts[selectedCustomer].map((product, index) => (
                                                    <div
                                                        key={product.id}
                                                        className={`grid grid-cols-[0.2fr_0.5fr_2fr_3fr] gap-4 items-center py-3 px-4 border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                            }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedProducts.includes(product.id)}
                                                                onChange={() => handleProductSelect(product.id)}
                                                                className="w-4 h-4 text-newPrimary rounded focus:ring-newPrimary border-gray-300"
                                                                id={`product-${product.id}`}
                                                            />
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FiPackage className="w-4 h-4 text-gray-400" />
                                                            {product.name}
                                                        </div>
                                                        <div>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    value={productComplaints[product.id] || ""}
                                                                    onChange={(e) => {
                                                                        // Only allow editing if product is selected
                                                                        if (selectedProducts.includes(product.id)) {
                                                                            setProductComplaints(prev => ({
                                                                                ...prev,
                                                                                [product.id]: e.target.value
                                                                            }));
                                                                        }
                                                                    }}
                                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-newPrimary bg-white transition-all duration-200 text-sm ${selectedProducts.includes(product.id)
                                                                        ? "border-gray-300 focus:ring-newPrimary/30"
                                                                        : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                                                        }`}
                                                                    placeholder="Enter complaint for this product..."
                                                                    readOnly={!selectedProducts.includes(product.id)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            Selected: {selectedProducts.length} product(s)
                                        </div>
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
                                                Update Complaint
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Save Complaint
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

export default ComplaintFrom;