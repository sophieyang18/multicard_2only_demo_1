import { describe, expect, it } from 'vitest'
import { inspirations } from '@/data/inspirations'
import { selectHotspotGroups, selectRoutineGroups, selectVisibleItems } from '@/store/workbenchStore'
import type { FilterState } from '@/types'

const baseFilters: FilterState = {
  contentType: 'material',
  keyword: '',
  sort: 'heatDesc',
  dateRange: '近7天',
  industry: '不限行业',
  category: '不限品类',
  hotNode: '节点热点',
  videoType: '视频类型',
  source: '视频来源',
  favoritesOnly: false,
  routineMode: false,
  routine: '',
}

describe('selectVisibleItems', () => {
  it('加载 Excel top20 全量数据', () => {
    expect(inspirations).toHaveLength(20)
    expect(inspirations[0]).toMatchObject({
      id: 'routine-top-1',
      materialName: '1',
      secondaryRoutineName: '轻剧情/互动演绎›外观/细节展示›参数/信息说明›转化引导',
    })
  })

  it('按热度从高到低排序', () => {
    const result = selectVisibleItems(inspirations, baseFilters)

    expect(result[0].heat).toBeGreaterThanOrEqual(result[1].heat)
    expect(result[0].id).toBe('routine-top-1')
  })

  it('支持关键词搜索套路名称', () => {
    const result = selectVisibleItems(inspirations, { ...baseFilters, keyword: '参数/信息说明›转化引导' })

    expect(result.map((item) => item.id)).toContain('routine-top-4')
  })

  it('识别能匹配 mock 视频的素材', () => {
    const matched = inspirations.filter((item) => item.videoSrc)
    const unmatched = inspirations.filter((item) => !item.videoSrc)

    expect(matched.map((item) => item.materialName)).toEqual(['1', '2', '3', '4', '10', '11', '12', '13', '14', '15', '16', '17', '19', '20'])
    expect(unmatched.every((item) => item.detailVideoSrc)).toBe(true)
  })

  it('支持按套路名称聚合', () => {
    const groups = selectRoutineGroups(inspirations, { ...baseFilters, contentType: 'routine', routineMode: true })

    expect(groups).toHaveLength(20)
    expect(groups[0].routineName).toBe('轻剧情/互动演绎›外观/细节展示›参数/信息说明›转化引导')
    expect(groups[0].secondaryRoutineName).toBe('轻剧情/互动演绎›外观/细节展示›参数/信息说明›转化引导')
  })

  it('支持按热点聚合并按热度排序', () => {
    const groups = selectHotspotGroups(inspirations, { ...baseFilters, contentType: 'hotspot' })

    expect(groups[0].heat).toBeGreaterThanOrEqual(groups[1].heat)
    expect(groups.find((group) => group.hotspotName === '节点热点')?.materialCount).toBe(10)
  })
})
