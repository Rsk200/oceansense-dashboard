import type { RiskLabel } from '../types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRiskColor = (riskLabel: RiskLabel): string => {
  switch (riskLabel) {
    case 'RED':
      return '#EF4444';
    case 'YELLOW':
      return '#FFC857';
    case 'GREEN':
      return '#00D26A';
    default:
      return '#00C2FF';
  }
};

export const getRiskBackgroundColor = (riskLabel: RiskLabel): string => {
  switch (riskLabel) {
    case 'RED':
      return 'bg-danger/20 border-danger/30';
    case 'YELLOW':
      return 'bg-warning/20 border-warning/30';
    case 'GREEN':
      return 'bg-success/20 border-success/30';
    default:
      return 'bg-accent/20 border-accent/30';
  }
};

export const calculateAccuracy = (predicted: number, actual: number): number => {
  if (actual === 0) return 0;
  const error = Math.abs(predicted - actual);
  const accuracy = Math.max(0, 1 - error / Math.abs(actual)) * 100;
  return Math.round(accuracy * 10) / 10;
};

export const downloadCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const classNames = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
