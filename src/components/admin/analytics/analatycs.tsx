'use client'
import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import {
  getSalesMetrics,
  getTopSellingProducts,
  getLowStockProducts,
  getOrdersWithPaymentStatus,
  getFilterOptions,
  SalesMetrics,
  TopSellingProduct,
  ProductInventory,
  OrderSummary,
  SalesMetricsFilter,
} from "@/server/actions/admin-report-actions";
import Image from "next/image";
import { exportOverviewPDF, exportProductsPDF, exportOrdersPDF } from "./analytic-pdf";
import { Button } from "@/components/ui/button";

interface FilterState {
  status:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "";
  paymentMethod: "COD" | "ONLINE" | "";
  brandId: string;
  categoryId: string;
  startDate?: Date;
  endDate?: Date;
}

function AnalyticsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState("30d");
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<ProductInventory[]>(
    []
  );
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [filterOptions, setFilterOptions] = useState<{
    brands: Array<{ id: string; name: string }>;
    categories: Array<{ id: string; name: string }>;
    subCategories: Array<{ id: string; name: string; categoryId: string }>;
  }>({ brands: [], categories: [], subCategories: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    paymentMethod: "",
    brandId: "",
    categoryId: "",
  });
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  // Date range calculation
  const getDateRange = useCallback(
    (range: string) => {
      const now = new Date();
      const startDate = new Date();

      switch (range) {
        case "7d":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(now.getDate() - 90);
          break;
        case "1y":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          return filters.startDate && filters.endDate
            ? { startDate: filters.startDate, endDate: filters.endDate }
            : { startDate, endDate: now };
      }

      return { startDate, endDate: now };
    },
    [filters.startDate, filters.endDate]
  );

  // Fetch sales metrics
  const fetchSalesMetrics = useCallback(async () => {
    try {
      const dateRange = getDateRange(selectedDateRange);
      const metricsFilter: SalesMetricsFilter = {
        ...dateRange,
        status: filters.status || undefined,
        paymentMethod: filters.paymentMethod || undefined,
      };

      const metrics = await getSalesMetrics(metricsFilter);
      setSalesMetrics(metrics);
    } catch (error) {
      console.error("Error fetching sales metrics:", error);
    }
  }, [selectedDateRange, filters.status, filters.paymentMethod, getDateRange]);

  // Fetch top selling products
  const fetchTopProducts = useCallback(async () => {
    try {
      const dateRange = getDateRange(selectedDateRange);
      const products = await getTopSellingProducts(10, dateRange);
      setTopProducts(products);
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
  }, [selectedDateRange, getDateRange]);

  // Fetch low stock products
  const fetchLowStockProducts = useCallback(async () => {
    try {
      const products = await getLowStockProducts(lowStockThreshold);
      setLowStockProducts(products);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
    }
  }, [lowStockThreshold]);

  // Fetch recent orders
  const fetchRecentOrders = useCallback(async () => {
    try {
      const dateRange = getDateRange(selectedDateRange);
      const ordersFilter: SalesMetricsFilter = {
        ...dateRange,
        status: filters.status || undefined,
        paymentMethod: filters.paymentMethod || undefined,
      };

      const orders = await getOrdersWithPaymentStatus(ordersFilter);
      setRecentOrders(orders.slice(0, 10)); // Show latest 10 orders
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  }, [selectedDateRange, filters.status, filters.paymentMethod, getDateRange]);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSalesMetrics(),
        fetchTopProducts(),
        fetchLowStockProducts(),
        fetchRecentOrders(),
        fetchFilterOptions(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [
    fetchSalesMetrics,
    fetchTopProducts,
    fetchLowStockProducts,
    fetchRecentOrders,
    fetchFilterOptions,
  ]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Refresh data when filters change
  useEffect(() => {
    if (filterOptions.brands.length > 0) {
      // Only refetch if initial data is loaded
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateRange, filters]);

  const dateRangeOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" },
    { value: "custom", label: "Custom range" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-50 border-green-200";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "FAILED":
        return "text-red-600 bg-red-50 border-red-200";
      case "SHIPPED":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "DELIVERED":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "CANCELLED":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (loading && !salesMetrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mx-auto p-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor your store performance and insights
              </p>
            </div>
            <Button
              onClick={fetchAllData}
              disabled={loading}
              variant="default"
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center space-x-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value as FilterState["status"],
                  }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    paymentMethod: e.target
                      .value as FilterState["paymentMethod"],
                  }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Methods</option>
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "products", label: "Products", icon: Package },
                { id: "orders", label: "Orders", icon: ShoppingCart },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="ghost"
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm rounded-none ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                 <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Overview Summary</h3>
                  <Button
                    onClick={() => exportOverviewPDF(salesMetrics, lowStockProducts, selectedDateRange)}
                    variant="destructive"
                    className="gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF
                  </Button>
                </div>
                {/* Sales Metrics */}
                {salesMetrics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            Total Revenue
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatCurrency(salesMetrics.totalRevenue)}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            Total Orders
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {salesMetrics.totalOrders.toLocaleString()}
                          </p>
                        </div>
                        <ShoppingCart className="h-8 w-8 text-green-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">
                            Avg Order Value
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            {formatCurrency(salesMetrics.averageOrderValue)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">
                            Low Stock Items
                          </p>
                          <p className="text-2xl font-bold text-orange-900">
                            {lowStockProducts.length}
                          </p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-orange-600" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Low Stock Alert
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lowStockProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                        >
                          <div className="flex items-center space-x-3">
                            <Image
                              src={product.image}
                              alt={product.name}
                              height={48}
                              width={48}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.brand}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-semibold text-orange-600">
                                  {product.currentStock} left
                                </span>
                                <span className="text-sm text-gray-600">
                                  {formatCurrency(product.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Selling Products
                </h3>
                <Button
                  onClick={() => exportProductsPDF(topProducts, selectedDateRange, lowStockThreshold)}
                  variant="destructive"
                  className="gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </Button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Quantity Sold
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Revenue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Stock
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {topProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  height={48}
                                  width={48}
                                  className="rounded-lg object-cover"
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.brand} • {product.category}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.totalQuantitySold.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(product.totalRevenue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  product.currentStock <= lowStockThreshold
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {product.currentStock} units
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Orders
                </h3>
                <Button
                  onClick={() => exportOrdersPDF(recentOrders, selectedDateRange)}
                  variant="destructive"
                  className="gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </Button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Payment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {order.userName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.userEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(order.totalAmount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {order.paymentMethod}
                              </div>
                              {order.razorpayPaymentId && (
                                <div className="text-xs text-gray-500">
                                  ID: {order.razorpayPaymentId}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;