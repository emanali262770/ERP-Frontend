import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../../components/CommanHeader";
import TableSkeleton from "../Skeleton";
import Swal from "sweetalert2";

const GateOutwards = () => {
  const [outwards, setOutwards] = useState([
    {
      _id: "1",
      outwardNo: "OUT-001",
      date: "2025-09-01",
      time: "14:30",
      saleType: "Local Sale",
      partyName: "Health Corp",
      address: "123 Health St, City",
      truckNo: "XYZ-123",
      driverName: "John Doe",
      fatherCnic: "",
      mobileNo: "",
      containerNo1: "",
      containerNo2: "",
      batchNo: "",
      forLocation: "",
      firstWeight: 5000,
      weightBridgeName: "",
      weightBridgeSlipNo: "",
      remarks: "Urgent delivery",
    },
    {
      _id: "2",
      outwardNo: "OUT-002",
      date: "2025-09-15",
      time: "09:45",
      saleType: "Export",
      partyName: "Global Pharma",
      address: "456 Export Ave, City",
      truckNo: "ABC-456",
      driverName: "Jane Smith",
      fatherCnic: "",
      mobileNo: "",
      containerNo1: "",
      containerNo2: "",
      batchNo: "",
      forLocation: "",
      firstWeight: 3000,
      weightBridgeName: "",
      weightBridgeSlipNo: "",
      remarks: "International shipment",
    },
  ]);

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [outwardNo, setOutwardNo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saleType, setSaleType] = useState("Local Sale");
  const [partyName, setPartyName] = useState("");
  const [address, setAddress] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [Cnic, setCnic] = useState("");
  const [father, setFather] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [containerNo1, setContainerNo1] = useState("");
  const [containerNo2, setContainerNo2] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [forLocation, setForLocation] = useState("");
  const [firstWeight, setFirstWeight] = useState("");
  const [weightBridgeName, setWeightBridgeName] = useState("");
  const [weightBridgeSlipNo, setWeightBridgeSlipNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOutward, setEditingOutward] = useState(null);
  const [errors, setErrors] = useState({});
  const [nextOutwardNo, setNextOutwardNo] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Simulate fetching outwards
  const fetchOutwards = useCallback(async () => {
    try {
      setLoading(true);
      // Static data already set in state
    } catch (error) {
      console.error("Failed to fetch outwards", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchOutwards();
  }, [fetchOutwards]);

  // Outward search
  useEffect(() => {
    if (!searchTerm || !searchTerm.startsWith("OUT-")) {
      fetchOutwards();
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        setLoading(true);
        const filtered = outwards.filter((outward) =>
          outward.outwardNo.toUpperCase().includes(searchTerm.toUpperCase())
        );
        setOutwards(filtered);
      } catch (error) {
        console.error("Search outward failed:", error);
        setOutwards([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchOutwards, outwards]);

  // Generate next outward ID
  useEffect(() => {
    if (outwards.length > 0) {
      const maxNo = Math.max(
        ...outwards.map((o) => {
          const match = o.outwardNo?.match(/OUT-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextOutwardNo((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextOutwardNo("001");
    }
  }, [outwards]);

  // Reset form fields
  const resetForm = () => {
    setOutwardNo("");
    setDate("");
    setTime("");
    setSaleType("Local Sale");
    setPartyName("");
    setAddress("");
    setTruckNo("");
    setDriverName("");
    setFather("");
    setCnic("");
    setMobileNo("");
    setContainerNo1("");
    setContainerNo2("");
    setBatchNo("");
    setForLocation("");
    setFirstWeight("");
    setWeightBridgeName("");
    setWeightBridgeSlipNo("");
    setRemarks("");
    setEditingOutward(null);
    setErrors({});
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    const trimmedOutwardNo = outwardNo.trim();
    const trimmedDate = date.trim();
    const trimmedTime = time.trim();
    const trimmedPartyName = partyName.trim();
    const trimmedAddress = address.trim();
    const trimmedFirstWeight = firstWeight.trim();

    if (!trimmedOutwardNo) newErrors.outwardNo = "Outward No. is required";
    if (!trimmedDate) newErrors.date = "Date is required";
    if (!trimmedTime) newErrors.time = "Time is required";
    if (!trimmedPartyName) newErrors.partyName = "Party Name is required";
    if (!trimmedAddress) newErrors.address = "Address is required";
    if (!trimmedFirstWeight || isNaN(parseFloat(firstWeight)) || parseFloat(firstWeight) <= 0) {
      newErrors.firstWeight = "First Weight must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddOutward = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  const handleEditClick = (outward) => {
    setEditingOutward(outward);
    setOutwardNo(outward.outwardNo || "");
    setDate(outward.date || "");
    setTime(outward.time || "");
    setSaleType(outward.saleType || "Local Sale");
    setPartyName(outward.partyName || "");
    setAddress(outward.address || "");
    setTruckNo(outward.truckNo || "");
    setDriverName(outward.driverName || "");
    setFather(outward.father || "");
    setCnic(outward.cnic || "");
    setMobileNo(outward.mobileNo || "");
    setContainerNo1(outward.containerNo1 || "");
    setContainerNo2(outward.containerNo2 || "");
    setBatchNo(outward.batchNo || "");
    setForLocation(outward.forLocation || "");
    setFirstWeight(outward.firstWeight?.toString() || "");
    setWeightBridgeName(outward.weightBridgeName || "");
    setWeightBridgeSlipNo(outward.weightBridgeSlipNo || "");
    setRemarks(outward.remarks || "");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newOutward = {
      outwardNo: editingOutward ? outwardNo : `OUT-${nextOutwardNo}`,
      date: date.trim(),
      time: time.trim(),
      saleType: saleType.trim(),
      partyName: partyName.trim(),
      address: address.trim(),
      truckNo: truckNo.trim(),
      driverName: driverName.trim(),
      father: father.trim(),
      cnic: cnic.trim(),
      mobileNo: mobileNo.trim(),
      containerNo1: containerNo1.trim(),
      containerNo2: containerNo2.trim(),
      batchNo: batchNo.trim(),
      forLocation: forLocation.trim(),
      firstWeight: parseFloat(firstWeight) || 0,
      weightBridgeName: weightBridgeName.trim(),
      weightBridgeSlipNo: weightBridgeSlipNo.trim(),
      remarks: remarks.trim(),
    };

    try {
      if (editingOutward) {
        setOutwards((prev) =>
          prev.map((o) => (o._id === editingOutward._id ? { ...o, ...newOutward, _id: o._id } : o))
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Gate Outward updated successfully.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        setOutwards((prev) => [...prev, { ...newOutward, _id: `temp-${Date.now()}` }]);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Gate Outward added successfully.",
          confirmButtonColor: "#3085d6",
        });
      }
      fetchOutwards();
      resetForm();
    } catch (error) {
      console.error("Error saving gate outward:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save gate outward.",
        confirmButtonColor: "#d33",
      });
    }
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
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            setOutwards((prev) => prev.filter((o) => o._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Gate Outward deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete gate outward.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Gate Outward is safe 🙂",
            "error"
          );
        }
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = outwards.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(outwards.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Gate Outward Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter Outward No. eg: OUT-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />
            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddOutward}
            >
              + Add Gate Outward
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
            <div className="min-w-[1200px]">
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>Outward No.</div>
                <div>Date</div>
                <div>Time</div>
                <div>Sale Type</div>
                <div>Party Name</div>
                <div>Address</div>
                <div>Truck No.</div>
                <div>Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton
                    rows={recordsPerPage}
                    cols={8}
                    className="lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                  />
                ) : currentRecords.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No gate outwards found.
                  </div>
                ) : (
                  currentRecords.map((outward) => (
                    <div
                      key={outward._id}
                      className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">{outward.outwardNo}</div>
                      <div className="text-gray-600">{outward.date}</div>
                      <div className="text-gray-600">{outward.time}</div>
                      <div className="text-gray-600">{outward.saleType}</div>
                      <div className="text-gray-600">{outward.partyName}</div>
                      <div className="text-gray-600">{outward.address}</div>
                      <div className="text-gray-600">{outward.truckNo}</div>
                      <div className="flex gap-3 justify-start">
                        <button
                          onClick={() => handleEditClick(outward)}
                          className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(outward._id)}
                          className="py-1 text-sm rounded text-red-600 hover:bg-red-50 transition-colors"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between my-4 px-10">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstRecord + 1} to{" "}
                {Math.min(indexOfLastRecord, outwards.length)} of{" "}
                {outwards.length} records
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-newPrimary text-white hover:bg-newPrimary/80"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-newPrimary text-white hover:bg-newPrimary/80"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingOutward ? "Update Gate Outward" : "Add a New Gate Outward"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Outward No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingOutward ? outwardNo : `OUT-${nextOutwardNo}`}
                      readOnly
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.outwardNo
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter outward no."
                      required
                    />
                    {errors.outwardNo && (
                      <p className="text-red-500 text-xs mt-1">{errors.outwardNo}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.date
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.time
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      required
                    />
                    {errors.time && (
                      <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Sale Type
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="Local Sale"
                          checked={saleType === "Local Sale"}
                          onChange={(e) => setSaleType(e.target.value)}
                          className="mr-2"
                        />
                        Local Sale
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="Export"
                          checked={saleType === "Export"}
                          onChange={(e) => setSaleType(e.target.value)}
                          className="mr-2"
                        />
                        Export
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Party Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.partyName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter party name"
                      required
                    />
                    {errors.partyName && (
                      <p className="text-red-500 text-xs mt-1">{errors.partyName}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.address
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter address"
                      required
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Truck No.
                    </label>
                    <input
                      type="text"
                      value={truckNo}
                      onChange={(e) => setTruckNo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter truck no."
                    />
                  </div>
                  
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter driver name"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Father 
                    </label>
                    <input
                      type="text"
                      value={father}
                      onChange={(e) => setFather(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter father "
                    />
                  </div>
                  </div>
                   <div className="flex gap-4">
                   <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      CNIC
                    </label>
                    <input
                      type="text"
                      value={Cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter CNIC"
                    />
                  </div>
                   <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Mobile No.
                    </label>
                    <input
                      type="text"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter mobile no."
                    />
                  </div>
                </div>
                {/* <div className="flex gap-4"> */}
                 
                 
                {/* </div> */}
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Container No. 1
                    </label>
                    <input
                      type="text"
                      value={containerNo1}
                      onChange={(e) => setContainerNo1(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter container no. 1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Container No. 2
                    </label>
                    <input
                      type="text"
                      value={containerNo2}
                      onChange={(e) => setContainerNo2(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter container no. 2"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Batch No.
                    </label>
                    <input
                      type="text"
                      value={batchNo}
                      onChange={(e) => setBatchNo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter batch no."
                    />
                  </div>
                   <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Batch No.
                    </label>
                    <input
                      type="text"
                      value={batchNo}
                      onChange={(e) => setBatchNo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter batch no."
                    />
                  </div>
                 
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      For Location
                    </label>
                    <input
                      type="text"
                      value={forLocation}
                      onChange={(e) => setForLocation(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter for location"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      For Location
                    </label>
                    <input
                      type="text"
                      value={forLocation}
                      onChange={(e) => setForLocation(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter for location"
                    />
                  </div>
                  </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      First Weight <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={firstWeight}
                      onChange={(e) => setFirstWeight(e.target.value)}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.firstWeight
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-newPrimary"
                      }`}
                      placeholder="Enter first weight"
                      min="0"
                      step="0.01"
                      required
                    />
                    {errors.firstWeight && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstWeight}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Weight Bridge Name
                    </label>
                    <input
                      type="text"
                      value={weightBridgeName}
                      onChange={(e) => setWeightBridgeName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter weight bridge name"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Weight Bridge Slip No.
                    </label>
                    <input
                      type="text"
                      value={weightBridgeSlipNo}
                      onChange={(e) => setWeightBridgeSlipNo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter weight bridge slip no."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter remarks"
                    rows="4"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading
                    ? "Saving..."
                    : editingOutward
                    ? "Update Gate Outward"
                    : "Save Gate Outward"}
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

export default GateOutwards;