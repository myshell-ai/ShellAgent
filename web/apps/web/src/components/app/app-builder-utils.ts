import {
  Scopes,
  State,
  stateSchema,
} from '@shellagent/shared/protocol/app-scope';

export function convertNodeDataToState(nodeData: any): State {
  return stateSchema.parse({
    name: nodeData.id,
    children: {
      inputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.input).map(([key, value]: [string, any]) => [
            key,
            { type: value.type },
          ]),
        ),
      },
      tasks: nodeData.blocks.map((block: any) => ({
        name: block.name,
        variables: block.inputs, // Assuming inputs are the variables
      })),
      outputs: {
        variables: Object.fromEntries(
          Object.entries(nodeData.output).map(([key, value]: [string, any]) => [
            key,
            { type: value.type },
          ]),
        ),
        render: {
          buttons: Object.fromEntries(
            nodeData.render.buttons.map((button: any) => [
              button.id,
              {
                payload: {},
              },
            ]),
          ),
        },
      },
    },
  });
}
