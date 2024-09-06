export interface EntityState<T> {
  entities: Record<string, T>;
  ids: string[];
}

export interface PayloadAction<T extends string, P> {
  type: T;
  payload: P;
}
