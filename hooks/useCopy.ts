'use client';

import { useState } from 'react';

export const useCopy = () => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);

      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return { copiedValue, copyToClipboard };
};
