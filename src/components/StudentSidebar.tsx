import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FlaskConical, 
  BookOpen, 
  Trophy, 
  Target, 
  Users, 
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StudentSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const StudentSidebar = ({ currentView, setCurrentView }: StudentSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "lab", label: "Virtual Lab", icon: FlaskConical },
    { id: "quizzes", label: "Quizzes", icon: Target },
    { id: "rewards", label: "Rewards", icon: Trophy },
    { id: "classmates", label: "Classmates", icon: Users },
  ];

  return (
    <div className="w-80 bg-sidebar-dark text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-white/90 tracking-wider">
            STUDENT PORTAL
          </h1>
        </div>
        
        {/* User Profile */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-16 h-16 bg-white">
            <AvatarFallback className="text-sidebar-dark text-xl font-bold">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">Aman</h2>
            <p className="text-sm text-white/70">ak88xxxx@kiet.edu</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <div className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left p-4 h-auto hover:bg-white/10 transition-colors",
                  isActive && "bg-white/20 text-white font-semibold"
                )}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-left p-4 h-auto hover:bg-white/10 text-white/80 hover:text-white"
          onClick={() => window.location.href = "/"}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
};