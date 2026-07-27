import { ArrowLeft, X } from 'lucide-react'
import { useWorkbenchStore } from '@/store/workbenchStore'

const materialGenerationPreview = 'file:///Users/bytedance/analysis_new/0720/参考素材成片-手动发送.png'

export function MaterialGeneration() {
  const generatedMaterialItemId = useWorkbenchStore((state) => state.generatedMaterialItemId)
  const item = useWorkbenchStore((state) => state.items.find((entry) => entry.id === generatedMaterialItemId))
  const closeGeneratedMaterial = useWorkbenchStore((state) => state.closeGeneratedMaterial)

  if (!item) return null

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-[#0b0715] text-white">
      <img src={materialGenerationPreview} alt={`参考「${item.title}」素材成片`} className="h-full w-full object-cover" />
      <button
        className="absolute left-5 top-4 flex h-9 items-center gap-2 rounded-full border border-white/12 bg-black/45 px-3 text-sm text-white/86 backdrop-blur transition hover:bg-white/12 hover:text-white"
        onClick={closeGeneratedMaterial}
        aria-label="返回灵感页"
      >
        <ArrowLeft size={16} />
        返回
      </button>
      <button
        className="absolute right-5 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-black/45 text-white/86 backdrop-blur transition hover:bg-white/12 hover:text-white"
        onClick={closeGeneratedMaterial}
        aria-label="关闭参考素材成片页面"
      >
        <X size={17} />
      </button>
    </div>
  )
}
