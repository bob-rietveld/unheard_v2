import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', end: true },
  { name: 'Personas', href: '/personas', end: false },
  { name: 'Experiments', href: '/experiments', end: false },
  { name: 'Results', href: '/results', end: false },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Unheard V2</h1>
            </div>
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
