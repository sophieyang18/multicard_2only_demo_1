import { ArrowLeft, X } from 'lucide-react'
import { useWorkbenchStore } from '@/store/workbenchStore'

export function RoutineGeneration() {
  const generatedItemId = useWorkbenchStore((state) => state.generatedItemId)
  const item = useWorkbenchStore((state) => state.items.find((entry) => entry.id === generatedItemId))
  const closeGeneratedVideo = useWorkbenchStore((state) => state.closeGeneratedVideo)

  if (!item) return null

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-[#0a0712] text-white">
      <img
        src="/routine-agent-page.png"
        alt={`参考「${item.secondaryRoutineName ?? item.routineName}」套路，生成一条带货短视频`}
        className="h-full w-full object-contain"
      />
      <button
        className="absolute left-5 top-4 flex h-9 items-center gap-2 rounded-full border border-white/12 bg-black/45 px-3 text-sm text-white/86 backdrop-blur transition hover:bg-white/12 hover:text-white"
        onClick={closeGeneratedVideo}
        aria-label="返回详情"
      >
        <ArrowLeft size={16} />
        返回
      </button>
      <button
        className="absolute right-5 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-black/45 text-white/86 backdrop-blur transition hover:bg-white/12 hover:text-white"
        onClick={closeGeneratedVideo}
        aria-label="关闭参考套路成片页面"
      >
        <X size={17} />
      </button>
    </div>
  )
}
