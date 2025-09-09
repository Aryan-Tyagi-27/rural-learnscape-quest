import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useOffline } from "@/hooks/useOffline";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const OfflineIndicator = () => {
  const isOffline = useOffline();
  
  if (!isOffline) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="destructive" className="flex items-center space-x-2">
        <WifiOff className="h-3 w-3" />
        <span>Offline Mode</span>
      </Badge>
    </div>
  );
};

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Auth />;
  }
  
  return (
    <Routes>
      <Route path="/" element={profile?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OfflineIndicator />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
