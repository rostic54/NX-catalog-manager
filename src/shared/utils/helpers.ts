export function hasChanges<T extends Record<string, any>>(
  original: T,
  updated: Partial<T>,
): boolean {
  return Object.entries(updated).some(([key, newValue]) => {
    const oldValue = original[key as keyof T];

    // Optionally: you can handle Date comparisons or deep objects here
    if ((oldValue as any) instanceof Date && newValue instanceof Date) {
      return oldValue.getTime() !== newValue.getTime();
    }

    return oldValue !== newValue;
  });
}
