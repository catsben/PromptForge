import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Save, Thermometer, Zap, Settings } from "lucide-react";

const AI_PROVIDERS = {
  openai: {
    name: "OpenAI",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    models: [
      { id: "gpt-4", name: "GPT-4", description: "Most capable model" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "Faster GPT-4" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and efficient" }
    ]
  },
  anthropic: {
    name: "Anthropic",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    models: [
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", description: "Most capable Claude model" },
      { id: "claude-3-haiku", name: "Claude 3 Haiku", description: "Fast and efficient" },
      { id: "claude-3-opus", name: "Claude 3 Opus", description: "Most powerful Claude" }
    ]
  },
  google: {
    name: "Google",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    models: [
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Advanced reasoning" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Fast responses" }
    ]
  },
  deepseek: {
    name: "DeepSeek",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    models: [
      { id: "deepseek-v2", name: "DeepSeek-V2", description: "Open source excellence" },
      { id: "deepseek-coder-v2", name: "DeepSeek Coder V2", description: "Specialized for coding" }
    ]
  },
  mistral: {
    name: "Mistral AI",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    models: [
      { id: "mistral-large", name: "Mistral Large", description: "Most capable model" },
      { id: "mistral-medium", name: "Mistral Medium", description: "Balanced performance" },
      { id: "mistral-small", name: "Mistral Small", description: "Fast and efficient" }
    ]
  }
};

export default function PromptEditor({ 
  prompt, 
  setPrompt, 
  provider,
  setProvider,
  model, 
  setModel, 
  temperature, 
  setTemperature,
  maxTokens,
  setMaxTokens,
  onTest, 
  onSave, 
  isLoading,
  hasResponse 
}) {
  const currentProvider = AI_PROVIDERS[provider] || AI_PROVIDERS.openai;
  const currentModel = currentProvider.models.find(m => m.id === model) || currentProvider.models[0];

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    // Set default model for the new provider
    const defaultModel = AI_PROVIDERS[newProvider].models[0].id;
    setModel(defaultModel);
  };

  const getTemperatureRange = () => {
    // Different providers have different temperature ranges
    switch (provider) {
      case 'anthropic':
        return { min: 0, max: 1, step: 0.1 };
      case 'google':
        return { min: 0, max: 2, step: 0.1 };
      default:
        return { min: 0, max: 2, step: 0.1 };
    }
  };

  const tempRange = getTemperatureRange();

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>AI Provider</Label>
            <Select value={provider} onValueChange={handleProviderChange}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {Object.entries(AI_PROVIDERS).map(([key, providerInfo]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Badge className={providerInfo.color}>
                        {providerInfo.name}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {currentProvider.models.map((modelInfo) => (
                  <SelectItem key={modelInfo.id} value={modelInfo.id}>
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{modelInfo.name}</div>
                      <div className="text-xs text-muted-foreground">{modelInfo.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Temperature: {temperature[0]}
            </Label>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              max={tempRange.max}
              min={tempRange.min}
              step={tempRange.step}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Focused</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Max Tokens: {maxTokens}
            </Label>
            <Slider
              value={[maxTokens]}
              onValueChange={(value) => setMaxTokens(value[0])}
              max={8000}
              min={100}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Short</span>
              <span>Long</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-card to-muted/50 p-4 rounded-xl border border-border">
        <div className="flex items-center gap-3 mb-2">
          <Badge className={currentProvider.color}>
            {currentProvider.name}
          </Badge>
          <span className="font-medium text-sm">{currentModel.name}</span>
        </div>
        <p className="text-sm text-muted-foreground">{currentModel.description}</p>
      </div>

      <div className="space-y-2 flex-1 flex flex-col">
        <Label htmlFor="prompt">Your Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Enter your prompt here... Be specific and detailed for better results."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 min-h-[300px] resize-none font-mono text-sm leading-relaxed bg-background border-border"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={onTest}
          disabled={!prompt.trim() || isLoading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1 md:flex-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Testing with {currentProvider.name}...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Test with {currentProvider.name}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={onSave}
          disabled={!prompt.trim()}
          className="bg-card/80 backdrop-blur-sm hover:bg-card border-border"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}
