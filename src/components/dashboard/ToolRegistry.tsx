'use client'

import { useAgentStore, type ToolDefinition } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Search,
  Code,
  Globe,
  Database,
  FileText,
  Eye,
  Mail,
  Network,
  Wrench,
  Zap,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Network: <Network className="w-5 h-5" />,
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  retrieval: { label: 'Retrieval', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
  action: { label: 'Action', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  analysis: { label: 'Analysis', color: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
  communication: { label: 'Communication', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
}

const toolStats = [
  { label: 'Total Calls (24h)', value: '1,921' },
  { label: 'Avg Latency', value: '654ms' },
  { label: 'Error Rate', value: '2.4%' },
  { label: 'Cache Hit Rate', value: '34.7%' },
]

const latencyHistory = [
  { tool: 'Web Search', current: 320, baseline: 290, trend: 'up' },
  { tool: 'Code Interpreter', current: 1500, baseline: 1350, trend: 'up' },
  { tool: 'API Caller', current: 450, baseline: 480, trend: 'down' },
  { tool: 'Data Retriever', current: 85, baseline: 80, trend: 'up' },
  { tool: 'File Manager', current: 200, baseline: 210, trend: 'down' },
  { tool: 'Image Analyzer', current: 2200, baseline: 2400, trend: 'down' },
  { tool: 'Knowledge Graph', current: 380, baseline: 400, trend: 'down' },
]

export function ToolRegistry() {
  const tools = useAgentStore((s) => s.tools)
  const toggleTool = useAgentStore((s) => s.toggleTool)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null)

  const categories = ['all', ...new Set(tools.map((t) => t.category))]

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {toolStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tool List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'All' : categoryConfig[cat]?.label || cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTools.map((tool) => {
              const catConfig = categoryConfig[tool.category]
              return (
                <Card
                  key={tool.id}
                  className={cn(
                    'transition-all cursor-pointer hover:shadow-md',
                    selectedTool?.id === tool.id && 'ring-2 ring-primary',
                    !tool.enabled && 'opacity-60'
                  )}
                  onClick={() => setSelectedTool(tool)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          {iconMap[tool.icon]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold">{tool.name}</h3>
                            <Badge variant="outline" className="text-[10px] border-current/20" style={{ color: 'inherit' }}>
                              <span className={cn('text-[10px]', catConfig?.color.split(' ')[1])}>
                                {catConfig?.label}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tool.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={tool.enabled}
                        onCheckedChange={() => toggleTool(tool.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tool.latency}ms
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {tool.successRate}%
                      </span>
                      {tool.enabled ? (
                        <span className="flex items-center gap-1 text-emerald-500 ml-auto">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground ml-auto">
                          <XCircle className="w-3 h-3" />
                          Disabled
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tool Detail */}
        <div className="lg:col-span-1">
          {selectedTool ? (
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    {iconMap[selectedTool.icon]}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{selectedTool.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={cn('text-[10px] mt-1', categoryConfig[selectedTool.category]?.color)}
                    >
                      {categoryConfig[selectedTool.category]?.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium mb-1">Description</p>
                  <p className="text-xs text-muted-foreground">{selectedTool.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-md bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">Latency</p>
                    <p className="text-sm font-semibold">{selectedTool.latency}ms</p>
                  </div>
                  <div className="p-2 rounded-md bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">Success Rate</p>
                    <p className="text-sm font-semibold">{selectedTool.successRate}%</p>
                  </div>
                </div>

                {selectedTool.inputSchema && (
                  <div>
                    <p className="text-xs font-medium mb-2">Input Schema</p>
                    <div className="space-y-1.5">
                      {Object.entries(selectedTool.inputSchema).map(([key, type]) => (
                        <div key={key} className="flex items-center justify-between text-xs p-2 rounded-md bg-muted/50">
                          <span className="font-mono">{key}</span>
                          <Badge variant="outline" className="text-[10px]">{type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-medium mb-2">Latency Trend</p>
                  {(() => {
                    const history = latencyHistory.find((h) => h.tool === selectedTool.name)
                    if (!history) return null
                    return (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Current</span>
                          <span className="font-medium">{history.current}ms</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Baseline</span>
                          <span className="font-medium">{history.baseline}ms</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              history.trend === 'down' ? 'bg-emerald-500' : 'bg-amber-500'
                            )}
                            style={{ width: `${Math.min(100, (history.current / history.baseline) * 100)}%` }}
                          />
                        </div>
                        <p className={cn('text-[10px]', history.trend === 'down' ? 'text-emerald-500' : 'text-amber-500')}>
                          {history.trend === 'down' ? 'Improving' : 'Degraded'} vs baseline
                        </p>
                      </div>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-4 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Wrench className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a tool to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
