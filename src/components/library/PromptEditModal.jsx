import React, { useState, useEffect } from "react";
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
import { Star, Save, Edit } from "lucide-react";

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

const providers = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google AI" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "mistral", label: "Mistral AI" },
];

export default function PromptEditModal({ prompt, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "other",
    rating: 3,
    notes: "",
    provider: "openai",
    model: "gpt-4",
    temperature: 0.7,
    max_tokens: 2000,
  });

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title || "",
        content: prompt.content || "",
        category: prompt.category || "other",
        rating: prompt.rating || 3,
        notes: prompt.notes || "",
        provider: prompt.provider || "openai",
        model: prompt.model || "gpt-4",
        temperature: prompt.temperature || 0.7,
        max_tokens: prompt.max_tokens || 2000,
      });
    }
  }, [prompt]);

  const handleSave = () => {
    onSave(prompt.id, formData);
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-purple-600" />
            Edit Prompt
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Prompt Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="font-mono text-sm bg-background border-border"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
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
              <Label>Provider</Label>
              <Select 
                value={formData.provider} 
                onValueChange={(value) => setFormData({ ...formData, provider: value })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {providers.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., gpt-4, claude-3-5-sonnet"
                className="bg-background border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input
                type="number"
                min="100"
                max="8000"
                step="100"
                value={formData.max_tokens}
                onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) || 0 })}
                className="bg-background border-border"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
                className="bg-background border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating 
                rating={formData.rating} 
                onRatingChange={(rating) => setFormData({ ...formData, rating })} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Add any notes about this prompt..."
              className="bg-background border-border"
            />
          </div>
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
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
