'use client';

import {
  Squares2X2Icon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils/cn';

interface ItemType {
  href: string;
  title: string;
  icon: React.ReactNode;
}

const ItemContent = ({
  item,
  isActive,
}: {
  item: ItemType;
  isActive: (path: string) => boolean;
}) => {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex gap-3 p-2 cursor-pointer rounded-lg hover:bg-surface-container-hovered hover:text-subtler',
        {
          '!text-brand !hover:text-brand bg-surface-accent-blue-subtler hover:bg-surface-accent-blue-subtle':
            isActive(item.href),
        },
      )}>
      {item.icon}
      {item.title}
    </Link>
  );
};

export default function SideContent() {
  const pathname = usePathname();
  const list: ItemType[] = [
    {
      href: '/app',
      title: 'App',
      icon: <RectangleGroupIcon className="w-6 h-6" />,
    },
    {
      href: '/workflow',
      title: 'Workflow',
      icon: <Squares2X2Icon className="w-6 h-6" />,
    },
  ];
  const isActive = (path: string) => {
    if (pathname === path) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-y-1.5">
      {list.map(item => (
        <ItemContent key={item.href} item={item} isActive={isActive} />
      ))}
    </div>
  );
}
