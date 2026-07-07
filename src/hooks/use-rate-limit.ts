import { useState, useCallback } from 'react';
import { RATE_LIMIT_CONFIG } from '@/lib/security';

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const getStorageKey = (identifier: string): string => `rate_limit_${identifier}`;

const getAttempts = (identifier: string): AttemptRecord => {
  const stored = localStorage.getItem(getStorageKey(identifier));
  if (!stored) return { count: 0, firstAttempt: Date.now() };
  
  try {
    return JSON.parse(stored);
  } catch {
    return { count: 0, firstAttempt: Date.now() };
  }
};

const setAttempts = (identifier: string, attempts: AttemptRecord): void => {
  localStorage.setItem(getStorageKey(identifier), JSON.stringify(attempts));
};

export const useRateLimit = (identifier: string = 'global') => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(RATE_LIMIT_CONFIG.MAX_ATTEMPTS);

  const checkRateLimit = useCallback((): { allowed: boolean; blockedUntil?: number } => {
    const now = Date.now();
    const attempts = getAttempts(identifier);

    // Check if currently blocked
    if (attempts.blockedUntil && attempts.blockedUntil > now) {
      setIsBlocked(true);
      const remainingTime = Math.ceil((attempts.blockedUntil - now) / 1000 / 60);
      return { allowed: false, blockedUntil: attempts.blockedUntil };
    }

    // Reset window if expired
    if (now - attempts.firstAttempt > RATE_LIMIT_CONFIG.WINDOW_MS) {
      const newAttempts = { count: 1, firstAttempt: now };
      setAttempts(identifier, newAttempts);
      setRemainingAttempts(RATE_LIMIT_CONFIG.MAX_ATTEMPTS - 1);
      setIsBlocked(false);
      return { allowed: true };
    }

    // Check if limit exceeded
    if (attempts.count >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
      const blockedUntil = now + RATE_LIMIT_CONFIG.BLOCK_DURATION_MS;
      const newAttempts = { ...attempts, blockedUntil };
      setAttempts(identifier, newAttempts);
      setIsBlocked(true);
      setRemainingAttempts(0);
      return { allowed: false, blockedUntil };
    }

    // Increment counter
    const newAttempts = { ...attempts, count: attempts.count + 1 };
    setAttempts(identifier, newAttempts);
    setRemainingAttempts(RATE_LIMIT_CONFIG.MAX_ATTEMPTS - newAttempts.count);
    setIsBlocked(false);
    return { allowed: true };
  }, [identifier]);

  const resetRateLimit = useCallback(() => {
    localStorage.removeItem(getStorageKey(identifier));
    setIsBlocked(false);
    setRemainingAttempts(RATE_LIMIT_CONFIG.MAX_ATTEMPTS);
  }, [identifier]);

  return {
    isBlocked,
    remainingAttempts,
    checkRateLimit,
    resetRateLimit
  };
};
