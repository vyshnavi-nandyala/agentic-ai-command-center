'use client'

import { useState, useEffect } from 'react'
import { useAgentStore, type LogEntry, type LogLevel } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Activity,
  AlertTriangle,
  XCircle,
  Info,
  Bug,
  Trash2,
  Pause,
  Play,
  Zap,
  Brain,
  Wrench,
  Server,
  Cpu,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { cn } from '@/lib/utils'

const throughputData = Array.from({ length: 30 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  throughput: Math.floor(Math.random() * 20 + 8),
  errors: Math.floor(Math.random() * 3),
}))

const tokenUsageData = Array.from({ length: 7 }, (_, i) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return {
    day: days[i],
    input: Math.floor(Math.random() * 500000 + 300000),
    output: Math.floor(Math.random() * 300000 + 150000),
  }
})

const levelConfig: Record<LogLevel, { icon: React.ReactNode; color: string; bg: string }> = {
  info: { icon: <Info className="w-3.5 h-3.5" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  warn: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  error: { icon: <XCircle className="w-3.5 h-3.5" />, color: 'text-red-500', bg: 'bg-red-500/10' },
  debug: { icon: <Bug className="w-3 h-3" />, color: 'text-muted-foreground', bg: 'bg-muted' },
}

const sourceIcons: Record<string, React.ReactNode> = {
  'Agent Orchestrator': <Brain className="w-3 h-3" />,
  'Web Search': <Zap className="w-3 h-3" />,
  'Code Interpreter': <Cpu className="w-3 h-3" />,
  'Tool Manager': <Wrench className="w-3 h-3" />,
  'System': <Server className="w-3 h-3" />,
}

const sampleLogs: LogEntry[] = [
  { id: '1', timestamp: new Date(Date.now() - 30000), level: 'info', source: 'Agent Orchestrator', message: 'Task #482 completed successfully. Multi-step research workflow executed 6 steps in 3.2s with 95% quality score.' },
  { id: '2', timestamp: new Date(Date.now() - 60000), level: 'warn', source: 'Code Interpreter', message: 'Code execution timeout approaching (25s remaining). Long-running computation detected in data processing step.' },
  { id: '3', timestamp: new Date(Date.now() - 90000), level: 'info', source: 'Web Search', message: 'Search API returned 8 results for query "multi-agent LLM systems". Cache hit ratio: 45%.' },
  { id: '4', timestamp: new Date(Date.now() - 120000), level: 'error', source: 'Tool Manager', message: 'API Caller failed: Rate limit exceeded for external API (429). Automatic retry scheduled with exponential backoff.' },
  { id: '5', timestamp: new Date(Date.now() - 150000), level: 'info', source: 'System', message: 'Auto-scaling triggered: Active agents increased from 2 to 3 due to queue depth exceeding threshold.' },
  { id: '6', timestamp: new Date(Date.now() - 200000), level: 'debug', source: 'Agent Orchestrator', message: 'Planning phase for Task #483: Decomposed into 5 steps. Estimated tokens: ~2,400.' },
  { id: '7', timestamp: new Date(Date.now() - 250000), level: 'warn', source: 'System', message: 'Token usage trending 12% above baseline for current hour. Consider enabling prompt caching.' },
  { id: '8', timestamp: new Date(Date.now() - 300000), level: 'info', source: 'Code Interpreter', message: 'Validation pipeline completed. All 12 unit tests passed. Security scan: 0 vulnerabilities.' },
  { id: '9', timestamp: new Date(Date.now() - 360000), level: 'error', source: 'Agent Orchestrator', message: 'Task #479 failed at step 4 (Quality Check): Score 72% below threshold 85%. Retrying.' },
  { id: '10', timestamp: new Date(Date.now() - 420000), level: 'info', source: 'System', message: 'Knowledge Graph index refreshed. 12,450 entities indexed. Avg query latency: 380ms.' },
]

export function MonitoringPanel() {
  const addLog = useAgentStore((s) => s.addLog)
  const [logs, setLogs] = useState<LogEntry[]>(sampleLogs)
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all')
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return
    const liveMessages = [
      { level: 'info' as LogLevel, source: 'Agent Orchestrator', message: 'Task #' + Math.floor(Math.random() * 100 + 480) + ' started. Allocating resources for multi-step execution.' },
      { level: 'info' as LogLevel, source: 'Web Search', message: 'Batch search completed: ' + Math.floor(Math.random() * 10 + 3) + ' queries in ' + (Math.random() * 2 + 0.5).toFixed(1) + 's.' },
      { level: 'debug' as LogLevel, source: 'System', message: 'Memory: ' + Math.floor(Math.random() * 30 + 55) + '%. CPU: ' + Math.floor(Math.random() * 20 + 30) + '%.' },
      { level: 'warn' as LogLevel, source: 'Code Interpreter', message: 'Sandbox memory approaching limit (' + Math.floor(Math.random() * 50 + 400) + 'MB / 512MB).' },
      { level: 'info' as LogLevel, source: 'Tool Manager', message: 'Cache hit rate: ' + Math.floor(Math.random() * 20 + 30) + '%. Evicted ' + Math.floor(Math.random() * 50) + ' entries.' },
    ]
    const interval = setInterval(() => {
      const msg = liveMessages[Math.floor(Math.random() * liveMessages.length)]
      const newLog: LogEntry = { id: `live-${Date.now()}`, timestamp: new Date(), ...msg }
      setLogs((prev) => [newLog, ...prev].slice(0, 200))
      addLog(newLog)
    }, 3000)
    return () => clearInterval(interval)
  }, [isLive, addLog])

  const filteredLogs = levelFilter === 'all' ? logs : logs.filter((l) => l.level === levelFilter)
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              Throughput &amp; Errors (30h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={throughputData}>
                  <defs>
                    <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={4} />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="throughput" stroke="#10b981" fill="url(#tGrad)" strokeWidth={2} name="Tasks/min" />
                  <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="url(#eGrad)" strokeWidth={2} name="Errors" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4 text-muted-foreground" />
              Token Usage (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tokenUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} formatter={(value: number) => [value.toLocaleString(), '']} />
                  <Line type="monotone" dataKey="input" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Input Tokens" />
                  <Line type="monotone" dataKey="output" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="Output Tokens" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Uptime', value: '99.97%', status: 'healthy' },
          { label: 'Memory', value: '68.2%', status: 'healthy' },
          { label: 'CPU', value: '42.1%', status: 'healthy' },
          { label: 'Queue Depth', value: '7', status: 'healthy' },
          { label: 'Error Rate', value: '4.6%', status: 'warning' },
          { label: 'P99 Latency', value: '6.8s', status: 'warning' },
        ].map((indicator) => (
          <Card key={indicator.label}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-muted-foreground">{indicator.label}</p>
                <div className={cn('w-2 h-2 rounded-full', indicator.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500')} />
              </div>
              <p className="text-base font-bold">{indicator.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Live System Logs
                {isLive && (
                  <span className="flex items-center gap-1 ml-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-500 font-normal">Live</span>
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs">Real-time execution logs and system events</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'info', 'warn', 'error', 'debug'] as const).map((level) => (
                <Button key={level} variant={levelFilter === level ? 'default' : 'outline'} size="sm" className="text-xs h-7 px-2" onClick={() => setLevelFilter(level)}>
                  {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
                  {level !== 'all' && (
                    <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                      {logs.filter((l) => l.level === level).length}
                    </Badge>
                  )}
                </Button>
              ))}
              <div className="w-px h-5 bg-border" />
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setIsLive(!isLive)}>
                {isLive ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {isLive ? 'Pause' : 'Resume'}
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setLogs([])}>
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border bg-muted/30 max-h-[400px] overflow-y-auto font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">No logs to display</div>
            ) : (
              filteredLogs.map((log) => {
                const config = levelConfig[log.level]
                return (
                  <div key={log.id} className={cn('flex items-start gap-2 px-3 py-2 border-b border-border/50 hover:bg-accent/30 transition-colors', log.level === 'error' && 'bg-red-500/5')}>
                    <span className="text-muted-foreground whitespace-nowrap flex-shrink-0">{formatTime(log.timestamp)}</span>
                    <div className={cn('flex-shrink-0 w-5 h-5 rounded flex items-center justify-center', config.bg)}>
                      <span className={config.color}>{config.icon}</span>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1 text-muted-foreground min-w-[130px]">
                      {sourceIcons[log.source] || <Server className="w-3 h-3" />}
                      <span className="truncate">{log.source}</span>
                    </div>
                    <p className={cn('flex-1 text-foreground/80 leading-relaxed', log.level === 'error' && 'text-red-400')}>{log.message}</p>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
