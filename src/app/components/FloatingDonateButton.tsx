'use client';

import { useEffect, useRef, useState } from 'react';
import PayPalButton from './PayPalButton';

interface FloatingDonateButtonProps {
  hostedButtonId: string;
}

export default function FloatingDonateButton({ hostedButtonId }: FloatingDonateButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  const hoverHandlers = canHover
    ? { onMouseEnter: () => setExpanded(true), onMouseLeave: () => setExpanded(false) }
    : {};

  const triggerClick = canHover ? undefined : () => setExpanded((prev) => !prev);

  if (!hostedButtonId) return null;

  return (
    <div
      ref={wrapperRef}
      className={`donate-fab-wrapper ${expanded ? 'expanded' : ''}`}
      {...hoverHandlers}
    >
      <button
        type="button"
        className="donate-fab-trigger"
        aria-expanded={expanded}
        aria-label="Support with PayPal"
        onClick={triggerClick}
      >
        $
      </button>

      {expanded && (
        <div className="donate-fab-panel">
          <p className="donate-fab-label">Support Khagatara</p>
          <PayPalButton hostedButtonId={hostedButtonId} />
        </div>
      )}

      <style jsx>{`
        .donate-fab-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .donate-fab-trigger {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #c8901a, #e8c547);
          color: #1a1408;
          font-size: 24px;
          font-weight: 800;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .donate-fab-trigger:hover,
        .donate-fab-wrapper.expanded .donate-fab-trigger {
          transform: scale(1.06);
          box-shadow: 0 6px 20px rgba(232, 197, 71, 0.5);
        }
        .donate-fab-trigger:focus-visible {
          outline: 3px solid #e8c547;
          outline-offset: 2px;
        }
        .donate-fab-panel {
          margin-top: 12px;
          background: #12101c;
          border: 1px solid rgba(232, 197, 71, 0.25);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          min-width: 220px;
          animation: donate-fab-in 0.18s ease-out;
        }
        .donate-fab-label {
          margin: 0 0 10px;
          font-size: 14px;
          font-weight: 600;
          color: #e8c547;
        }
        @keyframes donate-fab-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
