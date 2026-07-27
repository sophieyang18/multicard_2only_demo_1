import { ChevronDown, Clock3, History, Sparkles, Shuffle, Zap } from 'lucide-react'

export function TopWorkspaceBar() {
  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-9 py-8">
      <div className="flex items-center gap-4">
        <button className="glass-pill px-4 py-3 text-sm text-[#d7d0eb]">
          <History size={18} />
          历史任务
        </button>
        <div className="flex items-center gap-0 rounded-full bg-[#2b2442]/85 p-1 shadow-inner shadow-white/5 ring-1 ring-white/8">
          <div className="flex items-center gap-3 rounded-full px-3 py-2 text-[#eee9ff]">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#ffe38a] to-[#fe7b62] text-sm font-black text-[#4b2a20] ring-2 ring-white/50">
              创
            </div>
            <span className="font-medium">测试RD_005_PC</span>
            <ChevronDown size={17} className="text-[#9e96b8]" />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#342b4d] px-5 py-3 text-[#bfb7d6]">
            <span>巨量引擎方舟-测试代理商</span>
            <Shuffle size={15} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="glass-pill px-6 py-3 text-lg font-bold text-white">
          <Sparkles size={18} className="fill-white/80" />
          1,035,155
        </div>
        <button className="grid h-12 w-12 place-items-center rounded-full bg-[#2f2747]/85 text-white ring-1 ring-white/10 transition hover:bg-[#41335f]">
          <Zap size={22} className="text-[#86f6ff]" />
        </button>
        <button className="grid h-12 w-12 place-items-center rounded-full bg-[#2f2747]/85 text-white ring-1 ring-white/10 transition hover:bg-[#41335f]">
          <Clock3 size={22} className="text-[#b7afd4]" />
        </button>
      </div>
    </header>
  )
}
