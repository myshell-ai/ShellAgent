import { TContext } from '../types';

function exec(code: string, scope: TContext) {
  try {
    const str = `
      var ${'____data'}  = arguments[0];
      with(${'____data'}) {
        return ${code}
      } 
    `;

    return new Function(str)(scope);
  } catch (e) {
    console.log(e);
  }
}

export { exec };
