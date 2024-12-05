'use client';

import { PencilSquare, Heading, Input } from '@shellagent/ui';
import { useState, useEffect } from 'react';

interface EditableTitleProps {
  value: string;
  onChange: (value: string) => void;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({
  value,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(value);

  useEffect(() => {
    setTitleInput(value);
  }, [value]);

  const handleTitleChange = () => {
    if (titleInput.trim() === '') {
      setTitleInput(value);
      setIsEditing(false);
      return;
    }
    onChange(titleInput.trim());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center">
        <Input
          aria-label="Edit title"
          className="max-w-[200px] h-7 rounded-lg border border-default bg-surface-search-field p-1.5 text-sm"
          autoFocus
          value={titleInput}
          onChange={e => setTitleInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleTitleChange();
            }
          }}
          onBlur={handleTitleChange}
          maxLength={50}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Heading size="h4" className="truncate">
        {value}
      </Heading>
      <PencilSquare
        aria-label="Edit title"
        size="sm"
        color="subtle"
        className="ml-1 cursor-pointer"
        onClick={() => {
          setIsEditing(true);
        }}
      />
    </div>
  );
};
