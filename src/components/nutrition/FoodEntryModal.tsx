import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Food, logFood } from "@/services/foodService";
import { useToast } from "@/hooks/use-toast";

interface FoodEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: Food) => void;
  initialFood?: Food;
  mealType: string;
}

const FoodEntryModal: React.FC<FoodEntryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialFood,
  mealType
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [foodName, setFoodName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const loggedFood = await logFood({
        foodName: foodName,
        mealType: mealType
      });
      
      onSave(loggedFood);
      onClose();
      
      toast({
        title: "Success",
        description: `Successfully logged ${foodName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log food. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Food</DialogTitle>
          <DialogDescription>
            Enter the name of the food you want to log.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="foodName">Food Name</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Apple"
              required
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Food"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FoodEntryModal;
