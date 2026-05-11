import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: Request) {
  try {
    const { task, context } = await request.json()

    if (!task || typeof task !== 'string') {
      return NextResponse.json({ error: 'Task description is required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an agentic AI orchestrator. When given a task, you must:
1. Break it down into discrete, executable steps
2. Identify which tools and data sources are needed for each step
3. Plan the execution order considering dependencies
4. Define quality checkpoints and failure handling strategies

Respond with a structured JSON plan containing:
- "steps": array of step objects with "name", "type" (llm_call|tool_use|data_transform|conditional|aggregation), "tool_id" (if applicable), and "description"
- "estimated_tokens": { "input": number, "output": number }
- "estimated_latency_ms": number
- "tools_needed": array of tool IDs

Be specific and practical. Consider edge cases and failure modes.`,
        },
        {
          role: 'user',
          content: `Create an execution plan for this task: "${task}"${context ? `\n\nAdditional context: ${context}` : ''}`,
        },
      ],
      temperature: 0.2,
    })

    const planText = completion.choices[0]?.message?.content || ''

    let plan
    try {
      const jsonMatch = planText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0])
      }
    } catch {
      plan = { raw_plan: planText }
    }

    return NextResponse.json({
      success: true,
      plan,
      model: completion.model || 'default',
      usage: completion.usage,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
