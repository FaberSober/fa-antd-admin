export interface DefaultFieldProps<T> {
  value?: T | undefined;
  onChange?: (v: T) => void;
}

export interface DefaultArrayFieldProps<T> {
  value?: T[] | undefined;
  onChange?: (v: T[]) => void;
}
