import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  Beaker, 
  Droplets, 
  Zap, 
  RotateCcw, 
  BookOpen,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string;
  type: "acid" | "base" | "salt" | "water" | "indicator";
  icon: string;
}

interface Reaction {
  reactants: string[];
  products: string[];
  name: string;
  description: string;
  safetyLevel: "safe" | "caution" | "danger";
}

export const VirtualLab = () => {
  const [selectedChemicals, setSelectedChemicals] = useState<Chemical[]>([]);
  const [reactionResult, setReactionResult] = useState<string | null>(null);
  const [reactionEquation, setReactionEquation] = useState<string | null>(null);
  const [experiments, setExperiments] = useState<number>(0);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const chemicals: Chemical[] = [
    { id: "hcl", name: "Hydrochloric Acid", formula: "HCl", color: "red", type: "acid", icon: "🧪" },
    { id: "naoh", name: "Sodium Hydroxide", formula: "NaOH", color: "blue", type: "base", icon: "🧪" },
    { id: "h2so4", name: "Sulfuric Acid", formula: "H₂SO₄", color: "orange", type: "acid", icon: "⚠️" },
    { id: "ca_oh_2", name: "Calcium Hydroxide", formula: "Ca(OH)₂", color: "green", type: "base", icon: "🧪" },
    { id: "phenol", name: "Phenolphthalein", formula: "C₂₀H₁₄O₄", color: "purple", type: "indicator", icon: "💧" },
    { id: "litmus", name: "Litmus Paper", formula: "C₇H₇N₄O₄S", color: "pink", type: "indicator", icon: "📝" },
  ];

  const reactions: Reaction[] = [
    {
      reactants: ["hcl", "naoh"],
      products: ["nacl", "h2o"],
      name: "Acid-Base Neutralization",
      description: "HCl + NaOH → NaCl + H₂O (Salt + Water)",
      safetyLevel: "safe"
    },
    {
      reactants: ["h2so4", "ca_oh_2"],
      products: ["caso4", "h2o"],
      name: "Sulfuric Acid Neutralization", 
      description: "H₂SO₄ + Ca(OH)₂ → CaSO₄ + 2H₂O",
      safetyLevel: "caution"
    }
  ];

  const handleDragStart = (e: React.DragEvent, chemical: Chemical) => {
    e.dataTransfer.setData("application/json", JSON.stringify(chemical));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const chemicalData = e.dataTransfer.getData("application/json");
    const chemical: Chemical = JSON.parse(chemicalData);
    
    if (!selectedChemicals.find(c => c.id === chemical.id)) {
      setSelectedChemicals([...selectedChemicals, chemical]);
      toast.success(`Added ${chemical.name} to reaction vessel`);
    } else {
      toast.warning(`${chemical.name} is already in the reaction vessel`);
    }
  };

  const conductExperiment = () => {
    if (selectedChemicals.length < 2) {
      toast.error("Add at least 2 chemicals to conduct an experiment");
      return;
    }

    const chemicalIds = selectedChemicals.map(c => c.id).sort();
    const reaction = reactions.find(r => 
      JSON.stringify(r.reactants.sort()) === JSON.stringify(chemicalIds)
    );

    if (reaction) {
      setReactionResult(reaction.description);
      setReactionEquation(reaction.description);
      setExperiments(experiments + 1);
      
      if (reaction.safetyLevel === "safe") {
        toast.success(`Experiment successful! ${reaction.name}`);
      } else if (reaction.safetyLevel === "caution") {
        toast.warning(`Experiment completed with caution: ${reaction.name}`);
      }
    } else {
      setReactionResult("No reaction observed. Try different chemical combinations.");
      setReactionEquation(null);
      toast.info("No reaction occurred with these chemicals");
    }
  };

  const resetExperiment = () => {
    setSelectedChemicals([]);
    setReactionResult(null);
    setReactionEquation(null);
    toast.info("Lab equipment cleaned and reset");
  };

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case "safe": return <CheckCircle className="h-4 w-4 text-success" />;
      case "caution": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "danger": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lab Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-lab text-white border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FlaskConical className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-90">Experiments Conducted</p>
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
                <p className="text-sm opacity-90">Available Chemicals</p>
                <p className="text-2xl font-bold">{chemicals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-gamify text-white border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-90">Safety Level</p>
                <p className="text-lg font-bold">High</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chemical Inventory */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-gamify-teal" />
              <span>Chemical Inventory</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {chemicals.map((chemical) => (
                <div
                  key={chemical.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, chemical)}
                  className="p-3 border border-border rounded-lg cursor-move hover:bg-accent transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{chemical.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{chemical.name}</p>
                      <p className="text-xs text-muted-foreground">{chemical.formula}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs capitalize bg-${chemical.color}-100 text-${chemical.color}-800`}
                  >
                    {chemical.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reaction Vessel */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FlaskConical className="h-5 w-5 text-gamify-purple" />
              <span>Reaction Vessel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="min-h-48 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center space-y-4 hover:border-gamify-teal transition-colors"
            >
              {selectedChemicals.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  <FlaskConical className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Drag chemicals here to mix them</p>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div className="text-center">
                    <FlaskConical className="h-8 w-8 mx-auto text-gamify-teal mb-2" />
                    <p className="font-medium">Ready to conduct experiment</p>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedChemicals.map((chemical) => (
                      <div key={chemical.id} className="flex items-center justify-between p-2 bg-accent rounded">
                        <span className="text-sm">{chemical.name}</span>
                        <span className="text-xs text-muted-foreground">{chemical.formula}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4">
              <Button 
                onClick={conductExperiment} 
                disabled={selectedChemicals.length < 2}
                className="flex-1"
              >
                <Zap className="h-4 w-4 mr-2" />
                Conduct Experiment
              </Button>
              <Button variant="outline" onClick={resetExperiment}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Reaction Result */}
            {reactionResult && (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-success">Experiment Result</p>
                      <p className="text-sm text-foreground mt-1">{reactionResult}</p>
                    </div>
                  </div>
                </div>
                
                {reactionEquation && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Chemical Equation</p>
                        <p className="text-lg font-mono font-bold text-primary">{reactionEquation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reference Guide */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-gamify-orange" />
            <span>Reaction Reference Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reactions.map((reaction, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getSafetyIcon(reaction.safetyLevel)}
                  <h4 className="font-medium">{reaction.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{reaction.description}</p>
                <div className="flex flex-wrap gap-1">
                  {reaction.reactants.map((reactant) => {
                    const chemical = chemicals.find(c => c.id === reactant);
                    return chemical ? (
                      <Badge key={reactant} variant="secondary" className="text-xs">
                        {chemical.formula}
                      </Badge>
                    ) : null;
                  })}
                  <span className="text-muted-foreground mx-1">→</span>
                  <Badge variant="outline" className="text-xs">Products</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};