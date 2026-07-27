import type { InspirationItem } from '@/types'

const mockVideoBase = 'file:///Users/bytedance/analysis_new/0720/mock'
const assetVideoBase = 'file:///Users/bytedance/analysis_new/0720/assets'

const fallbackVideos = [
  `${assetVideoBase}/hot-pack/routine-top1-1.mp4`,
  `${assetVideoBase}/hot-pack/routine-top1-2.mp4`,
  `${assetVideoBase}/hot-pack/routine-top1-3.mp4`,
  `${assetVideoBase}/hot-pack/routine-top2-1.mp4`,
  `${assetVideoBase}/hot-pack/routine-top2-2.mp4`,
  `${assetVideoBase}/inspiration-pack/carpet-cleaning.mp4`,
]

const matchedVideoNames = new Set(['1', '2', '3', '4', '10', '11', '12', '13', '14', '15', '16', '17', '19', '20'])

const audienceLabels = ['小镇青年', '都市银发', '都市蓝领', '精致妈妈', '新锐白领', '资深中产']

const coverPrompts = [
  'realistic vertical ecommerce video cover, young chinese shopper holding a skincare product in a bright bathroom, clean product demo composition, premium commercial lighting',
  'realistic vertical short video cover, chinese senior relaxing in a modern living room with wellness device, warm lifestyle advertising scene',
  'realistic vertical product video cover, delivery worker demonstrating a home cleaning tool in an apartment, clear before after visual composition',
  'realistic vertical beauty video cover, elegant chinese woman showing cosmetic packaging near mirror, soft studio lighting, premium ad style',
  'realistic vertical food product video cover, office worker holding a beverage at desk, clean blue green commercial background',
  'realistic vertical parenting education video cover, mother and child using learning tablet at home desk, bright warm classroom atmosphere',
  'realistic vertical fashion product video cover, summer shoes displayed on clean city sidewalk, influencer shopping style',
  'realistic vertical home renovation video cover, modern apartment interior with calculator and sample boards, lead generation ad style',
  'realistic vertical exhibition product video cover, premium supplement beverage booth with product display, commercial lighting',
  'realistic vertical oral care product video cover, mint tablet packaging on clean white desk, fresh green background',
]

const materialTitles = [
  '数学救星朱韬，初中数学不再难',
  '真的后悔没有早点用皂洗脸，趁着活动划算快冲',
  '要是早知道有它，就不会被这些问题困扰这么久了',
  '快开学防晒赶紧备！别等娃晒出熊猫臂才后悔！',
  '美甲一步胶，不需要底胶封层，轻松做美甲',
  '一些有美女感又可以陪我暴走十公里的夏季高跟鞋',
  '不会的问题别喊妈！让我来帮助你！',
  '帮子女查一生成就，输入名字，一分钟出结果！',
  '出门旅行住酒店我都会带上这个',
  '权威期刊《Cell》实锤，脱发根源，是毛囊没了',
  '期末物理复盘查漏补缺！',
  '装修超过这个价就亏了！',
  '• • 求求这玩意千万别停产！',
]

