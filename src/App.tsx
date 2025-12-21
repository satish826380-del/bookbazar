import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import BookDetails from "./pages/BookDetails";
import PlaceOrder from "./pages/PlaceOrder";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellBook from "./pages/seller/SellBook";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./components/layout/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminOrders from "./pages/admin/AdminOrders";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/book/:id" element={<BookDetails />} />
            {/* Buyer/Logged-in Routes */}
            <Route element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']} />}>
              <Route path="/order/:bookId" element={<PlaceOrder />} />
              <Route path="/buyer" element={<BuyerDashboard />} />
            </Route>

            {/* Seller Routes */}
            <Route element={<ProtectedRoute allowedRoles={['seller', 'admin']} />}>
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/sell" element={<SellBook />} />
            </Route>



            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminHome />} />
                <Route path="books" element={<AdminBooks />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
