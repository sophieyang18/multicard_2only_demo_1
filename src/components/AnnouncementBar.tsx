import { X } from 'lucide-react'
import { useWorkbenchStore } from '@/store/workbenchStore'

export function AnnouncementBar() {
  const visible = useWorkbenchStore((state) => state.announcementVisible)
  const setVisible = useWorkbenchStore((state) => state.setAnnouncementVisible)

  if (!visible) return null

  return (
    <div className="relative z-30 flex h-[58px] items-center justify-center bg-gradient-to-r from-[#6336ff] via-[#7b3cff] to-[#8d48ff] px-6 text-[15px] font-semibold text-white shadow-[0_18px_42px_rgba(75,33,180,0.35)]">
      <span>Seedance2.5 即将震撼首发！30s视频直出，支持全模态参考素材！</span>
      <button
        className="absolute right-7 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/90 transition hover:bg-white/15"
        aria-label="关闭公告"
        onClick={() => setVisible(false)}
      >
        <X size={20} />
      </button>
    </div>
  )
}
