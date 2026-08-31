import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QrCode, MapPin, ScanFace, Clock, Check, X, RotateCcw, Fingerprint, ArrowRight } from 'lucide-react';
import { ProgressRail } from '@/components/ui/ProgressRail';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Button } from '@/components/ui/Button';

type StageKey = 'qr' | 'gps' | 'facial' | 'timestamp';
type StageState = 'idle' | 'scanning' | 'success' | 'failed';

const stages: { key: StageKey; label: string; icon: typeof QrCode }[] = [
  { key: 'qr', label: 'QR Scan', icon: QrCode },
  { key: 'gps', label: 'Geofence', icon: MapPin },
  { key: 'facial', label: 'Facial', icon: ScanFace },
  { key: 'timestamp', label: 'Timestamp', icon: Clock },
];

interface VerificationFlowProps {
  onComplete: (result: { success: boolean; stages: { stage: StageKey; passed: boolean; detail: string; score?: number }[] }) => void;
  onBack?: () => void;
  simulateFailure?: boolean;
}

export function VerificationFlow({ onComplete, onBack, simulateFailure = false }: VerificationFlowProps) {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [failedStep, setFailedStep] = useState<number | undefined>(undefined);
  const [stageState, setStageState] = useState<StageState>('idle');
  const [stageProgress, setStageProgress] = useState(0);
  const [facialScore, setFacialScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [stageResults, setStageResults] = useState<{ stage: StageKey; passed: boolean; detail: string; score?: number }[]>([]);
  const [qrCameraError, setQrCameraError] = useState<string | null>(null);
  const [facialCameraError, setFacialCameraError] = useState<string | null>(null);
  const [qrCameraReady, setQrCameraReady] = useState(false);
  const qrVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (qrVideoRef.current) qrVideoRef.current.srcObject = null;
    setQrCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setQrCameraError('This browser does not support camera access.');
      return;
    }

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      cameraStreamRef.current = stream;
      if (qrVideoRef.current) {
        qrVideoRef.current.srcObject = stream;
        await qrVideoRef.current.play().catch(() => undefined);
      }
      setQrCameraReady(true);
      setQrCameraError(null);
    } catch (error) {
      console.error('Camera access failed:', error);
      setQrCameraReady(false);
      setQrCameraError('Camera access was blocked. Please allow access to continue the demo.');
    }
  }, [stopCamera]);

  const startStage = useCallback(() => {
    setStageState('scanning');
    setStageProgress(0);
  }, []);

  useEffect(() => {
    if (stageState === 'idle' && currentStage < 4 && !showSummary) {
      if (currentStage === 0) {
        void startCamera();
        return;
      }
      const t = setTimeout(() => {
        if (currentStage !== 2) {
          startStage();
        }
      }, 600);
      return () => clearTimeout(t);
    }
  }, [stageState, currentStage, showSummary, startStage, startCamera]);

  useEffect(() => {
    if (stageState === 'success' || stageState === 'failed') {
      stopCamera();
    }
  }, [stageState, stopCamera]);

  useEffect(() => {
    if (stageState !== 'scanning') return;
    const interval = setInterval(() => {
      setStageProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [stageState]);

  useEffect(() => {
    if (stageProgress >= 100 && stageState === 'scanning') {
      const willFail = simulateFailure && currentStage === 1;

      setTimeout(() => {
        if (willFail) {
          setStageState('failed');
          setFailedStep(currentStage);
          const result = {
            stage: stages[currentStage].key,
            passed: false,
            detail: currentStage === 1 ? '340m outside geofence boundary' : 'Verification failed',
            score: 0,
          };
          setStageResults((prev) => [...prev, result]);
        } else {
          setStageState('success');
          const score = currentStage === 2 ? 98.4 : currentStage === 1 ? 100 : undefined;
          const detail =
            currentStage === 0
              ? 'QR decoded — session CSC 401 verified'
              : currentStage === 1
              ? '12.3m inside geofence'
              : currentStage === 2
              ? 'Face match confirmed'
              : 'Checked in 3 min after session start';
          const result = { stage: stages[currentStage].key, passed: true, detail, score };
          setStageResults((prev) => [...prev, result]);

          if (currentStage === 2) {
            let s = 0;
            const scoreInterval = setInterval(() => {
              s += 1.5;
              if (s >= 98.4) {
                s = 98.4;
                clearInterval(scoreInterval);
              }
              setFacialScore(s);
            }, 20);
          }
        }
      }, 400);
    }
  }, [stageProgress, stageState, currentStage, simulateFailure]);

  const advance = () => {
    if (stageState === 'success') {
      setCompletedSteps((prev) => [...prev, currentStage]);
      if (currentStage < 3) {
        setCurrentStage((s) => s + 1);
        setStageState('idle');
        setStageProgress(0);
      } else {
        setShowSummary(true);
      }
    } else if (stageState === 'failed') {
      onComplete({ success: false, stages: stageResults });
    }
  };

  useEffect(() => {
    if (stageState === 'success') {
      const t = setTimeout(advance, 900);
      return () => clearTimeout(t);
    }
  }, [stageState]);

  const retry = () => {
    setFailedStep(undefined);
    setStageState('idle');
    setStageProgress(0);
    setStageResults((prev) => prev.slice(0, currentStage));
  };

  if (showSummary) {
    return <SuccessSummary stages={stageResults} onComplete={() => onComplete({ success: true, stages: stageResults })} />;
  }

  return (
    <div className="min-h-screen bg-ink-900 dot-grid grain flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Fingerprint className="w-4.5 h-4.5 text-ink-900" />
            </div>
            <span className="font-serif text-sm text-cream-500">Veritas Check-In</span>
          </div>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                Back
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/student')}>
              Cancel
            </Button>
          </div>
        </div>
        <ProgressRail steps={stages} currentStep={currentStage} completedSteps={completedSteps} failedStep={failedStep} />
      </div>

      {/* Stage content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {currentStage === 0 && (
              <StageWrapper key="qr">
                <QRStage state={stageState} progress={stageProgress} onCapture={startStage} cameraError={qrCameraError} videoRef={qrVideoRef} cameraReady={qrCameraReady} />
              </StageWrapper>
            )}
            {currentStage === 1 && (
              <StageWrapper key="gps">
                <GPSStage state={stageState} progress={stageProgress} />
              </StageWrapper>
            )}
            {currentStage === 2 && (
              <StageWrapper key="facial">
                <FacialStage state={stageState} progress={stageProgress} score={facialScore} onCapture={startStage} cameraError={facialCameraError} />
              </StageWrapper>
            )}
            {currentStage === 3 && (
              <StageWrapper key="timestamp">
                <TimestampStage state={stageState} progress={stageProgress} />
              </StageWrapper>
            )}
          </AnimatePresence>

          {stageState === 'failed' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col items-center gap-3">
              <p className="text-sm text-terracotta-400 text-center">
                {currentStage === 1 ? 'You appear to be outside the geofence. Move closer to the lecture hall and try again.' : 'Verification failed.'}
              </p>
              <div className="flex gap-3">
                {onBack && (
                  <Button variant="secondary" size="sm" onClick={onBack}>
                    Return to Dashboard
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => navigate('/student')}>
                  Abort
                </Button>
                <Button variant="danger" size="sm" onClick={retry}>
                  <RotateCcw className="w-3.5 h-3.5" /> Retry Stage
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function StageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
}

/* ── QR Scan Stage ── */
function QRStage({ state, progress, onCapture, cameraError, videoRef, cameraReady }: { state: StageState; progress: number; onCapture: () => void; cameraError: string | null; videoRef: React.RefObject<HTMLVideoElement>; cameraReady: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-serif text-2xl font-600 text-cream-500 mb-1">QR Scan</h2>
      <p className="text-cream-700 text-sm mb-8">Point your camera at the session QR code and capture it before verification</p>

      <div className="relative w-64 h-64 rounded-lg border-2 border-stone-border bg-ink-800 overflow-hidden">
        {cameraReady ? (
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-ink-800 to-ink-900 flex items-center justify-center text-center px-8">
            <div className="text-cream-700">
              <p className="font-medium text-sm">Camera preview</p>
              <p className="text-[10px] uppercase tracking-wider mt-1">Waiting for access</p>
            </div>
          </div>
        )}

        {/* Viewfinder corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 rounded-br-lg" />

        {state === 'idle' && (
          <div className="absolute inset-0 bg-ink-900/35 flex items-center justify-center">
            <button
              type="button"
              onClick={onCapture}
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-ink-900 shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-colors"
            >
              Capture QR
            </button>
          </div>
        )}

        {/* Scan line */}
        {state === 'scanning' && (
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            style={{ top: '0%' }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-amber-500/20 blur-md" />
          </motion.div>
        )}

        {state === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-ink-800/80 flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
              <div className="w-16 h-16 rounded-full bg-gold-500/15 border-2 border-gold-500 flex items-center justify-center glow-gold">
                <Check className="w-8 h-8 text-gold-400" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {state === 'scanning' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-border">
            <motion.div className="h-full bg-gradient-to-r from-amber-500 to-gold-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {cameraError && (
        <p className="mt-4 text-xs text-terracotta-400 text-center max-w-xs">{cameraError}</p>
      )}
      <StageStatus state={state} label="Decoding QR pattern…" successLabel="Session QR verified" />
    </div>
  );
}

/* ── GPS Geofence Stage ── */
function GPSStage({ state, progress }: { state: StageState; progress: number }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-serif text-2xl font-600 text-cream-500 mb-1">GPS Geofence</h2>
      <p className="text-cream-700 text-sm mb-8">Verifying your location within campus grounds</p>

      <div className="relative w-64 h-64 rounded-lg border-2 border-stone-border bg-ink-800 overflow-hidden">
        {/* Stylized campus map */}
        <svg viewBox="0 0 256 256" className="w-full h-full">
          {/* Grid background */}
          <defs>
            <pattern id="gpsgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2A2C31" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="256" height="256" fill="url(#gpsgrid)" />

          {/* Buildings */}
          <rect x="40" y="40" width="60" height="40" fill="#1A1D22" stroke="#2A2C31" strokeWidth="1" rx="4" />
          <rect x="140" y="60" width="70" height="50" fill="#1A1D22" stroke="#2A2C31" strokeWidth="1" rx="4" />
          <rect x="50" y="140" width="80" height="60" fill="#1A1D22" stroke="#2A2C31" strokeWidth="1" rx="4" />
          <rect x="160" y="150" width="50" height="50" fill="#1A1D22" stroke="#2A2C31" strokeWidth="1" rx="4" />

          {/* Paths */}
          <line x1="100" y1="80" x2="140" y2="85" stroke="#2A2C31" strokeWidth="3" strokeDasharray="4 4" />
          <line x1="90" y1="140" x2="90" y2="100" stroke="#2A2C31" strokeWidth="3" strokeDasharray="4 4" />

          {/* Geofence circle */}
          <motion.circle
            cx="128"
            cy="128"
            r="60"
            fill="none"
            stroke={state === 'failed' ? '#D64545' : '#E8873A'}
            strokeWidth="2"
            strokeDasharray="6 4"
            animate={{ opacity: [0.4, 0.8, 0.4], r: [58, 62, 58] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle
            cx="128"
            cy="128"
            r="60"
            fill={state === 'failed' ? '#D64545' : '#E8873A'}
            fillOpacity="0.05"
            animate={{ fillOpacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Student location dot */}
          <motion.circle
            cx={state === 'failed' ? 220 : 128}
            cy={state === 'failed' ? 40 : 128}
            r="6"
            fill={state === 'failed' ? '#D64545' : '#E8873A'}
            initial={{ cx: 220, cy: 40 }}
            animate={state === 'scanning' ? { cx: [220, 180, 140, 128], cy: [40, 80, 110, 128] } : {}}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <motion.circle
            cx={state === 'failed' ? 220 : 128}
            cy={state === 'failed' ? 40 : 128}
            r="6"
            fill="none"
            stroke={state === 'failed' ? '#D64545' : '#E8873A'}
            strokeWidth="2"
            animate={{ r: [6, 18], opacity: [0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Labels */}
          <text x="70" y="62" fill="#4A4D53" fontSize="8" fontFamily="monospace">LT 3</text>
          <text x="165" y="82" fill="#4A4D53" fontSize="8" fontFamily="monospace">LAB 4</text>
        </svg>

        {state === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-ink-800/60 flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
              <div className="w-16 h-16 rounded-full bg-gold-500/15 border-2 border-gold-500 flex items-center justify-center glow-gold">
                <Check className="w-8 h-8 text-gold-400" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {state === 'failed' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-ink-800/60 flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
              <div className="w-16 h-16 rounded-full bg-terracotta-500/15 border-2 border-terracotta-500 flex items-center justify-center glow-red">
                <X className="w-8 h-8 text-terracotta-400" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {state === 'scanning' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-border">
            <motion.div className="h-full bg-gradient-to-r from-amber-500 to-gold-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <StageStatus
        state={state}
        label="Triangulating GPS position…"
        successLabel="12.3m inside geofence"
        failLabel="340m outside geofence boundary"
      />
    </div>
  );
}

/* ── Facial Verification Stage ── */
function FacialStage({ state, progress, score, onCapture, cameraError }: { state: StageState; progress: number; score: number; onCapture: () => void; cameraError: string | null }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-serif text-2xl font-600 text-cream-500 mb-1">Facial Verification</h2>
      <p className="text-cream-700 text-sm mb-8">Hold steady while we verify your identity against your registered reference</p>

      <div className="relative w-64 h-64 rounded-lg border-2 border-stone-border bg-ink-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-700 to-ink-900" />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-36 h-44 rounded-[50%] border-2 border-amber-500/40"
            animate={{ borderColor: state === 'scanning' ? ['rgba(232,135,58,0.3)', 'rgba(232,135,58,0.7)', 'rgba(232,135,58,0.3)'] : 'rgba(232,135,58,0.4)' }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {state === 'idle' && (
          <div className="absolute inset-0 z-10 bg-ink-900/35 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                if (cameraError) return;
                onCapture();
              }}
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-ink-900 shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-colors"
            >
              Capture Face
            </button>
          </div>
        )}

        {state === 'scanning' && (
          <>
            <motion.div
              className="absolute left-4 right-4 h-0.5 bg-amber-500"
              animate={{ top: ['15%', '85%', '15%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 bg-amber-500/30 blur-md" />
            </motion.div>
            <div className="absolute inset-4">
              {[25, 50, 75].map((p) => (
                <div key={p} className="absolute left-0 right-0 h-px bg-amber-500/10" style={{ top: `${p}%` }} />
              ))}
              {[33, 66].map((p) => (
                <div key={p} className="absolute top-0 bottom-0 w-px bg-amber-500/10" style={{ left: `${p}%` }} />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-cream-700/20 font-serif text-6xl">☻</div>
        </div>

        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500/60 rounded-tl" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-500/60 rounded-tr" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-500/60 rounded-bl" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500/60 rounded-br" />

        {state === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-ink-800/60 flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
              <div className="w-16 h-16 rounded-full bg-gold-500/15 border-2 border-gold-500 flex items-center justify-center glow-gold">
                <Check className="w-8 h-8 text-gold-400" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {state === 'scanning' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-border">
            <motion.div className="h-full bg-gradient-to-r from-amber-500 to-gold-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {cameraError && (
        <p className="mt-4 text-xs text-terracotta-400 text-center max-w-xs">{cameraError}</p>
      )}

      {(state === 'scanning' || state === 'success') && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 w-full max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-cream-700 uppercase tracking-wider">Match Confidence</span>
            <span className={`text-sm font-mono font-medium ${score >= 95 ? 'text-gold-400' : 'text-amber-400'}`}>
              {score.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-stone-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-gold-500 rounded-full"
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}

      <StageStatus state={state} label="Analyzing facial features…" successLabel="98.4% match — identity confirmed" />
    </div>
  );
}

/* ── Timestamp Validation Stage ── */
function TimestampStage({ state, progress }: { state: StageState; progress: number }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const sessionStart = '10:00 AM';
  const graceEnd = '10:15 AM';
  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-serif text-2xl font-600 text-cream-500 mb-1">Timestamp Validation</h2>
      <p className="text-cream-700 text-sm mb-8">Confirming check-in within the allowed window</p>

      <div className="relative w-64 h-64 rounded-lg border-2 border-stone-border bg-ink-800 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 dot-grid opacity-30" />

        <div className="relative flex flex-col items-center gap-4">
          <ProgressRing progress={state === 'success' ? 100 : progress} size={140} color={state === 'success' ? '#D9B56C' : '#E8873A'} />

          <div className="text-center">
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="font-mono text-2xl text-cream-500 font-medium"
            >
              {timeStr}
            </motion.p>
            <p className="text-xs text-cream-700 mt-1">Session window: {sessionStart} — {graceEnd}</p>
          </div>
        </div>

        {state === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-gold-500/15 border-2 border-gold-500 flex items-center justify-center">
              <Check className="w-5 h-5 text-gold-400" />
            </div>
          </motion.div>
        )}

        {state === 'scanning' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-border">
            <motion.div className="h-full bg-gradient-to-r from-amber-500 to-gold-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <StageStatus state={state} label="Validating timestamp…" successLabel="Checked in 3 min after session start" />
    </div>
  );
}

/* ── Stage status text ── */
function StageStatus({ state, label, successLabel, failLabel }: { state: StageState; label: string; successLabel: string; failLabel?: string }) {
  return (
    <div className="mt-6 text-center min-h-[24px]">
      <AnimatePresence mode="wait">
        {state === 'scanning' && (
          <motion.p key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-cream-700 flex items-center justify-center gap-2">
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {label}
          </motion.p>
        )}
        {state === 'success' && (
          <motion.p key="success" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-gold-400 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> {successLabel}
          </motion.p>
        )}
        {state === 'failed' && (
          <motion.p key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-terracotta-400 flex items-center justify-center gap-2">
            <X className="w-4 h-4" /> {failLabel ?? 'Verification failed'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Success Summary ── */
function SuccessSummary({ stages, onComplete }: { stages: { stage: StageKey; passed: boolean; detail: string; score?: number }[]; onComplete: () => void }) {
  const stageLabels: Record<StageKey, string> = { qr: 'QR Scan', gps: 'GPS Geofence', facial: 'Facial Match', timestamp: 'Timestamp' };
  const stageIcons: Record<StageKey, typeof QrCode> = { qr: QrCode, gps: MapPin, facial: ScanFace, timestamp: Clock };
  const overallScore = stages.filter(s => s.score).reduce((acc, s) => acc + (s.score || 0), 0) / stages.filter(s => s.score).length;

  return (
    <div className="min-h-screen bg-ink-900 dot-grid grain flex items-center justify-center px-6 py-8">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        {/* Success header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-500/15 border-2 border-gold-500 mb-4 glow-gold"
          >
            <motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }}>
              <Check className="w-10 h-10 text-gold-400" />
            </motion.div>
          </motion.div>
          <h1 className="font-serif text-3xl font-600 text-cream-500 mb-1">Attendance Verified</h1>
          <p className="text-cream-700 text-sm">All 4 verification stages passed successfully</p>
        </div>

        {/* Record summary */}
        <div className="bg-ink-800 border border-stone-border rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-stone-border">
            <div>
              <p className="text-[10px] text-cream-700 uppercase tracking-wider mb-1">Course</p>
              <p className="font-serif text-sm text-cream-500">CSC 401</p>
              <p className="text-xs text-cream-700">Distributed Systems</p>
            </div>
            <div>
              <p className="text-[10px] text-cream-700 uppercase tracking-wider mb-1">Time</p>
              <p className="font-mono text-sm text-cream-500">10:03 AM</p>
              <p className="text-xs text-cream-700">Aug 31, 2026</p>
            </div>
          </div>

          <p className="text-[10px] text-cream-700 uppercase tracking-wider mb-3">Verification Breakdown</p>
          <div className="space-y-3">
            {stages.map((s, i) => {
              const Icon = stageIcons[s.stage];
              return (
                <motion.div
                  key={s.stage}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-ink-700 flex items-center justify-center text-gold-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-cream-500">{stageLabels[s.stage]}</p>
                    <p className="text-[10px] text-cream-700">{s.detail}</p>
                  </div>
                  {s.score !== undefined && (
                    <span className="text-xs font-mono text-gold-400">{s.score.toFixed(1)}%</span>
                  )}
                  <Check className="w-4 h-4 text-gold-400" />
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-stone-border flex items-center justify-between">
            <span className="text-xs text-cream-700 uppercase tracking-wider">Overall Score</span>
            <span className="font-serif text-2xl text-gradient-gold font-600">{overallScore.toFixed(1)}%</span>
          </div>
        </div>

        <Button className="w-full" size="lg" magnetic onClick={onComplete}>
          Done <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
