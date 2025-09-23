import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
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
      items: [
        { name: "Pens", qty: 4 },
        { name: "Notebooks", qty: 5 },
        { name: "Markers", qty: 3 },
      ],
      date: "2025-09-12",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      department: "HR",
      employee: "Jane Smith",
      items: [
        { name: "Dell XPS 15", qty: 4 },
        { name: "Mouse", qty: 10 },
      ],
      date: "2025-09-16",
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


  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Invalid Date";

    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = parsed.getFullYear();

    return `${day}-${month}-${year}`; // DD-MM-YYYY
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
              <div className="grid grid-cols-[80px_1fr_1fr_2fr_150px_200px] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Sr #</div>
                <div>Department</div>
                <div>Employee</div>
                <div>Items with Quantity</div>
                <div>Date</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton rows={3} cols={6} className="grid-cols-[80px_1fr_1fr_2fr_150px_200px]" />
                ) : approvals.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No approvals found.
                  </div>
                ) : (
                  approvals.map((approval, idx) => (
                    <div
                      key={approval._id}
                      className="grid grid-cols-[80px_1fr_1fr_2fr_150px_200px] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      {/* Sr # */}
                      <div className="text-gray-600">{idx + 1}</div>

                      {/* Department */}
                      <div className="text-gray-600">{approval.department}</div>

                      {/* Employee */}
                      <div className="text-gray-600">{approval.employee}</div>

                      {/* Items with Qty */}
                      <div className="text-gray-600">
                        <div className="flex flex-wrap gap-2">
                          {approval.items.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `hsl(${(idx * 70) % 360}, 80%, 85%)`,
                                  color: `hsl(${(idx * 70) % 360}, 40%, 25%)`,
                                }}
                              >
                                {item.name}
                              </span>
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `hsl(${(idx * 70 + 35) % 360}, 80%, 85%)`,
                                  color: `hsl(${(idx * 70 + 35) % 360}, 40%, 25%)`,
                                }}
                              >
                                Qty: {item.qty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-gray-500">{formatDate(approval.date)}</div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-1 text-xs font-medium rounded-full bg-green-200 text-green-800 hover:bg-green-300">
                          Approved
                        </button>
                        <button className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                          Pending
                        </button>
                        <button className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 hover:bg-red-200">
                          Hold
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