import { PlusIcon } from '@heroicons/react/24/outline';
import {
  Card,
  CardHeader,
  Text,
  Button,
  Image,
  Description,
  Spinner,
} from '@shellagent/ui';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import { TemplateListResponse, Metadata } from '@/services/home/type';
import { cn } from '@/utils/cn';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

interface P {
  loading?: boolean;
  data?: TemplateListResponse['data'];
  onUseTemplate: (id: string) => void;
}

export default function TemplateList({ loading, data, onUseTemplate }: P) {
  console.log('data: ', data);
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="w-4.5 h-4.5 text-brand" />
      </div>
    );
  }
  if (!data?.length) {
    return (
      <Text
        color="subtlest"
        className="flex w-full h-full items-center justify-center">
        No Data
      </Text>
    );
  }
  return data?.map(item => (
    <TemplateCard {...item} onUseTemplate={onUseTemplate} />
  ));
}

interface FlowCardProps {
  id: string;
  metadata: Metadata;
  onUseTemplate: (id: string) => void;
}

export const TemplateCard = ({
  id,
  metadata,
  onUseTemplate,
}: FlowCardProps) => {
  return (
    <Card className="w-[334px] h-[226px] border border-hovered shadow-none p-3 pb-8 group/menu">
      <CardHeader className="h-full w-full relative p-0 overflow-hidden">
        <Image
          width="36px"
          height="36px"
          rounded="lg"
          className="overflow-hidden"
          src={metadata.avatar || '/shell-agent-avatar.png'}
          alt="shell-agent-avatar.png"
        />
        <Text size="lg" weight="medium" className="mt-3 mb-1">
          {metadata.name}
        </Text>
        <Description size="lg" color="subtler">
          {metadata.description}
        </Description>
        {Array.isArray(metadata?.categories) && metadata?.categories?.length ? (
          <div className={cn('flex mt-3')}>
            {metadata?.categories?.map(item => (
              <Tag
                className="bg-surface-accent-gray-subtlest rounded-lg"
                bordered={false}>
                {item}
              </Tag>
            ))}
          </div>
        ) : null}
        <div className="w-full absolute bottom-0 justify-center bg-light-mask hidden md:group-hover/menu:flex">
          <Button onClick={() => onUseTemplate(id)} icon={PlusIcon} size="md">
            Use this template
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
