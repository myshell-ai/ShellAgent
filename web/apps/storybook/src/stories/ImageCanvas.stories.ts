import 'image-canvas/index.css';
import 'image-canvas/assets/react-colors-beauty.css';

import type { Meta, StoryObj } from '@storybook/react';

import ImageCanvas from 'image-canvas';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ImageCanvas',
  component: ImageCanvas,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ImageCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
