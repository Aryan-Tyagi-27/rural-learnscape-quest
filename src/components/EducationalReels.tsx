import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Heart, 
  Share, 
  BookOpen, 
  Clock, 
  User,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  ThumbsUp,
  Eye,
  Filter
} from "lucide-react";
import { toast } from "sonner";

export const EducationalReels = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [likedReels, setLikedReels] = useState<number[]>([]);
  const [savedReels, setSavedReels] = useState<number[]>([]);

  const reels = [
    {
      id: 1,
      title: "Acid-Base Reactions Made Simple",
      teacher: "Dr. Priya Singh",
      subject: "Chemistry",
      duration: "2:30",
      views: 1520,
      likes: 234,
      description: "Learn the basics of acid-base reactions with visual demonstrations and real-world examples.",
      thumbnail: "🧪",
      category: "Basic Concepts",
      difficulty: "Beginner",
      points: 15
    },
    {
      id: 2,
      title: "Organic Compound Naming Tricks",
      teacher: "Prof. Amit Kumar",
      subject: "Organic Chemistry", 
      duration: "3:15",
      views: 892,
      likes: 156,
      description: "Master the art of naming organic compounds with easy-to-remember tricks and patterns.",
      thumbnail: "🔬",
      category: "Problem Solving",
      difficulty: "Intermediate",
      points: 20
    },
    {
      id: 3,
      title: "Lab Safety in 60 Seconds",
      teacher: "Dr. Neha Patel",
      subject: "Lab Techniques",
      duration: "1:00",
      views: 2341,
      likes: 445,
      description: "Essential lab safety rules every chemistry student must know.",
      thumbnail: "⚗️",
      category: "Safety",
      difficulty: "Beginner",
      points: 10
    },
    {
      id: 4,
      title: "Periodic Table Memory Palace",
      teacher: "Dr. Rajesh Sharma",
      subject: "Chemistry",
      duration: "4:20",
      views: 1876,
      likes: 321,
      description: "Use memory techniques to remember periodic table elements and their properties.",
      thumbnail: "📊",
      category: "Memory Tricks",
      difficulty: "Beginner",
      points: 25
    },
    {
      id: 5,
      title: "Balancing Chemical Equations",
      teacher: "Prof. Anita Verma",
      subject: "Chemistry",
      duration: "2:45",
      views: 1234,
      likes: 189,
      description: "Step-by-step method to balance even the most complex chemical equations.",
      thumbnail: "⚖️",
      category: "Problem Solving",
      difficulty: "Intermediate",
      points: 20
    },
    {
      id: 6,
      title: "Molecular Shapes Visualization",
      teacher: "Dr. Suresh Gupta",
      subject: "Physical Chemistry",
      duration: "3:00",
      views: 967,
      likes: 198,
      description: "Understand VSEPR theory and molecular geometry with 3D visualizations.",
      thumbnail: "🔮",
      category: "Visualization",
      difficulty: "Advanced",
      points: 30
    }
  ];

  const currentReelData = reels[currentReel];

  const handleLike = (reelId: number) => {
    if (likedReels.includes(reelId)) {
      setLikedReels(likedReels.filter(id => id !== reelId));
      toast.info("Removed from liked reels");
    } else {
      setLikedReels([...likedReels, reelId]);
      toast.success(`+${currentReelData.points} points for watching!`);
    }
  };

  const handleSave = (reelId: number) => {
    if (savedReels.includes(reelId)) {
      setSavedReels(savedReels.filter(id => id !== reelId));
      toast.info("Removed from saved reels");
    } else {
      setSavedReels([...savedReels, reelId]);
      toast.success("Reel saved to your collection");
    }
  };

  const nextReel = () => {
    setCurrentReel((prev) => (prev + 1) % reels.length);
  };

  const prevReel = () => {
    setCurrentReel((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success/10 text-success border-success/20";
      case "Intermediate": return "bg-warning/10 text-warning border-warning/20";
      case "Advanced": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Reel Player */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="relative">
            {/* Video Area */}
            <div className="aspect-[9/16] max-h-[600px] bg-gradient-lab rounded-t-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-white">
                <div className="text-8xl mb-4">{currentReelData.thumbnail}</div>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                  <Play className="h-6 w-6 mr-2" />
                  Play Reel
                </Button>
              </div>
              
              {/* Navigation Arrows */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={prevReel}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={nextReel}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Reel Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getDifficultyColor(currentReelData.difficulty)}>
                    {currentReelData.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                    {currentReelData.category}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold mb-1">{currentReelData.title}</h3>
                <p className="text-sm text-white/90 mb-2">{currentReelData.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{currentReelData.teacher}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{currentReelData.duration}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{currentReelData.views}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(currentReelData.id)}
                    className={likedReels.includes(currentReelData.id) ? "text-red-500" : ""}
                  >
                    <Heart 
                      className={`h-4 w-4 mr-2 ${likedReels.includes(currentReelData.id) ? "fill-current" : ""}`} 
                    />
                    {currentReelData.likes + (likedReels.includes(currentReelData.id) ? 1 : 0)}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(currentReelData.id)}
                    className={savedReels.includes(currentReelData.id) ? "text-gamify-purple" : ""}
                  >
                    <Bookmark 
                      className={`h-4 w-4 mr-2 ${savedReels.includes(currentReelData.id) ? "fill-current" : ""}`} 
                    />
                    Save
                  </Button>
                </div>

                <Badge className="bg-gamify-purple/10 text-gamify-purple border-gamify-purple/20">
                  +{currentReelData.points} pts
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reel Grid */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-gamify-teal" />
              <span>More Educational Reels</span>
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reels.map((reel, index) => (
              <div 
                key={reel.id}
                onClick={() => setCurrentReel(index)}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  index === currentReel ? "border-gamify-purple bg-gamify-purple/5" : "border-border hover:border-gamify-teal"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{reel.thumbnail}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{reel.title}</h4>
                    <p className="text-xs text-muted-foreground">{reel.teacher}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {reel.subject}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{reel.duration}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{reel.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{reel.likes}</span>
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        +{reel.points} pts
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};