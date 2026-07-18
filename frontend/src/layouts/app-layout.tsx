import { NavLink, Outlet } from 'react-router-dom';

const AppLayout = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'block rounded-md px-3 py-2 text-sm font-medium',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    ].join(' ');

  return (
    <div className='flex min-h-screen bg-background'>
      <aside className='w-64 border-r bg-card'>
        <div className='border-b p-6'>
          <h1 className='text-xl font-bold'>Power Grid Sim</h1>
        </div>

        <nav className='space-y-1 p-4'>
          <NavLink to='/' end className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to='/create-power-company' className={linkClass}>
            Create Power Company
          </NavLink>

          <NavLink to='/create-power-plant' className={linkClass}>
            Create Power Plant
          </NavLink>

          <NavLink to='/create-substation' className={linkClass}>
            Create Substation
          </NavLink>
        </nav>
      </aside>

      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='flex h-16 items-center border-b bg-card px-6'>
          <h2 className='font-semibold'>Power Grid Application</h2>
        </header>

        <main className='flex-1 overflow-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
