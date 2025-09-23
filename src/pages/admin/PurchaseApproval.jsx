import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../components/CommanHeader";
import TableSkeleton from "./Skeleton";
import Swal from "sweetalert2";

const PurchaseApproval = () => {
  const [approvals, setApprovals] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState("");
  const [employee, setEmployee] = useState("");
  const [items, setItems] = useState("");
  const [status, setStatus] = useState("Hold");
  const [editingApproval, setEditingApproval] = useState(null);
  const sliderRef = useRef(null);

  // Static data for approvals
  const staticData = [
    {
      _id: "1",
      department: "IT",
      employee: "John Doe",
      items: "Dell XPS 15 (5)",
      status: "Approved",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      department: "HR",
      employee: "Jane Smith",
      items: "Ink (4) , Notebooks (100)",
      status: "Hold",
      createdAt: new Date().toISOString(),
    },
      {
      _id: "3",
      department: "CS",
      employee: "Henry Smith",
      items: "Pens (4) , Notebooks (100)",
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
  ];

  // Load static data on mount
  useEffect(() => {
    setLoading(true);
    setApprovals(staticData);
    setTimeout(() => setLoading(false), 1000); // Simulate loading for 1 second
  }, []);

  // Handlers for form and table actions
  const handleEditClick = (approval) => {
    setEditingApproval(approval);
    setDepartment(approval.department);
    setEmployee(approval.employee);
    setItems(approval.items);
    setStatus(approval.status);
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
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        setApprovals((prev) => prev.filter((a) => a._id !== id));

        swalWithTailwindButtons.fire(
          "Deleted!",
          "Approval deleted successfully.",
          "success"
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithTailwindButtons.fire(
          "Cancelled",
          "Approval is safe 🙂",
          "error"
        );
      }
    });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedDepartment = department.trim();
  const trimmedEmployee = employee.trim();
  const trimmedItems = items.trim();

  if (!trimmedDepartment || !trimmedEmployee || !trimmedItems) {
    Swal.fire("Error", "All fields are required.", "error");
    return;
  }

  const newApproval = {
    _id: editingApproval ? editingApproval._id : Date.now().toString(),
    department: trimmedDepartment,
    employee: trimmedEmployee,
    items: trimmedItems,
    status,
    createdAt: new Date().toISOString(),
  };

  if (editingApproval) {
    setApprovals(
      approvals.map((a) =>
        a._id === editingApproval._id ? newApproval : a
      )
    );
    Swal.fire("✅ Success", "Approval updated successfully!", "success");
  } else {
    setApprovals([...approvals, newApproval]);
    Swal.fire("✅ Success", "Approval added successfully!", "success");
  }

  // Reset form state
  setDepartment("");
  setEmployee("");
  setItems("");
  setStatus("Hold");
  setEditingApproval(null);
  setIsSliderOpen(false);
};



  // Function to determine status styling
const getStatusStyle = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs";
    case "Hold":
      return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs";
    default:
      return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs";
  }
};


  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Purchase Approval Details
            </h1>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[400px]">
            <div className="min-w-[1200px]">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-5 gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Department</div>
                <div>Employee</div>
                <div>Items with Quantity</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton
                    rows={3}
                    cols={5}
                    className="lg:grid-cols-5"
                  />
                ) : approvals.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No approvals found.
                  </div>
                ) : (
                  approvals.map((approval) => (
                    <div
                      key={approval._id}
                      className="grid grid-cols-1 lg:grid-cols-5 items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">{approval.department}</div>
                      <div className="text-gray-600">{approval.employee}</div>
                      <div className="text-gray-600">{approval.items}</div>
                      <div>
                        <span className={getStatusStyle(approval.status)}>
                          {approval.status}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(approval)}
                          className="px-3 py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(approval._id)}
                          className="px-3 py-1 text-sm rounded text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
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

        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
            <div
              ref={sliderRef}
              className="w-full max-w-md bg-white p-4 h-full overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingApproval ? "Update Approval" : "Add a New Approval"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setIsSliderOpen(false);
                    setDepartment("");
                    setEmployee("");
                    setItems("");
                    setStatus("Hold");
                    setEditingApproval(null);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Department <span className="text-newPrimary">*</span>
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter department"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Employee <span className="text-newPrimary">*</span>
                  </label>
                  <input
                    type="text"
                    value={employee}
                    onChange={(e) => setEmployee(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter employee name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Items with Quantity <span className="text-newPrimary">*</span>
                  </label>
                  <input
                    type="text"
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter items with quantity"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                  >
                    <option value="Hold">Hold</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading ? "Saving..." : editingApproval ? "Update Approval" : "Save Approval"}
                </button>
              </form>
            </div>
          </div>
        )}

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #edf2f7;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #a0aec0;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #718096;
          }
        `}</style>
      </div>
    </div>
  );
};

export default PurchaseApproval;