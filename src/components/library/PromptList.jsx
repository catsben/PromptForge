import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function PromptList({ prompts, onEdit, onDelete }) {
  const getCategoryColor = (category) => {
    const colors = {
      writing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      coding: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      productivity: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      creative: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
      analysis: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
      education: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100",
      business: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-4">
      {prompts.map((prompt, index) => (
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
        >
          <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card text-card-foreground">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground flex-1">
                      {prompt.title}
                    </h3>
                    <div className="flex items-center gap-1 ml-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{prompt.rating || "N/A"}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {prompt.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getCategoryColor(prompt.category)}>
                      {prompt.category?.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-border">
                      {prompt.model || "gpt-4"}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-border">
                      Temp: {prompt.temperature || 0.7}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(prompt.created_date), "MMM d, yyyy")}
                    </div>
                    <div>Used {prompt.usage_count || 0} times</div>
                    {prompt.notes && (
                      <div className="max-w-xs truncate">
                        Note: {prompt.notes}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 lg:flex-col lg:w-24">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(prompt)}
                    className="flex-1 lg:w-full bg-card/80 backdrop-blur-sm hover:bg-card border-border"
                  >
                    <Edit className="w-3 h-3 mr-1 lg:mr-0" />
                    <span className="lg:hidden">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(prompt.id)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 border-border"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
