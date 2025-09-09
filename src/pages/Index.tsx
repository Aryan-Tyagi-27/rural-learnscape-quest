import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  FlaskConical, 
  Trophy, 
  Wifi, 
  WifiOff,
  Smartphone,
  Globe,
  BookOpen,
  Target
} from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    toast.success(`Welcome! Redirecting to ${role} dashboard...`);
    
    // Simulate loading and redirect
    setTimeout(() => {
      if (role === "teacher") {
        window.location.href = "/teacher";
      } else {
        window.location.href = "/student";
      }
    }, 1500);
  };

  const features = [
    {
      icon: FlaskConical,
      title: "Virtual Laboratory",
      description: "Conduct safe chemistry experiments with drag-and-drop interactions",
      color: "gamify-teal"
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn points, badges, and rewards for academic achievements",
      color: "gamify-orange"
    },
    {
      icon: WifiOff,
      title: "Offline Support",
      description: "Download content and continue learning without internet",
      color: "gamify-purple"
    },
    {
      icon: Users,
      title: "Collaborative Platform",
      description: "Connect teachers and students in rural communities",
      color: "gamify-green"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-primary text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Globe className="h-4 w-4 mr-2" />
              Rural Education Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Gamified Learning for
              <span className="block bg-gradient-to-r from-gamify-orange to-gamify-pink bg-clip-text text-transparent">
                Rural Communities
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Empowering rural students with interactive virtual labs, offline capabilities, 
              and gamified learning experiences designed for low-connectivity environments.
            </p>

            <div className="flex items-center justify-center space-x-4 pt-6">
              <Badge variant="secondary" className="bg-success/20 text-white border-success/30">
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile Friendly
              </Badge>
              <Badge variant="secondary" className="bg-info/20 text-white border-info/30">
                <WifiOff className="h-4 w-4 mr-2" />
                Works Offline
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Continue As</h2>
          <p className="text-muted-foreground text-lg">
            Choose your role to access the learning platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Teacher Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-hover border-2 ${
              selectedRole === "teacher" ? "border-gamify-orange shadow-hover" : "border-border"
            }`}
            onClick={() => handleRoleSelection("teacher")}
          >
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-gamify rounded-full flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Teacher</h3>
                <p className="text-muted-foreground">
                  Manage classes, create assignments, track student progress, and access teacher training resources.
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Student Management</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Content Creation</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Progress Analytics</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gamify-orange hover:bg-gamify-orange/90"
                size="lg"
              >
                Enter Teacher Portal
              </Button>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-hover border-2 ${
              selectedRole === "student" ? "border-gamify-green shadow-hover" : "border-border"
            }`}
            onClick={() => handleRoleSelection("student")}
          >
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-success rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Student</h3>
                <p className="text-muted-foreground">
                  Access courses, participate in virtual labs, earn rewards, and track your learning progress.
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <FlaskConical className="h-4 w-4" />
                  <span>Virtual Laboratory</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>Gamified Rewards</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <WifiOff className="h-4 w-4" />
                  <span>Offline Learning</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gamify-green hover:bg-gamify-green/90"
                size="lg"
              >
                Enter Student Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Offline Mode Toggle */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => {
              setIsOfflineMode(!isOfflineMode);
              toast.info(isOfflineMode ? "Online mode enabled" : "Offline mode enabled");
            }}
            className="space-x-2"
          >
            {isOfflineMode ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span>{isOfflineMode ? "Switch to Online" : "Switch to Offline"}</span>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Designed specifically for rural education with gamification, offline support, and interactive learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto bg-${feature.color} rounded-full flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sidebar-dark text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-white/70">
            Rural Gamified Learning Platform - Empowering education in remote communities
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
            <span className="flex items-center space-x-1">
              <Globe className="h-4 w-4" />
              <span>Accessible Anywhere</span>
            </span>
            <span className="flex items-center space-x-1">
              <WifiOff className="h-4 w-4" />
              <span>Offline Ready</span>
            </span>
            <span className="flex items-center space-x-1">
              <Smartphone className="h-4 w-4" />
              <span>Mobile First</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
