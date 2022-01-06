export const WEEK_STATE_CLASS_PALETTE = [
  '',
  'bg-green-300',
  'bg-yellow-300',
]

export const WEEK_STATE_COUNT = 3;

export function weekStatePipeline(): number[] {
  return [...new Array(WEEK_STATE_COUNT)].map((_, i) => i);
}

export function weekStateClass(state: number): string {
  return WEEK_STATE_CLASS_PALETTE[state];
}
