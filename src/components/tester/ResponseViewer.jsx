import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Copy, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ResponseViewer({ response, isLoading, onTest, hasPrompt, provider, responseTime }) {
  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
    }
  };

  const getProviderConfig = () => {
    const configs = {
      openai: { name: "OpenAI", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      anthropic: { name: "Anthropic", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
      google: { name: "Google AI", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
      deepseek: { name: "DeepSeek", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
      mistral: { name: "Mistral AI", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" }
    };
    return configs[provider] || configs.openai;
  };

  const providerConfig = getProviderConfig();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mb-4"
        />
        <p className="text-foreground">AI is thinking...</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={providerConfig.color}>
            {providerConfig.name}
          </Badge>
          <p className="text-sm text-muted-foreground">Processing your request</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <MessageCircle className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Ready to test your prompt</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Write your prompt in the editor and test it with any AI provider
        </p>
        {hasPrompt && (
          <Button
            onClick={onTest}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Test with {providerConfig.name}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 flex-1 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">AI Response</h3>
          <Badge className={providerConfig.color}>
            {providerConfig.name}
          </Badge>
          {responseTime && (
            <Badge variant="outline" className="text-xs border-border">
              {responseTime}ms
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyResponse}
          className="bg-card/80 backdrop-blur-sm hover:bg-card border-border"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>
      
      <Card className="flex-1 bg-gradient-to-br from-card to-muted/30 border-border">
        <CardContent className="p-6 h-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full overflow-auto"
          >
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {response}
            </pre>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
