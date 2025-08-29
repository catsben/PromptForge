import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Zap, Library, Sparkles, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Prompt Tester",
    url: createPageUrl("Dashboard"),
    icon: Zap,
  },
  {
    title: "Prompt Library",
    url: createPageUrl("Library"),
    icon: Library,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('promptforge-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('promptforge-theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <div style={{
      '--primary': '262 71% 50%',
      '--primary-foreground': '210 40% 98%',
      '--secondary': '197 71% 45%',
      '--secondary-foreground': '210 40% 98%',
      '--accent': isDarkMode ? '217.2 32.6% 17.5%' : '262 71% 95%',
      '--accent-foreground': isDarkMode ? '210 40% 98%' : '262 71% 15%',
      '--muted': isDarkMode ? '217.2 32.6% 17.5%' : '220 14% 96%',
      '--muted-foreground': isDarkMode ? '215 20.2% 65.1%' : '220 14% 40%',
      '--background': isDarkMode ? '222.2 84% 4.9%' : '0 0% 100%',
      '--foreground': isDarkMode ? '210 40% 98%' : '222.2 84% 4.9%',
      '--border': isDarkMode ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%',
      '--input': isDarkMode ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%',
      '--ring': '262 71% 50%',
      '--card': isDarkMode ? '222.2 84% 4.9%' : '0 0% 100%',
      '--card-foreground': isDarkMode ? '210 40% 98%' : '222.2 84% 4.9%',
      '--popover': isDarkMode ? '222.2 84% 4.9%' : '0 0% 100%',
      '--popover-foreground': isDarkMode ? '210 40% 98%' : '222.2 84% 4.9%'
    }} className="min-h-screen flex w-full bg-background text-foreground">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${isDarkMode ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gradient-to-br from-purple-600 to-blue-600'} rounded-xl flex items-center justify-center shadow-lg`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  PromptForge
                </h2>
                <p className="text-xs text-muted-foreground font-medium">AI Prompt Engineering</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="w-full justify-start gap-2 bg-background hover:bg-accent border-border"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 p-4">
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                Workspace
              </p>
            </div>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    location.pathname === item.url 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-full flex items-center justify-center">
                <span className="text-muted-foreground font-semibold text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">Prompt Engineer</p>
                <p className="text-xs text-muted-foreground truncate">Create amazing prompts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-background via-background to-accent/10">
        {/* Mobile Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4 lg:hidden">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-accent p-2 rounded-xl transition-colors duration-200"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              PromptForge
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
