'use client'

import { useAgentStore } from '@/lib/store'
import { Bell, Search, Zap, Menu, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

const tabLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  playground: 'Agent Playground',
  workflows: 'Workflow Builder',
  tools: 'Tool Registry',
  monitoring: 'Monitoring & Observability',
}

export function Header() {
  const activeTab = useAgentStore((s) => s.activeTab)
  const setActiveTab = useAgentStore((s) => s.setActiveTab)
  const metrics = useAgentStore((s) => s.metrics)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="md:hidden flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold">{tabLabels[activeTab]}</h2>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Real-time agentic system management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden lg:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks, tools, logs..."
            className="w-64 pl-9 h-9 text-sm bg-muted/50"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">Agent #482 completed</span>
              <span className="text-xs text-muted-foreground">Multi-step research task finished in 3.2s</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">Tool latency spike detected</span>
              <span className="text-xs text-muted-foreground">Code Interpreter p95 exceeded 5s threshold</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">Cost alert: $0.50/hr</span>
              <span className="text-xs text-muted-foreground">Token usage trending above baseline</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
            ML
          </div>
          <div className="hidden sm:block text-xs">
            <p className="font-medium">ML Engineer</p>
            <p className="text-muted-foreground">VCV - Agentic AI</p>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-border p-3 space-y-1 md:hidden z-50">
          {['dashboard', 'playground', 'workflows', 'tools', 'monitoring'].map((id) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setMobileMenuOpen(false) }}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              {tabLabels[id]}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
