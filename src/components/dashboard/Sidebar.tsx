'use client'

import { useAgentStore } from '@/lib/store'
import {
  LayoutDashboard,
  Bot,
  GitBranch,
  Wrench,
  Activity,
  Moon,
  Sun,
  Cpu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'playground', label: 'Agent Playground', icon: Bot },
  { id: 'workflows', label: 'Workflow Builder', icon: GitBranch },
  { id: 'tools', label: 'Tool Registry', icon: Wrench },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
]

export function Sidebar() {
  const activeTab = useAgentStore((s) => s.activeTab)
  const setActiveTab = useAgentStore((s) => s.setActiveTab)
  const darkMode = useAgentStore((s) => s.darkMode)
  const toggleDarkMode = useAgentStore((s) => s.toggleDarkMode)
  const metrics = useAgentStore((s) => s.metrics)

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">Agentic AI</h1>
          <p className="text-xs text-muted-foreground">Command Center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>System Status</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-xs space-y-0.5">
            <p className="text-muted-foreground">Active Agents</p>
            <p className="font-semibold text-foreground">{metrics.activeAgents}</p>
          </div>
          <div className="text-xs space-y-0.5">
            <p className="text-muted-foreground">Throughput</p>
            <p className="font-semibold text-foreground">{metrics.throughput}/s</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </aside>
  )
}
