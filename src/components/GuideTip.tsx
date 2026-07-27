import { SearchCheck, X } from 'lucide-react'
import { useWorkbenchStore } from '@/store/workbenchStore'

export function GuideTip() {
  const visible = useWorkbenchStore((state) => state.guideVisible)
  const setVisible = useWorkbenchStore((state) => state.setGuideVisible)

  if (!visible) return null

  return (
    <div className="fixed bottom-8 right-8 z-40 w-[300px] rounded-[26px] border border-white/12 bg-[#2c2240]/96 p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <button className="absolute right-4 top-4 rounded-full p-1 text-[#bfb7d7] hover:bg-white/10" onClick={() => setVisible(false)} aria-label="关闭提示">
        <X size={17} />
      </button>
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#7657ff] shadow-[0_12px_28px_rgba(118,87,255,0.35)]">
        <SearchCheck size={22} />
      </div>
      <h3 className="text-lg font-bold">搜索功能升级啦</h3>
      <p className="mt-2 text-sm text-[#c9c1da]">快来试试吧！支持按人群、行业、标题关键词快速定位灵感方案。</p>
      <div className="mt-5 flex justify-end gap-3">
        <button className="rounded-xl px-4 py-2 text-sm text-[#c8c0d8] hover:bg-white/8" onClick={() => setVisible(false)}>
          跳过
        </button>
        <button className="rounded-xl bg-[#7657ff] px-4 py-2 text-sm font-bold text-white hover:brightness-110" onClick={() => setVisible(false)}>
          我知道啦
        </button>
      </div>
    </div>
  )
}
