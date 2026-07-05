import { NavLink } from 'react-router-dom'

const navItems = [
  {
    to: '/questions',
    label: 'Questions',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: '/add-question',
    label: 'Add Question',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 h-screen bg-dm-sidebar border-r border-dm-border flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-dm-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-dm-accent flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="text-sm font-semibold text-dm-text tracking-tight">MedQ</span>
          <span className="ml-auto text-[10px] font-medium text-dm-text2 bg-dm-input px-1.5 py-0.5 rounded">
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150',
                isActive
                  ? 'text-dm-accent bg-dm-hover border-l-2 border-dm-accent pl-[10px]'
                  : 'text-dm-text2 hover:bg-dm-hover hover:text-dm-text border-l-2 border-transparent pl-[10px]',
              ].join(' ')
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
