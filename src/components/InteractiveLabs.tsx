import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FlaskConical, 
  Beaker, 
  Droplets, 
  Zap, 
  RotateCcw, 
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ThermometerSun,
  Microscope,
  Atom,
  TestTube,
  Play,
  Eye,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string;
  type: "acid" | "base" | "salt" | "water" | "indicator" | "metal" | "gas";
  icon: string;
  volume?: number;
}

interface BeakerState {
  id: number;
  chemicals: Chemical[];
  temperature: number;
  volume: number;
  color: string;
  bubbling: boolean;
}

export const InteractiveLabs = () => {
  const [selectedChemicals, setSelectedChemicals] = useState<Chemical[]>([]);
  const [beakers, setBeakers] = useState<BeakerState[]>([
    { id: 1, chemicals: [], temperature: 25, volume: 0, color: "transparent", bubbling: false },
    { id: 2, chemicals: [], temperature: 25, volume: 0, color: "transparent", bubbling: false },
    { id: 3, chemicals: [], temperature: 25, volume: 0, color: "transparent", bubbling: false }
  ]);
  const [currentLab, setCurrentLab] = useState("chemistry");
  const [experiments, setExperiments] = useState(0);
  const [activeBeaker, setActiveBeaker] = useState<number | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const chemicals: Chemical[] = [
    { id: "hcl", name: "Hydrochloric Acid", formula: "HCl", color: "#ff6b6b", type: "acid", icon: "🧪", volume: 50 },
    { id: "naoh", name: "Sodium Hydroxide", formula: "NaOH", color: "#4ecdc4", type: "base", icon: "🧪", volume: 50 },
    { id: "h2so4", name: "Sulfuric Acid", formula: "H₂SO₄", color: "#ff8c42", type: "acid", icon: "⚠️", volume: 50 },
    { id: "ca_oh_2", name: "Calcium Hydroxide", formula: "Ca(OH)₂", color: "#95e1d3", type: "base", icon: "🧪", volume: 50 },
    { id: "phenol", name: "Phenolphthalein", formula: "C₂₀H₁₄O₄", color: "#c44569", type: "indicator", icon: "💧", volume: 10 },
    { id: "h2o", name: "Distilled Water", formula: "H₂O", color: "#74b9ff", type: "water", icon: "💧", volume: 100 },
    { id: "zn", name: "Zinc Metal", formula: "Zn", color: "#a4b0be", type: "metal", icon: "🔩", volume: 25 },
    { id: "cu", name: "Copper Sulfate", formula: "CuSO₄", color: "#3742fa", type: "salt", icon: "💎", volume: 30 }
  ];

  const labTypes = [
    { id: "chemistry", name: "Chemistry Lab", icon: FlaskConical, color: "gamify-teal" },
    { id: "physics", name: "Physics Lab", icon: Atom, color: "gamify-purple" },
    { id: "biology", name: "Biology Lab", icon: Microscope, color: "gamify-green" },
    { id: "environment", name: "Environmental Lab", icon: TestTube, color: "gamify-orange" }
  ];

  const handleDragStart = (e: React.DragEvent, chemical: Chemical) => {
    e.dataTransfer.setData("application/json", JSON.stringify(chemical));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleBeakerDrop = (e: React.DragEvent, beakerId: number) => {
    e.preventDefault();
    const chemicalData = e.dataTransfer.getData("application/json");
    const chemical: Chemical = JSON.parse(chemicalData);
    
    setBeakers(prevBeakers => 
      prevBeakers.map(beaker => {
        if (beaker.id === beakerId) {
          if (beaker.chemicals.find(c => c.id === chemical.id)) {
            toast.warning(`${chemical.name} is already in this beaker`);
            return beaker;
          }
          
          const newChemicals = [...beaker.chemicals, chemical];
          const newVolume = beaker.volume + (chemical.volume || 50);
          const newColor = mixColors(beaker.color, chemical.color);
          
          toast.success(`Added ${chemical.name} to Beaker ${beakerId}`);
          return {
            ...beaker,
            chemicals: newChemicals,
            volume: Math.min(newVolume, 250), // Max capacity 250ml
            color: newColor,
            bubbling: newChemicals.length > 1 && hasReaction(newChemicals)
          };
        }
        return beaker;
      })
    );
  };

  const mixColors = (color1: string, color2: string): string => {
    if (color1 === "transparent") return color2;
    if (color2 === "transparent") return color1;
    
    // Enhanced color mixing with animations
    const colors = [color1, color2];
    if (colors.includes("#ff6b6b") && colors.includes("#4ecdc4")) return "#98fb98"; // Acid + Base = Neutralization (Green)
    if (colors.includes("#ff8c42") && colors.includes("#95e1d3")) return "#ffd93d"; // Strong reaction (Yellow)
    if (colors.includes("#c44569")) return "#ff69b4"; // Indicator color change
    if (colors.includes("#a4b0be")) return "#87ceeb"; // Metal reaction (Blue)
    return "#dda0dd"; // Default mixed color (Purple)
  };

  const hasReaction = (chemicals: Chemical[]): boolean => {
    const types = chemicals.map(c => c.type);
    return (types.includes("acid") && types.includes("base")) ||
           (types.includes("acid") && types.includes("metal")) ||
           (types.includes("salt") && types.includes("water"));
  };

  const conductBeakerExperiment = (beakerId: number) => {
    const beaker = beakers.find(b => b.id === beakerId);
    if (!beaker || beaker.chemicals.length < 2) {
      toast.error("Add at least 2 chemicals to conduct an experiment");
      return;
    }

    const reaction = getReactionResult(beaker.chemicals);
    setExperiments(experiments + 1);
    
    // Update beaker with reaction effects
    setBeakers(prevBeakers =>
      prevBeakers.map(b => {
        if (b.id === beakerId) {
          return {
            ...b,
            temperature: b.temperature + Math.random() * 30 + 10, // Temperature increase
            bubbling: true,
            color: reaction.color || b.color
          };
        }
        return b;
      })
    );

    toast.success(`Experiment successful! ${reaction.name}`);
  };

  const getReactionResult = (chemicals: Chemical[]) => {
    const formulas = chemicals.map(c => c.formula).sort();
    
    if (formulas.includes("HCl") && formulas.includes("NaOH")) {
      return { name: "Acid-Base Neutralization", color: "#98fb98", product: "NaCl + H₂O" };
    }
    if (formulas.includes("HCl") && formulas.includes("Zn")) {
      return { name: "Metal-Acid Reaction", color: "#87ceeb", product: "ZnCl₂ + H₂" };
    }
    if (formulas.includes("CuSO₄") && formulas.includes("H₂O")) {
      return { name: "Salt Dissolution", color: "#4169e1", product: "Cu²⁺ + SO₄²⁻" };
    }
    
    return { name: "Mixed Solution", color: "#dda0dd", product: "Complex mixture" };
  };

  const resetBeaker = (beakerId: number) => {
    setBeakers(prevBeakers =>
      prevBeakers.map(beaker => {
        if (beaker.id === beakerId) {
          return {
            ...beaker,
            chemicals: [],
            temperature: 25,
            volume: 0,
            color: "transparent",
            bubbling: false
          };
        }
        return beaker;
      })
    );
    toast.info(`Beaker ${beakerId} cleaned and reset`);
  };

  const resetAllBeakers = () => {
    setBeakers(prevBeakers =>
      prevBeakers.map(beaker => ({
        ...beaker,
        chemicals: [],
        temperature: 25,
        volume: 0,
        color: "transparent",
        bubbling: false
      }))
    );
    toast.info("All beakers cleaned and reset");
  };

  const currentLabData = labTypes.find(lab => lab.id === currentLab);

  return (
    <div className="space-y-6">
      {/* Lab Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gamify-purple" />
            <span>Select Laboratory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {labTypes.map((lab) => {
              const Icon = lab.icon;
              return (
                <Button
                  key={lab.id}
                  variant={currentLab === lab.id ? "default" : "outline"}
                  onClick={() => setCurrentLab(lab.id)}
                  className="h-20 flex-col space-y-2"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{lab.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lab Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`bg-${currentLabData?.color} text-white border-0 shadow-card`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FlaskConical className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-90">Experiments</p>
                <p className="text-2xl font-bold">{experiments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-success text-white border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Beaker className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-90">Active Beakers</p>
                <p className="text-2xl font-bold">{beakers.filter(b => b.chemicals.length > 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-lab text-white border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Droplets className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-90">Chemicals</p>
                <p className="text-2xl font-bold">{chemicals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-gamify text-white border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Eye className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-90">Lab Type</p>
                <p className="text-lg font-bold">{currentLabData?.name.split(' ')[0]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chemical Inventory */}
        <Card className="shadow-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-gamify-teal" />
              <span>Chemical Inventory</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {chemicals.map((chemical) => (
                <div
                  key={chemical.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, chemical)}
                  className="p-3 border border-border rounded-lg cursor-move hover:bg-accent transition-all duration-300 group hover:scale-105 hover:shadow-lg animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{chemical.icon}</span>
                      <div>
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">{chemical.name}</p>
                        <p className="text-xs text-muted-foreground">{chemical.formula}</p>
                        <p className="text-xs text-muted-foreground">{chemical.volume}ml</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="secondary" className="text-xs capitalize group-hover:bg-primary group-hover:text-white transition-colors">
                        {chemical.type}
                      </Badge>
                      <div 
                        className="w-4 h-4 rounded-full border border-border group-hover:animate-pulse shadow-md"
                        style={{ 
                          backgroundColor: chemical.color,
                          boxShadow: `0 0 10px ${chemical.color}40`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Beakers */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Beaker className="h-5 w-5 text-gamify-purple" />
                <span>Interactive Beakers</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={resetAllBeakers}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {beakers.map((beaker) => (
                <div
                  key={beaker.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleBeakerDrop(e, beaker.id)}
                  className={`relative p-4 border-2 border-dashed rounded-lg transition-all min-h-64 ${
                    activeBeaker === beaker.id 
                      ? "border-gamify-purple bg-gamify-purple/5" 
                      : "border-border hover:border-gamify-teal"
                  }`}
                  onMouseEnter={() => setActiveBeaker(beaker.id)}
                  onMouseLeave={() => setActiveBeaker(null)}
                >
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Beaker {beaker.id}</h4>
                    
                    {/* Enhanced Beaker Visualization with Animations */}
                    <div className="relative mx-auto w-20 h-24 mb-4 group">
                      <div className="absolute inset-0 border-2 border-gray-400 rounded-b-lg bg-white/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                        {beaker.volume > 0 && (
                          <div 
                            className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-700 ease-in-out animate-fade-in"
                            style={{ 
                              height: `${(beaker.volume / 250) * 100}%`,
                              backgroundColor: beaker.color === "transparent" ? "#e0e7ff" : beaker.color,
                              opacity: beaker.color === "transparent" ? 0.3 : 0.85,
                              boxShadow: beaker.bubbling ? `0 0 25px ${beaker.color}, inset 0 0 15px rgba(255,255,255,0.3)` : 'inset 0 0 10px rgba(255,255,255,0.2)'
                            }}
                          >
                            {beaker.bubbling && (
                              <>
                                {/* Enhanced bubbling effect */}
                                <div className="absolute inset-0">
                                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-2 animate-bounce shadow-lg"></div>
                                  <div className="w-2 h-2 bg-white rounded-full absolute top-2 right-2 animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-1 h-1 bg-white rounded-full absolute top-3 left-4 animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                                  <div className="w-1.5 h-1.5 bg-white/80 rounded-full absolute top-4 right-3 animate-bounce shadow-lg" style={{ animationDelay: '0.15s' }}></div>
                                  <div className="w-1 h-1 bg-white/70 rounded-full absolute top-2 left-1/2 animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }}></div>
                                </div>
                                {/* Enhanced steam effect */}
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-10">
                                  <div className="w-1 h-6 bg-white/60 rounded-full absolute left-0 animate-ping"></div>
                                  <div className="w-1 h-6 bg-white/40 rounded-full absolute left-2 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                                </div>
                                {/* Glow effect during reaction */}
                                <div className="absolute inset-0 rounded-b-lg animate-pulse" style={{ boxShadow: `inset 0 0 20px ${beaker.color}` }}></div>
                              </>
                            )}
                            {/* Enhanced shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent animate-pulse"></div>
                            {/* Wave animation at surface */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 border-2 border-gray-400 border-b-0 rounded-t-md bg-white/30"></div>
                      {beaker.temperature > 40 && (
                        <div className="absolute -top-8 right-0 flex items-center space-x-1 bg-warning/20 px-2 py-1 rounded-md">
                          <ThermometerSun className="h-4 w-4 text-warning animate-pulse" />
                          <span className="text-xs font-bold text-warning">{Math.round(beaker.temperature)}°C</span>
                        </div>
                      )}
                    </div>

                    {/* Beaker Info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Volume:</span>
                        <span>{beaker.volume}ml / 250ml</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Temperature:</span>
                        <span className="flex items-center space-x-1">
                          <ThermometerSun className="h-3 w-3" />
                          <span>{Math.round(beaker.temperature)}°C</span>
                        </span>
                      </div>
                      <Progress value={(beaker.volume / 250) * 100} className="h-1" />
                    </div>

                    {/* Chemicals in Beaker */}
                    {beaker.chemicals.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium">Contents:</p>
                        {beaker.chemicals.map((chemical, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {chemical.formula}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      <Button
                        size="sm"
                        onClick={() => conductBeakerExperiment(beaker.id)}
                        disabled={beaker.chemicals.length < 2}
                        className="w-full"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        React
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetBeaker(beaker.id)}
                        className="w-full"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Clean
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lab Instructions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-gamify-orange" />
            <span>Lab Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <Play className="h-4 w-4 text-gamify-teal" />
                <span>How to Use</span>
              </h4>
              <ol className="text-sm space-y-2 text-muted-foreground">
                <li>1. Select chemicals from the inventory</li>
                <li>2. Drag chemicals into beakers</li>
                <li>3. Mix different chemicals to see reactions</li>
                <li>4. Monitor temperature and volume changes</li>
                <li>5. Clean beakers when done</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>Safety Notes</span>
              </h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Always observe proper lab safety</li>
                <li>• Monitor temperature changes carefully</li>
                <li>• Some reactions may produce gases</li>
                <li>• Clean equipment after each experiment</li>
                <li>• Record your observations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};