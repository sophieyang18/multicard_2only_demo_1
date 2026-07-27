import { Eye, FileText, Search, Trash2, WandSparkles, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useWorkbenchStore } from '@/store/workbenchStore'
import type { InspirationItem, RoutineGroup } from '@/types'

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

function imageUrl(prompt: string) {
  return `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=portrait_4_3`
}

function materialCoverVideo(item: InspirationItem) {
  return materialCoverVideos[((item.rank ?? 1) - 1) % materialCoverVideos.length]
}

function favoriteTime(item: InspirationItem) {
  return item.likedAt ? new Date(item.likedAt).getTime() : 0
}

function formatFavoriteTime(timestamp: number) {
  const date = new Date(timestamp || Date.now())
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} 收藏`
}

function selectFavoriteRoutineGroups(items: InspirationItem[]): Array<RoutineGroup & { favoriteAt: number }> {
  const groups = new Map<string, InspirationItem[]>()
  items.forEach((item) => {
    if (!item.liked) return
    groups.set(item.routineName, [...(groups.get(item.routineName) ?? []), item])
  })

  return Array.from(groups.entries())
    .map(([routineName, groupItems]) => {
      const sortedItems = [...groupItems].sort((a, b) => b.ctr - a.ctr)
      const coverItem = sortedItems[0]
      return {
        routineName,
        secondaryRoutineName: coverItem.secondaryRoutineName,
        tertiaryRoutineName: coverItem.tertiaryRoutineName,
        items: groupItems,
        coverItem,
        heat: groupItems.reduce((total, item) => total + item.heat, 0),
        merchantCount: groupItems.reduce((total, item) => total + item.merchantCount, 0),
        materialCount: groupItems.length,
        industry: coverItem.industry,
        favoriteAt: Math.max(...groupItems.map(favoriteTime)),
      }
    })
    .sort((a, b) => b.favoriteAt - a.favoriteAt)
}

export function FavoriteDrawer() {
  const open = useWorkbenchStore((state) => state.favoriteDrawerOpen)
  const contentType = useWorkbenchStore((state) => state.filters.contentType)
  const items = useWorkbenchStore((state) => state.items)
  const closeFavoriteDrawer = useWorkbenchStore((state) => state.closeFavoriteDrawer)
  const openDetail = useWorkbenchStore((state) => state.openDetail)
  const openGeneratedVideo = useWorkbenchStore((state) => state.openGeneratedVideo)
  const openGeneratedMaterial = useWorkbenchStore((state) => state.openGeneratedMaterial)
  const removeFavorites = useWorkbenchStore((state) => state.removeFavorites)
  const setToast = useWorkbenchStore((state) => state.setToast)
  const [keyword, setKeyword] = useState('')
  const [activeTab, setActiveTab] = useState<'routine' | 'material'>(contentType === 'routine' ? 'routine' : 'material')
  const isRoutineMode = activeTab === 'routine'

  useEffect(() => {
    if (!open) return
    setActiveTab(contentType === 'routine' ? 'routine' : 'material')
    setKeyword('')
  }, [contentType, open])

  const favoriteMaterials = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    return items
      .filter((item) => item.liked)
      .filter((item) => {
        if (!normalizedKeyword) return true
        return (
          item.title.toLowerCase().includes(normalizedKeyword) ||
          item.routineName.toLowerCase().includes(normalizedKeyword) ||
          item.secondaryRoutineName?.toLowerCase().includes(normalizedKeyword) ||
          item.tertiaryRoutineName?.toLowerCase().includes(normalizedKeyword) ||
          item.audience.toLowerCase().includes(normalizedKeyword)
        )
      })
      .sort((a, b) => favoriteTime(b) - favoriteTime(a))
  }, [items, keyword])

  const favoriteRoutineGroups = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    return selectFavoriteRoutineGroups(items).filter((group) => {
      if (!normalizedKeyword) return true
      return (
        group.routineName.toLowerCase().includes(normalizedKeyword) ||
        group.secondaryRoutineName?.toLowerCase().includes(normalizedKeyword) ||
        group.tertiaryRoutineName?.toLowerCase().includes(normalizedKeyword)
      )
    })
  }, [items, keyword])

  if (!open) return null

  const openItemDetail = (id: string) => {
    closeFavoriteDrawer()
    openDetail(id)
  }

  const openRoutineGeneration = (id: string) => {
    closeFavoriteDrawer()
    openGeneratedVideo(id)
  }

  return (
    <div className="fixed inset-0 z-[55] overflow-hidden bg-[#080510]/55 text-white backdrop-blur-md">
      <button className="absolute inset-0 cursor-default" aria-label="关闭我的收藏" onClick={closeFavoriteDrawer} />
      <aside className="absolute bottom-0 right-0 top-0 flex w-[56vw] min-w-[680px] flex-col bg-[#241b31]/98 px-9 py-6 shadow-[0_0_80px_rgba(0,0,0,0.48)]">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black">我的收藏</h2>
            <div className="mt-8 flex h-8 items-end gap-8">
              <Tab label="AI灵感广场" active={false} />
              <Tab label="热门套路" active={isRoutineMode} onClick={() => setActiveTab('routine')} />
              <Tab label="热门素材" active={!isRoutineMode} onClick={() => setActiveTab('material')} />
            </div>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white/8 text-[#bfb7d2] transition hover:bg-white/14 hover:text-white"
            onClick={closeFavoriteDrawer}
            aria-label="关闭我的收藏"
          >
            <X size={19} />
          </button>
        </header>

        <div className="mb-5 flex items-center justify-between gap-4">
          <label className="flex h-10 w-[330px] items-center rounded-xl bg-[#110d19]/82 px-3 text-[#7f748f]">
            <Search size={16} />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="ml-2 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#7f748f]"
              placeholder={isRoutineMode ? '请输入关键词查找套路' : '请输入关键词查找素材'}
            />
          </label>
          <div className="flex items-center gap-6 text-sm font-semibold text-[#c9c1da]">
            <FavoriteFilter label="行业" />
            <FavoriteFilter label="品类" />
            <FavoriteFilter label="投放受众" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          {isRoutineMode ? (
            favoriteRoutineGroups.length > 0 ? (
              <div className="grid gap-4">
                {favoriteRoutineGroups.map((group) => (
                  <RoutineFavoriteRow
                    key={group.routineName}
                    group={group}
                    onGenerate={() => openRoutineGeneration(group.coverItem.id)}
                    onOpen={() => openItemDetail(group.coverItem.id)}
                    onDelete={() => removeFavorites(group.items.map((item) => item.id))}
                  />
                ))}
              </div>
            ) : (
              <EmptyFavorite text="暂无收藏套路" />
            )
          ) : favoriteMaterials.length > 0 ? (
            <div className="grid gap-4">
              {favoriteMaterials.map((item) => (
                <MaterialFavoriteRow
                  key={item.id}
                  item={item}
                  onReference={() => openGeneratedMaterial(item.id)}
                  onGenerate={() => setToast(`已基于「${item.title}」素材生成脚本草稿`)}
                  onOpen={() => openItemDetail(item.id)}
                  onDelete={() => removeFavorites([item.id])}
                />
              ))}
            </div>
          ) : (
            <EmptyFavorite text="暂无收藏素材" />
          )}
        </div>
      </aside>
    </div>
  )
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick?: () => void }) {
  return (
    <button className={`relative text-lg font-bold ${active ? 'text-white' : 'text-[#8f86a7] hover:text-[#cfc7df]'}`} onClick={onClick}>
      {label}
      {active && <span className="absolute -bottom-3 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[#8f6bff]" />}
    </button>
  )
}

function FavoriteFilter({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 transition hover:text-white">
      {label}
      <span className="text-lg leading-none">⌄</span>
    </button>
  )
}

function RoutineFavoriteRow({
  group,
  onGenerate,
  onOpen,
  onDelete,
}: {
  group: RoutineGroup & { favoriteAt: number }
  onGenerate: () => void
  onOpen: () => void
  onDelete: () => void
}) {
  const videoSrc = group.coverItem.videoSrc ?? group.coverItem.detailVideoSrc
  const tertiaryTitle = group.tertiaryRoutineName ?? group.routineName
  const secondaryTitle = group.secondaryRoutineName ?? group.routineName

  return (
    <article className="relative min-h-[176px] rounded-2xl bg-[#332941]/96 p-5 pl-[150px]">
      <div className="absolute left-5 top-5 h-[116px] w-[92px] overflow-hidden rounded-xl bg-black">
        {videoSrc ? <FavoriteVideo src={videoSrc} /> : <img src={imageUrl(group.coverItem.imagePrompt)} alt={tertiaryTitle} className="h-full w-full object-cover" />}
      </div>
      <button className="absolute right-5 top-4 rounded-lg p-1 text-[#c7bfd5] hover:bg-white/10 hover:text-white" onClick={onDelete} aria-label="删除收藏套路">
        <Trash2 size={16} />
      </button>
      <h3 className="mr-12 line-clamp-2 text-base font-black leading-6 text-white">{tertiaryTitle}</h3>
      <div className="mt-2 line-clamp-2 text-xs leading-5 text-[#bfb7d2]">{secondaryTitle}</div>
      <div className="absolute bottom-5 left-[150px] flex items-center gap-7 text-sm font-bold text-[#d7d0eb]">
        <button className="flex items-center gap-1.5 hover:text-white" onClick={onGenerate}>
          <FileText size={15} />
          参考套路成片
        </button>
        <button className="flex items-center gap-1.5 hover:text-white" onClick={onOpen}>
          <Eye size={15} />
          查看套路
        </button>
      </div>
      <div className="absolute bottom-5 right-5 text-xs font-medium text-[#786f91]">{formatFavoriteTime(group.favoriteAt)}</div>
    </article>
  )
}

function MaterialFavoriteRow({
  item,
  onReference,
  onGenerate,
  onOpen,
  onDelete,
}: {
  item: InspirationItem
  onReference: () => void
  onGenerate: () => void
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <article className="relative min-h-[176px] rounded-2xl bg-[#332941]/96 p-5 pl-[150px]">
      <div className="absolute left-5 top-5 h-[116px] w-[92px] overflow-hidden rounded-xl bg-black">
        <FavoriteVideo src={materialCoverVideo(item)} />
      </div>
      <button className="absolute right-5 top-4 rounded-lg p-1 text-[#c7bfd5] hover:bg-white/10 hover:text-white" onClick={onDelete} aria-label="删除收藏素材">
        <Trash2 size={16} />
      </button>
      <h3 className="mr-12 line-clamp-2 text-base font-black leading-6 text-white">{item.title}</h3>
      <div className="mt-3 inline-flex rounded-lg bg-white/8 px-2 py-1 text-xs font-bold text-[#c9c1da]">{item.audience}</div>
      <div className="absolute bottom-5 left-[150px] flex items-center gap-7 text-sm font-bold text-[#d7d0eb]">
        <button className="flex items-center gap-1.5 hover:text-white" onClick={onReference}>
          <FileText size={15} />
          参考素材成片
        </button>
        <button className="flex items-center gap-1.5 hover:text-white" onClick={onGenerate}>
          <WandSparkles size={15} />
          去生成脚本
        </button>
        <button className="flex items-center gap-1.5 hover:text-white" onClick={onOpen}>
          <Eye size={15} />
          查看灵感
        </button>
      </div>
      <div className="absolute bottom-5 right-5 text-xs font-medium text-[#786f91]">{formatFavoriteTime(favoriteTime(item))}</div>
    </article>
  )
}

function FavoriteVideo({ src }: { src: string }) {
  return (
    <video
      className="h-full w-full object-cover"
      src={src}
      muted
      playsInline
      preload="auto"
      onLoadedData={(event) => {
        event.currentTarget.pause()
      }}
    />
  )
}

function EmptyFavorite({ text }: { text: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-[#bcb5cf]">{text}</div>
}
