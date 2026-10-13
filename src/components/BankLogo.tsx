import React from 'react';

interface BankLogoProps {
  className?: string;
  size?: number | string;
  fill?: string;
}

export const BankLogo: React.FC<BankLogoProps> = ({
  className = 'w-6 h-6',
  size,
  fill = 'currentColor',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 818 775"
      fill={fill}
      style={style}
      className={`shrink-0 select-none ${className}`}
      aria-label="FinCore Bank Logo"
      role="img"
    >
      {/* Outer Roof Gable / Pediment Chevron */}
      <polygon points="409,0 818,223 748,223 409,38 70,223 0,223" />

      {/* Inner Tympanum Triangle with transparent central circular cutout */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 409 68 L 700 223 L 118 223 Z M 409 120 A 28 28 0 1 0 409 176 A 28 28 0 1 0 409 120 Z"
      />

      {/* Entablature / Horizontal Beam */}
      <rect x="45" y="246" width="728" height="65" />

      {/* Four Classical Columns */}
      {/* Column 1 */}
      <rect x="103" y="334" width="130" height="23" />
      <rect x="123" y="357" width="90" height="219" />
      <rect x="103" y="576" width="130" height="23" />

      {/* Column 2 */}
      <rect x="263" y="334" width="130" height="23" />
      <rect x="283" y="357" width="90" height="219" />
      <rect x="263" y="576" width="130" height="23" />

      {/* Column 3 */}
      <rect x="423" y="334" width="130" height="23" />
      <rect x="443" y="357" width="90" height="219" />
      <rect x="423" y="576" width="130" height="23" />

      {/* Column 4 */}
      <rect x="583" y="334" width="130" height="23" />
      <rect x="603" y="357" width="90" height="219" />
      <rect x="583" y="576" width="130" height="23" />

      {/* Upper Foundation Step */}
      <rect x="45" y="622" width="728" height="65" />

      {/* Lower Foundation Step (Plinth) */}
      <rect x="0" y="710" width="818" height="65" />
    </svg>
  );
};

export default BankLogo;
