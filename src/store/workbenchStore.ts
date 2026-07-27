import { create } from 'zustand'
import { inspirations } from '@/data/inspirations'
import type { ContentType, FilterState, HotspotGroup, InspirationItem, RoutineGroup, SortKey, ViewMode } from '@/types'

interface WorkbenchState {
  announcementVisible: boolean
  guideVisible: boolean
  activeNav: string
  viewMode: ViewMode
  toast: string
  selectedItemId: string
  generatedItemId: string
  generatedMaterialItemId: string
  favoriteDrawerOpen: boolean
  filters: FilterState
  items: InspirationItem[]
  setAnnouncementVisible: (visible: boolean) => void
  setGuideVisible: (visible: boolean) => void
  setActiveNav: (nav: string) => void
  setViewMode: (mode: ViewMode) => void
  setToast: (message: string) => void
  clearToast: () => void
  openDetail: (id: string) => void
  closeDetail: () => void
  openGeneratedVideo: (id: string) => void
  closeGeneratedVideo: () => void
  openGeneratedMaterial: (id: string) => void
  closeGeneratedMaterial: () => void
  openFavoriteDrawer: () => void
  closeFavoriteDrawer: () => void
  setKeyword: (keyword: string) => void
  setSort: (sort: SortKey) => void
  setFilter: (key: keyof FilterState, value: string | boolean) => void
  setContentType: (contentType: ContentType) => void
  toggleRoutineMode: () => void
  toggleFavoritesOnly: () => void
  toggleLike: (id: string) => void
  removeFavorites: (ids: string[]) => void
}

const initialFilters: FilterState = {
  contentType: 'routine',
  keyword: '',
  sort: 'heatDesc',
  dateRange: '近7天',
  industry: '不限行业',
  category: '不限品类',
  hotNode: '节点热点',
  videoType: '视频类型',
  source: '视频来源',
  favoritesOnly: false,
  routineMode: true,
  routine: '',
}

export const useWorkbenchStore = create<WorkbenchState>((set) => ({
  announcementVisible: true,
  guideVisible: true,
  activeNav: '首页',
  viewMode: 'grid',
  toast: '',
  selectedItemId: '',
  generatedItemId: '',
  generatedMaterialItemId: '',
  favoriteDrawerOpen: false,
  filters: initialFilters,
  items: inspirations,
  setAnnouncementVisible: (visible) => set({ announcementVisible: visible }),
  setGuideVisible: (visible) => set({ guideVisible: visible }),
  setActiveNav: (nav) => set({ activeNav: nav }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setToast: (message) => set({ toast: message }),
  clearToast: () => set({ toast: '' }),
  openDetail: (id) => set({ selectedItemId: id }),
  closeDetail: () => set({ selectedItemId: '' }),
  openGeneratedVideo: (id) => set({ selectedItemId: '', generatedItemId: id }),
  closeGeneratedVideo: () => set({ generatedItemId: '' }),
  openGeneratedMaterial: (id) => set({ selectedItemId: '', favoriteDrawerOpen: false, generatedMaterialItemId: id }),
  closeGeneratedMaterial: () => set({ generatedMaterialItemId: '' }),
  openFavoriteDrawer: () => set({ favoriteDrawerOpen: true }),
  closeFavoriteDrawer: () => set({ favoriteDrawerOpen: false }),
  setKeyword: (keyword) => set((state) => ({ filters: { ...state.filters, keyword } })),
  setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setContentType: (contentType) =>
    set((state) => ({
      filters: {
        ...state.filters,
        contentType,
        routineMode: contentType === 'routine',
        routine: '',
        dateRange: contentType === 'material' ? '近30天' : '近7天',
        sort: state.filters.sort === 'heatAsc' ? 'heatAsc' : 'heatDesc',
      },
    })),
  toggleRoutineMode: () =>
    set((state) => ({
      filters: {
        ...state.filters,
        routineMode: !state.filters.routineMode,
        routine: state.filters.routineMode ? '' : state.filters.routine,
      },
    })),
  toggleFavoritesOnly: () =>
    set((state) => ({ filters: { ...state.filters, favoritesOnly: !state.filters.favoritesOnly } })),
  toggleLike: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              liked: !item.liked,
              likedAt: item.liked ? undefined : new Date().toISOString(),
            }
          : item,
      ),
    })),
  removeFavorites: (ids) =>
    set((state) => ({
      items: state.items.map((item) => (ids.includes(item.id) ? { ...item, liked: false, likedAt: undefined } : item)),
    })),
}))

