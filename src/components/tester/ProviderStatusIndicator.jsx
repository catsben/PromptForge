import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Zap } from "lucide-react";

const PROVIDER_CONFIGS = {
  openai: { name: "OpenAI", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
  anthropic: { name: "Anthropic", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
  google: { name: "Google", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
  deepseek: { name: "DeepSeek", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
  mistral: { name: "Mistral", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" }
};

export default function ProviderStatusIndicator({ provider, hasApiKey, isActive }) {
  const config = PROVIDER_CONFIGS[provider];
  
  if (!config) return null;

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
      isActive ? 'bg-card shadow-md border border-border' : 'hover:bg-card/50'
    }`}>
      <Badge className={config.color}>
        {config.name}
      </Badge>
      
      <div className="flex items-center gap-1">
        {hasApiKey ? (
          <Check className="w-3 h-3 text-green-500" />
        ) : (
          <AlertCircle className="w-3 h-3 text-red-500" />
        )}
        
        {isActive && (
          <Zap className="w-3 h-3 text-purple-500 animate-pulse" />
        )}
      </div>
    </div>
  );
}
