'use client';

import { Myshell, MyshellLogo, Separator } from '@shellagent/ui';
import { usePathname } from 'next/navigation';

import SideContent from './side-content';
import SideFooter from './side-footer';

const paths = ['/workflow/detail', '/app/detail'];

export default function SideBar() {
  const pathname = usePathname();
  const hiddenSideBar = paths.includes(pathname);
  if (hiddenSideBar) {
    return null;
  }
  return (
    <aside className="w-52 px-4 py-6 bg-surface-container-default flex flex-col gap-y-6">
      <div className="px-2 text-lg">
        <div className="pb-6">
          <MyshellLogo className="w-10" />
          <Myshell className="w-18 ml-3" />
        </div>
        <Separator />
      </div>
      <SideContent />
      <SideFooter />
    </aside>
  );
}
