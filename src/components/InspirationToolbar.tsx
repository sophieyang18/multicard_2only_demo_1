import { Check, ChevronDown, Filter, Grid3X3, Heart, List, Search } from 'lucide-react'
import { useState } from 'react'
import { useWorkbenchStore } from '@/store/workbenchStore'
import type { ContentType, SortKey, ViewMode } from '@/types'

const industryOptions = {
  second: ['半导体', '消费电子', '中药', '白酒', '服饰纺织与奢侈品', '家居', '美妆个护', '银行', '保险', '化工'],
  third: ['集成电路设计', '智能手机', '中成药', '高端白酒', '纺织品', '传统家居', '日化家清', '国有银行 / 政策银行', '综合保险集团', '化肥'],
}
const categoryOptions = {
  second: ['定制商品及服务 / 定制品', '箱包 > 时尚箱包', '鞋靴 > 男鞋', '休闲食品 > 饼干', '3C 数码及配件 > 手机及配件', '3C 数码及配件 > 影音设备及配件', '母婴用品 > 婴童洗护', '农资园艺 > 仿真花材 / 装饰', '汽摩工具 > 内部配件', '市场服务品类 / 广告媒介（硬广）'],
  third: ['定制商品及服务 / 定制品 / 定制礼盒', '箱包 > 时尚箱包 > 单肩包 / 斜挎包', '鞋靴 > 男鞋 > 皮鞋', '休闲食品 > 饼干 > 薄脆饼干', '3C 数码及配件 > 手机及配件 > 手机贴膜', '3C 数码及配件 > 影音设备及配件 > 耳机', '母婴用品 > 婴童洗护 > 婴童湿厕纸', '农资园艺 > 仿真花材 / 装饰 > 仿真花', '汽摩工具 > 内部配件 > 汽车香薰', '市场服务品类 / 广告媒介（硬广）/ 户外广告'],
}
const dateOptions = ['近1天', '近3天', '近7天', '近14天', '近30天']
const sortOptions: Array<{ label: string; value: SortKey }> = [
  { label: '热度降序', value: 'heatDesc' },
  { label: '消耗降序', value: 'spend' },
  { label: '使用商家数降序', value: 'merchantDesc' },
  { label: '点击率降序', value: 'ctr' },
  { label: '转化率降序', value: 'conversion' },
  { label: '3s完播率降序', value: 'completion' },
]
const hotNodeOptions = ['节点热点', '商品热', '场景热', '人群热', '价格热', '展会热', '开学热', '内容热']
const videoTypeOptions = ['视频类型', '口播', '剧情', '种草', '教程', '测评', '科普', '促销', '课程推广', '线索转化']
const sourceOptions = ['视频来源', '达人视频', '品牌素材', '混剪素材']
export function InspirationToolbar() {
  const filters = useWorkbenchStore((state) => state.filters)
  const viewMode = useWorkbenchStore((state) => state.viewMode)
  const setKeyword = useWorkbenchStore((state) => state.setKeyword)
  const setSort = useWorkbenchStore((state) => state.setSort)
  const setFilter = useWorkbenchStore((state) => state.setFilter)
  const setContentType = useWorkbenchStore((state) => state.setContentType)
  const setViewMode = useWorkbenchStore((state) => state.setViewMode)
  const openFavoriteDrawer = useWorkbenchStore((state) => state.openFavoriteDrawer)
  const [openFilter, setOpenFilter] = useState<'view' | 'sort' | 'industry' | 'category' | 'date' | 'hotNode' | 'videoType' | 'source' | 'more' | ''>('')
  const [activePrimaryTab, setActivePrimaryTab] = useState<'square' | 'creative'>('creative')
  const contentType = filters.contentType
  const isRoutineType = contentType === 'routine'
  const isMaterialType = contentType === 'material'
  const isHotspotType = contentType === 'hotspot'

  const switchContentType = (nextContentType: ContentType) => {
    setContentType(nextContentType)
    setOpenFilter('')
  }

  const searchPlaceholder = isRoutineType
    ? '可输入关键词查找对应的套路'
    : isHotspotType
      ? '可输入关键词查找对应的热点'
      : '请输入关键词查找灵感方案'
  const contentTypeLabel = contentType === 'routine' ? '套路' : contentType === 'hotspot' ? '热点' : '素材'
  const sortLabel = sortOptions.find((option) => option.value === filters.sort)?.label ?? '热度降序'

  return (
    <section className="sticky top-0 z-10 border-b border-white/6 bg-[#130f20]/72 px-6 pb-4 pt-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <div className="flex h-11 items-end gap-7">
            <PrimaryTab label="AI灵感广场" active={activePrimaryTab === 'square'} onClick={() => setActivePrimaryTab('square')} />
            <PrimaryTab label="热门创意" active={activePrimaryTab === 'creative'} onClick={() => setActivePrimaryTab('creative')} />
          </div>
          <div className="flex h-10 min-w-[420px] max-w-[520px] flex-1 items-center rounded-[14px] border border-white/9 bg-[#0f0c18]/80 px-3 shadow-inner shadow-black/30">
            <Search size={17} className="text-[#786f91]" />
            <input
              value={filters.keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="ml-3 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#786f91]"
              placeholder={searchPlaceholder}
            />
          </div>
        </div>
        <button
          className="glass-pill h-10 px-4 text-sm text-[#cfc7df]"
          onClick={openFavoriteDrawer}
        >
          <Heart size={18} />
          我的收藏
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ContentTypeDropdown
          value={contentTypeLabel}
          open={openFilter === 'view'}
          onOpen={() => setOpenFilter(openFilter === 'view' ? '' : 'view')}
          onSelect={switchContentType}
        />
        <Dropdown
          label="排序|热度降序"
          value={`排序|${sortLabel}`}
          open={openFilter === 'sort'}
          options={sortOptions.map((option) => option.label)}
          onOpen={() => setOpenFilter(openFilter === 'sort' ? '' : 'sort')}
          onSelect={(value) => {
            setSort(sortOptions.find((option) => option.label === value)?.value ?? 'heatDesc')
            setOpenFilter('')
          }}
        />
        <GroupedDropdown
          label="行业｜不限行业"
          value={filters.industry === '不限行业' ? '行业｜不限行业' : `行业｜${filters.industry}`}
          open={openFilter === 'industry'}
          groups={[
            { title: '二级行业', options: ['不限行业', ...industryOptions.second] },
            { title: '三级行业', options: industryOptions.third },
          ]}
          onOpen={() => setOpenFilter(openFilter === 'industry' ? '' : 'industry')}
          onSelect={(value) => {
            setFilter('industry', value)
            setOpenFilter('')
          }}
        />
        <GroupedDropdown
          label="品类｜不限品类"
          value={filters.category === '不限品类' ? '品类｜不限品类' : `品类｜${filters.category}`}
          open={openFilter === 'category'}
          groups={[
            { title: '二级品类', options: ['不限品类', ...categoryOptions.second] },
            { title: '三级品类', options: categoryOptions.third },
          ]}
          onOpen={() => setOpenFilter(openFilter === 'category' ? '' : 'category')}
          onSelect={(value) => {
            setFilter('category', value)
            setOpenFilter('')
          }}
        />
        {!isMaterialType ? (
          <Dropdown
            label="时间｜近7天"
            value={`时间｜${filters.dateRange}`}
            open={openFilter === 'date'}
              options={dateOptions}
            onOpen={() => setOpenFilter(openFilter === 'date' ? '' : 'date')}
            onSelect={(value) => {
                setFilter('dateRange', value)
              setOpenFilter('')
            }}
          />
        ) : (
          <>
            <Dropdown
              label="时间｜近30天"
              value={`时间｜${filters.dateRange}`}
              open={openFilter === 'date'}
                options={dateOptions}
              onOpen={() => setOpenFilter(openFilter === 'date' ? '' : 'date')}
              onSelect={(value) => {
                  setFilter('dateRange', value)
                setOpenFilter('')
              }}
            />
            <Dropdown
              label="节点热点"
              value={filters.hotNode}
              open={openFilter === 'hotNode'}
              options={hotNodeOptions}
              onOpen={() => setOpenFilter(openFilter === 'hotNode' ? '' : 'hotNode')}
              onSelect={(value) => {
                setFilter('hotNode', value)
                setOpenFilter('')
              }}
            />
            <Dropdown
              label="视频类型"
              value={filters.videoType}
              open={openFilter === 'videoType'}
              options={videoTypeOptions}
              onOpen={() => setOpenFilter(openFilter === 'videoType' ? '' : 'videoType')}
              onSelect={(value) => {
                setFilter('videoType', value)
                setOpenFilter('')
              }}
            />
            <Dropdown
              label="视频来源"
              value={filters.source}
              open={openFilter === 'source'}
              options={sourceOptions}
              onOpen={() => setOpenFilter(openFilter === 'source' ? '' : 'source')}
              onSelect={(value) => {
                setFilter('source', value)
                setOpenFilter('')
              }}
            />
            <div className="relative">
              <button className={`toolbar-button ${openFilter === 'more' ? 'toolbar-button-active' : ''}`} onClick={() => setOpenFilter(openFilter === 'more' ? '' : 'more')}>
                更多筛选
                <Filter size={15} />
              </button>
              {openFilter === 'more' && (
                <div className="absolute right-0 top-10 z-30 w-[310px] rounded-2xl border border-white/10 bg-[#241b35]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  <MoreFilterGroup title="视频时长" options={['不限', '15秒内', '15-30秒', '30秒以上']} />
                  <MoreFilterGroup title="内容结构" options={['真人口播', '价格促销', '行动号召']} />
                  <MoreFilterGroup title="互动指标" options={['热度增长', '点击率增长', '完播率增长']} />
                  <div className="mt-4 flex justify-end gap-2">
                    <button className="rounded-xl px-3 py-2 text-xs text-[#c7c0d7] hover:bg-white/8" onClick={() => setOpenFilter('')}>
                      重置
                    </button>
                    <button className="rounded-xl bg-[#7657ff] px-4 py-2 text-xs font-bold text-white" onClick={() => setOpenFilter('')}>
                      确定
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-white/8 bg-[#21192f]/70 p-1">
          {(['grid', 'list'] as ViewMode[]).map((mode) => {
            const Icon = mode === 'grid' ? Grid3X3 : List
            return (
              <button
                key={mode}
                className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                  viewMode === mode ? 'bg-[#7657ff] text-white' : 'text-[#9e96b5] hover:bg-white/8'
                }`}
                onClick={() => setViewMode(mode)}
              >
                <Icon size={16} />
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PrimaryTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`relative h-11 text-[22px] font-bold tracking-tight transition ${
        active ? 'text-white' : 'text-[#8f86a7] hover:text-[#cfc7df]'
      }`}
      onClick={onClick}
    >
      {label}
      {active && <span className="absolute -bottom-[1px] left-0 right-0 mx-auto h-0.5 rounded-full bg-[#8f6bff]" />}
    </button>
  )
}

function ContentTypeDropdown({
  value,
  open,
  onOpen,
  onSelect,
}: {
  value: string
  open: boolean
  onOpen: () => void
  onSelect: (contentType: ContentType) => void
}) {
  const options: Array<{ label: string; value: ContentType }> = [
    { label: '套路', value: 'routine' },
    { label: '素材', value: 'material' },
    { label: '热点', value: 'hotspot' },
  ]

  return (
    <div className="relative">
      <button className="toolbar-button toolbar-button-active" onClick={onOpen}>
        内容类型｜{value}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute left-0 top-10 z-30 grid min-w-[160px] gap-1 rounded-2xl border border-white/10 bg-[#241b35]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={option.value}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                value === option.label ? 'bg-[#7657ff] text-white' : 'text-[#c7c0d7] hover:bg-white/8'
              }`}
              onClick={() => onSelect(option.value)}
            >
              {option.label}
              {value === option.label && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function GroupedDropdown({
  label,
  value,
  open,
  groups,
  onOpen,
  onSelect,
}: {
  label: string
  value: string
  open: boolean
  groups: Array<{ title: string; options: string[] }>
  onOpen: () => void
  onSelect: (value: string) => void
}) {
  return (
    <div className="relative">
      <button className={`toolbar-button ${value !== label ? 'toolbar-button-active' : ''}`} onClick={onOpen}>
        <span className="max-w-[180px] truncate">{value}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute left-0 top-10 z-30 max-h-[420px] min-w-[300px] overflow-y-auto rounded-2xl border border-white/10 bg-[#241b35]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {groups.map((group) => (
            <div key={group.title} className="mb-2 last:mb-0">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#8f86a7]">{group.title}</div>
              <div className="grid gap-1">
                {group.options.map((option) => (
                  <button
                    key={`${group.title}-${option}`}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                      value.endsWith(option) ? 'bg-[#7657ff] text-white' : 'text-[#c7c0d7] hover:bg-white/8'
                    }`}
                    onClick={() => onSelect(option)}
                  >
                    <span className="max-w-[250px] truncate">{option}</span>
                    {value.endsWith(option) && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Dropdown({
  label,
  value,
  open,
  options,
  onOpen,
  onSelect,
}: {
  label: string
  value: string
  open: boolean
  options: string[]
  onOpen: () => void
  onSelect: (value: string) => void
}) {
  const isSelected = (option: string) => value === option || value.endsWith(option)

  return (
    <div className="relative">
      <button className={`toolbar-button ${value !== label ? 'toolbar-button-active' : ''}`} onClick={onOpen}>
        {value}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute left-0 top-10 z-30 grid min-w-[168px] gap-1 rounded-2xl border border-white/10 bg-[#241b35]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={option}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                isSelected(option) ? 'bg-[#7657ff] text-white' : 'text-[#c7c0d7] hover:bg-white/8'
              }`}
              onClick={() => onSelect(option)}
            >
              {option}
              {isSelected(option) && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MoreFilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-xs font-semibold text-[#8f86a7]">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <button
            key={option}
            className={`rounded-xl border px-3 py-1.5 text-xs transition ${
              index === 0 ? 'border-[#7657ff]/55 bg-[#3a2b62] text-white' : 'border-white/8 bg-white/[0.04] text-[#c7c0d7] hover:bg-white/8'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
