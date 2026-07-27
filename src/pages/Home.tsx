import { useEffect } from 'react'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { TopWorkspaceBar } from '@/components/TopWorkspaceBar'
import { SideNav } from '@/components/SideNav'
import { AgentPrompt } from '@/components/AgentPrompt'
import { InspirationToolbar } from '@/components/InspirationToolbar'
import { InspirationGrid } from '@/components/InspirationGrid'
import { InspirationDetail } from '@/components/InspirationDetail'
import { RoutineGeneration } from '@/components/RoutineGeneration'
import { MaterialGeneration } from '@/components/MaterialGeneration'
import { GuideTip } from '@/components/GuideTip'
import { FavoriteDrawer } from '@/components/FavoriteDrawer'
import { useWorkbenchStore } from '@/store/workbenchStore'

export default function Home() {
  const toast = useWorkbenchStore((state) => state.toast)
  const clearToast = useWorkbenchStore((state) => state.clearToast)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(clearToast, 2600)
    return () => window.clearTimeout(timer)
  }, [toast, clearToast])

  return (
    <main className="workbench-shell min-h-screen overflow-x-hidden text-white">
      <AnnouncementBar />
      <TopWorkspaceBar />
      <SideNav />
      <AgentPrompt />
      <div className="relative z-10 ml-[96px] mt-6 min-h-[680px] rounded-tl-[28px] border-l border-t border-white/8 bg-[#15101f]/72 shadow-[0_-18px_70px_rgba(0,0,0,0.18)] backdrop-blur">
        <InspirationToolbar />
        <InspirationGrid />
      </div>
      <InspirationDetail />
      <RoutineGeneration />
      <MaterialGeneration />
      <FavoriteDrawer />
      <GuideTip />
      {toast && (
        <div className="fixed left-1/2 top-7 z-50 -translate-x-1/2 rounded-full border border-white/12 bg-[#2d2443]/95 px-5 py-3 text-sm font-medium text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {toast}
        </div>
      )}
    </main>
  )
}
