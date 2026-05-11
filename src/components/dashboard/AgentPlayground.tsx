'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useAgentStore, type WorkflowStep, type StepStatus } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Send,
  Bot,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  ChevronDown,
  ChevronRight,
  Copy,
  RotateCcw,
  Sparkles,
  Brain,
  Search,
  Code,
  Database,
  Globe,
  Zap,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const exampleTasks = [
  {
    label: 'Research a topic',
    prompt: 'Research the latest advances in multi-agent LLM systems and summarize key findings',
  },
  {
    label: 'Analyze data',
    prompt: 'Analyze the performance metrics from our agent system and identify optimization opportunities',
  },
  {
    label: 'Generate code',
    prompt: 'Write a Python function that implements a retry mechanism with exponential backoff for API calls',
  },
  {
    label: 'Compare options',
    prompt: 'Compare deterministic pipeline approaches vs adaptive LLM-driven approaches for structured data extraction',
  },
]

const stepIcons: Record<string, React.ReactNode> = {
  llm_call: <Brain className="w-4 h-4" />,
  tool_use: <Wrench className="w-4 h-4" />,
  data_transform: <Database className="w-4 h-4" />,
  conditional: <Zap className="w-4 h-4" />,
  aggregation: <Sparkles className="w-4 h-4" />,
}

const toolIcons: Record<string, React.ReactNode> = {
  web_search: <Search className="w-3.5 h-3.5" />,
  code_interpreter: <Code className="w-3.5 h-3.5" />,
  api_caller: <Globe className="w-3.5 h-3.5" />,
  data_retriever: <Database className="w-3.5 h-3.5" />,
}

function StepStatusIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'running':
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-500" />
    case 'skipped':
      return <AlertTriangle className="w-4 h-4 text-amber-500" />
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />
  }
}

function generateSteps(prompt: string): WorkflowStep[] {
  const needsSearch = /research|find|search|latest|current/i.test(prompt)
  const needsCode = /code|function|implement|write|script|program/i.test(prompt)
  const needsData = /analyze|data|metrics|performance|statistics/i.test(prompt)
  const needsCompare = /compare|versus|vs|difference/i.test(prompt)

  const steps: WorkflowStep[] = [
    {
      id: 'plan',
      name: 'Task Planning',
      type: 'llm_call',
      status: 'pending',
      input: `Decompose the task into executable steps: "${prompt}"`,
    },
  ]

  if (needsSearch) {
    steps.push({
      id: 'search',
      name: 'Web Search',
      type: 'tool_use',
      toolId: 'web_search',
      status: 'pending',
      input: 'Query search engines for relevant information',
    })
  }

  if (needsData) {
    steps.push({
      id: 'retrieve',
      name: 'Data Retrieval',
      type: 'tool_use',
      toolId: 'data_retriever',
      status: 'pending',
      input: 'Fetch relevant data from knowledge base and databases',
    })
  }

  if (needsCompare) {
    steps.push({
      id: 'compare-1',
      name: 'Gather Option A',
      type: 'tool_use',
      toolId: 'web_search',
      status: 'pending',
      input: 'Research first approach',
    })
    steps.push({
      id: 'compare-2',
      name: 'Gather Option B',
      type: 'tool_use',
      toolId: 'web_search',
      status: 'pending',
      input: 'Research second approach',
    })
  }

  if (needsCode) {
    steps.push({
      id: 'codegen',
      name: 'Code Generation',
      type: 'llm_call',
      status: 'pending',
      input: 'Generate implementation based on requirements and context',
    })
    steps.push({
      id: 'validate',
      name: 'Code Validation',
      type: 'tool_use',
      toolId: 'code_interpreter',
      status: 'pending',
      input: 'Execute and validate the generated code',
    })
  }

  steps.push({
    id: 'synthesize',
    name: 'Synthesis',
    type: 'llm_call',
    status: 'pending',
    input: 'Combine all gathered information into a coherent response',
  })

  steps.push({
    id: 'quality-check',
    name: 'Quality Check',
    type: 'conditional',
    status: 'pending',
    input: 'Verify output meets quality standards',
  })

  return steps
}

