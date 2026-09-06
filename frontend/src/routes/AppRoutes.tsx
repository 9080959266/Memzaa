import React from 'react';
import { Notifications } from '../pages/customer/Notifications';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../components/common/CustomerLayout';
import { ShopOwnerLayout } from '../components/shopOwner/ShopOwnerLayout';
import { AdminLayout } from '../components/admin/AdminLayout';

// Customer Pages
import { Home } from '../pages/customer/Home';
import { Studios } from '../pages/customer/Studios';
import { StudioDetail } from '../pages/customer/StudioDetail';
import { CompareStudios } from '../pages/customer/CompareStudios';
import { Categories } from '../pages/customer/Categories';
import { Products } from '../pages/customer/Products';
import { ProductDetail } from '../pages/customer/ProductDetail';
import { Cart } from '../pages/customer/Cart';
import { Checkout } from '../pages/customer/Checkout';
import { Orders } from '../pages/customer/Orders';
import { OrderDetail } from '../pages/customer/OrderDetail';
import { Bookings } from '../pages/customer/Bookings';
import { Proofs } from '../pages/customer/Proofs';
import { Invoices } from '../pages/customer/Invoices';
import { Wishlist } from '../pages/customer/Wishlist';
import { Profile } from '../pages/customer/Profile';
import { MyPhotos } from '../pages/customer/MyPhotos';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

// Shop Owner Pages
import { ShopOwnerDashboard } from '../pages/shopOwner/ShopOwnerDashboard';
import { ShopOwnerKanban } from '../pages/shopOwner/ShopOwnerKanban';
import { ShopOwnerStudio } from '../pages/shopOwner/ShopOwnerStudio';
import { ShopOwnerPackages } from '../pages/shopOwner/ShopOwnerPackages';
import { ShopOwnerBookings } from '../pages/shopOwner/ShopOwnerBookings';
import { ShopOwnerProofs } from '../pages/shopOwner/ShopOwnerProofs';
import { ShopOwnerInventory } from '../pages/shopOwner/ShopOwnerInventory';
import { ShopOwnerRevenue } from '../pages/shopOwner/ShopOwnerRevenue';
import { ShopOwnerOrders } from '../pages/shopOwner/ShopOwnerOrders';
import { ShopOwnerCustomers } from '../pages/shopOwner/ShopOwnerCustomers';
import { ShopOwnerReviews } from '../pages/shopOwner/ShopOwnerReviews';
import { ShopOwnerProduction } from '../pages/shopOwner/ShopOwnerProduction';
import { ShopOwnerProducts } from '../pages/shopOwner/ShopOwnerProducts';
import { ShopOwnerStaff } from '../pages/shopOwner/ShopOwnerStaff';
import { ShopOwnerOffers } from '../pages/shopOwner/ShopOwnerOffers';
import { ShopOwnerReports } from '../pages/shopOwner/ShopOwnerReports';
import { ShopOwnerSettings } from '../pages/shopOwner/ShopOwnerSettings';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminStudios } from '../pages/admin/AdminStudios';
import { AdminCategories } from '../pages/admin/AdminCategories';
import { AdminCoupons } from '../pages/admin/AdminCoupons';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminComplaints } from '../pages/admin/AdminComplaints';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminBookings } from '../pages/admin/AdminBookings';
import { AdminOrders } from '../pages/admin/AdminOrders';
import { AdminPayments } from '../pages/admin/AdminPayments';
import { AdminReviews } from '../pages/admin/AdminReviews';
import { AdminProducts } from '../pages/admin/AdminProducts';
import { AdminPackages } from '../pages/admin/AdminPackages';
import { AdminDeliveries } from '../pages/admin/AdminDeliveries';
import { AdminCommission } from '../pages/admin/AdminCommission';
import { AdminSettings } from '../pages/admin/AdminSettings';

import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'customer' | 'shop_owner' | 'admin' }> = ({
  children,
  requiredRole,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public / Customer Layout */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/studios" element={<Studios />} />
        <Route path="/studios/:id" element={<StudioDetail />} />
        <Route path="/compare" element={<CompareStudios />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-photos" element={<MyPhotos />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Customer Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proofs"
          element={
            <ProtectedRoute>
              <Proofs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Standalone Printable Invoice */}
      <Route path="/invoices/:id" element={<Invoices />} />

      {/* Shop Owner Seller Portal */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute requiredRole="shop_owner">
            <ShopOwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ShopOwnerDashboard />} />
        <Route path="kanban" element={<ShopOwnerKanban />} />
        <Route path="orders" element={<ShopOwnerOrders />} />
        <Route path="bookings" element={<ShopOwnerBookings />} />
        <Route path="proofs" element={<ShopOwnerProofs />} />
        <Route path="production" element={<ShopOwnerProduction />} />
        <Route path="studio" element={<ShopOwnerStudio />} />
        <Route path="packages" element={<ShopOwnerPackages />} />
        <Route path="products" element={<ShopOwnerProducts />} />
        <Route path="inventory" element={<ShopOwnerInventory />} />
        <Route path="staff" element={<ShopOwnerStaff />} />
        <Route path="offers" element={<ShopOwnerOffers />} />
        <Route path="customers" element={<ShopOwnerCustomers />} />
        <Route path="reviews" element={<ShopOwnerReviews />} />
        <Route path="reports" element={<ShopOwnerReports />} />
        <Route path="revenue" element={<ShopOwnerRevenue />} />
        <Route path="settings" element={<ShopOwnerSettings />} />
      </Route>

      {/* Super Admin Master Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="studios" element={<AdminStudios />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="commission" element={<AdminCommission />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="deliveries" element={<AdminDeliveries />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />

      </Route><Route path="/notifications" element={<Notifications />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
