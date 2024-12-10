import { pathJoin } from './comfyui-utils';

describe('comfyui utils', () => {
  it('path join', () => {
    const ret = pathJoin([
      '/Users/shane/Downloads/ShellAgent_MacOS_release/ShellAgent',
      'ShellAgent/data/comfy_workflow',
    ]);
    expect(ret).toMatchInlineSnapshot(
      `"/Users/shane/Downloads/ShellAgent_MacOS_release/ShellAgent/ShellAgent/data/comfy_workflow"`,
    );
  });
});
