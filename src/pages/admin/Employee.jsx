import React, { useState, useEffect, useRef } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CommanHeader from "../../components/CommanHeader";
import { SquarePen, Trash2 } from "lucide-react";
import TableSkeleton from "./Skeleton";

const Employee = () => {
  const [employeeList, setEmployeeList] = useState([
    {
      _id: "e1",
      employeeName: "Ali Khan",
      department: "HR",
      address: "123 Main Street",
      city: "Lahore",
      gender: "Male",
      phoneNumber: "03001234567",
      nic: "35202-1234567-8",
      dob: "1995-05-12",
      qualification: "MBA",
      bloodGroup: "B+",
      enable: true,
    },
    {
      _id: "e2",
      employeeName: "Sara Ahmed",
      department: "Accounts",
      address: "45 Gulberg",
      city: "Karachi",
      gender: "Female",
      phoneNumber: "03007654321",
      nic: "35201-7654321-9",
      dob: "1998-08-21",
      qualification: "B.Com",
      bloodGroup: "O+",
      enable: false,
    },
  ]);

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [qualification, setQualification] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [enable, setEnable] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Slider animation
  useEffect(() => {
    if (isSliderOpen && sliderRef.current) {
      gsap.fromTo(
        sliderRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.2, ease: "expo.out" }
      );
    }
  }, [isSliderOpen]);

  // Handlers
  const handleAddEmployee = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setEmployeeName("");
    setDepartment("");
    setAddress("");
    setCity("");
    setGender("");
    setPhoneNumber("");
    setNic("");
    setDob("");
    setQualification("");
    setBloodGroup("");
    setEnable(true);
  };

  const handleSave = () => {
    if (!employeeName || !department) {
      toast.error("❌ Employee name and department are required");
      return;
    }

    const newEmployee = {
      _id: isEdit ? editId : Date.now().toString(),
      employeeName,
      department,
      address,
      city,
      gender,
      phoneNumber,
      nic,
      dob,
      qualification,
      bloodGroup,
      enable,
    };

    if (isEdit) {
      setEmployeeList(
        employeeList.map((emp) => (emp._id === editId ? newEmployee : emp))
      );
      toast.success("✅ Employee updated successfully");
    } else {
      setEmployeeList([...employeeList, newEmployee]);
      toast.success("✅ Employee added successfully");
    }

    setIsSliderOpen(false);
  };

  const handleEdit = (emp) => {
    setIsEdit(true);
    setEditId(emp._id);
    setEmployeeName(emp.employeeName);
    setDepartment(emp.department);
    setAddress(emp.address);
    setCity(emp.city);
    setGender(emp.gender);
    setPhoneNumber(emp.phoneNumber);
    setNic(emp.nic);
    setDob(emp.dob);
    setQualification(emp.qualification);
    setBloodGroup(emp.bloodGroup);
    setEnable(emp.enable);
    setIsSliderOpen(true);
  };

  const handleDelete = (id) => {
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
      text: "You want to delete this employee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        setEmployeeList(employeeList.filter((emp) => emp._id !== id));
        swalWithTailwindButtons.fire(
          "Deleted!",
          "Employee has been deleted.",
          "success"
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithTailwindButtons.fire(
          "Cancelled",
          "Employee is safe 🙂",
          "error"
        );
      }
    });
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Common header */}
      <CommanHeader />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Employees</h1>
          <p className="text-gray-500 text-sm">Manage your employee details</p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/90"
          onClick={handleAddEmployee}
        >
          + Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* ✅ Table Header */}
            <div className="hidden lg:grid grid-cols-9 gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
              <div>ID</div>
              <div>Name</div>
              <div>Department</div>
              <div>Phone</div>
              <div>NIC</div>
              <div>DOB</div>
              <div>Qualification</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            {/* ✅ Table Body */}
            <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {loading ? (
                <TableSkeleton rows={5} cols={9} className="lg:grid-cols-9"/>
              ) : employeeList.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-white">
                  No employees found.
                </div>
              ) : (
                employeeList.map((emp) => (
                  <div
                    key={emp._id}
                    className="hidden lg:grid grid-cols-9 items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                  >
                    <div className="font-medium text-gray-900">
                      {emp._id?.slice(0, 6)}
                    </div>
                    <div className="text-gray-700">{emp.employeeName}</div>
                    <div className="text-gray-600">{emp.department}</div>
                    <div className="text-gray-600">{emp.phoneNumber}</div>
                    <div className="text-gray-600">{emp.nic}</div>
                    <div className="text-gray-600">{emp.dob}</div>
                    <div className="text-gray-600">{emp.qualification}</div>
                    <div className=" font-semibold">
                      {emp.enable ? (
                        <span className="text-green-600">Enabled</span>
                      ) : (
                        <span className="text-red-600">Disabled</span>
                      )}
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="text-blue-600 hover:underline"
                      >
                        <SquarePen size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="text-red-600 hover:underline"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slider Form */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div
            ref={sliderRef}
            className="w-full max-w-md bg-white p-6 h-full overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-newPrimary">
                {isEdit ? "Update Employee" : "Add a New Employee"}
              </h2>
              <button
                className="text-2xl text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsSliderOpen(false);
                  setIsEdit(false);
                  setEditId(null);
                  setEmployeeName("");
                  setDepartment("");
                  setAddress("");
                  setCity("");
                  setGender("");
                  setPhoneNumber("");
                  setNic("");
                  setDob("");
                  setQualification("");
                  setBloodGroup("");
                  setEnable(true);
                }}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Sales">Sales</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">NIC</label>
                <input
                  type="text"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Qualification
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Blood Group
                </label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Enable Toggle */}
              <div className="flex items-center gap-3">
                <label className="text-gray-700 font-medium">Enable</label>
                <button
                  type="button"
                  onClick={() => setEnable(!enable)}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    enable ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      enable ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
                <span>{enable ? "Enabled" : "Disabled"}</span>
              </div>

              <button
                className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 w-full"
                onClick={handleSave}
              >
                Save Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
