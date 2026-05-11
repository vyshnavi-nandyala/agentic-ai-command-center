'use client'

import { useAgentStore, type AgentTask } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  Zap,
  BarChart3,
  ArrowRight,
  Activity,
  Timer,
  Target,
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const latencyData = [
  { time: '00:00', latency: 1800, tokens: 320 },
  { time: '02:00', latency: 2100, tokens: 280 },
  { time: '04:00', latency: 1500, tokens: 150 },
  { time: '06:00', latency: 2200, tokens: 410 },
  { time: '08:00', latency: 3100, tokens: 620 },
  { time: '10:00', latency: 2800, tokens: 580 },
  { time: '12:00', latency: 3400, tokens: 700 },
  { time: '14:00', latency: 2600, tokens: 530 },
  { time: '16:00', latency: 2900, tokens: 610 },
  { time: '18:00', latency: 2400, tokens: 480 },
  { time: '20:00', latency: 2000, tokens: 390 },
  { time: '22:00', latency: 1700, tokens: 310 },
]

const toolUsageData = [
  { name: 'Web Search', calls: 456, color: '#10b981' },
  { name: 'Code Interpreter', calls: 312, color: '#f59e0b' },
  { name: 'API Caller', calls: 287, color: '#8b5cf6' },
  { name: 'Data Retriever', calls: 523, color: '#06b6d4' },
  { name: 'Knowledge Graph', calls: 198, color: '#ec4899' },
  { name: 'Image Analyzer', calls: 145, color: '#f97316' },
]

const costBreakdown = [
  { category: 'LLM Input Tokens', cost: 42.3 },
  { category: 'LLM Output Tokens', cost: 67.8 },
  { category: 'Tool Execution', cost: 18.4 },
  { category: 'Infrastructure', cost: 14.0 },
]

const recentTasks: Partial<AgentTask>[] = [
  {
    id: '1',
    title: 'Market Research Report',
    description: 'Analyze competitor pricing strategies using web search and data retrieval',
    status: 'completed',
    totalTokens: { input: 4200, output: 1800 },
    totalLatency: 4200,
    cost: 0.32,
    quality: 94,
  },
  {
    id: '2',
    title: 'Code Review Automation',
    description: 'Review pull request for performance issues and security vulnerabilities',
    status: 'completed',
    totalTokens: { input: 8900, output: 3200 },
    totalLatency: 7800,
    cost: 0.58,
    quality: 91,
  },
  {
    id: '3',
    title: 'Data Pipeline Optimization',
    description: 'Identify bottlenecks in ETL pipeline and suggest improvements',
    status: 'failed',
    totalTokens: { input: 6100, output: 2100 },
    totalLatency: 12300,
    cost: 0.45,
    quality: 72,
  },
  {
    id: '4',
    title: 'Customer Support Triage',
    description: 'Classify and route incoming support tickets using semantic analysis',
    status: 'completed',
    totalTokens: { input: 3400, output: 1200 },
    totalLatency: 2100,
    cost: 0.21,
    quality: 97,
  },
  {
    id: '5',
    title: 'API Integration Testing',
    description: 'Run comprehensive tests on new payment gateway integration endpoints',
    status: 'completed',
    totalTokens: { input: 5600, output: 2800 },
    totalLatency: 5400,
    cost: 0.39,
    quality: 88,
  },
]

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    completed: { label: 'Completed', variant: 'default' },
    failed: { label: 'Failed', variant: 'destructive' },
    running: { label: 'Running', variant: 'secondary' },
    pending: { label: 'Pending', variant: 'outline' },
    retrying: { label: 'Retrying', variant: 'secondary' },
  }
  const c = config[status] || config.pending
  return <Badge variant={c.variant}>{c.label}</Badge>
}

export function DashboardOverview() {
  const metrics = useAgentStore((s) => s.metrics)
  const setActiveTab = useAgentStore((s) => s.setActiveTab)

  const successRate = ((metrics.tasksSuccess / metrics.tasksTotal) * 100).toFixed(1)
  const avgTokens = Math.round(metrics.totalTokens / metrics.tasksTotal)

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Tasks</p>
                <p className="text-2xl font-bold mt-1">{metrics.tasksTotal.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">+12.5%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Success Rate</p>
                <p className="text-2xl font-bold mt-1">{successRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">+0.8%</span>
                  <span className="text-xs text-muted-foreground">improvement</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Avg Latency</p>
                <p className="text-2xl font-bold mt-1">{(metrics.avgLatency / 1000).toFixed(1)}s</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">-180ms</span>
                  <span className="text-xs text-muted-foreground">p95: {(metrics.p95Latency / 1000).toFixed(1)}s</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Timer className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Cost</p>
                <p className="text-2xl font-bold mt-1">${metrics.totalCost.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Coins className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-muted-foreground">{avgTokens} avg tokens/task</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latency Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              System Latency (24h)
            </CardTitle>
            <CardDescription className="text-xs">Request latency and token throughput over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={latencyData}>
                  <defs>
                    <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="latency"
                    stroke="#8b5cf6"
                    fill="url(#latencyGrad)"
                    strokeWidth={2}
                    name="Latency (ms)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tool Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              Tool Usage Distribution
            </CardTitle>
            <CardDescription className="text-xs">API calls per tool in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolUsageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="calls" radius={[0, 4, 4, 0]}>
                    {toolUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Recent Tasks
                </CardTitle>
                <CardDescription className="text-xs">Latest agent executions and their results</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setActiveTab('monitoring')}
              >
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium truncate">{task.title}</h4>
                      <StatusBadge status={task.status || 'pending'} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {task.totalTokens ? (task.totalTokens.input + task.totalTokens.output).toLocaleString() : 0} tokens
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {task.totalLatency ? (task.totalLatency / 1000).toFixed(1) + 's' : '-'}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        ${task.cost?.toFixed(3)}
                      </span>
                      {task.quality && (
                        <span className={`text-xs font-medium ${task.quality >= 90 ? 'text-emerald-500' : task.quality >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
                          Quality: {task.quality}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Coins className="w-4 h-4 text-muted-foreground" />
              Cost Breakdown
            </CardTitle>
            <CardDescription className="text-xs">Spending distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="cost"
                  >
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#06b6d4" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#6b7280" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {costBreakdown.map((item, i) => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: ['#8b5cf6', '#06b6d4', '#f59e0b', '#6b7280'][i] }}
                    />
                    <span className="text-muted-foreground">{item.category}</span>
                  </div>
                  <span className="font-medium">${item.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
