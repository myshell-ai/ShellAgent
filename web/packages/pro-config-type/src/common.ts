/**
 * @example
 * "variable_name"
 */
type SnakeCaseName = string;

type ReservedKey =
  | 'type'
  | 'id'
  | 'properties'
  | 'inputs'
  | 'outputs'
  | 'tasks'
  | 'render'
  | 'transitions'
  | 'states'
  | 'context'
  | 'payload';
// TODO：blocks, result

/**
 * User-defined keys should be:
 * - lowercase, snake_case names
 * - not reserved words, including names of block's fields
 *
 * @pattern "^(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*$"
 */
export type CustomKey = Exclude<Lowercase<SnakeCaseName>, ReservedKey>;
// export type NonReservedName = string;

type WithDots<T extends string> = T;
/**
 * lowercase, snake_case names concatenated by dots
 *
 * @example `create_page.type_a`
 * @pattern "^(?:(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*)(?:\.(?:(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*))*$"
 */
export type CustomEventName = WithDots<CustomKey>;

/**
 * lowercase, snake_case names concatenated by dots
 *
 * @example `.child.state_name`
 * @example `#uniq_id.state_name`
 * @pattern "^(?:#?(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*)?(?:\.(?:(?!(type|id|properties|inputs|outputs|tasks|render|transitions|states|context|payload|\d+)\b)[a-z\d]+(?:_[a-z\d]+)*))*$"
 */
export type TargetPath = WithDots<CustomKey>;

/**
 * 测试用字符串
type
id
properties
payload
123
type1
a
ttt
1a
a_1
1.a
type.a
a.1a
.a
a.1a
 */
