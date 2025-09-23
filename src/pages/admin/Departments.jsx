import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../components/CommanHeader";
import TableSkeleton from "./Skeleton";

const Departments = () => {
  const [departmentList, setDepartmentList] = useState([
    { _id: "dep1", department: "HR" },
    { _id: "dep2", department: "Accounts" },
  ]);

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef(null);

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
  const handleAdd = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setDepartment("");
  };

  const handleSave = () => {
    if (!department) {
      toast.error("❌ Department is required");
      return;
    }

    const newDept = {
      _id: isEdit ? editId : Date.now().toString(),
      department,
    };

    if (isEdit) {
      setDepartmentList(
        departmentList.map((d) => (d._id === editId ? newDept : d))
      );
      toast.success("✅ Department updated successfully");
    } else {
      setDepartmentList([...departmentList, newDept]);
      toast.success("✅ Department added successfully");
    }

    setIsSliderOpen(false);
  };

  const handleEdit = (d) => {
    setIsEdit(true);
    setEditId(d._id);
    setDepartment(d.department);
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
      text: "You want to delete this department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        setDepartmentList(departmentList.filter((d) => d._id !== id));
        swalWithTailwindButtons.fire(
          "Deleted!",
          "Department has been deleted.",
          "success"
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithTailwindButtons.fire(
          "Cancelled",
          "Department is safe 🙂",
          "error"
        );
      }
    });
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <CommanHeader />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Departments</h1>
          <p className="text-gray-500 text-sm">Manage your department details</p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/90"
          onClick={handleAdd}
        >
          + Add Department
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-[80px_1fr_auto] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
              <div>Sr</div>
              <div>Department</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {loading ? (
                <TableSkeleton rows={5} cols={3} />
              ) : departmentList.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-white">
                  No departments found.
                </div>
              ) : (
                departmentList.map((d, index) => (
                  <div
                    key={d._id}
                    className="hidden lg:grid grid-cols-[80px_1fr_auto] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                  >
                    <div>{index + 1}</div>
                    <div className="text-gray-700">{d.department}</div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(d)}
                        className="text-blue-600 hover:underline"
                      >
                        <SquarePen size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
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

      {/* Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div
            ref={sliderRef}
            className="w-full max-w-md bg-white p-6 h-full overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-newPrimary">
                {isEdit ? "Update Department" : "Add a New Department"}
              </h2>
              <button
                className="text-2xl text-gray-500 hover:text-gray-700"
                onClick={() => setIsSliderOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Department <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter department"
                />
              </div>

              <button
                className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 w-full"
                onClick={handleSave}
              >
                Save Department
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
