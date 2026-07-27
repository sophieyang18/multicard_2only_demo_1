import { Bell, BriefcaseBusiness, Home, Wrench } from 'lucide-react'
import { useWorkbenchStore } from '@/store/workbenchStore'

const navItems = [
  { label: '首页', icon: Home },
  { label: '资产', icon: BriefcaseBusiness },
  { label: '工具', icon: Wrench },
]

export function SideNav() {
  const activeNav = useWorkbenchStore((state) => state.activeNav)
  const setActiveNav = useWorkbenchStore((state) => state.setActiveNav)

  return (
    <aside className="fixed left-7 top-[184px] z-20 flex w-[66px] flex-col items-center rounded-full border border-white/12 bg-[#191426]/70 py-4 shadow-[0_18px_52px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      {navItems.map(({ label, icon: Icon }) => {
        const active = activeNav === label
        return (
          <button
            key={label}
            onClick={() => setActiveNav(label)}
            className={`mb-3 flex h-[76px] w-[56px] flex-col items-center justify-center gap-2 rounded-[28px] text-sm transition ${
              active ? 'bg-white/10 text-white shadow-inner shadow-white/10' : 'text-[#a9a1c2] hover:bg-white/6 hover:text-white'
            }`}
          >
            <Icon size={24} />
            <span>{label}</span>
          </button>
        )
      })}
      <button className="relative mt-2 grid h-10 w-10 place-items-center rounded-full text-[#a9a1c2] transition hover:bg-white/8 hover:text-white">
        <Bell size={21} />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff5967]" />
      </button>
    </aside>
  )
}