const simulatedOutputs: Record<string, { output: string; tokens: { input: number; output: number }; latency: number }> = {
  plan: {
    output: 'Decomposed task into 5 executable steps:\n1. Parse and understand the user intent\n2. Identify required tools and data sources\n3. Execute retrieval and analysis steps\n4. Synthesize findings into structured output\n5. Validate quality and completeness',
    tokens: { input: 85, output: 52 },
    latency: 420,
  },
  search: {
    output: 'Found 8 relevant sources:\n• "Multi-Agent Systems: A Survey" (NeurIPS 2025)\n• "Cooperative LLM Agents" (arXiv, 2025)\n• "Scaling Agentic Workflows" (ICML 2025)\n• Key themes: agent communication protocols, task decomposition, shared memory architectures',
    tokens: { input: 120, output: 78 },
    latency: 1250,
  },
  retrieve: {
    output: 'Retrieved 3 datasets:\n• Performance metrics (1,247 task executions)\n• Cost analysis (142.50 total spend)\n• Latency distribution (avg: 2.34s, p95: 5.2s)\n• Identified 3 optimization opportunities',
    tokens: { input: 95, output: 64 },
    latency: 380,
  },
  'compare-1': {
    output: 'Deterministic Pipeline Approach:\n• Predictable latency and cost\n• Easy to test and debug\n• Limited flexibility for novel inputs\n• Best for: well-defined, repetitive tasks\n• Tools: DAG-based workflow engines',
    tokens: { input: 110, output: 68 },
    latency: 890,
  },
  'compare-2': {
    output: 'Adaptive LLM-Driven Approach:\n• Flexible handling of edge cases\n• Can reason about novel situations\n• Higher latency and cost variance\n• Best for: complex, ambiguous tasks\n• Tools: ReAct, Chain-of-Thought, Plan-and-Execute',
    tokens: { input: 110, output: 72 },
    latency: 1050,
  },
  codegen: {
    output: '```python\nimport asyncio\nimport random\n\ndef retry_with_backoff(func, max_retries=3, base_delay=1.0):\n    """Execute func with exponential backoff retry logic."""\n    for attempt in range(max_retries):\n        try:\n            return func()\n        except Exception as e:\n            if attempt == max_retries - 1:\n                raise\n            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)\n            await asyncio.sleep(delay)\n    raise RuntimeError("Max retries exceeded")\n```\nGenerated function with proper error handling and configurable parameters.',
    tokens: { input: 180, output: 145 },
    latency: 2100,
  },
  validate: {
    output: 'Execution results:\n✓ Function defined successfully\n✓ Retry logic tested with 10 mock failures\n✓ Exponential backoff: 1.0s → 2.3s → 4.1s (avg)\n✓ Max retries enforced correctly\n✓ All edge cases handled\n\nQuality score: 94/100',
    tokens: { input: 200, output: 88 },
    latency: 1800,
  },
  synthesize: {
    output: '## Summary\n\nBased on comprehensive analysis across multiple sources and data points, here are the key findings:\n\n### Key Insights\n1. **Multi-agent architectures** show 35% improvement in complex task completion rates over single-agent systems\n2. **Hybrid approaches** (deterministic + adaptive) offer the best balance of reliability and flexibility\n3. **Cost optimization** can achieve 40% reduction through intelligent tool selection and caching\n\n### Recommendations\n- Implement plan-and-execute pattern for complex workflows\n- Use deterministic pipelines for high-volume, well-defined tasks\n- Deploy adaptive LLM reasoning for novel or ambiguous requests',
    tokens: { input: 320, output: 210 },
    latency: 1800,
  },
  'quality-check': {
    output: 'Quality assessment passed:\n• Completeness: 96%\n• Accuracy: 94%\n• Relevance: 98%\n• Coherence: 95%\n\nOverall quality score: 95.75%\n✓ Output meets quality threshold (90%)',
    tokens: { input: 150, output: 62 },
    latency: 350,
  },
}

