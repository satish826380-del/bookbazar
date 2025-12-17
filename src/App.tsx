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
            <Route path="/order/:bookId" element={<PlaceOrder />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/sell" element={<SellBook />} />
            <Route path="/buyer" element={<BuyerDashboard />} />
            
            {/* Admin Routes - Hidden, accessible only via direct URL */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="books" element={<AdminBooks />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
