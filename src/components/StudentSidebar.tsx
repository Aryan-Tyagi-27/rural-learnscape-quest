import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  FlaskConical, 
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface StudentSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const StudentSidebar = ({ currentView, setCurrentView }: StudentSidebarProps) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "text-gamify-purple"
    },
    {
      id: "courses",
      label: "My Courses",
      icon: BookOpen,
      color: "text-gamify-teal"
    },
    {
      id: "virtuallab",
      label: "Virtual Lab",
      icon: FlaskConical,
      color: "text-gamify-green"
    },
    {
      id: "quiz",
      label: "Quizzes",
      icon: Brain,
      color: "text-gamify-orange"
    },
    {
      id: "rewards",
      label: "Rewards",
      icon: Trophy,
      color: "text-gamify-gold"
    },
  ];

  return (
    <Card className="w-64 h-screen rounded-none border-r shadow-sidebar">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">ShikshaSetu</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-12 px-4",
                  currentView === item.id && "bg-primary/10 text-primary border-primary/20"
                )}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon className={cn("mr-3 h-5 w-5", item.color)} />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </Card>
  );
};