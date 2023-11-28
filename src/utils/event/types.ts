/*
 * @Description: Custom event types
 */

// Select mode
export enum SelectMode {
  EMPTY = '',
  ONE = 'one',
  MULTI = 'multiple',
}

export enum SelectOneType {
  EMPTY = '',
  GROUP = 'group',
  POLYGON = 'polygon',
}

//Select event (for broadcast)
export enum SelectEvent {
  ONE = 'selectOne',
  MULTI = 'selectMultiple',
  CANCEL = 'selectCancel',
}
