
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Verification from "./pages/auth/Verification";
import Dashboard from "./pages/dashboard/Dashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import TeachersPage from "./pages/TeachersPage";
import TeacherDetailPage from "./pages/TeacherDetailPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import BookingPage from "./pages/BookingPage";
import BookingPaymentPage from "./pages/BookingPaymentPage";
import MessagesPage from "./pages/MessagesPage";
import MessageDetailPage from "./pages/MessageDetailPage";
import StudentLearningGoalsPage from "./pages/student/StudentLearningGoalsPage";
import PaymentsPage from "./pages/payment/PaymentsPage";
import CheckoutPage from "./pages/payment/CheckoutPage";
import AddPaymentMethodPage from "./pages/payment/AddPaymentMethodPage";

const queryClient = new QueryClient();

// Create the App component as a function component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/update-password" element={<UpdatePassword />} />
              <Route path="/auth/verification" element={<Verification />} />
              
              {/* Teachers Browse Routes */}
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/teachers/:id" element={<TeacherDetailPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Booking Routes */}
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/booking/payment/:id" element={<BookingPaymentPage />} />
                
                {/* Messages Routes */}
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/messages/:userId" element={<MessageDetailPage />} />
                
                {/* Payment Routes */}
                <Route path="/payment" element={<PaymentsPage />} />
                <Route path="/payment/checkout" element={<CheckoutPage />} />
                <Route path="/payment/add-method" element={<AddPaymentMethodPage />} />
              </Route>
              
              {/* Student Routes */}
              <Route element={<ProtectedRoute requiredRole="student" />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/learning-goals" element={<StudentLearningGoalsPage />} />
              </Route>
              
              {/* Teacher Routes */}
              <Route element={<ProtectedRoute requiredRole="teacher" />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              </Route>
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              </Route>
              
              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
