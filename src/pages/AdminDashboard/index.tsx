import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { BsCurrencyDollar, BsPeople, BsCart3 } from 'react-icons/bs';

import { formatCurrency, formatNumber } from '@/utils';
import userService from '@/apis/user';
import { getAllOrders } from '@/apis/order';
import type { OrderInfo } from '@/types/order';
import { filterUsersByRoleCode } from '@/utils/user';
import { calculateDashboardStats, type DashboardStats } from '@/utils/order';

interface AdminDashboardProps {
  stats?: DashboardStats;
}

const AdminDashboard = ({
  stats: initialStats = {
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    weeklySales: [0, 0, 0, 0, 0, 0, 0],
    yearlySales: [0, 0, 0, 0, 0],
  },
}: AdminDashboardProps) => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const weeklyChartRef = useRef<Chart | null>(null);
  const yearlyChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersResponse = await userService.listUsers();
        const filteredUsers = filterUsersByRoleCode(
          1,
          usersResponse.users || [],
        );
        const totalUsers = filteredUsers.length;

        const ordersResponse = await getAllOrders();
        const orders: OrderInfo[] = Array.isArray(ordersResponse.orders)
          ? ordersResponse.orders
          : [];

        const orderStats = calculateDashboardStats(orders);

        setStats({
          totalRevenue: orderStats.totalRevenue,
          totalUsers,
          totalOrders: orderStats.totalOrders,
          weeklySales: orderStats.weeklySales,
          yearlySales: orderStats.yearlySales,
        });
      } catch (error: unknown) {
        console.error('[AdminDashboard] Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (weeklyChartRef.current) {
      weeklyChartRef.current.destroy();
    }
    if (yearlyChartRef.current) {
      yearlyChartRef.current.destroy();
    }

    const ctxWeekly = (
      document.getElementById('weeklySalesChart') as HTMLCanvasElement
    )?.getContext('2d');
    const ctxYearly = (
      document.getElementById('yearlySalesChart') as HTMLCanvasElement
    )?.getContext('2d');

    if (ctxWeekly) {
      weeklyChartRef.current = new Chart(ctxWeekly, {
        type: 'bar',
        data: {
          labels: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
          datasets: [
            {
              label: 'Doanh thu hàng tuần',
              data: stats.weeklySales,
              backgroundColor: 'rgba(40, 167, 69, 0.8)',
              borderColor: 'rgba(40, 167, 69, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Báo cáo doanh thu hàng tuần',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value.toLocaleString('vi-VN') + 'đ';
                },
              },
            },
          },
        },
      });
    }

    if (ctxYearly) {
      const currentYear = new Date().getFullYear();
      const years = [
        currentYear - 4,
        currentYear - 3,
        currentYear - 2,
        currentYear - 1,
        currentYear,
      ];

      yearlyChartRef.current = new Chart(ctxYearly, {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Doanh thu hàng năm',
              data: stats.yearlySales,
              borderColor: 'rgba(128, 0, 128, 1)',
              backgroundColor: 'rgba(128, 0, 128, 0.1)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Tổng quan doanh số hàng năm',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value.toLocaleString('vi-VN') + 'đ';
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (weeklyChartRef.current) {
        weeklyChartRef.current.destroy();
      }
      if (yearlyChartRef.current) {
        yearlyChartRef.current.destroy();
      }
    };
  }, [stats]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-4xl font-medium mb-8 pl-2">Dashboard</h2>

      <main className="bg-gray-100 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-lg flex items-center gap-5 shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="w-15 h-15 rounded-full bg-green-50 flex items-center justify-center">
              <BsCurrencyDollar className="text-2xl text-green-700" />
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Tổng doanh thu</h3>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg flex items-center gap-5 shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="w-15 h-15 rounded-full bg-blue-50 flex items-center justify-center">
              <BsPeople className="text-2xl text-blue-700" />
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Tổng số người dùng</h3>
              <p className="text-2xl font-bold">
                {formatNumber(stats.totalUsers)}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg flex items-center gap-5 shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="w-15 h-15 rounded-full bg-purple-50 flex items-center justify-center">
              <BsCart3 className="text-2xl text-purple-700" />
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Tổng đơn hàng</h3>
              <p className="text-2xl font-bold">
                {formatNumber(stats.totalOrders)}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">Doanh thu trong tuần</h3>
            <div className="w-full h-[300px]">
              <canvas id="weeklySalesChart" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">Doanh thu hàng năm</h3>
            <div className="w-full h-[300px]">
              <canvas id="yearlySalesChart" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
