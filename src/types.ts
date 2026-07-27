export type SortKey = 'heatDesc' | 'spend' | 'merchantDesc' | 'heatAsc' | 'ctr' | 'conversion' | 'completion' | 'latest'
export type ViewMode = 'grid' | 'list'
export type ContentType = 'routine' | 'material' | 'hotspot'

export interface InspirationItem {
  id: string
  rank?: number
  audience: string
  routineName: string
  secondaryRoutineName?: string
  tertiaryRoutineName?: string
  materialName?: string
  materialLink?: string
  videoSrc?: string
  detailVideoSrc?: string
  title: string
  heat: number
  merchantCount: number
  ctr: number
  conversionRate?: number
  completionRate?: number
  industry: string
  hotNode: string
  videoType: string
  source: string
  imagePrompt: string
  liked: boolean
  likedAt?: string
}

export interface FilterState {
  contentType: ContentType
  keyword: string
  sort: SortKey
  dateRange: '近1天' | '近3天' | '近7天' | '近14天' | '近30天'
  industry: string
  category: string
  hotNode: string
  videoType: string
  source: string
  favoritesOnly: boolean
  routineMode: boolean
  routine: string
}

export interface RoutineGroup {
  routineName: string
  secondaryRoutineName?: string
  tertiaryRoutineName?: string
  items: InspirationItem[]
  coverItem: InspirationItem
  heat: number
  merchantCount: number
  materialCount: number
  industry: string
}

export interface HotspotGroup {
  hotspotName: string
  items: InspirationItem[]
  coverItem: InspirationItem
  heat: number
  materialCount: number
  industry: string
}