const rows = [
  ['1', '轻剧情/互动演绎›外观/细节展示›参数/信息说明›转化引导', '剧情·外观·信息·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v0dc8eg10000d97jk8vog65jmta4atq0', '1'],
  ['2', '外观/细节展示+社会证明', '外观+社会证明', 'https://icc.bytedance.net/platform/preview/video?vid=v28033gi0000d979osfog65na7u7hh6g', '2'],
  ['3', '轻剧情/互动演绎›外观/细节展示›参数/信息说明', '剧情·外观·信息', 'https://icc.bytedance.net/platform/preview/video?vid=v03033g10000d9bjtefog65vsj41kj00', '3'],
  ['4', '参数/信息说明›转化引导', '信息·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v0dc8eg10000d965m9nog65mackr5010', '4'],
  ['5', '轻剧情/互动演绎›社会证明›参数/信息说明›促销利益信息›转化引导', '剧情·社会证明·信息·促销·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v0dc8eg10000d91606fog65qqn7hdgkg', '5'],
  ['6', '悬念/反问钩子+轻剧情/互动演绎›促销利益信息›转化引导', '钩子+剧情·促销·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v28033gi0000d95lda7og65jo8lostfg', '6'],
  ['7', '悬念/反问钩子›参数/信息说明›促销利益信息›转化引导', '钩子·信息·促销·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v28033gi0000d98un17og65hh9g4ujg0', '7'],
  ['8', '悬念/反问钩子+轻剧情/互动演绎›外观/细节展示›转化引导', '钩子+剧情·外观·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v0dc8eg10000d9c7dt7og65n28nnev10', '8'],
  ['9', '悬念/反问钩子›外观/细节展示›参数/信息说明›转化引导', '钩子·外观·信息·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v021abg10002d9a7md7og65ks1sfp39g', '9'],
  ['10', '轻剧情/互动演绎›外观/细节展示›促销利益信息', '剧情·外观·促销', 'https://icc.bytedance.net/platform/preview/video?vid=v03c8eg10000d8tr217og65por4a0mgg', '10'],
  ['11', '悬念/反问钩子+轻剧情/互动演绎›外观/细节展示+社会证明›参数/信息说明›促销利益信息›转化引导', '钩子+剧情·外观+社会证明·信息·促销·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v28033gi0000d975in7og65jmc8id5c0', '11'],
  ['12', '轻剧情/互动演绎›外观/细节展示+社会证明›参数/信息说明›促销利益信息›转化引导', '剧情·外观+社会证明·信息·促销·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v03033g10000d97mr17og65m44lenrag', '12'],
  ['13', '轻剧情/互动演绎›外观/细节展示›参数/信息说明›促销利益信息›转化引导', '剧情·外观·信息·促销·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v0d00fg10000d9def0vog65rbu7r1s30', '13'],
  ['14', '悬念/反问钩子›转化引导', '钩子·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v1e033gi0000d2kn3cnog65v6r4c3m9g', '14'],
  ['15', '悬念/反问钩子›外观/细节展示+社会证明›参数/信息说明›促销利益信息', '钩子·外观+社会证明·信息·促销', 'https://icc.bytedance.net/platform/preview/video?vid=v28033gi0000d9a4e3fog65n0pfk39s0', '15'],
  ['16', '悬念/反问钩子›外观/细节展示+社会证明›参数/信息说明›促销利益信息›转化引导', '钩子·外观+社会证明·信息·促销·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v28033gi0000d8rdq67og65umi6mcbkg', '16'],
  ['17', '外观/细节展示+社会证明›参数/信息说明›促销利益信息', '外观+社会证明·信息·促销', 'https://icc.bytedance.net/platform/preview/video?vid=v0392fg10003d94b3v2ljht41qhl9s70', '17'],
  ['18', '未分类', '未找到可靠映射', '待补充', '18'],
  ['19', '轻剧情/互动演绎›社会证明›促销利益信息›转化引导', '剧情·社会证明·促销·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v28033gi0000d97m6p7og65gnglvi600', '19'],
  ['20', '轻剧情/互动演绎›参数/信息说明›促销利益信息›转化引导', '剧情·信息·促销·转化', 'https://icc.bytedance.net/platform/preview/video?vid=v0dc8eg10000d7eufnfog65mo0jkgdqg', '20'],
] as const

export const routineNames = rows.map(([, secondary]) => secondary)

export const inspirations: InspirationItem[] = rows.map(([rankText, secondaryRoutineName, tertiaryRoutineName, materialLink, materialName], index) => {
  const rank = Number(rankText)
  const videoSrc = matchedVideoNames.has(materialName) ? `${mockVideoBase}/${materialName}.mp4` : undefined
  const liked = index % 5 === 1

  return {
    id: `routine-top-${rankText}`,
    rank,
    audience: audienceLabels[index % audienceLabels.length],
    routineName: secondaryRoutineName,
    secondaryRoutineName,
    tertiaryRoutineName,
    materialName,
    materialLink,
    videoSrc,
    detailVideoSrc: videoSrc ?? fallbackVideos[index % fallbackVideos.length],
    title: materialTitles[index % materialTitles.length],
    heat: 1200 - index * 37,
    merchantCount: 96 - index * 3,
    ctr: 4.8 - index * 0.13,
    conversionRate: 3.6 - index * 0.07,
    completionRate: 42 - index * 0.35,
    industry: '不限行业',
    hotNode: index < 10 ? '节点热点' : '商品热',
    videoType: '套路素材',
    source: videoSrc ? '本地匹配素材' : '封面素材',
    imagePrompt: coverPrompts[index % coverPrompts.length],
    liked,
    likedAt: liked ? new Date(Date.UTC(2026, 5, 24, 16, 48, 53 - index)).toISOString() : undefined,
  }
})
