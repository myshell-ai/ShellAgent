import {
  getTaskDisplayName,
  getButtonDisplayName,
  NodeTypeEnum,
} from './get_display_name';
import { Task } from '../protocol/task';
import { Button } from '../protocol/render-button';

describe('getTaskDisplayName', () => {
  it('should generate correct display name for workflow type', () => {
    const widgetItem = {
      display_name: 'Workflow',
      name: 'workflow',
      type: NodeTypeEnum.workflow,
    };

    const tasks: Task[] = [
      {
        display_name: 'Workflow#1',
        mode: NodeTypeEnum.workflow,
      } as Task,
      {
        display_name: 'Workflow#2',
        mode: NodeTypeEnum.workflow,
      } as Task,
    ];

    expect(getTaskDisplayName(widgetItem, tasks)).toBe('Workflow#3');
  });

  it('should generate correct display name for widget type', () => {
    const widgetItem = {
      display_name: 'Button',
      name: 'button',
      type: NodeTypeEnum.widget,
    };

    const tasks: Task[] = [
      {
        display_name: 'Button#1',
        mode: NodeTypeEnum.widget,
        widget_class_name: 'button',
      } as Task,
    ];

    expect(getTaskDisplayName(widgetItem, tasks)).toBe('Button#2');
  });

  it('should handle empty tasks array', () => {
    const widgetItem = {
      display_name: 'Button',
      name: 'button',
      type: NodeTypeEnum.widget,
    };

    expect(getTaskDisplayName(widgetItem, [])).toBe('Button#1');
  });
});

describe('getButtonDisplayName', () => {
  it('should generate correct button display name', () => {
    const buttons: Button[] = [
      { content: 'Button#1' } as Button,
      { content: 'Button#2' } as Button,
    ];

    expect(getButtonDisplayName(buttons)).toBe('Button#3');
  });

  it('should handle empty buttons array', () => {
    expect(getButtonDisplayName([])).toBe('Button#1');
  });

  it('should handle buttons without index', () => {
    const buttons: Button[] = [{ content: 'Button' } as Button];

    expect(getButtonDisplayName(buttons)).toBe('Button#1');
  });
});
