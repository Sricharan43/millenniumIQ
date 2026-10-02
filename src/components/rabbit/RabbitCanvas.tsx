import React, { useEffect, useRef } from 'react';
import type { RabbitState } from '../../types';
import confetti from 'canvas-confetti';

interface RabbitCanvasProps {
  state: RabbitState;
  isSpeaking: boolean;
  onStateChange?: (newState: RabbitState) => void;
  width?: number;
  height?: number;
}

export const RabbitCanvas: React.FC<RabbitCanvasProps> = ({
  state,
  isSpeaking,
  width = 300,
  height = 320
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger real confetti burst on celebrating state
  useEffect(() => {
    if (state === 'celebrating') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Animation calculations
      const bounce = Math.sin(tick * 0.05) * 4;
      const earTwitch = Math.sin(tick * 0.08) * 0.08;
      const mouthCycle = isSpeaking ? (Math.sin(tick * 0.3) > 0 ? 1 : 0) : 0;

      // Base coordinates
      const centerX = width / 2;
      const centerY = height / 2 + 15 + (state === 'excited' || state === 'celebrating' ? Math.abs(Math.sin(tick * 0.15) * 8) : bounce);

      // --- Background Glow / Aura ---
      const auraGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 140);
      let auraColor = 'rgba(99, 102, 241, 0.15)'; // Indigo base
      if (state === 'excited') auraColor = 'rgba(245, 158, 11, 0.25)'; // Amber
      if (state === 'concerned') auraColor = 'rgba(239, 68, 68, 0.2)'; // Red
      if (state === 'celebrating') auraColor = 'rgba(16, 185, 129, 0.25)'; // Emerald
      if (state === 'detective') auraColor = 'rgba(14, 165, 233, 0.25)'; // Sky blue

      auraGlow.addColorStop(0, auraColor);
      auraGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
      ctx.fill();

      // --- Lightbulb Prop for Excited/Idea State ---
      if (state === 'excited') {
        const lbY = centerY - 140 + Math.sin(tick * 0.1) * 3;
        ctx.fillStyle = '#F59E0B';
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(centerX, lbY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Rays
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 2.5;
        for (let r = 0; r < 8; r++) {
          const angle = (r * Math.PI) / 4;
          const rx1 = centerX + Math.cos(angle) * 18;
          const ry1 = lbY + Math.sin(angle) * 18;
          const rx2 = centerX + Math.cos(angle) * 24;
          const ry2 = lbY + Math.sin(angle) * 24;
          ctx.beginPath();
          ctx.moveTo(rx1, ry1);
          ctx.lineTo(rx2, ry2);
          ctx.stroke();
        }
      }

      // --- Ears ---
      let leftEarAngle = -0.15 + (state === 'thinking' ? -0.2 : 0) + (state === 'concerned' ? -0.35 : 0) + earTwitch;
      let rightEarAngle = 0.15 + (state === 'thinking' ? 0.25 : 0) + (state === 'concerned' ? 0.35 : 0) - earTwitch;
      if (state === 'excited' || state === 'celebrating') {
        leftEarAngle -= 0.1;
        rightEarAngle += 0.1;
      }

      // Outer Ear Left
      ctx.save();
      ctx.translate(centerX - 25, centerY - 65);
      ctx.rotate(leftEarAngle);
      ctx.fillStyle = '#E0E7FF'; // Soft cream-indigo
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, -45, 14, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner Ear Left
      ctx.fillStyle = '#EEF2FF';
      ctx.beginPath();
      ctx.ellipse(0, -45, 8, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Outer Ear Right
      ctx.save();
      ctx.translate(centerX + 25, centerY - 65);
      ctx.rotate(rightEarAngle);
      ctx.fillStyle = '#E0E7FF';
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, -45, 14, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner Ear Right
      ctx.fillStyle = '#EEF2FF';
      ctx.beginPath();
      ctx.ellipse(0, -45, 8, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- Body ---
      ctx.fillStyle = '#4F46E5'; // Indigo Smart Business Vest
      ctx.strokeStyle = '#3730A3';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 65, 42, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Shirt Collar & Red Bowtie
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(centerX - 15, centerY + 28);
      ctx.lineTo(centerX + 15, centerY + 28);
      ctx.lineTo(centerX, centerY + 48);
      ctx.closePath();
      ctx.fill();

      // Bowtie
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(centerX - 12, centerY + 36);
      ctx.lineTo(centerX, centerY + 40);
      ctx.lineTo(centerX - 12, centerY + 44);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(centerX + 12, centerY + 36);
      ctx.lineTo(centerX, centerY + 40);
      ctx.lineTo(centerX + 12, centerY + 44);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY + 40, 4, 0, Math.PI * 2);
      ctx.fill();

      // --- Head ---
      ctx.fillStyle = '#F5F3FF'; // Pure fur gradient
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 15, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Soft Cheek Blush
      ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
      ctx.beginPath();
      ctx.arc(centerX - 30, centerY - 5, 10, 0, Math.PI * 2);
      ctx.arc(centerX + 30, centerY - 5, 10, 0, Math.PI * 2);
      ctx.fill();

      // --- Eyes ---
      const eyeOffset = state === 'detective' ? -3 : 0;

      // Left Eye
      ctx.fillStyle = '#1E1B4B';
      ctx.beginPath();
      const eyeH = state === 'concerned' ? 7 : state === 'surprised' || state === 'excited' ? 14 : 11;
      ctx.ellipse(centerX - 20 + eyeOffset, centerY - 24, 9, eyeH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Right Eye
      ctx.beginPath();
      ctx.ellipse(centerX + 20 + eyeOffset, centerY - 24, 9, eyeH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye Highlights (Sparkle)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX - 22 + eyeOffset, centerY - 27, 3, 0, Math.PI * 2);
      ctx.arc(centerX + 18 + eyeOffset, centerY - 27, 3, 0, Math.PI * 2);
      ctx.fill();

      // --- Eyebrows ---
      ctx.strokeStyle = '#4338CA';
      ctx.lineWidth = 2.5;
      if (state === 'concerned') {
        // Slanted sad brows
        ctx.beginPath();
        ctx.moveTo(centerX - 28, centerY - 38);
        ctx.lineTo(centerX - 12, centerY - 34);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 28, centerY - 38);
        ctx.lineTo(centerX + 12, centerY - 34);
        ctx.stroke();
      } else if (state === 'thinking' || state === 'detective') {
        // One raised eyebrow
        ctx.beginPath();
        ctx.moveTo(centerX - 28, centerY - 42);
        ctx.lineTo(centerX - 12, centerY - 40);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 12, centerY - 36);
        ctx.lineTo(centerX + 28, centerY - 38);
        ctx.stroke();
      } else {
        // Normal happy arches
        ctx.beginPath();
        ctx.arc(centerX - 20, centerY - 38, 8, Math.PI, Math.PI * 1.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 20, centerY - 38, 8, Math.PI * 1.2, Math.PI * 2);
        ctx.stroke();
      }

      // --- Nose ---
      ctx.fillStyle = '#EC4899'; // Cute pink nose
      ctx.beginPath();
      ctx.moveTo(centerX - 5, centerY - 12);
      ctx.lineTo(centerX + 5, centerY - 12);
      ctx.lineTo(centerX, centerY - 7);
      ctx.closePath();
      ctx.fill();

      // --- Mouth / Lip Sync ---
      ctx.strokeStyle = '#1E1B4B';
      ctx.lineWidth = 2.5;

      if (isSpeaking && mouthCycle === 1) {
        // Open speaking mouth
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 1, 7, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (state === 'concerned') {
        // Small worried line
        ctx.beginPath();
        ctx.moveTo(centerX - 8, centerY + 2);
        ctx.lineTo(centerX + 8, centerY + 2);
        ctx.stroke();
      } else if (state === 'excited' || state === 'celebrating' || state === 'happy') {
        // Wide happy smile with teeth
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 4, 11, 0.2, Math.PI - 0.2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Gentle smile line
        ctx.beginPath();
        ctx.arc(centerX - 5, centerY - 4, 5, 0.3, Math.PI - 0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 5, centerY - 4, 5, 0.3, Math.PI - 0.3);
        ctx.stroke();
      }

      // --- Whiskers ---
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 1.5;
      // Left whiskers
      ctx.beginPath();
      ctx.moveTo(centerX - 35, centerY - 10);
      ctx.lineTo(centerX - 60, centerY - 16);
      ctx.moveTo(centerX - 35, centerY - 5);
      ctx.lineTo(centerX - 62, centerY - 4);
      ctx.stroke();
      // Right whiskers
      ctx.beginPath();
      ctx.moveTo(centerX + 35, centerY - 10);
      ctx.lineTo(centerX + 60, centerY - 16);
      ctx.moveTo(centerX + 35, centerY - 5);
      ctx.lineTo(centerX + 62, centerY - 4);
      ctx.stroke();

      // --- Paws & Props ---
      ctx.fillStyle = '#F5F3FF';
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 3;

      if (state === 'thinking') {
        // Paw Resting under Chin
        ctx.beginPath();
        ctx.arc(centerX + 18, centerY + 8, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (state === 'celebrating' || state === 'excited') {
        // Both Paws raised high in victory!
        ctx.beginPath();
        ctx.arc(centerX - 42, centerY - 25 + Math.sin(tick * 0.2) * 5, 12, 0, Math.PI * 2);
        ctx.arc(centerX + 42, centerY - 25 + Math.sin(tick * 0.2) * 5, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (state === 'detective') {
        // Holding Vector Magnifying Glass
        ctx.save();
        ctx.translate(centerX - 24, centerY - 22);
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();
        // Glass handle
        ctx.beginPath();
        ctx.moveTo(-12, 12);
        ctx.lineTo(-24, 26);
        ctx.stroke();
        ctx.restore();
      } else if (state === 'pointing') {
        // Laser Chart Pointer Stick
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(centerX + 35, centerY + 30);
        ctx.lineTo(centerX + 90, centerY - 15);
        ctx.stroke();
        // Laser tip glow
        ctx.fillStyle = '#EC4899';
        ctx.shadowColor = '#EC4899';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(centerX + 90, centerY - 15, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Resting Paws on hips/chest
        ctx.beginPath();
        ctx.arc(centerX - 36, centerY + 45, 11, 0, Math.PI * 2);
        ctx.arc(centerX + 36, centerY + 45, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [state, isSpeaking, width, height]);

  return (
    <div className="relative flex flex-col items-center justify-center p-2 rounded-3xl bg-white backdrop-blur-md border border-blue-200 shadow-sm shadow-indigo-950/40">
      {/* Badge Overlay */}
      <div className="absolute top-3 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Barnaby IQ — AI Adviser</span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full max-w-[320px] h-auto cursor-pointer transition-transform duration-300 hover:scale-105"
      />

      {/* State Indicator pill */}
      <div className="mt-1 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-700 flex items-center gap-2 shadow-inner">
        <span className="capitalize text-blue-600 font-bold">{state}</span>
        {isSpeaking && (
          <span className="text-emerald-600 text-[10px] animate-pulse">🔊 Speaking...</span>
        )}
      </div>
    </div>
  );
};
