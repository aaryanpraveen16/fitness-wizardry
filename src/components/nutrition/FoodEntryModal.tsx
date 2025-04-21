
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Food } from "@/services/foodService";

interface FoodEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: Food) => void;
  initialFood?: Food;
}

const FoodEntryModal: React.FC<FoodEntryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialFood
}) => {
  const [food, setFood] = useState<Food>(
    initialFood || {
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFood(prev => ({
      ...prev,
      [name]: name === "name" ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(food);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialFood ? "Edit Food" : "Add Custom Food"}</DialogTitle>
          <DialogDescription>
            Enter the nutritional information for your food.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Food Name</Label>
            <Input
              id="name"
              name="name"
              value={food.name}
              onChange={handleChange}
              placeholder="e.g., Homemade Banana Bread"
              required
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              name="calories"
              type="number"
              min="0"
              value={food.calories}
              onChange={handleChange}
              placeholder="e.g., 250"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                name="protein"
                type="number"
                min="0"
                step="0.1"
                value={food.protein}
                onChange={handleChange}
                placeholder="e.g., 5"
                required
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                step="0.1"
                value={food.carbs}
                onChange={handleChange}
                placeholder="e.g., 30"
                required
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                name="fat"
                type="number"
                min="0"
                step="0.1"
                value={food.fat}
                onChange={handleChange}
                placeholder="e.g., 10"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialFood ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FoodEntryModal;
