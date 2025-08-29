import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function PromptGrid({ prompts, onEdit, onDelete }) {
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

  const getProviderColor = (provider) => {
    const colors = {
      openai: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      anthropic: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
      google: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      deepseek: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      mistral: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    };
    return colors[provider] || colors.openai;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt, index) => (
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="h-full glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-card text-card-foreground">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg line-clamp-2 flex-1">
                  {prompt.title}
                </CardTitle>
                <div className="flex items-center gap-1 ml-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{prompt.rating || "N/A"}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getCategoryColor(prompt.category)}>
                  {prompt.category?.replace('_', ' ')}
                </Badge>
                {prompt.provider && (
                  <Badge className={getProviderColor(prompt.provider)}>
                    {prompt.provider}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs border-border">
                  {prompt.model || "gpt-4"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground line-clamp-4 mb-4 flex-1">
                {prompt.content}
              </p>
              
              {prompt.notes && (
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 italic">
                  Note: {prompt.notes}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(prompt.created_date), "MMM d, yyyy")}
                </div>
                <div className="flex items-center gap-2">
                  <div>Used {prompt.usage_count || 0} times</div>
                  {prompt.average_response_time && (
                    <div>Avg: {Math.round(prompt.average_response_time)}ms</div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(prompt)}
                  className="flex-1 bg-card/80 backdrop-blur-sm hover:bg-card group-hover:border-purple-300 border-border"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
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
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
