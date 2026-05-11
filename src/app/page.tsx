'use client'

import { useAgentStore } from '@/lib/store'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { AgentPlayground } from '@/components/dashboard/AgentPlayground'
import { WorkflowBuilder } from '@/components/dashboard/WorkflowBuilder'
import { ToolRegistry } from '@/components/dashboard/ToolRegistry'
import { MonitoringPanel } from '@/components/dashboard/MonitoringPanel'
import { useEffect } from 'react'

export default function Home() {
  const activeTab = useAgentStore((s) => s.activeTab)
  const darkMode = useAgentStore((s) => s.darkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'playground' && <AgentPlayground />}
          {activeTab === 'workflows' && <WorkflowBuilder />}
          {activeTab === 'tools' && <ToolRegistry />}
          {activeTab === 'monitoring' && <MonitoringPanel />}
        </main>
      </div>
    </div>
  )
}
