
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (meal: { name: string, calories: number }) => void;
}

const LogMealModal: React.FC<LogMealModalProps> = ({
  isOpen,
  onClose,
  onLog,
}) => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(350);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && calories > 0) {
      onLog({ name, calories });
      setName("");
      setCalories(350);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
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