export function selectVisibleItems(items: InspirationItem[], filters: FilterState) {
  const keyword = filters.keyword.trim().toLowerCase()

  return items
    .filter((item) => {
      const keywordMatched =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        (filters.routineMode && item.routineName.toLowerCase().includes(keyword)) ||
        item.secondaryRoutineName?.toLowerCase().includes(keyword) ||
        item.tertiaryRoutineName?.toLowerCase().includes(keyword) ||
        item.materialName?.toLowerCase().includes(keyword) ||
        item.audience.toLowerCase().includes(keyword) ||
        item.industry.toLowerCase().includes(keyword)
      const favoriteMatched = !filters.favoritesOnly || item.liked
      const industryMatched = filters.industry === '不限行业' || item.industry === filters.industry
      const categoryMatched = !filters.category || filters.category === '不限品类'
      const hotNodeMatched = filters.hotNode === '节点热点' || item.hotNode === filters.hotNode
      const videoTypeMatched = filters.videoType === '视频类型' || item.videoType === filters.videoType
      const sourceMatched = filters.source === '视频来源' || item.source === filters.source
      const routineMatched = !filters.routineMode || !filters.routine || item.routineName === filters.routine

      return keywordMatched && favoriteMatched && industryMatched && categoryMatched && hotNodeMatched && videoTypeMatched && sourceMatched && routineMatched
    })
    .sort((a, b) => {
      if (filters.sort === 'ctr') return b.ctr - a.ctr
      if (filters.sort === 'conversion') return (b.conversionRate ?? 0) - (a.conversionRate ?? 0)
      if (filters.sort === 'completion') return (b.completionRate ?? 0) - (a.completionRate ?? 0)
      if (filters.sort === 'merchantDesc') return b.merchantCount - a.merchantCount
      if (filters.sort === 'latest') return a.id.localeCompare(b.id)
      if (filters.sort === 'heatAsc') return a.heat - b.heat
      if (filters.sort === 'spend') return b.heat - a.heat
      return b.heat - a.heat
    })
}

export function selectRoutineGroups(items: InspirationItem[], filters: FilterState): RoutineGroup[] {
  const keyword = filters.keyword.trim().toLowerCase()
  const filteredItems = items.filter((item) => {
    const keywordMatched =
      !keyword ||
      item.routineName.toLowerCase().includes(keyword) ||
      item.secondaryRoutineName?.toLowerCase().includes(keyword) ||
      item.tertiaryRoutineName?.toLowerCase().includes(keyword) ||
      item.materialName?.toLowerCase().includes(keyword) ||
      item.title.toLowerCase().includes(keyword) ||
      item.industry.toLowerCase().includes(keyword) ||
      item.audience.toLowerCase().includes(keyword)
    const industryMatched = filters.industry === '不限行业' || item.industry === filters.industry
    const routineMatched = !filters.routine || item.routineName === filters.routine

    return keywordMatched && industryMatched && routineMatched
  })

  const groups = new Map<string, InspirationItem[]>()
  filteredItems.forEach((item) => {
    groups.set(item.routineName, [...(groups.get(item.routineName) ?? []), item])
  })

  return Array.from(groups.entries())
    .map(([routineName, groupItems]) => {
      const sortedItems = [...groupItems].sort((a, b) => b.ctr - a.ctr)
      const coverItem = sortedItems[0]
      const heat = groupItems.reduce((total, item) => total + item.heat, 0)
      const merchantCount = groupItems.reduce((total, item) => total + item.merchantCount, 0)

      return {
        routineName,
        secondaryRoutineName: coverItem.secondaryRoutineName,
        tertiaryRoutineName: coverItem.tertiaryRoutineName,
        items: groupItems.sort((a, b) => b.heat - a.heat),
        coverItem,
        heat,
        merchantCount,
        materialCount: groupItems.length,
        industry: coverItem.industry,
      }
    })
    .filter((group) => !filters.favoritesOnly || group.items.some((item) => item.liked))
    .sort((a, b) => {
      if (filters.sort === 'ctr') return b.coverItem.ctr - a.coverItem.ctr
      if (filters.sort === 'conversion') return (b.coverItem.conversionRate ?? 0) - (a.coverItem.conversionRate ?? 0)
      if (filters.sort === 'completion') return (b.coverItem.completionRate ?? 0) - (a.coverItem.completionRate ?? 0)
      if (filters.sort === 'merchantDesc') return b.merchantCount - a.merchantCount
      if (filters.sort === 'spend') return b.heat - a.heat
      return filters.sort === 'heatAsc' ? a.heat - b.heat : b.heat - a.heat
    })
}

export function selectHotspotGroups(items: InspirationItem[], filters: FilterState): HotspotGroup[] {
  const keyword = filters.keyword.trim().toLowerCase()
  const filteredItems = items.filter((item) => {
    const keywordMatched =
      !keyword ||
      item.hotNode.toLowerCase().includes(keyword) ||
      item.title.toLowerCase().includes(keyword) ||
      item.industry.toLowerCase().includes(keyword) ||
      item.audience.toLowerCase().includes(keyword)
    const industryMatched = filters.industry === '不限行业' || item.industry === filters.industry

    return keywordMatched && industryMatched
  })

  const groups = new Map<string, InspirationItem[]>()
  filteredItems.forEach((item) => {
    groups.set(item.hotNode, [...(groups.get(item.hotNode) ?? []), item])
  })

  return Array.from(groups.entries())
    .map(([hotspotName, groupItems]) => {
      const sortedItems = [...groupItems].sort((a, b) => b.ctr - a.ctr)
      const coverItem = sortedItems[0]
      const heat = groupItems.reduce((total, item) => total + item.heat, 0)

      return {
        hotspotName,
        items: [...groupItems].sort((a, b) => b.heat - a.heat),
        coverItem,
        heat,
        materialCount: groupItems.length,
        industry: coverItem.industry,
      }
    })
    .filter((group) => !filters.favoritesOnly || group.items.some((item) => item.liked))
    .sort((a, b) => (filters.sort === 'heatAsc' ? a.heat - b.heat : b.heat - a.heat))
}
