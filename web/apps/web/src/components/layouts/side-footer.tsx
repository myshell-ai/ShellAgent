/** @jsxImportSource @emotion/react */

'use client';

import { css } from '@emotion/react';
import {
  Cog8ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { Text, LegoSolid } from '@shellagent/ui';
import clsx from 'clsx';
import { useInjection } from 'inversify-react';
import Link from 'next/link';
import React from 'react';

import { useGlobalStore } from '@/stores/global/global-provider';

import { SettingsModel } from '../settings/settings.model';

interface ItemType {
  href?: string;
  title: string;
  icon: React.ReactNode;
  passHref?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const ItemFooter = ({
  href,
  title,
  icon,
  passHref,
  onClick,
  disabled,
}: ItemType) => {
  return (
    <Link
      href={href || ''}
      passHref={passHref}
      onClick={disabled ? () => {} : onClick}
      css={css`
        color:
        flex: 0;
      `}
      className={clsx('flex gap-3 p-2 rounded-lg', {
        'hover:bg-surface-container-hovered hover:text-subtler cursor-pointer':
          !disabled,
        'cursor-not-allowed': disabled,
      })}>
      {icon}
      <Text color={disabled ? 'disabled' : 'subtler'}>{title}</Text>
    </Link>
  );
};

export default function SideFooter() {
  const settingsModel = useInjection(SettingsModel);
  const setManagerDialogOpen = useGlobalStore(
    state => state.setManagerDialogOpen,
  );

  const onOpenTab = (url: string) => {
    window.open(url, '__blank');
  };

  const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

  const list: ItemType[] = [
    {
      title: 'Manager',
      passHref: true,
      icon: <LegoSolid className="w-6 h-6 text-icon-subtle" />,
      onClick: () => setManagerDialogOpen(true),
    },
    {
      title: 'Settings',
      passHref: true,
      disabled: settingsDisabled,
      onClick: () => {
        if (settingsDisabled) return;
        settingsModel.modal.open();
      },
      icon: (
        <Cog8ToothIcon
          className={clsx('w-6 h-6 ', {
            'text-icon-subtle': !settingsDisabled,
            'text-disabled': settingsDisabled,
          })}
        />
      ),
    },
    {
      title: 'Help',
      passHref: true,
      icon: <QuestionMarkCircleIcon className="w-6 h-6 text-icon-subtle" />,
      onClick: () =>
        onOpenTab(
          'https://www.notion.so/myshellai/Shell-Agent-30b32e482e75483a8c7207db184a176f',
        ),
    },
    // {
    //   title: 'Report',
    //   href: '/report',
    //   icon: <Report className="w-6 h-6 text-icon-subtle" />,
    // },
    // {
    //   title: 'Community',
    //   passHref: true,
    //   icon: <Discord className="w-6 h-6 text-icon-subtle" />,
    //   onClick: () =>
    //     onOpenTab(
    //       'https://discord.com/channels/1122227993805336617/1127967758919925953',
    //     ),
    // },
  ];

  return (
    <div className="fixed bottom-6 flex flex-col gap-y-1.5 w-40">
      {list.map(item => (
        <ItemFooter key={item.title} {...item} />
      ))}
    </div>
  );
}
