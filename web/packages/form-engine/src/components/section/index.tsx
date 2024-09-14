import { ChevronRightIcon } from '@heroicons/react/16/solid';
import ClipboardIcon from '@heroicons/react/24/outline/esm/ClipboardIcon';
import { useFormContext, Heading, Paragraph, Icon } from '@shellagent/ui';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { cn } from '../../utils/cn';
import { useFormEngineContext } from '../provider';

export interface ISectionProps {
  name?: string;
  children?: React.ReactNode;
}

/**
 * @param props
 * @returns
 */
const Section: React.FC<ISectionProps> = props => {
  const { children, name = '' } = props;
  const { fields, components } = useFormEngineContext();
  const { schema } = fields[name] || {};
  const { getValues } = useFormContext();

  if (!schema) {
    return null;
  }

  const {
    title,
    description,
    'x-title-size': xTitleSize = 'h1',
    'x-title-icon': xTitleIcon,
    'x-class': xClass = '',
    'x-suffix': xSuffix,
    'x-collapsible': xCollapsible,
    'x-title-copiable': xTitleCopiable,
  } = schema;

  const value = name !== '' ? getValues(name) : getValues();
  const [isExpand, setIsExpand] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const cls = cn(
    'mt-3 space-y-3',
    {
      hidden: !isExpand,
    },
    xClass,
  );
  const onExpandToggle = () => {
    setIsExpand(!isExpand);
  };

  return (
    <div className="flex flex-col" data-ui="section">
      <div className="flex items-center group/menu">
        {xTitleIcon ? (
          <img
            alt="title"
            width="20px"
            height="20px"
            className="mr-2"
            src={xTitleIcon}
          />
        ) : null}
        {title ? (
          xTitleCopiable ? (
            <Heading
              size={xTitleSize}
              lineClamp={1}
              className="flex items-center cursor-pointer group/title">
              {title}
              {isCopied ? (
                <span className="text-icon-success ml-2">copied!</span>
              ) : (
                <CopyToClipboard
                  text={title}
                  onCopy={() => {
                    setIsCopied(true);
                    setTimeout(() => {
                      setIsCopied(false);
                    }, 1500);
                  }}>
                  <Icon
                    component={ClipboardIcon}
                    size="sm"
                    className=" ml-2 invisible group-hover/title:visible"
                  />
                </CopyToClipboard>
              )}
            </Heading>
          ) : (
            <Heading size={xTitleSize} lineClamp={1}>
              {title}
            </Heading>
          )
        ) : null}
        {xSuffix ? (
          <div className="ml-auto">
            {React.createElement(components[xSuffix], { value })}
          </div>
        ) : null}
        {xCollapsible ? (
          <ChevronRightIcon
            onClick={onExpandToggle}
            className={cn('w-5 h-5 text-subtle cursor-pointer ml-auto', {
              'rotate-90': isExpand,
            })}
          />
        ) : null}
      </div>
      {description ? (
        <Paragraph size="sm" lineClamp={2} color="subtler" className="mt-1">
          {description}
        </Paragraph>
      ) : null}
      <div className={cls}>{children}</div>
    </div>
  );
};

export default Section;
