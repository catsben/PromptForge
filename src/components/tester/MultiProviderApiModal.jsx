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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Shield, Check, AlertCircle, ExternalLink } from "lucide-react";

const API_PROVIDERS = {
  openai: {
    name: "OpenAI",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    keyPrefix: "sk-",
    docs: "https://platform.openai.com/api-keys",
    description: "GPT-4, GPT-3.5 Turbo models"
  },
  anthropic: {
    name: "Anthropic",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    keyPrefix: "sk-ant-",
    docs: "https://console.anthropic.com/",
    description: "Claude 3.5, Claude 3 models"
  },
  google: {
    name: "Google AI",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    keyPrefix: "AI",
    docs: "https://makersuite.google.com/app/apikey",
    description: "Gemini 1.5 Pro, Flash models"
  },
  deepseek: {
    name: "DeepSeek",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    keyPrefix: "sk-",
    docs: "https://platform.deepseek.com/api_keys",
    description: "DeepSeek-V2, DeepSeek Coder"
  },
  mistral: {
    name: "Mistral AI",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    keyPrefix: "MR-",
    docs: "https://console.mistral.ai/api-keys/",
    description: "Mistral Large, Medium, Small"
  }
};

export default function MultiProviderApiModal({ isOpen, onClose, onSave }) {
  const [apiKeys, setApiKeys] = useState({});
  const [activeTab, setActiveTab] = useState("openai");

  useEffect(() => {
    if (isOpen) {
      loadStoredKeys();
    }
  }, [isOpen]);

  const loadStoredKeys = () => {
    const stored = {};
    Object.keys(API_PROVIDERS).forEach(provider => {
      const key = localStorage.getItem(`${provider}_api_key`);
      if (key) {
        stored[provider] = key;
      }
    });
    setApiKeys(stored);
  };

  const handleKeyChange = (provider, key) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: key
    }));
  };

  const handleSave = () => {
    // Save all keys to localStorage
    Object.entries(apiKeys).forEach(([provider, key]) => {
      if (key.trim()) {
        localStorage.setItem(`${provider}_api_key`, key.trim());
      } else {
        localStorage.removeItem(`${provider}_api_key`);
      }
    });
    onSave();
  };

  const isKeyValid = (provider, key) => {
    if (!key) return null;
    const expectedPrefix = API_PROVIDERS[provider].keyPrefix;
    return key.startsWith(expectedPrefix);
  };

  const getProviderStatus = (provider) => {
    const key = apiKeys[provider];
    if (!key) return "not-configured";
    return isKeyValid(provider, key) ? "valid" : "invalid";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-600" />
            Multi-Provider API Configuration
          </DialogTitle>
        </DialogHeader>
        
        <Alert className="bg-muted/50 border-border">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your API keys are stored locally in your browser and never sent to our servers.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-muted">
            {Object.entries(API_PROVIDERS).map(([key, provider]) => {
              const status = getProviderStatus(key);
              return (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="relative data-[state=active]:bg-card"
                >
                  {provider.name}
                  {status === "valid" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  )}
                  {status === "invalid" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-2 h-2 text-white" />
                    </div>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(API_PROVIDERS).map(([key, provider]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-card to-muted/50 rounded-xl border border-border">
                <Badge className={provider.color}>
                  {provider.name}
                </Badge>
                <div>
                  <p className="font-medium text-sm">{provider.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${key}-key`}>API Key</Label>
                <Input
                  id={`${key}-key`}
                  type="password"
                  placeholder={`${provider.keyPrefix}...`}
                  value={apiKeys[key] || ""}
                  onChange={(e) => handleKeyChange(key, e.target.value)}
                  className={`font-mono text-sm bg-background border-border ${
                    getProviderStatus(key) === "invalid" 
                      ? "border-red-300 focus:border-red-500" 
                      : getProviderStatus(key) === "valid"
                      ? "border-green-300 focus:border-green-500"
                      : ""
                  }`}
                />
                {getProviderStatus(key) === "invalid" && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Invalid key format. Expected to start with "{provider.keyPrefix}"
                  </p>
                )}
                {getProviderStatus(key) === "valid" && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    API key format looks correct
                  </p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-border">
                <p className="text-sm text-foreground mb-2">
                  Get your API key from {provider.name}:
                </p>
                <a 
                  href__={provider.docs} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                >
                  {provider.docs}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="grid grid-cols-5 gap-2 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <div className="space-y-1">
              {Object.keys(API_PROVIDERS).map(provider => {
                const status = getProviderStatus(provider);
                return (
                  <div key={provider} className="flex items-center justify-center">
                    {status === "valid" ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : status === "invalid" ? (
                      <AlertCircle className="w-3 h-3 text-red-500" />
                    ) : (
                      <div className="w-3 h-3 bg-muted rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-4 text-xs text-muted-foreground">
            Configure API keys for the AI providers you want to use. Keys are stored securely in your browser.
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
            Save All Keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
