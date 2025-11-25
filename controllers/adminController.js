import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";

export const getAdminStats = async (req, res) => {
  try {
    // ===========================
    // 🧾 PRODUCTS STATS
    // ===========================
    const totalProducts = await Product.countDocuments();
    const hiddenProducts = await Product.countDocuments({ visible: false });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 5 } });
    const bestsellerCount = await Product.countDocuments({ bestseller: true });

    // ===========================
    // 📦 ORDER STATS
    // ===========================
    const totalOrders = await Order.countDocuments();
    const processingOrders = await Order.countDocuments({ orderStatus: "Processing" });
    const completedOrders = await Order.countDocuments({ orderStatus: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "Cancelled" });

    // Total revenue (sum of all delivered order total)
    const revenueData = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // ===========================
    // 💹 MONTHLY SALES (LAST 6 MONTHS)
    // ===========================
    const monthlySalesRaw = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const currentMonth = new Date().getMonth();
    const last6Months = Array.from({ length: 6 }, (_, i) =>
      (currentMonth - 5 + i + 12) % 12
    ).map((m) => monthNames[m]);

    const monthlySales = last6Months.map((m) => ({
      month: m,
      total:
        monthlySalesRaw.find((x) => monthNames[x._id - 1] === m)?.total || 0,
    }));

    // ===========================
    // 👥 USER STATS
    // ===========================
    const totalUsers = await User.countDocuments();
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // ===========================
    // 🎟️ COUPON STATS
    // ===========================
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({
      expiry: { $gte: new Date() },
    });

    // ===========================
    // 🧠 TOP PRODUCTS BY DEMAND
    // ===========================
    const topProductsRaw = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          name: { $first: "$orderItems.name" },
          totalSold: { $sum: "$orderItems.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // ===========================
    // 🆕 RECENT 5 ORDERS
    // ===========================
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email") // return clean user info
      .select("orderStatus totalAmount createdAt");

    // ===========================
    // 🆕 RECENT 5 USERS
    // ===========================
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    // ===========================
    // 📊 FINAL RESPONSE
    // ===========================
    res.json({
      products: {
        total: totalProducts,
        hidden: hiddenProducts,
        lowStock: lowStockProducts,
        bestsellerCount,
      },
      orders: {
        total: totalOrders,
        processing: processingOrders,
        delivered: completedOrders,
        cancelled: cancelledOrders,
        revenue: totalRevenue,
        monthlySales,
      },
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
      },
      coupons: {
        total: totalCoupons,
        active: activeCoupons,
      },
      topProducts: topProductsRaw,
      recentOrders,
      recentUsers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
};
