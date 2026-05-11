import { create } from 'zustand'

export type TaskStatus = 'idle' | 'planning' | 'executing' | 'completed' | 'failed' | 'retrying'
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export interface ToolDefinition {
  id: string
  name: string
  description: string
  icon: string
  category: 'retrieval' | 'action' | 'analysis' | 'communication'
  enabled: boolean
  latency?: number
  successRate?: number
  inputSchema?: Record<string, string>
}

export interface WorkflowStep {
  id: string
  name: string
  type: 'llm_call' | 'tool_use' | 'data_transform' | 'conditional' | 'aggregation'
  toolId?: string
  status: StepStatus
  input: string
  output?: string
  latency?: number
  tokens?: { input: number; output: number }
  error?: string
  metadata?: Record<string, unknown>
}

export interface AgentTask {
  id: string
  title: string
  description: string
  status: TaskStatus
  createdAt: Date
  completedAt?: Date
  steps: WorkflowStep[]
  totalTokens: { input: number; output: number }
  totalLatency: number
  cost: number
  quality?: number
}

export interface LogEntry {
  id: string
  timestamp: Date
  level: LogLevel
  source: string
  message: string
  metadata?: Record<string, unknown>
}

export interface SystemMetrics {
  tasksTotal: number
  tasksSuccess: number
  tasksFailed: number
  avgLatency: number
  p95Latency: number
  totalTokens: number
  totalCost: number
  activeAgents: number
  toolsRegistered: number
  uptime: number
  throughput: number
}

interface AgentStore {
  // Current view
  activeTab: string
  setActiveTab: (tab: string) => void

  // Tasks
  tasks: AgentTask[]
  currentTask: AgentTask | null
  addTask: (task: AgentTask) => void
  updateTask: (id: string, updates: Partial<AgentTask>) => void
  setCurrentTask: (task: AgentTask | null) => void

  // Tools
  tools: ToolDefinition[]
  setTools: (tools: ToolDefinition[]) => void
  toggleTool: (id: string) => void

  // Logs
  logs: LogEntry[]
  addLog: (log: LogEntry) => void
  clearLogs: () => void

  // Metrics
  metrics: SystemMetrics
  updateMetrics: (metrics: Partial<SystemMetrics>) => void

  // Chat input
  chatInput: string
  setChatInput: (input: string) => void
  isExecuting: boolean
  setIsExecuting: (executing: boolean) => void

  // Theme
  darkMode: boolean
  toggleDarkMode: () => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  tasks: [],
  currentTask: null,
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks], currentTask: task })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      currentTask: state.currentTask?.id === id ? { ...state.currentTask, ...updates } : state.currentTask,
    })),
  setCurrentTask: (task) => set({ currentTask: task }),

  tools: [
    {
      id: 'web_search',
      name: 'Web Search',
      description: 'Search the web for real-time information, news, and data from public sources.',
      icon: 'Search',
      category: 'retrieval',
      enabled: true,
      latency: 320,
      successRate: 97.5,
      inputSchema: { query: 'string', num_results: 'number' },
    },
    {
      id: 'code_interpreter',
      name: 'Code Interpreter',
      description: 'Execute Python code for data analysis, computation, and file processing.',
      icon: 'Code',
      category: 'analysis',
      enabled: true,
      latency: 1500,
      successRate: 92.3,
      inputSchema: { code: 'string', timeout: 'number' },
    },
    {
      id: 'api_caller',
      name: 'API Caller',
      description: 'Make HTTP requests to external APIs with authentication and error handling.',
      icon: 'Globe',
      category: 'action',
      enabled: true,
      latency: 450,
      successRate: 98.1,
      inputSchema: { url: 'string', method: 'string', headers: 'object', body: 'object' },
    },
    {
      id: 'data_retriever',
      name: 'Data Retriever',
      description: 'Query structured databases and retrieve contextual information for agent reasoning.',
      icon: 'Database',
      category: 'retrieval',
      enabled: true,
      latency: 85,
      successRate: 99.2,
      inputSchema: { query: 'string', source: 'string' },
    },
    {
      id: 'file_manager',
      name: 'File Manager',
      description: 'Read, write, and organize files across local and cloud storage systems.',
      icon: 'FileText',
      category: 'action',
      enabled: true,
      latency: 200,
      successRate: 99.8,
      inputSchema: { path: 'string', operation: 'string' },
    },
    {
      id: 'image_analyzer',
      name: 'Image Analyzer',
      description: 'Analyze images using vision models to extract text, objects, and scene descriptions.',
      icon: 'Eye',
      category: 'analysis',
      enabled: true,
      latency: 2200,
      successRate: 94.6,
      inputSchema: { image_url: 'string', analysis_type: 'string' },
    },
    {
      id: 'email_sender',
      name: 'Email Sender',
      description: 'Compose and send emails with templates, attachments, and scheduling support.',
      icon: 'Mail',
      category: 'communication',
      enabled: false,
      latency: 600,
      successRate: 99.5,
      inputSchema: { to: 'string', subject: 'string', body: 'string' },
    },
    {
      id: 'knowledge_graph',
      name: 'Knowledge Graph',
      description: 'Query and traverse knowledge graphs for entity relationships and semantic search.',
      icon: 'Network',
      category: 'retrieval',
      enabled: true,
      latency: 380,
      successRate: 96.8,
      inputSchema: { entity: 'string', depth: 'number' },
    },
  ],
  setTools: (tools) => set({ tools }),
  toggleTool: (id) =>
    set((state) => ({
      tools: state.tools.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    })),

  logs: [],
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 500) })),
  clearLogs: () => set({ logs: [] }),

  metrics: {
    tasksTotal: 1247,
    tasksSuccess: 1189,
    tasksFailed: 58,
    avgLatency: 2340,
    p95Latency: 5200,
    totalTokens: 4850000,
    totalCost: 142.5,
    activeAgents: 3,
    toolsRegistered: 8,
    uptime: 864000,
    throughput: 14.5,
  },
  updateMetrics: (metrics) =>
    set((state) => ({ metrics: { ...state.metrics, ...metrics } })),

  chatInput: '',
  setChatInput: (input) => set({ chatInput: input }),
  isExecuting: false,
  setIsExecuting: (executing) => set({ isExecuting: executing }),

  darkMode: true,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}))
