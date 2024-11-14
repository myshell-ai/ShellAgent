import { AppBuilderModel } from './app-builder.model';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';

describe('AppBuilderModel - updateNodeData', () => {
  let model: AppBuilderModel;

  beforeEach(() => {
    model = new AppBuilderModel();
  });

  it('应该正确清空包含指定路径的引用', () => {
    // 准备测试数据
    const nodeData = {
      '@@@start': {
        id: '@@@start',
        type: 'start',
        context: {},
      },
      state_1: {
        id: 'state_1',
        type: 'state',
        name: 'State#1',
        render: {},
        inputs: {
          untitled_inputs_1: {
            name: 'Untitled',
            type: 'text',
            user_input: true,
          },
        },
        outputs: {
          untitled_outputs_1: {
            type: 'text',
            value: '{{ untitled_inputs_1 }}',
            name: 'Untitled',
          },
        },
        blocks: [],
      },
    };

    const event = {
      scene: 'remove_ref_opts',
      params: {
        paths: ['state_1.inputs.untitled_inputs_1'],
      },
    };

    // 执行测试
    model.updateNodeData(event as any, nodeData);

    // 验证结果
    expect(nodeData.state_1.outputs.untitled_outputs_1).toBe('');
  });

  it('当路径不匹配时不应该修改引用值', () => {
    const nodeData = {
      state1: {
        ref: 'path/to/keep',
        nested: {
          ref: 'another/path',
        },
      },
    };

    const event = {
      scene: RefSceneEnum.Enum.remove_ref_opts,
      params: {
        paths: ['path/to/remove'],
      },
    };

    model.updateNodeData(event, nodeData);

    expect(nodeData.state1.ref).toBe('path/to/keep');
    expect(nodeData.state1.nested.ref).toBe('another/path');
  });
});
