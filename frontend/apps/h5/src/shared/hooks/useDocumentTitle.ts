import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} · FA H5`;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
