import { useState, useEffect, useMemo } from 'react';

interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollResult<T> {
  virtualItems: Array<{
    index: number;
    start: number;
    end: number;
    data: T;
  }>;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
): VirtualScrollResult<T> {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleCount + overscan * 2
  );

  const virtualItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      index: startIndex + index,
      start: (startIndex + index) * itemHeight,
      end: (startIndex + index + 1) * itemHeight,
      data: item,
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const scrollToIndex = (index: number) => {
    const targetScrollTop = index * itemHeight;
    setScrollTop(targetScrollTop);
  };

  const scrollToTop = () => {
    setScrollTop(0);
  };

  const scrollToBottom = () => {
    setScrollTop(totalHeight - containerHeight);
  };

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
  };
}
