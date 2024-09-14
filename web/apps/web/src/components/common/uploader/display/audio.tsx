import PauseIcon from '@heroicons/react/20/solid/esm/PauseIcon';
import PlayIcon from '@heroicons/react/20/solid/esm/PlayIcon';
import { Slider } from '@shellagent/ui';
import { useAudio } from 'react-use';

import { SpecificDisplayProps } from '@/components/common/uploader/display';
import { durationFormatter } from '@/utils/common-helper';

export default function Audio({
  name,
  size,
  src,
  deleteEle,
}: SpecificDisplayProps) {
  const [audio, state, controls] = useAudio({
    src: src!,
    onEnded: () => controls.seek(0),
  });

  const { paused, time, duration } = state;

  const handleAudioToggle = () => {
    if (paused) {
      controls.play();
    } else {
      controls.pause();
    }
  };

  const handleValueChange = (value: number[]) => {
    if (!paused) {
      controls.pause();
    }
    controls.seek(value[0]);
  };

  const handleValueCommit = () => {
    controls.play();
  };

  return (
    <div className="flex flex-col space-y-1 w-full overflow-hidden">
      <div className="flex items-center space-x-3">
        <div
          className="w-9 h-9 rounded-full bg-surface-primary-subtle-hovered flex justify-center items-center shrink-0 cursor-pointer"
          onClick={handleAudioToggle}>
          {paused ? (
            <PlayIcon className="w-5 h-5 text-brand" />
          ) : (
            <PauseIcon className="w-5 h-5 text-brand" />
          )}
        </div>

        <div className="flex flex-col space-y-1 grow overflow-hidden">
          <div className="text-sm font-medium text-default truncate max-w-96">
            {name}
          </div>
          <div className="text-sm text-subtler truncate">
            {durationFormatter(duration)} {size && `(${size})`}
          </div>
        </div>

        {deleteEle}
      </div>
      <div className="flex items-center space-x-2">
        <Slider
          size="sm"
          value={[time]}
          min={0}
          max={duration}
          step={0.01}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          wrapperClassName="border-0 p-0 px-1 h-2"
        />
        <span className="inline-block shrink-0 text-subtler text-xs">
          {durationFormatter(time)}
        </span>
      </div>
      {audio}
    </div>
  );
}
