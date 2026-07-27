import { Star, WandSparkles } from 'lucide-react'
import { useWorkbenchStore } from '@/store/workbenchStore'
import type { InspirationItem, ViewMode } from '@/types'

const assetVideoBase = 'file:///Users/bytedance/analysis_new/0720/assets'

const materialCoverVideos = [
  `${assetVideoBase}/(2.0)6.8-1.mp4`,
  `${assetVideoBase}/61444a99af8f4e1b84154fa919fa1b58.mp4`,
  `${assetVideoBase}/659555069186.mp4`,
  `${assetVideoBase}/664414228226.mp4`,
  `${assetVideoBase}/665674260994.mp4`,
  `${assetVideoBase}/666075844098.mp4`,
  `${assetVideoBase}/666702876162.mp4`,
  `${assetVideoBase}/oQ971aHEPFwiiAliKAB3MBMi8QaahUVaz67LI.mp4`,
  `${assetVideoBase}/oUIaEQBK7lfKcjGUfLwgenTup0Fl7INAaKw9CF.mp4`,
  `${assetVideoBase}/oUqioiI0am6aPwqBMEV3yT9AZkiQA7pIQ2ZOI.mp4`,
  `${assetVideoBase}/osNAmTePMiD1igB0IPWtcs5BQiLkm9QwY9E9EV.mp4`,
  `${assetVideoBase}/inspiration-pack/blood-stain-animation.mp4`,
  `${assetVideoBase}/inspiration-pack/carpet-cleaning.mp4`,
  `${assetVideoBase}/inspiration-pack/girl-drinking-milk.mp4`,
  `${assetVideoBase}/inspiration-pack/haircare-recommendation.mp4`,
  `${assetVideoBase}/inspiration-pack/scalp-care-animation.mp4`,
  `${assetVideoBase}/inspiration-pack/sunscreen-ice-beach.mp4`,
]

export function InspirationCard({ item, viewMode }: { item: InspirationItem; viewMode: ViewMode }) {
  const toggleLike = useWorkbenchStore((state) => state.toggleLike)
  const openDetail = useWorkbenchStore((state) => state.openDetail)
  const openGeneratedMaterial = useWorkbenchStore((state) => state.openGeneratedMaterial)
  const isList = viewMode === 'list'
  const coverVideoSrc = materialCoverVideos[((item.rank ?? 1) - 1) % materialCoverVideos.length]

  return (
    <article
      className={`group relative overflow-hidden rounded-[20px] border border-white/10 bg-[#21192f]/82 shadow-[0_14px_36px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#7a5dff]/55 hover:shadow-[0_20px_58px_rgba(72,48,160,0.26)] ${
        isList ? 'grid grid-cols-[200px_1fr] gap-0' : ''
      }`}
      role="button"
      tabIndex={0}
      onClick={() => openDetail(item.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') openDetail(item.id)
      }}
    >
      <div className={`relative overflow-hidden ${isList ? 'h-full min-h-[190px]' : 'aspect-[0.98]'}`}>
        <video
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={coverVideoSrc}
          muted
          playsInline
          preload="auto"
          onLoadedData={(event) => {
            event.currentTarget.pause()
          }}
          onMouseEnter={(event) => {
            event.currentTarget.play().catch(() => undefined)
          }}
          onMouseLeave={(event) => {
            event.currentTarget.pause()
            event.currentTarget.currentTime = 0
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140f20]/85 via-transparent to-black/20" />
        <span className="absolute left-3 top-3 rounded-lg bg-black/55 px-2.5 py-1 text-[13px] font-bold text-white backdrop-blur">
          {item.audience}
        </span>
      </div>

      <div className="flex min-h-[138px] flex-col p-3">
        <h2 className="line-clamp-3 text-[12px] font-semibold leading-[18px] text-[#f5f1ff]">{item.title}</h2>
        <div className="relative mt-auto pt-2.5">
          <div className="grid grid-cols-2 gap-2 transition duration-200 group-hover:opacity-0">
            <Metric label="热度" value={item.heat.toString()} />
            <Metric label="点击率" value={`${item.ctr.toFixed(2)}%`} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-2.5 flex h-10 translate-y-1 items-center justify-between opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            <button
              className="pointer-events-auto grid h-10 w-10 place-items-center rounded-xl bg-black/55 text-white backdrop-blur transition hover:bg-[#7657ff]"
              aria-label="收藏素材"
              onClick={(event) => {
                event.stopPropagation()
                toggleLike(item.id)
              }}
            >
              <Star size={16} className={item.liked ? 'fill-[#ffcf5a] text-[#ffcf5a]' : ''} />
            </button>
            <button
              className="pointer-events-auto flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#7657ff] to-[#9a67ff] px-3 text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(118,87,255,0.25)] transition hover:brightness-110"
              onClick={(event) => {
                event.stopPropagation()
                openGeneratedMaterial(item.id)
              }}
            >
              <WandSparkles size={14} />
              参考素材成片
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#15101f]/80 px-2 py-1">
      <div className="text-[13px] font-black leading-5 text-white">{value}</div>
      <div className="text-[10px] text-[#8e86a4]">{label}</div>
    </div>
  )
}
