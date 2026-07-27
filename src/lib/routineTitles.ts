const routineTitleSamples = [
  '外观/细节展示›参数/信息说明›促销利益信息',
  '轻剧情/互动演绎>外观/细节展示›参数/信息说明',
  '轻剧情/互动演绎',
  '轻剧情/互动演绎>外观/细节展示›参数/信息说明>转化引导',
  '外观/细节展示+社会证明＞参数/信息说明>促销利益信息',
  '外观/细节展示+社会证明',
  '悬念/反问钩子+轻剧情/互动演绎>促销利益信息›转化引导',
]

export function getRoutineDisplayTitle(routineName: string) {
  return routineTitleSamples[Math.abs(hashCode(routineName)) % routineTitleSamples.length]
}

function hashCode(value: string) {
  return value.split('').reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0)
}
