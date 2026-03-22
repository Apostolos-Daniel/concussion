import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerProps {
  durationSeconds: number;
  label: string;
  autoStart?: boolean;
  onComplete?: () => void;
  persistKey?: string;
  onTick?: (elapsed: number) => void;
}

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio not available
  }
}

export function Timer({ durationSeconds, label, autoStart = false, onComplete, onTick }: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    startTimeRef.current = null;
  }, []);

  const start = useCallback(() => {
    if (completed || running) return;
    setRunning(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setRemaining(prev => {
        const next = prev - 1;
        if (onTick) onTick(elapsedRef.current);
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setRunning(false);
          setCompleted(true);
          beep();
          if (onComplete) onComplete();
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [completed, running, onComplete, onTick]);

  const reset = useCallback(() => {
    stop();
    setCompleted(false);
    setRemaining(durationSeconds);
    elapsedRef.current = 0;
  }, [stop, durationSeconds]);

  useEffect(() => {
    if (autoStart) start();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line

  const getTimerColor = () => {
    if (completed) return '#DC2626';
    if (remaining <= 10 && running) return '#D97706';
    return '#0D5C63';
  };

  const progress = ((durationSeconds - remaining) / durationSeconds) * 100;

  return (
    <div style={{ border: `2px solid ${getTimerColor()}`, borderRadius: 12, padding: 16, background: completed ? '#FEE2E2' : remaining <= 10 && running ? '#FEF3C7' : '#F0FDFA' }}>
      <div style={{ marginBottom: 8, fontWeight: 600, color: getTimerColor(), fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 48, fontWeight: 700, color: getTimerColor(), fontFamily: 'monospace', textAlign: 'center', marginBottom: 12 }}>
        {formatTime(remaining)}
      </div>
      {/* Progress bar */}
      <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, marginBottom: 12, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: getTimerColor(), borderRadius: 3, transition: 'width 1s linear' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {!running && !completed && (
          <button
            onClick={start}
            style={{
              background: '#0D5C63',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 24px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 15,
              minHeight: 44,
            }}
          >
            Start
          </button>
        )}
        {running && (
          <button
            onClick={stop}
            style={{
              background: '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 24px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 15,
              minHeight: 44,
            }}
          >
            Stop
          </button>
        )}
        {(running || completed) && (
          <button
            onClick={reset}
            style={{
              background: 'white',
              color: '#6B7280',
              border: '1px solid #D1D5DB',
              borderRadius: 8,
              padding: '8px 24px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 15,
              minHeight: 44,
            }}
          >
            Reset
          </button>
        )}
      </div>
      {completed && (
        <div style={{ marginTop: 8, textAlign: 'center', fontWeight: 600, color: '#DC2626' }}>
          Time's up!
        </div>
      )}
    </div>
  );
}
