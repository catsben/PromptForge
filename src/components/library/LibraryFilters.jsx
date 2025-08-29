import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, SortDesc } from "lucide-react";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "writing", label: "Writing" },
  { value: "coding", label: "Coding" },
  { value: "productivity", label: "Productivity" },
  { value: "creative", label: "Creative" },
  { value: "analysis", label: "Analysis" },
  { value: "education", label: "Education" },
  { value: "business", label: "Business" },
  { value: "other", label: "Other" },
];

export default function LibraryFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedRating,
  setSelectedRating,
  sortBy,
  setSortBy,
  totalCount
}) {
  return (
    <Card className="glass-effect border-0 shadow-lg bg-card text-card-foreground">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search prompts by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/80 backdrop-blur-sm border-border"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40 bg-background/80 backdrop-blur-sm border-border">
                <Filter className="w-4 h-4 mr-2" />
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
            
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full sm:w-32 bg-background/80 backdrop-blur-sm border-border">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4+">4+ Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-36 bg-background/80 backdrop-blur-sm border-border">
                <SortDesc className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="-created_date">Newest</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="-rating">Highest Rated</SelectItem>
                <SelectItem value="-usage_count">Most Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {totalCount} prompts
        </div>
      </CardContent>
    </Card>
  );
}
