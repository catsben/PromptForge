import React, { useState, useEffect } from "react";
import { Prompt } from "@/entities/Prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Download, 
  Library as LibraryIcon,
  Grid3X3,
  List
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PromptGrid from "../components/library/PromptGrid";
import PromptList from "../components/library/PromptList";
import LibraryFilters from "../components/library/LibraryFilters";
import PromptEditModal from "../components/library/PromptEditModal";

export default function Library() {
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("-created_date");
  const [isLoading, setIsLoading] = useState(true);
  const [editingPrompt, setEditingPrompt] = useState(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  useEffect(() => {
    filterAndSortPrompts();
  }, [prompts, searchTerm, selectedCategory, selectedRating, sortBy]);

  const loadPrompts = async () => {
    setIsLoading(true);
    try {
      const data = await Prompt.list(sortBy);
      setPrompts(data);
    } catch (error) {
      console.error("Error loading prompts:", error);
    }
    setIsLoading(false);
  };

  const filterAndSortPrompts = () => {
    let filtered = prompts.filter(prompt => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prompt.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory;
      const matchesRating = selectedRating === "all" || 
                           (selectedRating === "4+" && prompt.rating >= 4) ||
                           prompt.rating === parseInt(selectedRating);
      
      return matchesSearch && matchesCategory && matchesRating;
    });

    if (sortBy === "-created_date") {
      filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "-rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "-usage_count") {
      filtered.sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
    }

    setFilteredPrompts(filtered);
  };

  const exportPrompts = () => {
    const exportData = prompts.map(prompt => ({
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      rating: prompt.rating,
      notes: prompt.notes,
      provider: prompt.provider,
      model: prompt.model,
      temperature: prompt.temperature,
      max_tokens: prompt.max_tokens,
      created_date: prompt.created_date
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `promptforge-prompts-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const updatePrompt = async (id, data) => {
    try {
      await Prompt.update(id, data);
      loadPrompts();
      setEditingPrompt(null);
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const deletePrompt = async (id) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      try {
        await Prompt.delete(id);
        loadPrompts();
      } catch (error) {
        console.error("Error deleting prompt:", error);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              Prompt Library
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your collection of {prompts.length} prompts
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={exportPrompts}
              disabled={prompts.length === 0}
              className="bg-card/80 backdrop-blur-sm hover:bg-card border-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            
            <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : ""}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <LibraryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCount={filteredPrompts.length}
        />

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse bg-card border-border">
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-4/5"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredPrompts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <LibraryIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                {prompts.length === 0 ? "No prompts saved yet" : "No prompts match your filters"}
              </h3>
              <p className="text-muted-foreground">
                {prompts.length === 0 
                  ? "Start creating prompts in the testing studio!" 
                  : "Try adjusting your search or filter criteria"
                }
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {viewMode === "grid" ? (
                <PromptGrid
                  prompts={filteredPrompts}
                  onEdit={setEditingPrompt}
                  onDelete={deletePrompt}
                />
              ) : (
                <PromptList
                  prompts={filteredPrompts}
                  onEdit={setEditingPrompt}
                  onDelete={deletePrompt}
                />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <PromptEditModal
        prompt={editingPrompt}
        isOpen={!!editingPrompt}
        onClose={() => setEditingPrompt(null)}
        onSave={updatePrompt}
      />
    </div>
  );
}
