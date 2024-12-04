import type { Meta, StoryObj } from '@storybook/react'
import { Editor } from '../../../../web/src/components/app/node-form/widgets/highlight-input'

const meta: Meta<typeof Editor> = {
  title: 'Components/HighlightedTextArea',
  component: Editor,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Editor>

export const Default: Story = {
  args: {
    onChange: (editorState) => {
      console.log('editorState', editorState)
    },
  },
}

export const WithInitialContent: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea')
    if (textarea) {
      textarea.value = 'Try typing "/" to show the dropdown menu\nYou can select items from the dropdown'
      textarea.dispatchEvent(new Event('change', { bubbles: true }))
    }
  },
}
