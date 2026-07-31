import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  videoId: string;
  title?: string;
};

type YtPlayer = {
  mute: () => void;
  unMute: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

type YtNamespace = {
  Player: new (
    element: HTMLElement | string,
    options: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: { target: YtPlayer }) => void;
        onStateChange?: (e: { data: number; target: YtPlayer }) => void;
      };
    },
  ) => YtPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; BUFFERING: number };
};

declare global {
  interface Window {
    YT?: YtNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** 숨긴 채 버퍼링할 때 ABR이 저화질로 고정되지 않도록 실제 재생 크기 유지 */
const WARM_WIDTH = 1280;
const WARM_HEIGHT = 720;
/** mute 재생으로 초반 세그먼트·화질 램프를 유도하는 시간 */
const WARM_BUFFER_MS = 3200;

function loadYouTubeApi(): Promise<YtNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);

  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };

    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    // 이미 API 로드가 끝난 경우
    if (window.YT?.Player) resolve(window.YT);
  });
}

export function YouTubeVideoModal({
  open,
  onClose,
  videoId,
  title = "서비스 영상",
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // 페이지 진입 후 유휴 시점에 플레이어를 미리 만들고 초반만 버퍼링
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let warmTimer: number | undefined;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const startWarm = () => {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (conn?.saveData) return;

      void loadYouTubeApi().then((YT) => {
        if (cancelled || !hostRef.current || playerRef.current) return;

        playerRef.current = new YT.Player(hostRef.current, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              if (cancelled) return;
              // 워밍업 전에 모달이 열린 경우: 바로 본 재생
              if (openRef.current) {
                e.target.unMute();
                e.target.playVideo();
                return;
              }
              // 음소거로 잠깐 재생 → 초반 스트림·화질 램프 유도 후 처음으로 되감기
              e.target.mute();
              e.target.playVideo();
              warmTimer = window.setTimeout(() => {
                if (cancelled || openRef.current) return;
                e.target.pauseVideo();
                e.target.seekTo(0, true);
              }, WARM_BUFFER_MS);
            },
          },
        });
      });
    };

    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(() => startWarm(), { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(startWarm, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (warmTimer !== undefined) window.clearTimeout(warmTimer);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  // 모달 열림/닫힘에 맞춰 재생 제어
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (open) {
      player.unMute();
      player.seekTo(0, true);
      player.playVideo();
    } else {
      player.pauseVideo();
      player.mute();
      player.seekTo(0, true);
    }
  }, [open]);

  return (
    <div
      className={
        open
          ? "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-2 sm:p-4"
          : "pointer-events-none fixed left-[-100vw] top-0 z-[-1] overflow-hidden opacity-0"
      }
      style={
        open
          ? undefined
          : { width: WARM_WIDTH, height: WARM_HEIGHT }
      }
      role={open ? "presentation" : undefined}
      aria-hidden={!open}
      onClick={open ? onClose : undefined}
    >
      <div
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? title : undefined}
        className={
          open
            ? "relative w-full max-w-[1100px] overflow-hidden rounded-2xl bg-black shadow-2xl lg:max-w-[1280px]"
            : "h-full w-full bg-black"
        }
        onClick={open ? (e) => e.stopPropagation() : undefined}
      >
        {open ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
        <div className={open ? "relative aspect-video w-full" : "h-full w-full"}>
          <div ref={hostRef} className="absolute inset-0 h-full w-full" />
        </div>
      </div>
    </div>
  );
}
