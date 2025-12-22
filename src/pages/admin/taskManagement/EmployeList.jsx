import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { 
  FiEdit3, 
  FiTrash2, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFileText,
  FiHash,
  FiPrinter
} from "react-icons/fi";
import { FaUsers, FaBuilding, FaPhoneAlt, FaMobileAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { MdLocalPostOffice } from "react-icons/md";
import CommanHeader from "../../../components/CommanHeader";
// import Pagination from "../../pages/admin/pagination/Pagination";

const EmployeList = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [id, setId] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [employeeCode, setEmployeeCode] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [fax, setFax] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [salesTaxNo, setSalesTaxNo] = useState("");
    const [ntn, setNtn] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const sliderRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dummy data for demonstration
    const dummyEmployees = [
        {
            _id: "1",
            companyId: "1",
            employeeCode: "EMP001",
            employeeName: "John Smith",
            address: "123 Main Street, New York, NY 10001",
            phone: "+1 (212) 555-1234",
            mobile: "+1 (917) 555-5678",
            email: "john.smith@techsolutions.com",
            fax: "+1 (212) 555-9876",
            contactPerson: "Sarah Johnson",
            salesTaxNo: "STN-123456",
            ntn: "12345-6789012-3",
            companyName: "Tech Solutions Inc."
        },
        {
            _id: "2",
            companyId: "1",
            employeeCode: "EMP002",
            employeeName: "Sarah Johnson",
            address: "456 Park Avenue, New York, NY 10022",
            phone: "+1 (212) 555-4321",
            mobile: "+1 (917) 555-8765",
            email: "sarah.j@techsolutions.com",
            fax: "+1 (212) 555-6789",
            contactPerson: "Michael Chen",
            salesTaxNo: "STN-234567",
            ntn: "23456-7890123-4",
            companyName: "Tech Solutions Inc."
        },
        {
            _id: "3",
            companyId: "2",
            employeeCode: "EMP003",
            employeeName: "Michael Chen",
            address: "789 Business Blvd, San Francisco, CA 94107",
            phone: "+1 (415) 555-1111",
            mobile: "+1 (415) 555-2222",
            email: "michael.chen@globalpharma.com",
            fax: "+1 (415) 555-3333",
            contactPerson: "Emily Rodriguez",
            salesTaxNo: "STN-345678",
            ntn: "34567-8901234-5",
            companyName: "Global Pharmaceuticals"
        },
        {
            _id: "4",
            companyId: "3",
            employeeCode: "EMP004",
            employeeName: "Emily Rodriguez",
            address: "101 Green Way, Austin, TX 78701",
            phone: "+1 (512) 555-4444",
            mobile: "+1 (512) 555-5555",
            email: "emily.r@greenenergy.com",
            fax: "+1 (512) 555-6666",
            contactPerson: "David Wilson",
            salesTaxNo: "STN-456789",
            ntn: "45678-9012345-6",
            companyName: "Green Energy Corp"
        },
        {
            _id: "5",
            companyId: "4",
            employeeCode: "EMP005",
            employeeName: "David Wilson",
            address: "202 Logistics Lane, Chicago, IL 60601",
            phone: "+1 (312) 555-7777",
            mobile: "+1 (312) 555-8888",
            email: "david.w@urbanlogistics.com",
            fax: "+1 (312) 555-9999",
            contactPerson: "Lisa Thompson",
            salesTaxNo: "STN-567890",
            ntn: "56789-0123456-7",
            companyName: "Urban Logistics Ltd"
        },
        {
            _id: "6",
            companyId: "5",
            employeeCode: "EMP006",
            employeeName: "Lisa Thompson",
            address: "303 Design Drive, Los Angeles, CA 90001",
            phone: "+1 (213) 555-0000",
            mobile: "+1 (213) 555-1112",
            email: "lisa.t@creativedesigns.com",
            fax: "+1 (213) 555-2223",
            contactPerson: "Robert Kim",
            salesTaxNo: "STN-678901",
            ntn: "67890-1234567-8",
            companyName: "Creative Designs Studio"
        },
        {
            _id: "7",
            companyId: "6",
            employeeCode: "EMP007",
            employeeName: "Robert Kim",
            address: "404 Finance Street, Boston, MA 02108",
            phone: "+1 (617) 555-3334",
            mobile: "+1 (617) 555-4445",
            email: "robert.k@financialtrust.com",
            fax: "+1 (617) 555-5556",
            contactPerson: "Jessica Lee",
            salesTaxNo: "STN-789012",
            ntn: "78901-2345678-9",
            companyName: "Financial Trust Bank"
        },
        {
            _id: "8",
            companyId: "7",
            employeeCode: "EMP008",
            employeeName: "Jessica Lee",
            address: "505 Wellness Way, Miami, FL 33101",
            phone: "+1 (305) 555-6667",
            mobile: "+1 (305) 555-7778",
            email: "jessica.l@wellnesscenter.com",
            fax: "+1 (305) 555-8889",
            contactPerson: "Thomas Brown",
            salesTaxNo: "STN-890123",
            ntn: "89012-3456789-0",
            companyName: "Health & Wellness Center"
        },
        {
            _id: "9",
            companyId: "8",
            employeeCode: "EMP009",
            employeeName: "Thomas Brown",
            address: "606 Eco Road, Seattle, WA 98101",
            phone: "+1 (206) 555-9990",
            mobile: "+1 (206) 555-0001",
            email: "thomas.b@ecofoods.com",
            fax: "+1 (206) 555-1112",
            contactPerson: "Amanda Clark",
            salesTaxNo: "STN-901234",
            ntn: "90123-4567890-1",
            companyName: "Eco Food Products"
        },
        {
            _id: "10",
            companyId: "1",
            employeeCode: "EMP010",
            employeeName: "Amanda Clark",
            address: "707 Tech Avenue, New York, NY 10016",
            phone: "+1 (212) 555-3335",
            mobile: "+1 (917) 555-4446",
            email: "amanda.c@techsolutions.com",
            fax: "+1 (212) 555-5557",
            contactPerson: "John Smith",
            salesTaxNo: "STN-012345",
            ntn: "01234-5678901-2",
            companyName: "Tech Solutions Inc."
        }
    ];

    // Dummy companies for dropdown
    const dummyCompanies = [
        { _id: "1", companyName: "Tech Solutions Inc." },
        { _id: "2", companyName: "Global Pharmaceuticals" },
        { _id: "3", companyName: "Green Energy Corp" },
        { _id: "4", companyName: "Urban Logistics Ltd" },
        { _id: "5", companyName: "Creative Designs Studio" },
        { _id: "6", companyName: "Financial Trust Bank" },
        { _id: "7", companyName: "Health & Wellness Center" },
        { _id: "8", companyName: "Eco Food Products" }
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

    // Fetch employees
    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            // Try to fetch from API first
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/employees`);
            if (res.data && res.data.length > 0) {
                setEmployeeList(res.data);
            } else {
                // If no data from API, use dummy data
                setEmployeeList(dummyEmployees);
                console.log("Using dummy employees data");
            }
        } catch (error) {
            // If API fails, use dummy data for demonstration
            console.log("API failed, using dummy data");
            setEmployeeList(dummyEmployees);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);

    // Fetch companies for dropdown
    const fetchCompanies = useCallback(async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/companies`);
            if (res.data && res.data.length > 0) {
                setCompanyList(res.data);
            } else {
                setCompanyList(dummyCompanies);
            }
        } catch (error) {
            setCompanyList(dummyCompanies);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
        fetchCompanies();
    }, [fetchEmployees, fetchCompanies]);

    // Pagination calculations
    const totalItems = employeeList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = employeeList.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleAddEmployee = () => {
        setIsSliderOpen(true);
        setIsEdit(false);
        setEditId(null);
        setId("");
        setCompanyId("");

        // Generate next employee code
        const nextCode = generateNextEmployeeCode();
        setEmployeeCode(nextCode);

        setEmployeeName("");
        setAddress("");
        setPhone("");
        setMobile("");
        setEmail("");
        setFax("");
        setContactPerson("");
        setSalesTaxNo("");
        setNtn("");
    };

    // Generate next employee code in format EMP001
    const generateNextEmployeeCode = () => {
        if (employeeList.length === 0) {
            return "EMP001";
        }

        // Extract all numeric parts from existing codes
        const codes = employeeList
            .map(emp => {
                const code = emp.employeeCode || "";
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
        return `EMP${formattedNumber}`;
    };

    // Save or Update Employee
    const handleSave = async () => {
        if (!employeeName || !email || !companyId) {
            toast.error("Employee Name, Email, and Company are required");
            return;
        }

        try {
            const selectedCompany = companyList.find(company => company._id === companyId);

            if (isEdit && editId) {
                // For dummy data, update locally
                const updatedEmployee = {
                    _id: editId,
                    companyId,
                    employeeCode: employeeCode || generateNextEmployeeCode(),
                    employeeName,
                    address,
                    phone,
                    mobile,
                    email,
                    fax,
                    contactPerson,
                    salesTaxNo,
                    ntn,
                    companyName: selectedCompany?.companyName || "Unknown Company"
                };

                setEmployeeList(employeeList.map(employee =>
                    employee._id === editId ? updatedEmployee : employee
                ));
                toast.success("Employee updated successfully");
            } else {
                // For dummy data, add new employee locally
                const newEmployee = {
                    _id: `emp-${Date.now()}`,
                    companyId,
                    employeeCode: employeeCode || generateNextEmployeeCode(),
                    employeeName,
                    address,
                    phone,
                    mobile,
                    email,
                    fax,
                    contactPerson,
                    salesTaxNo,
                    ntn,
                    companyName: selectedCompany?.companyName || "Unknown Company"
                };

                setEmployeeList([newEmployee, ...employeeList]);
                toast.success("Employee added successfully");
            }

            reState();
        } catch (error) {
            console.error(error);
            toast.error(`❌ ${isEdit ? "Update" : "Add"} Employee failed`);
        }
    };

    // Reset state
    const reState = () => {
        setIsSliderOpen(false);
        setIsEdit(false);
        setEditId(null);
        setId("");
        setCompanyId("");
        setEmployeeCode("");
        setEmployeeName("");
        setAddress("");
        setPhone("");
        setMobile("");
        setEmail("");
        setFax("");
        setContactPerson("");
        setSalesTaxNo("");
        setNtn("");
    };

    // Edit Employee
    const handleEdit = (employee) => {
        setIsEdit(true);
        setEditId(employee._id);
        setCompanyId(employee.companyId);
        setEmployeeCode(employee.employeeCode);
        setEmployeeName(employee.employeeName);
        setAddress(employee.address || "");
        setPhone(employee.phone || "");
        setMobile(employee.mobile || "");
        setEmail(employee.email || "");
        setFax(employee.fax || "");
        setContactPerson(employee.contactPerson || "");
        setSalesTaxNo(employee.salesTaxNo || "");
        setNtn(employee.ntn || "");
        setIsSliderOpen(true);
    };

    // Delete Employee
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
                        setEmployeeList(employeeList.filter((employee) => employee._id !== id));
                        swalWithTailwindButtons.fire(
                            "Deleted!",
                            "Employee deleted successfully.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Delete error:", error);
                        swalWithTailwindButtons.fire(
                            "Error!",
                            "Failed to delete employee.",
                            "error"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Employee is safe 🙂",
                        "error"
                    );
                }
            });
    };

    // Get company name by ID
    const getCompanyName = (companyId) => {
        const company = companyList.find(c => c._id === companyId);
        return company?.companyName || "Unknown Company";
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
                    <p className="mt-4 text-gray-600">Loading employees...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <CommanHeader/>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FaUsers className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">Employees Information</h1>
                        <p className="text-gray-500 text-sm">Manage your employees and their details</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
                        onClick={handleAddEmployee}
                    >
                        <FiUser className="w-4 h-4" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Employees Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[2000px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_2fr_1.5fr_1.5fr_1.5fr_1.5fr_1.5fr_2fr_1.5fr_1.5fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Employee Name</div>     
                            <div>Address</div>
                            <div>Phone</div>
                            <div>Mobile</div>
                            <div>Email</div>
                            <div>Fax</div>
                            <div>Contact Person</div>
                            <div>Sales Tax No</div>
                            <div>NTN</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Employees List */}
                        <div className="flex flex-col">
                            {currentItems.map((employee, index) => (
                                <div
                                    key={employee._id}
                                    className={`grid grid-cols-[0.5fr_2fr_1.5fr_1.5fr_1.5fr_1.5fr_1.5fr_2fr_1.5fr_1.5fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                        }`}
                                >
                                    {/* Serial Number */}
                                    <div className="text-sm font-medium text-gray-900">
                                        {startIndex + index + 1}
                                    </div>

                                    {/* Employee Name */}
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-newPrimary/20 to-newPrimary/10 rounded-lg flex items-center justify-center">
                                                <FiUser className="w-4 h-4 text-newPrimary" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {employee.employeeName}
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono">
                                                    {employee.employeeCode}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                  

                                    {/* Address */}
                                    <div className="text-sm text-gray-600 truncate" title={employee.address}>
                                        <div className="flex items-center gap-2">
                                            <FiMapPin className="w-3 h-3 text-gray-400" />
                                            {employee.address || "N/A"}
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaPhoneAlt className="w-3 h-3 text-gray-400" />
                                            {employee.phone || "N/A"}
                                        </div>
                                    </div>

                                    {/* Mobile */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaMobileAlt className="w-3 h-3 text-gray-400" />
                                            {employee.mobile || "N/A"}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="text-sm text-gray-600 truncate" title={employee.email}>
                                        <div className="flex items-center gap-2">
                                            <FiMail className="w-3 h-3 text-gray-400" />
                                            {employee.email}
                                        </div>
                                    </div>

                                    {/* Fax */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiPrinter className="w-3 h-3 text-gray-400" />
                                            {employee.fax || "N/A"}
                                        </div>
                                    </div>

                                    {/* Contact Person */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <IoPerson className="w-3 h-3 text-gray-400" />
                                            {employee.contactPerson || "N/A"}
                                        </div>
                                    </div>

                                    {/* Sales Tax No */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiFileText className="w-3 h-3 text-gray-400" />
                                            {employee.salesTaxNo || "N/A"}
                                        </div>
                                    </div>

                                    {/* NTN */}
                                    <div className="text-sm text-gray-600 font-mono">
                                        {employee.ntn || "N/A"}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 justify-end">
                                        {/* EDIT ICON */}
                                        <button
                                            onClick={() => handleEdit(employee)}
                                            className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-2 rounded-md transition"
                                        >
                                            <FiEdit3 className="w-4 h-4" />
                                        </button>
                                        {/* DELETE ICON */}
                                        <button
                                            onClick={() => handleDelete(employee._id)}
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
                                        <FaUsers className="w-6 h-6 text-newPrimary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-newPrimary">
                                            {isEdit ? "Update Employee" : "Add New Employee"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {isEdit ? "Update employee details" : "Fill in the employee information below"}
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
                            {/* Section 1: Basic Information */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Employee Code */}
                                    <div className="space-y-2">
                                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Employee Code <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiHash className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employeeCode}
                                                disabled
                                                className="w-full bg-gray-50 pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="EMP001"
                                            />
                                        </div>
                                    </div>

                                    {/* Employee Name */}
                                    <div className="space-y-2">
                                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Employee Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiUser className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employeeName}
                                                required
                                                onChange={(e) => setEmployeeName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="Enter employee name"
                                            />
                                        </div>
                                    </div>

                                    

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiMail className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                required
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="employee@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Contact Information */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Address */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiMapPin className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="Enter address"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaPhoneAlt className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>

                                    {/* Mobile */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mobile
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaMobileAlt className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="Enter mobile number"
                                            />
                                        </div>
                                    </div>

                                    {/* Fax */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fax
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiPrinter className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={fax}
                                                onChange={(e) => setFax(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="Enter fax number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Tax & Additional Information */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Tax & Additional Information</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Contact Person */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Contact Person
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <IoPerson className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={contactPerson}
                                                onChange={(e) => setContactPerson(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="Enter contact person name"
                                            />
                                        </div>
                                    </div>

                                    {/* Sales Tax No */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Sales Tax No
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiFileText className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={salesTaxNo}
                                                onChange={(e) => setSalesTaxNo(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="Enter sales tax number"
                                            />
                                        </div>
                                    </div>

                                    {/* NTN */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            NTN (National Tax Number)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <MdLocalPostOffice className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={ntn}
                                                onChange={(e) => setNtn(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="Enter NTN"
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
                                                Update Employee
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Save Employee
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

export default EmployeList;