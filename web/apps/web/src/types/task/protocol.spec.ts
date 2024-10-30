import { TaskSchema, Task } from './protocol';
import { NodeTypeEnum } from '@shellagent/flow-engine';
import { ZodError } from 'zod';

describe('TaskSchema', () => {
  it('should validate a valid WorkflowTask successfully', () => {
    const validWorkflowTask: Task = {
      type: 'task',
      display_name: 'Sample Workflow Task',
      name: 'workflow_task_1',
      mode: NodeTypeEnum.workflow,
      workflow_id: '123e4567-e89b-12d3-a456-426614174000',
      inputs: {
        input1: 'value1',
      },
      outputs: {
        output1: 'value1',
      },
      custom: true,
    };

    expect(() => TaskSchema.parse(validWorkflowTask)).not.toThrow();
  });

  it('should validate a valid WidgetTask successfully', () => {
    const validWidgetTask: Task = {
      type: 'task',
      display_name: 'Sample Widget Task',
      name: 'widget_task_1',
      mode: NodeTypeEnum.widget,
      widget_name: 'SampleWidget',
      widget_class_name: 'SampleWidgetClass',
      inputs: {
        input1: 'value1',
      },
      outputs: {
        output1: 'value1',
      },
    };

    expect(() => TaskSchema.parse(validWidgetTask)).not.toThrow();
  });

  it('should reject a Task missing required fields', () => {
    const invalidTaskMissingFields = {
      type: 'task',
      display_name: 'Task Missing Fields',
      mode: NodeTypeEnum.workflow,
      // Missing 'name', 'workflow_id', 'inputs', 'outputs'
    };

    expect(() => TaskSchema.parse(invalidTaskMissingFields)).toThrow(ZodError);
  });

  it('should reject a Task with extra unrecognized fields', () => {
    const invalidTaskExtraFields = {
      type: 'task',
      display_name: 'Task with Extra Fields',
      name: 'extra_field_task',
      mode: NodeTypeEnum.widget,
      widget_name: 'ExtraWidget',
      widget_class_name: 'ExtraWidgetClass',
      extra_field: 'Unexpected Field', // Extra field
      inputs: {},
      outputs: {},
    };

    expect(() => TaskSchema.parse(invalidTaskExtraFields)).toThrow(
      /Unrecognized key/,
    );
  });

  it('should reject a Task with invalid mode type', () => {
    const invalidModeTask = {
      type: 'task',
      display_name: 'Task with Invalid Mode',
      name: 'invalid_mode_task',
      mode: 'invalid_mode', // Invalid mode
      inputs: {},
      outputs: {},
    };

    expect(() => TaskSchema.parse(invalidModeTask)).toThrow(ZodError);
  });

  it('should reject a WorkflowTask missing workflow_id', () => {
    const invalidWorkflowTask = {
      type: 'task',
      display_name: 'WorkflowTask without workflow_id',
      name: 'invalid_workflow_task',
      mode: NodeTypeEnum.workflow,
      inputs: {},
      outputs: {},
    };

    expect(() => TaskSchema.parse(invalidWorkflowTask)).toThrow(ZodError);
  });

  it('should reject a WidgetTask missing widget_name', () => {
    const invalidWidgetTaskMissingName = {
      type: 'task',
      display_name: 'WidgetTask Missing widget_name',
      name: 'invalid_widget_task_1',
      mode: NodeTypeEnum.widget,
      widget_class_name: 'MissingNameClass',
      inputs: {},
      outputs: {},
    };

    expect(() => TaskSchema.parse(invalidWidgetTaskMissingName)).toThrow(
      ZodError,
    );
  });

  it('should reject a WidgetTask missing widget_class_name', () => {
    const invalidWidgetTaskMissingClassName = {
      type: 'task',
      display_name: 'WidgetTask Missing widget_class_name',
      name: 'invalid_widget_task_2',
      mode: NodeTypeEnum.widget,
      widget_name: 'MissingClassNameWidget',
      inputs: {},
      outputs: {},
    };

    expect(() => TaskSchema.parse(invalidWidgetTaskMissingClassName)).toThrow(
      ZodError,
    );
  });

  it('should allow a Task with an optional custom field', () => {
    const validTaskWithCustom = {
      type: 'task',
      display_name: 'Task with Custom Field',
      name: 'custom_task',
      mode: NodeTypeEnum.workflow,
      workflow_id: '123e4567-e89b-12d3-a456-426614174000',
      inputs: {},
      outputs: {},
      custom: false,
    };

    expect(() => TaskSchema.parse(validTaskWithCustom)).not.toThrow();
  });

  it('should allow a Task without the optional custom field', () => {
    const validTaskWithoutCustom = {
      type: 'task',
      display_name: 'Task without Custom Field',
      name: 'no_custom_task',
      mode: NodeTypeEnum.widget,
      widget_name: 'NoCustomWidget',
      widget_class_name: 'NoCustomWidgetClass',
      inputs: {},
      outputs: {},
      // No custom field
    };

    expect(() => TaskSchema.parse(validTaskWithoutCustom)).not.toThrow();
  });

  it('should reject a Task with correct mode but extra keys', () => {
    const invalidTaskWithExtraKeys = {
      type: 'task',
      display_name: 'Task with Extra Keys',
      name: 'extra_keys_task',
      mode: NodeTypeEnum.widget,
      widget_name: 'ExtraKeysWidget',
      widget_class_name: 'ExtraKeysWidgetClass',
      unexpected_key: 'unexpected_value', // Extra key
      inputs: {},
      outputs: {},
    };

    expect(() => TaskSchema.parse(invalidTaskWithExtraKeys)).toThrow(
      /Unrecognized key/,
    );
  });

  it('should reject a Task with non-string values for inputs or outputs', () => {
    const invalidTaskInputsOutputs = {
      type: 'task',
      display_name: 'Task with Non-String Inputs and Outputs',
      name: 'invalid_io_task',
      mode: NodeTypeEnum.workflow,
      workflow_id: '123e4567-e89b-12d3-a456-426614174000',
      inputs: {
        input1: 123, // Non-string value
      },
      outputs: {
        output1: 'value1',
      },
    };

    expect(() => TaskSchema.parse(invalidTaskInputsOutputs)).toThrow(ZodError);
  });

  it('should reject a Task with non-boolean custom field', () => {
    const invalidTaskCustom = {
      type: 'task',
      display_name: 'Task with Non-Boolean Custom Field',
      name: 'invalid_custom_task',
      mode: NodeTypeEnum.widget,
      widget_name: 'InvalidCustomWidget',
      widget_class_name: 'InvalidCustomWidgetClass',
      inputs: {},
      outputs: {},
      custom: 'yes', // Non-boolean value
    };

    expect(() => TaskSchema.parse(invalidTaskCustom)).toThrow(ZodError);
  });

  it('should reject a WorkflowTask with non-UUID formatted workflow_id', () => {
    const invalidWorkflowIdTask = {
      type: 'task',
      display_name: 'WorkflowTask with Non-UUID workflow_id',
      name: 'invalid_workflow_id_task',
      mode: NodeTypeEnum.workflow,
      workflow_id: 'invalid-uuid',
      inputs: {},
      outputs: {},
    };

    expect(() => TaskSchema.parse(invalidWorkflowIdTask)).toThrow(ZodError);
  });
});
