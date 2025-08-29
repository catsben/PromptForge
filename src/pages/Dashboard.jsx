import React, { useState, useEffect } from "react";
import { Prompt } from "@/entities/Prompt";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Clock,
  Star,
  BookOpen,
  Zap,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import MultiProviderApiModal from "../components/tester/MultiProviderApiModal";
import ProviderStatusIndicator from "../components/tester/ProviderStatusIndicator";
import PromptEditor from "../components/tester/PromptEditor";
import ResponseViewer from "../components/tester/ResponseViewer";
import QuickSave from "../components/tester/QuickSave";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt-4");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeys, setApiKeys] = useState({});
  const [responseTime, setResponseTime] = useState(null);

  useEffect(() => {
    loadRecentPrompts();
    loadApiKeys();
  }, []);

  const loadApiKeys = () => {
    const keys = {};
    ['openai', 'anthropic', 'google', 'deepseek', 'mistral'].forEach(provider => {
      const key = localStorage.getItem(`${provider}_api_key`);
      if (key) {
        keys[provider] = key;
      }
    });
    setApiKeys(keys);
  };

  const loadRecentPrompts = async () => {
    try {
      const prompts = await Prompt.list("-updated_date", 5);
      setRecentPrompts(prompts);
    } catch (error) {
      console.error("Error loading recent prompts:", error);
    }
  };

  const testPrompt = async () => {
    if (!prompt.trim()) return;
    
    const currentApiKey = apiKeys[provider];
    if (!currentApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setIsLoading(true);
    setResponseTime(null);
    const startTime = Date.now();
    
    try {
      const result = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });
      
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      setResponse(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message || `Failed to get response from ${provider.toUpperCase()} model`}`);
    }
    setIsLoading(false);
  };

  const savePrompt = async (promptData) => {
    try {
      await Prompt.create({
        ...promptData,
        content: prompt,
        provider: provider,
        model: model,
        temperature: temperature[0],
        max_tokens: maxTokens,
        last_response: response,
        usage_count: 1,
        average_response_time: responseTime
      });
      setShowSaveDialog(false);
      loadRecentPrompts();
    } catch (error) {
      console.error("Error saving prompt:", error);
    }
  };

  const loadPromptFromRecent = (recentPrompt) => {
    setPrompt(recentPrompt.content);
    setProvider(recentPrompt.provider || "openai");
    setModel(recentPrompt.model || "gpt-4");
    setTemperature([recentPrompt.temperature || 0.7]);
    setMaxTokens(recentPrompt.max_tokens || 2000);
    if (recentPrompt.last_response) {
      setResponse(recentPrompt.last_response);
    }
  };

  const handleApiKeyUpdate = () => {
    loadApiKeys();
    setShowApiKeyModal(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/10">
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto h-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Multi-Provider AI Studio
              </h1>
              <p className="text-muted-foreground mt-2">Test prompts across different AI providers</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center gap-2 bg-card/80 backdrop-blur-sm hover:bg-card border-border"
            >
              <Settings className="w-4 h-4" />
              API Settings
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-200px)]">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-8"
            >
              <Card className="h-full glass-effect border-0 shadow-xl bg-card text-card-foreground">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Multi-Provider Testing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 h-[calc(100%-80px)] flex flex-col">
                  <Tabs defaultValue="editor" className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
                      <TabsTrigger value="editor" className="data-[state=active]:bg-card">Prompt Editor</TabsTrigger>
                      <TabsTrigger value="response" className="data-[state=active]:bg-card">AI Response</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="editor" className="flex-1 flex flex-col mt-0">
                      <PromptEditor 
                        prompt={prompt}
                        setPrompt={setPrompt}
                        provider={provider}
                        setProvider={setProvider}
                        model={model}
                        setModel={setModel}
                        temperature={temperature}
                        setTemperature={setTemperature}
                        maxTokens={maxTokens}
                        setMaxTokens={setMaxTokens}
                        onTest={testPrompt}
                        onSave={() => setShowSaveDialog(true)}
                        isLoading={isLoading}
                        hasResponse={!!response}
                      />
                    </TabsContent>
                    
                    <TabsContent value="response" className="flex-1 flex flex-col mt-0">
                      <ResponseViewer 
                        response={response}
                        isLoading={isLoading}
                        onTest={testPrompt}
                        hasPrompt={!!prompt.trim()}
                        provider={provider}
                        responseTime={responseTime}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 space-y-6"
            >
              <Card className="glass-effect border-0 shadow-lg bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Provider Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['openai', 'anthropic', 'google', 'deepseek', 'mistral'].map(p => (
                    <ProviderStatusIndicator
                      key={p}
                      provider={p}
                      hasApiKey={!!apiKeys[p]}
                      isActive={p === provider}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-effect border-0 shadow-lg bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Recent Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentPrompts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No saved prompts yet</p>
                      <p className="text-sm">Start creating and saving prompts!</p>
                    </div>
                  ) : (
                    recentPrompts.map((recentPrompt) => (
                      <motion.div
                        key={recentPrompt.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-card to-muted/50 border border-border cursor-pointer transition-all duration-200 hover:shadow-md"
                        onClick={() => loadPromptFromRecent(recentPrompt)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-foreground truncate flex-1">
                            {recentPrompt.title}
                          </h4>
                          <div className="flex items-center gap-1 ml-2">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-muted-foreground">{recentPrompt.rating || 'N/A'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {recentPrompt.content}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {recentPrompt.category?.replace('_', ' ')}
                          </Badge>
                          {recentPrompt.provider && (
                            <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                              {recentPrompt.provider}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <MultiProviderApiModal 
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeyUpdate}
      />

      <QuickSave
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={savePrompt}
        prompt={prompt}
      />
    </div>
  );
}
