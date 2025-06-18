import { useEffect } from 'react';

export default function PageHead({ title = 'Kutubi' }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return null; // No actual render output
}
