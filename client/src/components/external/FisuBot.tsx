import React from 'react';

interface FisuBotProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    state?: 'idle' | 'thinking' | 'speaking';
    className?: string;
}

const FisuBot: React.FC<FisuBotProps> = ({ size = 'md', state = 'idle', className = '' }) => {
    const dimensions = {
        sm: 40,
        md: 80,
        lg: 150,
        xl: 240
    };

    const px = dimensions[size];

    // Neon glow colors based on state
    const glowColor = state === 'thinking' ? '#a855f7' : state === 'speaking' ? '#06b6d4' : '#6366f1';

    return (
        <div className={`relative ${className} flex justify-center items-center`}>
            {/* Ambient Glow */}
            <div
                className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse-glow"
                style={{ background: glowColor }}
            ></div>

            <svg
                width={px}
                height={px}
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`relative z-10 transition-transform duration-500 ${state === 'thinking' ? 'animate-bounce' : 'animate-float'}`}
            >
                {/* Antenna */}
                <line x1="100" y1="50" x2="100" y2="20" stroke="#94a3b8" strokeWidth="4" />
                <circle cx="100" cy="20" r="6" fill={glowColor} className="animate-pulse" />

                {/* Head Shape */}
                <rect x="50" y="50" width="100" height="90" rx="25" fill="url(#headGradient)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

                {/* Face Screen */}
                <rect x="65" y="70" width="70" height="50" rx="10" fill="#0f172a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                {/* Eyes Container */}
                <g className="eyes">
                    {state === 'thinking' ? (
                        <>
                            <circle cx="85" cy="95" r="8" fill={glowColor}>
                                <animate attributeName="r" values="8;2;8" dur="1s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="115" cy="95" r="8" fill={glowColor}>
                                <animate attributeName="r" values="8;2;8" dur="1s" repeatCount="indefinite" begin="0.1s" />
                            </circle>
                        </>
                    ) : (
                        <>
                            {/* Left Eye */}
                            <ellipse cx="85" cy="95" rx="8" ry="12" fill={glowColor}>
                                <animate attributeName="ry" values="12;1;12" dur="4s" repeatCount="indefinite" begin="1s" />
                            </ellipse>
                            {/* Right Eye */}
                            <ellipse cx="115" cy="95" rx="8" ry="12" fill={glowColor}>
                                <animate attributeName="ry" values="12;1;12" dur="4s" repeatCount="indefinite" begin="1s" />
                            </ellipse>
                        </>
                    )}
                </g>

                {/* Mouth/Smile - Simple line that changes based on intent could be added here, keeping minimal for now */}

                {/* Gradients */}
                <defs>
                    <linearGradient id="headGradient" x1="100" y1="50" x2="100" y2="140" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#e2e8f0" />
                        <stop offset="1" stopColor="#94a3b8" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default FisuBot;
