# Agentic AI Command Center

A full-stack dashboard for designing, orchestrating, and monitoring autonomous AI agent systems — built as a portfolio project demonstrating expertise in agentic AI architectures, real-time UI patterns, and production-grade full-stack development.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + tw-animate-css |
| Components | shadcn/ui (50+ primitives) |
| State Management | Zustand |
| Data Visualization | Recharts |
| Forms & Validation | React Hook Form + Zod |
| ORM | Prisma (SQLite) |
| Drag & Drop | @dnd-kit |
| Rich Text | @mdxeditor/editor |
| Runtime | Bun |

---

## Features

### 1. Dashboard Overview
A high-level command center surface displaying real-time agent activity, system health metrics, and performance KPIs. Provides at-a-glance visibility into agent throughput, success rates, and resource utilization through interactive charts and status cards.

### 2. Agent Playground
An interactive sandbox for configuring, testing, and iterating on individual AI agents. Supports multi-turn conversations with streaming responses, adjustable system prompts, model parameter tuning (temperature, top-p, max tokens), and structured output parsing. Enables rapid experimentation with agent behaviors before committing to production workflows.

### 3. Workflow Builder
A visual, drag-and-drop workflow orchestration canvas where users compose multi-step agent pipelines. Nodes represent agent actions, tool calls, conditional branching, and data transformations. Workflows are serializable and executable, enabling complex agentic reasoning chains with human-in-the-loop checkpoints.

### 4. Tool Registry
A centralized catalog for managing and configuring external tool integrations that agents can invoke at runtime. Each tool entry defines its schema, authentication requirements, rate limits, and input/output contracts. Supports semantic search and categorization for rapid tool discovery.

### 5. Monitoring Panel
Real-time observability layer tracking agent execution traces, token usage, latency distributions, and error rates. Features structured log views, timeline-based trace exploration, and cost attribution — essential for debugging complex agentic behaviors and optimizing operational efficiency.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Next.js App Router                  │
│  (Server Components, API Routes, Streaming SSR)       │
├──────────────────────┬──────────────────────────────┤
│   Dashboard UI       │       API Layer               │
│   ┌──────────────┐   │   ┌────────────────────────┐ │
│   │ Zustand Store │◄──┼──►│ /api/agent/*           │ │
│   │ (Client State)│   │   │ /api/workflows/*       │ │
│   └──────┬───────┘   │   └──────────┬─────────────┘ │
│          │           │              │               │
│   ┌──────▼───────┐   │   ┌──────────▼─────────────┐ │
│   │ shadcn/ui    │   │   │ z-ai-web-dev-sdk       │ │
│   │ + Recharts   │   │   │ (LLM / VLM / Search)  │ │
│   └──────────────┘   │   └────────────────────────┘ │
├──────────────────────┴──────────────────────────────┤
│                    Prisma ORM                        │
│              (SQLite — schema.prisma)                │
└─────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **Server-first rendering** with selective client hydration via React 19 and Next.js 16 App Router
- **Zustand** for lightweight, ephemeral client state (agent configs, UI preferences, playground state)
- **Prisma** for persistent schema storage (users, tool definitions, workflow metadata)
- **z-ai-web-dev-sdk** for unified access to LLM, VLM, and web search capabilities
- **@dnd-kit** for performant drag-and-drop in the workflow builder

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.3+
- [Node.js](https://nodejs.org/) v20+ (alternative to Bun)

### Installation

```bash
git clone <repository-url>
cd my-project
bun install
```

### Database Setup

```bash
bun run db:push      # Apply Prisma schema to SQLite
bun run db:generate  # Generate Prisma client
```

### Development

```bash
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
bun run build
bun run start
```

---

## Key Competencies Demonstrated

This project maps directly to core skills required for a **Machine Learning Engineer — Agentic AI** role:

| Competency | Project Evidence |
|---|---|
| **Agent Orchestration** | Multi-agent workflow builder with conditional branching and tool chaining |
| **Tool Use & Function Calling** | Tool Registry with schema definitions, authentication, and runtime invocation |
| **Prompt Engineering** | Agent Playground with adjustable system prompts, temperature, and structured output |
| **Observability & Debugging** | Monitoring Panel with execution traces, token tracking, and error analysis |
| **Full-Stack ML Systems** | Next.js server-side rendering streaming LLM responses to React 19 clients |
| **Data Modeling** | Prisma schema design for agents, workflows, tools, and execution logs |
| **Production UX** | shadcn/ui component system, real-time state management, responsive layouts |

---

## Project Structure

```
my-project/
├── prisma/
│   └── schema.prisma          # Database schema (SQLite)
├── public/
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Dashboard entry point
│   │   ├── globals.css        # Tailwind CSS v4 theme
│   │   └── api/
│   │       └── agent/
│   │           └── plan/      # Agent planning endpoint
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives (50+)
│   │   └── dashboard/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── DashboardOverview.tsx
│   │       ├── AgentPlayground.tsx
│   │       ├── WorkflowBuilder.tsx
│   │       ├── ToolRegistry.tsx
│   │       └── MonitoringPanel.tsx
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   └── use-mobile.ts
│   └── lib/
│       ├── db.ts              # Prisma client singleton
│       ├── store.ts           # Zustand store
│       └── utils.ts           # Utility functions (cn, etc.)
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── components.json            # shadcn/ui configuration
├── Caddyfile                  # Production reverse proxy config
└── package.json
```

---

*Built with Next.js 16, Tailwind CSS 4, and shadcn/ui.*
