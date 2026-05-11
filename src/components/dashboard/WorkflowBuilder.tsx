'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  GitBranch,
  Plus,
  Play,
  Trash2,
  GripVertical,
  Brain,
  Wrench,
  Database,
  Zap,
  Sparkles,
  ArrowRight,
  Settings2,
  Save,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WfNode {
  id: string
  name: string
  type: 'llm_call' | 'tool_use' | 'data_transform' | 'conditional' | 'aggregation'
  config: Record<string, string>
}

interface Workflow {
  id: string
  name: string
  description: string
  nodes: WfNode[]
  status: 'draft' | 'active' | 'archived'
  lastRun?: string
  successRate?: number
}

const nodeTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string; fields: { key: string; label: string; placeholder: string }[] }> = {
  llm_call: {
    label: 'LLM Call',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    fields: [
      { key: 'model', label: 'Model', placeholder: 'gpt-4o / claude-3.5' },
      { key: 'temperature', label: 'Temperature', placeholder: '0.0 - 1.0' },
      { key: 'prompt_template', label: 'Prompt Template', placeholder: 'System prompt or template...' },
    ],
  },
  tool_use: {
    label: 'Tool Use',
    icon: <Wrench className="w-4 h-4" />,
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    fields: [
      { key: 'tool', label: 'Tool', placeholder: 'web_search / code_interpreter' },
      { key: 'parameters', label: 'Parameters', placeholder: 'JSON parameters...' },
    ],
  },
  data_transform: {
    label: 'Data Transform',
    icon: <Database className="w-4 h-4" />,
    color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    fields: [
      { key: 'transform', label: 'Transform', placeholder: 'filter / map / aggregate' },
      { key: 'schema', label: 'Output Schema', placeholder: 'Expected output format...' },
    ],
  },
  conditional: {
    label: 'Conditional',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    fields: [
      { key: 'condition', label: 'Condition', placeholder: 'Quality score > 90?' },
      { key: 'on_true', label: 'On True', placeholder: 'proceed / retry / fallback' },
      { key: 'on_false', label: 'On False', placeholder: 'abort / alternative' },
    ],
  },
  aggregation: {
    label: 'Aggregation',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    fields: [
      { key: 'strategy', label: 'Strategy', placeholder: 'concat / vote / weighted' },
      { key: 'inputs', label: 'Input Sources', placeholder: 'Which steps to aggregate...' },
    ],
  },
}

const sampleWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Research Pipeline',
    description: 'Multi-step research workflow with search, analysis, and synthesis',
    status: 'active',
    lastRun: '2 min ago',
    successRate: 94.5,
    nodes: [
      { id: 'n1', name: 'Query Parser', type: 'llm_call', config: { model: 'gpt-4o', temperature: '0.1' } },
      { id: 'n2', name: 'Web Search', type: 'tool_use', config: { tool: 'web_search', parameters: '{}' } },
      { id: 'n3', name: 'Extract Key Facts', type: 'llm_call', config: { model: 'gpt-4o', temperature: '0.0' } },
      { id: 'n4', name: 'Cross-Reference', type: 'data_transform', config: { transform: 'filter', schema: 'facts[]' } },
      { id: 'n5', name: 'Synthesize Report', type: 'llm_call', config: { model: 'gpt-4o', temperature: '0.3' } },
      { id: 'n6', name: 'Quality Gate', type: 'conditional', config: { condition: 'score > 85', on_true: 'proceed', on_false: 'retry' } },
    ],
  },
  {
    id: 'wf-2',
    name: 'Code Review Agent',
    description: 'Automated code review with static analysis and LLM feedback',
    status: 'active',
    lastRun: '15 min ago',
    successRate: 91.2,
    nodes: [
      { id: 'n1', name: 'Parse PR Diff', type: 'data_transform', config: { transform: 'parse_diff', schema: 'files[]' } },
      { id: 'n2', name: 'Run Linter', type: 'tool_use', config: { tool: 'code_interpreter', parameters: '{}' } },
      { id: 'n3', name: 'Security Analysis', type: 'llm_call', config: { model: 'claude-3.5', temperature: '0.0' } },
      { id: 'n4', name: 'Performance Review', type: 'llm_call', config: { model: 'claude-3.5', temperature: '0.1' } },
      { id: 'n5', name: 'Aggregate Feedback', type: 'aggregation', config: { strategy: 'weighted', inputs: 'n2,n3,n4' } },
    ],
  },
  {
    id: 'wf-3',
    name: 'Data Extraction Pipeline',
    description: 'Extract structured data from unstructured documents using vision + LLM',
    status: 'draft',
    nodes: [
      { id: 'n1', name: 'Document Loader', type: 'tool_use', config: { tool: 'file_manager', parameters: '{}' } },
      { id: 'n2', name: 'OCR Analysis', type: 'tool_use', config: { tool: 'image_analyzer', parameters: '{}' } },
      { id: 'n3', name: 'Entity Extraction', type: 'llm_call', config: { model: 'gpt-4o', temperature: '0.0' } },
      { id: 'n4', name: 'Schema Validation', type: 'conditional', config: { condition: 'valid JSON', on_true: 'proceed', on_false: 'retry' } },
    ],
  },
]

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState(sampleWorkflows)
  const [selectedWf, setSelectedWf] = useState<Workflow | null>(null)
  const [addNodeOpen, setAddNodeOpen] = useState(false)
  const [newNodeType, setNewNodeType] = useState<string>('llm_call')
  const [newNodeName, setNewNodeName] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  const handleAddNode = () => {
    if (!selectedWf || !newNodeName.trim()) return
    const node: WfNode = {
      id: `n-${Date.now()}`,
      name: newNodeName,
      type: newNodeType as WfNode['type'],
      config: {},
    }
    const updated = {
      ...selectedWf,
      nodes: [...selectedWf.nodes, node],
    }
    setSelectedWf(updated)
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
    setAddNodeOpen(false)
    setNewNodeName('')
  }

  const handleRemoveNode = (nodeId: string) => {
    if (!selectedWf) return
    const updated = {
      ...selectedWf,
      nodes: selectedWf.nodes.filter((n) => n.id !== nodeId),
    }
    setSelectedWf(updated)
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
  }

  const handleSaveWorkflow = () => {
    if (!selectedWf) return
    setWorkflows((prev) => prev.map((w) => (w.id === selectedWf.id ? selectedWf : w)))
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Workflow List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-primary" />
                  Workflows
                </CardTitle>
                <Badge variant="secondary" className="text-xs">{workflows.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflows.map((wf) => (
                  <button
                    key={wf.id}
                    onClick={() => { setSelectedWf(wf); setPreviewMode(false) }}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all duration-200',
                      selectedWf?.id === wf.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30 hover:bg-accent/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{wf.name}</h4>
                      <Badge
                        variant={wf.status === 'active' ? 'default' : wf.status === 'draft' ? 'outline' : 'secondary'}
                        className="text-[10px] ml-2"
                      >
                        {wf.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{wf.description}</p>
                    {wf.successRate !== undefined && (
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <span>Success: {wf.successRate}%</span>
                        <span>•</span>
                        <span>{wf.lastRun}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Editor */}
        <div className="lg:col-span-2">
          {selectedWf ? (
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-muted-foreground" />
                      {selectedWf.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{selectedWf.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      {previewMode ? 'Edit' : 'Preview'}
                    </Button>
                    <Button size="sm" onClick={handleSaveWorkflow}>
                      <Save className="w-3.5 h-3.5 mr-1" />
                      Save
                    </Button>
                    <Dialog open={addNodeOpen} onOpenChange={setAddNodeOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Add Step
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Workflow Step</DialogTitle>
                          <DialogDescription>
                            Add a new step to the workflow pipeline
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label className="text-xs">Step Type</Label>
                            <Select value={newNodeType} onValueChange={setNewNodeType}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(nodeTypeConfig).map(([key, config]) => (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                      {config.icon}
                                      {config.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Step Name</Label>
                            <Input
                              placeholder="Enter step name..."
                              value={newNodeName}
                              onChange={(e) => setNewNodeName(e.target.value)}
                            />
                          </div>
                          <Button className="w-full" onClick={handleAddNode} disabled={!newNodeName.trim()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Workflow
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Pipeline Visualization */}
                <div className="relative">
                  {selectedWf.nodes.map((node, index) => {
                    const config = nodeTypeConfig[node.type]
                    return (
                      <div key={node.id} className="flex items-center gap-2">
                        <div
                          className={cn(
                            'flex-1 rounded-lg border p-3 transition-all',
                            config.color,
                            !previewMode && 'hover:shadow-md cursor-pointer'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {!previewMode && (
                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                              )}
                              <div className="flex items-center gap-1.5">
                                {config.icon}
                                <span className="text-sm font-medium">{node.name}</span>
                              </div>
                              <Badge variant="outline" className="text-[10px]">{config.label}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                Step {index + 1}
                              </span>
                              {!previewMode && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7"
                                  onClick={() => handleRemoveNode(node.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {/* Config preview */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {Object.entries(node.config).map(([key, value]) => (
                              <span key={key} className="text-[10px] bg-background/50 px-2 py-0.5 rounded-md border border-border/50">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        </div>
                        {index < selectedWf.nodes.length - 1 && (
                          <div className="flex-shrink-0 flex flex-col items-center gap-1">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {selectedWf.nodes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <GitBranch className="w-10 h-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">No steps yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Click &quot;Add Step&quot; to build your workflow</p>
                    </div>
                  )}
                </div>

                {/* Workflow Stats */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5" />
                      {selectedWf.nodes.length} steps
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5" />
                      {selectedWf.nodes.filter((n) => n.type === 'llm_call').length} LLM calls
                    </span>
                    <span className="flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5" />
                      {selectedWf.nodes.filter((n) => n.type === 'tool_use').length} tool uses
                    </span>
                    {selectedWf.successRate !== undefined && (
                      <span className="flex items-center gap-1 ml-auto">
                        Success rate: <span className="font-semibold text-foreground">{selectedWf.successRate}%</span>
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium">Select a Workflow</h3>
                <p className="text-xs text-muted-foreground mt-1">Choose a workflow from the list or create a new one</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
