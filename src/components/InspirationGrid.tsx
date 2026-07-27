import { useEffect, useState } from 'react'
import { selectHotspotGroups, selectRoutineGroups, selectVisibleItems, useWorkbenchStore } from '@/store/workbenchStore'
import { HotspotCard } from '@/components/HotspotCard'
import { InspirationCard } from '@/components/InspirationCard'
import { RoutineCard } from '@/components/RoutineCard'

const routinesPerPage = 10

export function InspirationGrid() {
  const items = useWorkbenchStore((state) => state.items)
  const filters = useWorkbenchStore((state) => state.filters)
  const viewMode = useWorkbenchStore((state) => state.viewMode)
  const [currentPage, setCurrentPage] = useState(1)
  const contentType = filters.contentType
  const routineGroups = contentType === 'routine' ? selectRoutineGroups(items, filters) : []
  const hotspotGroups = contentType === 'hotspot' ? selectHotspotGroups(items, filters) : []
  const visibleItems = contentType === 'material' ? selectVisibleItems(items, filters) : []
  const totalRoutinePages = Math.max(1, Math.ceil(routineGroups.length / routinesPerPage))
  const pagedRoutineGroups = routineGroups.slice((currentPage - 1) * routinesPerPage, currentPage * routinesPerPage)
  const emptyText =
    contentType === 'routine'
      ? '没有匹配的热门套路，试试切换关键词或筛选条件。'
      : contentType === 'hotspot'
        ? '没有匹配的创作热点，试试切换关键词或筛选条件。'
        : '没有匹配的灵感素材，试试切换关键词或筛选条件。'
  const empty =
    (contentType === 'routine' && routineGroups.length === 0) ||
    (contentType === 'hotspot' && hotspotGroups.length === 0) ||
    (contentType === 'material' && visibleItems.length === 0)

  useEffect(() => {
    setCurrentPage(1)
  }, [filters.keyword, filters.sort, filters.industry, filters.dateRange, filters.contentType, viewMode])

  useEffect(() => {
    if (currentPage > totalRoutinePages) setCurrentPage(totalRoutinePages)
  }, [currentPage, totalRoutinePages])

  if (empty) {
    return (
      <div className="mx-6 mt-6 rounded-[22px] border border-white/10 bg-white/[0.04] p-10 text-center text-[#bcb5cf]">
        {emptyText}
      </div>
    )
  }

  return (
    <>
      <section
        className={`grid px-6 py-5 ${
          viewMode === 'grid'
            ? 'grid-cols-5 gap-x-4 gap-y-5'
            : 'grid-cols-1 gap-4'
        }`}
      >
        {contentType === 'routine' && pagedRoutineGroups.map((group) => <RoutineCard key={group.routineName} group={group} viewMode={viewMode} />)}
        {contentType === 'hotspot' && hotspotGroups.map((group) => <HotspotCard key={group.hotspotName} group={group} viewMode={viewMode} />)}
        {contentType === 'material' && visibleItems.map((item) => <InspirationCard key={item.id} item={item} viewMode={viewMode} />)}
      </section>
      {contentType === 'routine' && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalRoutinePages}
          totalItems={routineGroups.length}
          onChange={setCurrentPage}
        />
      )}
    </>
  )
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onChange,
}: {
  currentPage: number
  totalPages: number
  totalItems: number
  onChange: (page: number) => void
}) {
  return (
    <footer className="flex items-center justify-between border-t border-white/6 px-6 py-4 text-sm text-[#bfb7d2]">
      <div>
        共 {totalItems} 个套路，每页 {routinesPerPage} 个，共 {totalPages} 页
      </div>
      <div className="flex items-center gap-2">
        <button
          className="toolbar-button disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => onChange(Math.max(1, currentPage - 1))}
        >
          上一页
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            className={`grid h-9 min-w-9 place-items-center rounded-xl border px-3 transition ${
              currentPage === page
                ? 'border-[#7657ff]/60 bg-[#7657ff] text-white'
                : 'border-white/8 bg-[#21192f]/70 text-[#bfb7d2] hover:bg-white/8'
            }`}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="toolbar-button disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage === totalPages}
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        >
          下一页
        </button>
      </div>
    </footer>
  )
}
