/* tslint:disable:interface-over-type-literal */
declare type SmartChange<T, P extends keyof T> = {
  previousValue: T[P];
  currentValue: T[P];
  firstChange: boolean;
  isFirstChange(): boolean;
};

declare type SmartChanges<TComponent> =  {
  [TProperty in keyof TComponent]?: SmartChange<TComponent, TProperty>;
};

declare type ObjectType = Record<string, unknown> | undefined | null;
