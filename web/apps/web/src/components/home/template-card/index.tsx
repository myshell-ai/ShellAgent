'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import {
  Card,
  CardHeader,
  Text,
  Button,
  Image,
  Description,
} from '@shellagent/ui';
import dayjs from 'dayjs';

import { Metadata } from '@/services/home/type';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

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
    <Card className="w-[334px] h-[152px] border border-hovered shadow-none p-3 pb-8 group/menu">
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
        <div className="w-full absolute bottom-0 justify-center bg-light-mask hidden md:group-hover/menu:flex">
          <Button onClick={() => onUseTemplate(id)} icon={PlusIcon} size="md">
            Use this template
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
