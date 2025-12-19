import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";
import { HashLoader } from "react-spinners";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
  LineChart,
} from "recharts";

import {
  Users,
  Package,
  UserCheck,
  Calendar,
  CreditCard,
  DollarSign,
  PieChart as PieChartIcon,
  Bell,
  X,
  Sun,
  Moon,
  Cloud,
} from "lucide-react";
import CommanHeader from "../../components/CommanHeader";

import HeaderSkeleton from "./HeaderSkeleton";
import SummaryCardSkeleton from "./SummaryCardSkeleton";
import ChartSkeleton from "./ChartSkeleton";
import DasboardTableSkelton from "./DasboardTableSkelton";

const AdminDashboard = () => {
  const [customers, setCustomers] = useState(0);
  const [items, setItems] = useState(0);
  const [booking, setBooking] = useState(0);
  const [users, setUsers] = useState(0);
  const [sales, setSales] = useState(0);
  const [bookingCompleted, setBookingCompleted] = useState(0);
  const [bookingPending, setBookingPending] = useState(0);
  const [bookingRejected, setBookingRejected] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [recentCustomer, setRecentCustomer] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef(null);
  const [search, setSearch] = useState("");
  const dummyBookings = [
    {
      id: 1,
      customerName: "John Doe",
      mobileNo: "123-456-7890",
      address: "123 Main St, New York",
      items: ["Pizza", "Burger"],
      total: 1200,
      paymentMethod: "Credit Card",
      status: "Approved",
    },
    {
      id: 2,
      customerName: "Alexander Pierce",
      mobileNo: "555-111-2222",
      address: "456 Elm St, Los Angeles",
      items: ["Pasta", "Salad"],
      total: 800,
      paymentMethod: "Cash",
      status: "Pending",
    },
    {
      id: 3,
      customerName: "Bob Doe",
      mobileNo: "987-654-3210",
      address: "789 Oak St, Chicago",
      items: ["Sushi", "Noodles"],
      total: 1500,
      paymentMethod: "PayPal",
      status: "Approved",
    },
    {
      id: 4,
      customerName: "Mike Doe",
      mobileNo: "444-222-3333",
      address: "321 Pine St, Houston",
      items: ["Sandwich", "Juice"],
      total: 600,
      paymentMethod: "Debit Card",
      status: "Denied",
    },
    {
      id: 5,
      customerName: "Mike Doe",
      mobileNo: "444-222-3333",
      address: "321 Pine St, Houston",
      items: ["Sandwich", "Juice"],
      total: 600,
      paymentMethod: "Debit Card",
      status: "Denied",
    },
    {
      id: 6,
      customerName: "Mike Doe",
      mobileNo: "444-222-3333",
      address: "321 Pine St, Houston",
      items: ["Sandwich", "Juice"],
      total: 600,
      paymentMethod: "Debit Card",
      status: "Denied",
    },
    {
      id: 7,
      customerName: "Mike Doe",
      mobileNo: "444-222-3333",
      address: "321 Pine St, Houston",
      items: ["Sandwich", "Juice"],
      total: 600,
      paymentMethod: "Debit Card",
      status: "Denied",
    },
  ];
  const filteredData = dummyBookings.filter(
    (booking) =>
      booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
      booking.mobileNo.toLowerCase().includes(search.toLowerCase())
  );
  const abortRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const base = import.meta.env.VITE_API_BASE_URL;
  const statusColor = {
    Approved: "bg-green-100 text-green-800",
    Pending: "bg-amber-100 text-amber-800",
    Denied: "bg-rose-100 text-rose-800",
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${base}/customers/count`, {
          signal: controller.signal,
        });
        setCustomers(res.data?.totalCustomers ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Customer fetch failed:", err);
      }
    };

    const fetchItems = async () => {
      try {
        const res = await axios.get(`${base}/item-details/count`, {
          signal: controller.signal,
        });
        setItems(res.data?.count ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Items fetch failed:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${base}/company-users/count`, {
          signal: controller.signal,
        });
        setUsers(res.data?.len ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Users fetch failed:", err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${base}/bookings/count`, {
          signal: controller.signal,
        });
        setBooking(res.data?.total ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Bookings fetch failed:", err);
      }
    };
    const fetchNotifcations = async () => {
      try {
        const res = await axios.get(`${base}/notifications`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
          signal: controller.signal,
        });
        setNotifications(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Bookings fetch failed:", err);
      }
    };

    const fetchBookingRecent = async () => {
      try {
        const res = await axios.get(`${base}/bookings/recent`, {
          signal: controller.signal,
        });
        setRecentCustomer(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Bookings fetch failed:", err);
      }
    };

    const fetchBookingCompleted = async () => {
      try {
        const res = await axios.get(`${base}/bookings/completed`, {
          signal: controller.signal,
        });
        setBookingCompleted(res.data?.total ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Bookings fetch failed:", err);
      }
    };

    const fetchBookingPending = async () => {
      try {
        const res = await axios.get(`${base}/bookings/pending`, {
          signal: controller.signal,
        });
        setBookingPending(res.data?.total ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Bookings fetch failed:", err);
      }
    };

    const fetchBookingRejected = async () => {
      try {
        const res = await axios.get(`${base}/bookings/rejected`, {
          signal: controller.signal,
        });
        setBookingRejected(res.data?.total ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Bookings fetch failed:", err);
      }
    };

    const fetchSales = async () => {
      try {
        const res = await axios.get(`${base}/saleInvoices/count`, {
          signal: controller.signal,
        });
        setSales(res.data?.total ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Sales fetch failed:", err);
      }
    };

    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${base}/saleInvoices/total-revenue`, {
          signal: controller.signal,
        });
        setRevenue(res.data?.totalRevenue ?? 0);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Revenue fetch failed:", err);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.allSettled([
        fetchCustomers(),
        fetchItems(),
        fetchUsers(),
        fetchBookings(),
        fetchBookingCompleted(),
        fetchBookingPending(),
        fetchSales(),
        fetchRevenue(),
        fetchNotifcations(),
        fetchBookingRejected(),
        fetchBookingRecent(),
      ]);
      // Add a slight delay to show loading animation
      setTimeout(() => setLoading(false), 1000);
    };

    fetchAll();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    fetchSalesChart("weekly");
  });

  const fetchSalesChart = async (period = "daily") => {
    try {
      const res = await axios.get(
        `${base}/saleInvoices/chart?period=${period}`
      );

      const transformedData = res.data.map((item) => {
        const date = new Date(item._id);
        let name;

        if (period === "daily" || period === "weekly") {
          const month = date.toLocaleString("default", { month: "short" });
          const day = date.getDate();
          name = `${month} ${day}`;
        } else if (period === "monthly") {
          name = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
        } else if (period === "yearly") {
          name = date.getFullYear();
        }

        return {
          name,
          sales: item.count,
          revenue: item.totalAmount || (Math.random() * 1000).toFixed(2),
        };
      });

      setChartData(transformedData);
    } catch (err) {
      console.error("Sales chart fetch failed:", err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Mark single notification as read
  const clearNotification = async (id) => {
    try {
      await axios.put(`${base}/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Clear failed:", err);
    }
  };

  // ✅ Mark all notifications as read
  const clearAll = async () => {
    try {
      await axios.put(`${base}/notifications/mark-all`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setNotifications([]);
    } catch (err) {
      console.error("Clear all failed:", err);
    }
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get appropriate icon based on time of day
  const getGreetingIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return <Sun className="text-amber-500" size={24} />;
    if (hour < 17) return <Cloud className="text-blue-400" size={24} />;
    return <Moon className="text-indigo-500" size={24} />;
  };
  const data = [
    { day: "22th", thisWeek: 100, lastWeek: 60 },
    { day: "23th", thisWeek: 120, lastWeek: 80 },
    { day: "24th", thisWeek: 160, lastWeek: 70 },
    { day: "25th", thisWeek: 155, lastWeek: 65 },
    { day: "26th", thisWeek: 170, lastWeek: 75 },
    { day: "27th", thisWeek: 177, lastWeek: 77 },
    { day: "28th", thisWeek: 150, lastWeek: 90 },
  ];

  const summaryData = [
    {
      name: "Total Customers",
      value: customers,
      icon: <Users size={24} />,
      change: "+12%",
      color: "bg-blue-100 text-blue-600",
      border: "border-l-4 border-blue-700",
    },
    {
      name: "Total Products",
      value: items,
      icon: <Package size={24} />,
      change: "+5%",
      color: "bg-green-100 text-green-600",
      border: "border-l-4 border-green-400",
    },
    {
      name: "Total Staff",
      value: users,
      icon: <UserCheck size={24} />,
      change: "+2%",
      color: "bg-purple-100 text-purple-600",
      border: "border-l-4 border-purple-400",
    },
    {
      name: "Total Sales",
      value: sales,
      icon: <CreditCard size={24} />,
      change: "+18%",
      color: "bg-amber-100 text-amber-600",
      border: "border-l-4 border-amber-500",
    },
    // {
    //   name: "Total Revenue",
    //   value: `$${revenue.toLocaleString()}`,
    //   icon: <DollarSign size={24} />,
    //   change: "+15%",
    //   color: "bg-emerald-100 text-emerald-600",
    //   border: "border-l-4 border-emerald-500",
    // },
    {
      name: "Bookings",
      value: booking,
      icon: <Calendar size={24} />,
      change: "-3%",
      color: "bg-rose-100 text-rose-600",
      border: "border-l-4 border-rose-400",
    },
  ];

  const pieData = [
    { month: "JUN", thisYear: 1000, lastYear: 600 },
    { month: "JUL", thisYear: 2000, lastYear: 1800 },
    { month: "AUG", thisYear: 3000, lastYear: 2800 },
    { month: "SEP", thisYear: 2500, lastYear: 2000 },
    { month: "OCT", thisYear: 2700, lastYear: 1900 },
    { month: "NOV", thisYear: 2600, lastYear: 1500 },
    { month: "DEC", thisYear: 3000, lastYear: 2000 },
  ];
  const statusColors = {
    Completed: "bg-green-100 text-green-800",
    Pending: "bg-amber-100 text-amber-800",
    Refunded: "bg-rose-100 text-rose-800",
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow rounded text-sm">
          <p className="font-semibold">{label}</p>
          <p style={{ color: "#2563eb" }}>High - 2023: {payload[0]?.value}</p>
          <p style={{ color: "#6b7280" }}>Low - 2023: {payload[1]?.value}</p>
        </div>
      );
    }
    return null;
  };

  // if (loading) {
  //   return (
  //     <div className="flex flex-col justify-center items-center h-[80vh]">
  //       <HashLoader color="#84CF16" />
  //       <span className="ml-4 text-gray-500 mt-4">Loading ERP...</span>
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      {/* Updated Header - Replaced Search Bar */}
      {loading ? <HeaderSkeleton /> : <CommanHeader />}
      {/* Summary Cards Grid */}
      {loading ? (
        <SummaryCardSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
          {summaryData.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl border border-gray-200/60 hover:border-gray-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{
                animation: `slideIn 0.5s ease-out ${index * 0.06}s both`,
              }}
            >
              {/* Professional top accent border */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  item.change.includes("+")
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                    : "bg-gradient-to-r from-rose-500 to-rose-400"
                }`}
              ></div>

              {/* Subtle background texture */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Status badge - Professional style */}
              <div
                className={`absolute top-3 right-3 z-10 backdrop-blur-sm ${
                  item.change.includes("+")
                    ? "bg-emerald-500/10 border border-emerald-200/50"
                    : "bg-rose-500/10 border border-rose-200/50"
                } rounded-lg px-2.5 py-1.5`}
              >
                <span
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    item.change.includes("+")
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }`}
                >
                  {item.change.includes("+") ? (
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {item.change}
                </span>
              </div>

              <div className="relative p-5 z-20">
                {/* Icon and value section */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className={`p-3 rounded-xl ${
                      item.change.includes("+") ? "bg-emerald-50" : "bg-rose-50"
                    } border ${
                      item.change.includes("+")
                        ? "border-emerald-100"
                        : "border-rose-100"
                    } group-hover:scale-105 transition-transform duration-300`}
                  >
                    <div
                      className={`w-6 h-6 ${
                        item.change.includes("+")
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-gray-900 mb-0.5">
                      {item.value}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {item.name}
                    </div>
                  </div>
                </div>

                {/* Progress indicator - Professional style */}
                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-400">
                      TREND
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(100, 15 + index * 14)}%`,
                        background: item.change.includes("+")
                          ? "linear-gradient(90deg, #059669, #10b981)"
                          : "linear-gradient(90deg, #dc2626, #ef4444)",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  item.change.includes("+")
                    ? "bg-gradient-to-br from-emerald-50/20 via-transparent to-transparent"
                    : "bg-gradient-to-br from-rose-50/20 via-transparent to-transparent"
                }`}
              ></div>
            </div>
          ))}
        </div>
      )}
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Overview Skeleton */}
            <ChartSkeleton type="sales" count={1} />

            {/* Summary with Circle Progress Skeleton */}
            <ChartSkeleton type="summary" count={1} />

            {/* Customer Progress Skeleton */}
            <ChartSkeleton type="progress" count={1} />
          </div>
        ) : (
          <>
            {/* Charts and Tables Section */}
            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 1. Sales Chart (8 Months View) */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Sales Overview
                    </h2>
                    <p className="text-sm text-gray-500">
                      February to August 2024
                    </p>
                  </div>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
                    <option>Last 7 months</option>
                    <option>Last 8 months</option>
                    <option>This year</option>
                  </select>
                </div>

                {/* Chart Container with Y-axis */}
                <div className="h-full">
                  <div className="flex items-start h-60">
                    {/* Y-axis Labels */}
                    <div className="w-8 mr-2 flex flex-col justify-between h-full text-xs text-gray-400">
                      <span>100K</span>
                      <span>75K</span>
                      <span>50K</span>
                      <span>25K</span>
                      <span>0</span>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 flex items-end justify-between h-full">
                      {[
                        {
                          month: "Feb",
                          value: 65,
                          color:
                            "bg-gradient-to-t from-emerald-400 to-newPrimary",
                        },
                        {
                          month: "Mar",
                          value: 80,
                          color:
                            "bg-gradient-to-t from-emerald-400 to-newPrimary",
                        },
                        {
                          month: "Apr",
                          value: 75,
                          color:
                            "bg-gradient-to-t from-emerald-400 to-newPrimary",
                        },
                        {
                          month: "May",
                          value: 55,
                          color:
                            "bg-gradient-to-t from-emerald-400 to-newPrimary",
                        },
                        {
                          month: "Jun",
                          value: 90,
                          color:
                            "bg-gradient-to-t from-emerald-400 to-newPrimary",
                        },
                        {
                          month: "Jul",
                          value: 60,
                          color:
                            "bg-gradient-to-t from-emerald-400 to-newPrimary",
                        },
                        {
                          month: "Aug",
                          value: 85,
                          color:
                            "bg-gradient-to-t from-emerald-400 to-newPrimary",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1 h-full"
                        >
                          {/* Bar Container */}
                          <div className="h-full flex flex-col justify-end items-center relative group">
                            {/* Bar Value Label (shown on hover) */}
                            <div className="mb-1 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                              ${item.value}K
                            </div>

                            {/* Bar */}
                            <div
                              className={`${item.color} lg:w-9 rounded-t-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2 cursor-pointer`}
                              style={{ height: `${item.value}%` }}
                            ></div>
                          </div>

                          {/* Month Label */}
                          <span className="text-xs font-medium text-gray-600 mt-2">
                            {item.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chart Stats */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="text-xl font-bold text-gray-900">$510K</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Average Monthly</p>
                      <p className="text-lg font-bold text-gray-900">$72.9K</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Growth</p>
                      <p className="text-lg font-semibold text-green-600">
                        +12.8%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Summary with Circle Progress */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-100 items-center justify-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-blue-200/50 pb-3">
                  Project Summary
                </h2>

                <div className="flex items-center justify-center mt-10">
                  {/* Left: Circular Progress with Gradient */}
                  <div className="relative w-[250] h-[250px]">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e0e7ff"
                        strokeWidth="10"
                      />
                      {/* Progress Circle with Gradient */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="251.2"
                        strokeDashoffset="75.36"
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient
                          id="progressGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-semibold text-gray-900">
                        70%
                      </span>
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                  </div>

                  {/* Right: Status List */}
                  <div className="ml-6 flex-1">
                    {[
                      {
                        label: "In Progress",
                        value: 12,
                        color: "bg-gradient-to-r from-blue-500 to-blue-600",
                        textColor: "text-blue-700",
                      },
                      {
                        label: "Completed",
                        value: 28,
                        color: "bg-gradient-to-r from-green-500 to-emerald-600",
                        textColor: "text-green-700",
                      },
                      {
                        label: "Pending",
                        value: 8,
                        color: "bg-gradient-to-r from-yellow-500 to-amber-600",
                        textColor: "text-amber-700",
                      },
                      {
                        label: "On Hold",
                        value: 4,
                        color: "bg-gradient-to-r from-red-500 to-rose-600",
                        textColor: "text-rose-700",
                      },
                      {
                        label: "Not Started",
                        value: 6,
                        color: "bg-gradient-to-r from-gray-400 to-gray-500",
                        textColor: "text-gray-700",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between hover:bg-white/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className={`mb-3 mt-3 w-3 h-3 ${item.color} rounded-full mr-3 shadow-sm`}
                          ></div>
                          <span
                            className={`mb-3 mt-3 text-sm font-medium ${item.textColor}`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm mb-3 mt-3 font-bold text-gray-900 px-2 py-1 rounded">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Footer */}
                <div className="mt-6 pt-4 border-t border-blue-200/50">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-gray-900 text-lg">58</span>{" "}
                    total projects
                  </p>
                </div>
              </div>

              {/* 3. Customer Progress */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-start items-center mb-6 border-b border-blue-200/50 pb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Customer Progress
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "Nestle Pakistan",
                      progress: 85,
                      status: "Order fulfillment in progress",
                      color: "bg-blue-500",
                    },
                    {
                      name: "Unilever Ltd",
                      progress: 65,
                      status: "Product delivery scheduled",
                      color: "bg-green-500",
                    },
                    {
                      name: "PepsiCo Inc",
                      progress: 45,
                      status: "Contract negotiation phase",
                      color: "bg-yellow-500",
                    },
                    {
                      name: "Engro Foods",
                      progress: 92,
                      status: "Project nearing completion",
                      color: "bg-purple-500",
                    },
                  ].map((customer, index) => (
                    <div
                      key={index}
                      className=" border-gray-100 last:border-0 last:pb-0"
                    >
                      {/* Customer Name */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900">
                          {customer.name}
                        </h3>
                        <span className="text-sm font-semibold text-gray-700">
                          {customer.progress}%
                        </span>
                      </div>

                      {/* Progress Line */}
                      <div className="w-full bg-white rounded-full h-2.5 mb-2 shadow-inner">
                        <div
                          className={`${customer.color} h-2.5 rounded-full shadow-md`}
                          style={{ width: `${customer.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Stats */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-600">Active Customers</p>
                      <p className="font-semibold text-gray-900">24</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Satisfaction</p>
                      <p className="font-semibold text-green-600">94%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        {/* Header with Search */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h2 className="text-md font-semibold text-gray-700">
            Recent Booking Customers
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-2 top-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Scrollable Table with Fixed Header */}
        <div className="overflow-y-auto max-h-72">
          <div className="min-w-[1000px] text-sm">
            {/* Table Header */}
            <div className="grid grid-cols-7 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200 sticky top-0 z-10">
              <div>Customer Name</div>
              <div>Mobile No.</div>
              <div>Address</div>
              <div>Items</div>
              <div>Total</div>
              <div>Payment Method</div>
              <div>Status</div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col divide-y divide-gray-200">
              {loading ? (
                <DasboardTableSkelton rows={filteredData.length} cols={7} />
              ) : (
                filteredData.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="grid grid-cols-7 items-center px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                  >
                    <div className="font-medium text-gray-700">
                      {booking.customerName}
                    </div>
                    <div className="text-gray-600">{booking.mobileNo}</div>
                    <div className="text-gray-600 truncate">
                      {booking.address}
                    </div>
                    <div className="text-gray-600 truncate">
                      {booking.items.join(", ")}
                    </div>
                    <div className="text-gray-600">Rs.{booking.total}</div>
                    <div className="text-gray-600">{booking.paymentMethod}</div>
                    <div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          statusColor[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* No Data State */}
        {filteredData.length === 0 && !loading && (
          <div className="text-center py-6 text-gray-500">
            No recent transactions found.
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
