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

export function normalizeValue(value: string): string {
  if (!value) {
    return value;
  }
  return value
    .toLowerCase() // все у нижній регістр
    .replace(/\s+/g, '-') // пробіли замінити на дефіси
    .replace(/[^a-z0-9-]/g, '') // прибрати спецсимволи
    .trim();
}
