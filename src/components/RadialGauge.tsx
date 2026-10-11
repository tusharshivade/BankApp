import React from 'react';

interface RadialGaugeProps {
  amount: string;
  subText?: string;
  size?: number;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  amount = '$80,720.50',
  subText = 'from all accounts',
  size = 260,
}) => {
  const center = size / 2;
  const strokeWidth = 10;

  // Concentric arc radii
  const rOuter = size * 0.44;
  const rMiddle = size * 0.38;
  const rInner = size * 0.32;

  // Semi-circle circumference for 180 degrees (from 180 to 0 deg)
  const arcLength = (r: number) => Math.PI * r;

  return (
    <div className="relative flex flex-col items-center justify-center pt-2">
      <svg width={size} height={size * 0.62} className="overflow-visible">
        {/* Outer Background Track */}
        <path
          d={`M ${center - rOuter} ${center * 0.95} A ${rOuter} ${rOuter} 0 0 1 ${center + rOuter} ${center * 0.95}`}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Outer Blue Arc (78% filled) */}
        <path
          d={`M ${center - rOuter} ${center * 0.95} A ${rOuter} ${rOuter} 0 0 1 ${center + rOuter} ${center * 0.95}`}
          fill="none"
          stroke="#2555EA"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength(rOuter)}
          strokeDashoffset={arcLength(rOuter) * 0.22}
          strokeLinecap="round"
        />

        {/* Middle Background Track */}
        <path
          d={`M ${center - rMiddle} ${center * 0.95} A ${rMiddle} ${rMiddle} 0 0 1 ${center + rMiddle} ${center * 0.95}`}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Middle Green Arc (65% filled) */}
        <path
          d={`M ${center - rMiddle} ${center * 0.95} A ${rMiddle} ${rMiddle} 0 0 1 ${center + rMiddle} ${center * 0.95}`}
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength(rMiddle)}
          strokeDashoffset={arcLength(rMiddle) * 0.35}
          strokeLinecap="round"
        />

        {/* Inner Background Track */}
        <path
          d={`M ${center - rInner} ${center * 0.95} A ${rInner} ${rInner} 0 0 1 ${center + rInner} ${center * 0.95}`}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Inner Amber Arc (48% filled) */}
        <path
          d={`M ${center - rInner} ${center * 0.95} A ${rInner} ${rInner} 0 0 1 ${center + rInner} ${center * 0.95}`}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength(rInner)}
          strokeDashoffset={arcLength(rInner) * 0.52}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Amount Text */}
      <div className="absolute bottom-2 text-center pointer-events-none">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">
          {amount}
        </span>
        <span className="text-xs text-slate-400 font-medium block mt-0.5">
          {subText}
        </span>
      </div>
    </div>
  );
};