export function AgentPlayground() {
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionComplete, setExecutionComplete] = useState(false)
  const abortRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const addTask = useAgentStore((s) => s.addTask)
  const addLog = useAgentStore((s) => s.addLog)

  const executeStep = useCallback(
    (step: WorkflowStep, index: number) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          if (abortRef.current) return resolve()

          setSteps((prev) =>
            prev.map((s, i) =>
              i === index
                ? {
                    ...s,
                    status: 'running' as StepStatus,
                    output: undefined,
                  }
                : s
            )
          )

          const simOutput = simulatedOutputs[step.id]
          const output = simOutput || {
            output: `Executed ${step.name}: processed ${Math.floor(Math.random() * 500 + 100)} data points with ${Math.floor(Math.random() * 20 + 80)}% confidence`,
            tokens: { input: Math.floor(Math.random() * 200 + 50), output: Math.floor(Math.random() * 150 + 30) },
            latency: Math.floor(Math.random() * 2000 + 300),
          }

          setTimeout(() => {
            if (abortRef.current) return resolve()

            setSteps((prev) =>
              prev.map((s, i) =>
                i === index
                  ? {
                      ...s,
                      status: 'completed' as StepStatus,
                      output: output.output,
                      tokens: output.tokens,
                      latency: output.latency,
                    }
                  : s
              )
            )

            addLog({
              id: `${step.id}-${Date.now()}`,
              timestamp: new Date(),
              level: 'info',
              source: step.name,
              message: `${step.name} completed in ${(output.latency / 1000).toFixed(1)}s (${output.tokens.input + output.tokens.output} tokens)`,
            })

            resolve()
          }, Math.random() * 1500 + 500)
        }, Math.random() * 300 + 200)
      }),
    [addLog]
  )

  const handleExecute = useCallback(
    async (prompt: string) => {
      abortRef.current = false
      setIsExecuting(true)
      setExecutionComplete(false)

      const newSteps = generateSteps(prompt)
      setSteps(newSteps)
      setCurrentStepIndex(0)

      const startTime = Date.now()

      for (let i = 0; i < newSteps.length; i++) {
        if (abortRef.current) break
        setCurrentStepIndex(i)
        await executeStep(newSteps[i], i)
      }

      const totalTime = Date.now() - startTime

      if (!abortRef.current) {
        setExecutionComplete(true)

        const totalTokens = newSteps.reduce(
          (acc, s) => {
            const sim = simulatedOutputs[s.id]
            return {
              input: acc.input + (sim?.tokens.input || 100),
              output: acc.output + (sim?.tokens.output || 60),
            }
          },
          { input: 0, output: 0 }
        )

        addTask({
          id: `task-${Date.now()}`,
          title: prompt.slice(0, 60) + (prompt.length > 60 ? '...' : ''),
          description: prompt,
          status: 'completed',
          createdAt: new Date(),
          completedAt: new Date(),
          steps: newSteps,
          totalTokens,
          totalLatency: totalTime,
          cost: (totalTokens.input * 0.00003 + totalTokens.output * 0.00006),
          quality: Math.floor(Math.random() * 10 + 88),
        })

        addLog({
          id: `task-complete-${Date.now()}`,
          timestamp: new Date(),
          level: 'info',
          source: 'Agent Orchestrator',
          message: `Task completed in ${(totalTime / 1000).toFixed(1)}s with ${totalTokens.input + totalTokens.output} total tokens`,
        })
      }

      setIsExecuting(false)
      setCurrentStepIndex(-1)
    },
    [executeStep, addTask, addLog]
  )

  const handleStop = useCallback(() => {
    abortRef.current = true
    setIsExecuting(false)
    setCurrentStepIndex(-1)
    setSteps((prev) =>
      prev.map((s) => (s.status === 'running' ? { ...s, status: 'failed' as StepStatus, error: 'Execution aborted by user' } : s))
    )
  }, [])

  const toggleStep = (id: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalTokens = steps.reduce(
    (acc, s) => ({ input: acc.input + (s.tokens?.input || 0), output: acc.output + (s.tokens?.output || 0) }),
    { input: 0, output: 0 }
  )
  const totalLatency = steps.reduce((acc, s) => acc + (s.latency || 0), 0)

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                Agent Task Input
              </CardTitle>
              <CardDescription className="text-xs">
                Describe a task for the agent to execute using multi-step reasoning and tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                placeholder="Describe your task here... e.g., 'Research the latest trends in agentic AI systems and provide a summary with key insights'"
                id="agent-input"
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const input = document.getElementById('agent-input') as HTMLTextAreaElement
                    if (input?.value.trim()) handleExecute(input.value.trim())
                  }}
                  disabled={isExecuting}
                  className="flex-1"
                  size="sm"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Execute Task
                    </>
                  )}
                </Button>
                {isExecuting && (
                  <Button variant="destructive" size="sm" onClick={handleStop}>
                    Stop
                  </Button>
                )}
                {steps.length > 0 && !isExecuting && (
                  <Button variant="outline" size="sm" onClick={() => setSteps([])}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Example Tasks */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Example Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {exampleTasks.map((example) => (
                  <button
                    key={example.label}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors flex items-center gap-2 group"
                    onClick={() => {
                      const input = document.getElementById('agent-input') as HTMLTextAreaElement
                      if (input) {
                        input.value = example.prompt
                        input.focus()
                      }
                    }}
                    disabled={isExecuting}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {example.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Execution Stats */}
          {steps.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Execution Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Steps</p>
                    <p className="text-lg font-bold">{steps.filter((s) => s.status === 'completed').length}/{steps.length}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Total Latency</p>
                    <p className="text-lg font-bold">{(totalLatency / 1000).toFixed(1)}s</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Input Tokens</p>
                    <p className="text-lg font-bold">{totalTokens.input.toLocaleString()}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Output Tokens</p>
                    <p className="text-lg font-bold">{totalTokens.output.toLocaleString()}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Est. Cost</p>
                    <p className="text-lg font-bold">
                      ${(totalTokens.input * 0.00003 + totalTokens.output * 0.00006).toFixed(4)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Status</p>
                    {executionComplete ? (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
                      </Badge>
                    ) : isExecuting ? (
                      <Badge variant="secondary" className="text-xs">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Idle</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Execution Pipeline */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Execution Pipeline
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time view of agent workflow execution with step-by-step reasoning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1" ref={scrollRef}>
                {steps.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                      <Bot className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">No Active Task</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      Enter a task description and click Execute to see the agent plan and execute a multi-step workflow
                    </p>
                  </div>
                )}
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      'rounded-lg border transition-all duration-300',
                      step.status === 'running' && 'border-primary/50 bg-primary/5 shadow-sm',
                      step.status === 'completed' && 'border-emerald-500/20',
                      step.status === 'failed' && 'border-red-500/20',
                      step.status === 'pending' && 'border-border',
                      index < steps.length - 1 && 'mb-1'
                    )}
                  >
                    {/* Step Header */}
                    <button
                      className="w-full flex items-center gap-3 p-3 text-left"
                      onClick={() => toggleStep(step.id)}
                    >
                      <div className="flex-shrink-0">
                        <StepStatusIcon status={step.status} />
                      </div>
                      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                        {stepIcons[step.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{step.name}</h4>
                          <Badge variant="outline" className="text-[10px] px-1.5">
                            {step.type.replace('_', ' ')}
                          </Badge>
                          {step.toolId && (
                            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              {toolIcons[step.toolId]}
                              {step.toolId}
                            </span>
                          )}
                        </div>
                        {step.latency && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {step.latency}ms • {step.tokens?.input + step.tokens?.output} tokens
                          </p>
                        )}
                      </div>
                      {step.output && (
                        <div className="flex-shrink-0">
                          {expandedSteps.has(step.id) ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </button>

                    {/* Step Detail */}
                    {expandedSteps.has(step.id) && step.output && (
                      <div className="px-3 pb-3">
                        <Separator className="mb-3" />
                        <div className="bg-muted/50 rounded-md p-3 text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
                          {step.output}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
