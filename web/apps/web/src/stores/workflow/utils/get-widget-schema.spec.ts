import { getTypesFromSchema } from './get-widget-schema-utils';

describe('get widget schema', () => {
  it('support Array<string>', () => {
    const input = {
      properties: {
        image_path: {
          default: null,
          items: { type: 'string' },
          title: 'Image Path',
          type: 'array',
        },
        image: { default: null, title: 'Image', type: 'IMAGE' },
        latent: { default: null, title: 'Latent', type: 'LATENT' },
        model: { default: null, title: 'Model', type: 'MODEL' },
        clip: { default: null, title: 'Clip', type: 'CLIP' },
        vae: { default: null, title: 'Vae', type: 'VAE' },
      },
      required: ['model', 'clip', 'vae'],
      title: 'OutputsSchema',
      type: 'object',
    };
    const res = getTypesFromSchema(input);
    expect(res).toMatchInlineSnapshot(`
      {
        "clip": "CLIP",
        "image": "IMAGE",
        "image_path": "Array<string>",
        "latent": "LATENT",
        "model": "MODEL",
        "vae": "VAE",
      }
    `);
  });

  it('support Array<object>', () => {
    const input = {
      properties: {
        image_path: {
          default: null,
          items: { type: 'object', properties: { a: { type: 'string' } } },
          title: 'Image Path',
          type: 'array',
        },
        image: { default: null, title: 'Image', type: 'IMAGE' },
        latent: { default: null, title: 'Latent', type: 'LATENT' },
        model: { default: null, title: 'Model', type: 'MODEL' },
        clip: { default: null, title: 'Clip', type: 'CLIP' },
        vae: { default: null, title: 'Vae', type: 'VAE' },
      },
      required: ['model', 'clip', 'vae'],
      title: 'OutputsSchema',
      type: 'object',
    };
    const res = getTypesFromSchema(input);
    // console.log(res)
    expect(res).toEqual({
      image_path: [
        {
          a: 'String',
        },
      ],
      image: 'IMAGE',
      latent: 'LATENT',
      model: 'MODEL',
      clip: 'CLIP',
      vae: 'VAE',
    });
  });

  it('support nested Array<object>', () => {
    const input = {
      properties: {
        image_path: {
          default: null,
          items: {
            type: 'object',
            properties: {
              a: { type: 'object', properties: { b: { type: 'string' } } },
            },
          },
          title: 'Image Path',
          type: 'array',
        },
        image: { default: null, title: 'Image', type: 'IMAGE' },
        latent: { default: null, title: 'Latent', type: 'LATENT' },
        model: { default: null, title: 'Model', type: 'MODEL' },
        clip: { default: null, title: 'Clip', type: 'CLIP' },
        vae: { default: null, title: 'Vae', type: 'VAE' },
      },
      required: ['model', 'clip', 'vae'],
      title: 'OutputsSchema',
      type: 'object',
    };
    const res = getTypesFromSchema(input);
    expect(res).toEqual({
      image_path: [
        {
          a: {
            b: 'String',
          },
        },
      ],
      image: 'IMAGE',
      latent: 'LATENT',
      model: 'MODEL',
      clip: 'CLIP',
      vae: 'VAE',
    });
  });
});
