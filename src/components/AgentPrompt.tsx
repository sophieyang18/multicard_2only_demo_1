import { Box, Lightbulb, Settings, SlidersHorizontal } from 'lucide-react'

const tabs = [
  { label: '商品', icon: Box },
  { label: '参考', icon: Lightbulb },
  { label: '脚本/原料', icon: SlidersHorizontal },
  { label: '设置', icon: Settings },
]

export function AgentPrompt() {
  return (
    <section className="relative z-10 mx-9 mt-1 pl-[74px]">
      <div className="flex max-w-[720px] items-center gap-3 rounded-[22px] border border-white/8 bg-[#120f1d]/72 p-2 shadow-[0_24px_68px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        {tabs.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm transition ${
              index === 0 ? 'bg-[#33284b] text-white' : 'text-[#aaa2bf] hover:bg-white/7 hover:text-white'
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>
      <button className="mt-4 flex h-[74px] w-full max-w-[820px] items-center justify-between rounded-[24px] border border-white/8 bg-[#171222]/72 px-7 text-left shadow-inner shadow-white/5 transition hover:border-[#7d59ff]/40 hover:bg-[#211933]/85">
        <span className="text-[#beb7cf]">提供商品、参考、确定的脚本或素材可以帮助我更好地创作哦</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#28213a] text-sm font-semibold text-[#9b91b7]">0</span>
      </button>
    </section>
  )
}
