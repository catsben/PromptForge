import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Save } from "lucide-react";

const categories = [
  { value: "writing", label: "Writing" },
  { value: "coding", label: "Coding" },
  { value: "productivity", label: "Productivity" },
  { value: "creative", label: "Creative" },
  { value: "analysis", label: "Analysis" },
  { value: "education", label: "Education" },
  { value: "business", label: "Business" },
  { value: "other", label: "Other" },
];

export default function QuickSave({ isOpen, onClose, onSave, prompt }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave({
      title: title.trim() || `Prompt ${new Date().toLocaleString()}`,
      category,
      rating,
      notes
    });
    // Reset form
    setTitle("");
    setCategory("other");
    setRating(3);
    setNotes("");
  };

  const StarRating = ({ rating, onRatingChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="transition-colors duration-200"
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground/50 hover:text-yellow-300"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5 text-purple-600" />
            Save Your Prompt
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your prompt a memorable title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this prompt..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="bg-background border-border"
            />
          </div>

          {prompt && (
            <div className="space-y-2">
              <Label>Prompt Preview</Label>
              <div className="bg-muted/50 p-3 rounded-lg max-h-32 overflow-auto border border-border">
                <p className="text-sm text-foreground font-mono">
                  {prompt.length > 200 ? `${prompt.substring(0, 200)}...` : prompt}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="border-border">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Prompt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
