
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (meal: { 
    name: string; 
    calories: number; 
    protein: number; 
    carbs: number; 
    fat: number;
    mealType: string;
  }) => void;
}

const LogMealModal: React.FC<LogMealModalProps> = ({
  isOpen,
  onClose,
  onLog,
}) => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(350);
  const [protein, setProtein] = useState(20);
  const [carbs, setCarbs] = useState(30);
  const [fat, setFat] = useState(15);
  const [mealType, setMealType] = useState("Breakfast");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && calories > 0) {
      onLog({ name, calories, protein, carbs, fat, mealType });
      setName("");
      setCalories(350);
      setProtein(20);
      setCarbs(30);
      setFat(15);
      setMealType("Breakfast");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Meal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="meal-name">Meal Name</Label>
            <Input
              id="meal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Turkey Sandwich"
            />
          </div>
          <div>
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger id="meal-type">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meal-calories">Calories</Label>
              <Input
                id="meal-calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                min={1}
                required
              />
            </div>
            <div>
              <Label htmlFor="meal-protein">Protein (g)</Label>
              <Input
                id="meal-protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="meal-carbs">Carbs (g)</Label>
              <Input
                id="meal-carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="meal-fat">Fat (g)</Label>
              <Input
                id="meal-fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Log Meal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogMealModal;
