import {
  RefOptionsOutput,
  Scopes,
  scopesSchema,
  State,
  stateSchema,
} from '@shellagent/shared/protocol/app-scope';
import { mapValues } from 'lodash-es';

export function convertNodeDataToState(nodeData: any): State {
  return stateSchema.parse({
    name: nodeData.id,
    children: {
      inputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.input || {}).map(
            ([key, value]: [string, any]) => [key, { type: value.type }],
          ),
        ),
      },
      tasks: (nodeData.blocks || []).map((block: any) => ({
        name: block.name,
        variables: block.inputs, // Assuming inputs are the variables
      })),
      outputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.output || {}).map(
            ([key, value]: [string, any]) => [key, { type: value.type }],
          ),
        ),
        render: {
          buttons: Object.fromEntries(
            (nodeData.render?.buttons || []).map((button: any) => {
              const [name, evt] = button.id.split('.');
              return [
                name,
                {
                  event: button.id,
                  payload: mapValues(button[evt].payload, v => ({
                    type: v.type,
                  })),
                },
              ];
            }),
          ),
        },
      },
    },
  });
}

export function convetNodeDataToScopes(nodeDatas: any) {
  const ret = Object.keys(nodeDatas).reduce(
    (acc, k) => {
      const v = nodeDatas[k];
      if (k === '@@@start') {
        acc.context = {
          variables: mapValues(v.context, v => ({ type: v.type })),
        };
      } else {
        acc.states[k] = convertNodeDataToState(v);
      }
      return acc;
    },
    {
      context: {},
      states: {},
    } as any,
  );
  scopesSchema.parse({
    scopes: ret,
  });
  return ret;
}

export function convertRefToCascaderOpts(refOpts: RefOptionsOutput) {}
