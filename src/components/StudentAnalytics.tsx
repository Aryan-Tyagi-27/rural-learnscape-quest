import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DataTable } from "./DataTable";
import { toast } from "sonner";
import { 
  User, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Award,
  Calendar,
  Clock,
  BarChart3,
  Eye,
  MessageSquare
} from "lucide-react";

interface StudentAnalyticsProps {
  studentId?: string;
}

export const StudentAnalytics = ({ studentId }: StudentAnalyticsProps) => {
  const tableColumns = [
    { key: 'name', label: 'Student Name', sortable: true },
    { key: 'totalPoints', label: 'Total Points', sortable: true },
    { key: 'avgScore', label: 'Avg Score (%)', sortable: true },
    { key: 'streak', label: 'Streak (days)', sortable: true },
    { key: 'hoursStudied', label: 'Hours', sortable: true },
    { key: 'badges', label: 'Badges', sortable: true },
  ];

  const students = [
    {
      id: 1,
      name: "Aman Kumar",
      avatar: "👨‍🎓",
      totalPoints: 2450,
      streak: 12,
      courses: 4,
      avgScore: 87,
      hoursStudied: 45,
      badges: 8,
      recentActivity: [
        { action: "Completed Quiz: Chemical Reactions", points: 50, time: "2h ago" },
        { action: "Watched Reel: Acid-Base Theory", points: 10, time: "4h ago" },
        { action: "Lab Experiment: Neutralization", points: 75, time: "1d ago" }
      ],
      weakAreas: ["Organic Chemistry", "Thermodynamics"],
      strongAreas: ["Chemical Equations", "Lab Techniques"],
      courseProgress: [
        { name: "Chemistry Fundamentals", progress: 85, grade: "A" },
        { name: "Organic Chemistry", progress: 65, grade: "B" },
        { name: "Physical Chemistry", progress: 92, grade: "A+" },
        { name: "Lab Techniques", progress: 78, grade: "B+" }
      ]
    },
    {
      id: 2,
      name: "Priya Sharma",
      avatar: "👩‍🎓",
      totalPoints: 2180,
      streak: 8,
      courses: 3,
      avgScore: 91,
      hoursStudied: 38,
      badges: 6,
      recentActivity: [
        { action: "Completed Assignment: Molecular Structure", points: 85, time: "1h ago" },
        { action: "Earned Badge: Quiz Master", points: 100, time: "3h ago" },
        { action: "Started Course: Advanced Chemistry", points: 0, time: "2d ago" }
      ],
      weakAreas: ["Mathematical Chemistry"],
      strongAreas: ["Theory", "Problem Solving", "Lab Safety"],
      courseProgress: [
        { name: "Chemistry Fundamentals", progress: 95, grade: "A+" },
        { name: "Organic Chemistry", progress: 88, grade: "A" },
        { name: "Advanced Chemistry", progress: 15, grade: "In Progress" }
      ]
    },
    {
      id: 3,
      name: "Rahul Singh",
      avatar: "👨‍🎓",
      totalPoints: 1850,
      streak: 5,
      courses: 3,
      avgScore: 78,
      hoursStudied: 32,
      badges: 4,
      recentActivity: [
        { action: "Virtual Lab: Titration Experiment", points: 60, time: "3h ago" },
        { action: "Quiz Attempt: Periodic Table", points: 45, time: "6h ago" },
        { action: "Watched Educational Reel", points: 15, time: "1d ago" }
      ],
      weakAreas: ["Complex Reactions", "Calculations"],
      strongAreas: ["Basic Concepts", "Lab Work"],
      courseProgress: [
        { name: "Chemistry Fundamentals", progress: 72, grade: "B" },
        { name: "Organic Chemistry", progress: 45, grade: "C+" },
        { name: "Lab Techniques", progress: 89, grade: "A" }
      ]
    }
  ];

  const selectedStudent = students.find(s => s.id.toString() === studentId) || students[0];

  return (
    <div className="space-y-6">
      {/* Student Overview */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedStudent.avatar}</div>
              <div>
                <CardTitle className="text-xl">{selectedStudent.name}</CardTitle>
                <p className="text-muted-foreground">Student ID: ST{selectedStudent.id.toString().padStart(3, '0')}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gamify-purple">{selectedStudent.totalPoints}</div>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gamify-orange">{selectedStudent.streak}</div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gamify-teal">{selectedStudent.avgScore}%</div>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gamify-green">{selectedStudent.badges}</div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-gamify-teal" />
              <span>Course Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedStudent.courseProgress.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{course.name}</span>
                    <Badge variant="secondary">{course.grade}</Badge>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{course.progress}% complete</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gamify-purple" />
              <span>Performance Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-success mb-2">Strong Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.strongAreas.map((area, index) => (
                    <Badge key={index} className="bg-success/10 text-success border-success/20">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-warning mb-2">Areas for Improvement</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.weakAreas.map((area, index) => (
                    <Badge key={index} className="bg-warning/10 text-warning border-warning/20">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Study Hours</span>
                  </span>
                  <span className="font-medium">{selectedStudent.hoursStudied}h this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-gamify-green" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedStudent.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                {activity.points > 0 && (
                  <Badge variant="secondary" className="text-gamify-purple">
                    +{activity.points} pts
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Students Data Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gamify-orange" />
              <span>All Students Overview</span>
            </div>
            <Button 
              size="sm"
              onClick={() => toast.success('Student management panel opened!')}
            >
              Manage Students
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={tableColumns}
            data={students}
            onRowClick={(student) => toast.info(`Viewing details for ${student.name}`)}
            searchable={true}
            exportable={true}
          />
        </CardContent>
      </Card>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {students.map((student) => (
          <Card key={student.id} className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer group animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl group-hover:scale-110 transition-transform">{student.avatar}</span>
                <div className="flex-1">
                  <h4 className="font-medium group-hover:text-primary transition-colors">{student.name}</h4>
                  <p className="text-xs text-muted-foreground">{student.totalPoints} points</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-accent rounded">
                    <p className="text-muted-foreground text-xs">Score</p>
                    <p className="font-bold text-gamify-teal">{student.avgScore}%</p>
                  </div>
                  <div className="text-center p-2 bg-accent rounded">
                    <p className="text-muted-foreground text-xs">Streak</p>
                    <p className="font-bold text-gamify-orange">{student.streak}d</p>
                  </div>
                  <div className="text-center p-2 bg-accent rounded">
                    <p className="text-muted-foreground text-xs">Hours</p>
                    <p className="font-bold text-gamify-purple">{student.hoursStudied}h</p>
                  </div>
                  <div className="text-center p-2 bg-accent rounded">
                    <p className="text-muted-foreground text-xs">Badges</p>
                    <p className="font-bold text-gamify-green">{student.badges}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};