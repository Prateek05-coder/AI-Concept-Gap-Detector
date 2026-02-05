import React, { useState } from 'react';
import { ChevronRight, Lightbulb, Lock } from 'lucide-react';
import FisuBot from './FisuBot';
import { SlideData } from '@/lib/external-types';

interface OnboardingProps {
    onComplete: () => void;
}

const SLIDES: SlideData[] = [
    {
        id: 1,
        title: "Ask Anything. Get Answers Now.",
        description: "The more you chat, the better we understand your needs and remember context.",
        iconType: 'robot'
    },
    {
        id: 2,
        title: "Complex Situation, Smart Solution.",
        description: "Ask anything that complex, and get instant smart solutions to debug your learning.",
        iconType: 'bulb'
    },
    {
        id: 3,
        title: "Unlock Your Next Idea Instantly.",
        description: "Our AI is the effortless co-pilot for every project, big or small.",
        iconType: 'unlock'
    }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        if (currentIndex < SLIDES.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const currentSlide = SLIDES[currentIndex];

    const renderIcon = () => {
        switch (currentSlide.iconType) {
            case 'robot':
                return <FisuBot size="lg" state="idle" />;
            case 'bulb':
                return (
                    <div className="relative animate-float">
                        <div className="absolute inset-0 bg-yellow-500 blur-[80px] opacity-20"></div>
                        <Lightbulb className="w-48 h-48 md:w-64 md:h-64 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" strokeWidth={1} />
                    </div>
                );
            case 'unlock':
                return (
                    <div className="relative animate-float">
                        <div className="absolute inset-0 bg-purple-500 blur-[80px] opacity-20"></div>
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[3rem] shadow-2xl border border-white/10">
                            <Lock className="w-32 h-32 md:w-40 md:h-40 text-white" />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="h-full w-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617] absolute inset-0 z-50">
            <div className="w-full max-w-lg mx-auto h-full flex flex-col p-6 z-10">
                {/* Top Skip Button */}
                <div className="w-full flex justify-end">
                    <button onClick={onComplete} className="text-slate-400 text-sm hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-full">Skip</button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <div className="h-80 md:h-96 flex items-center justify-center mb-8 w-full">
                        {renderIcon()}
                    </div>

                    <div className="text-center space-y-4 animate-[fadeIn_0.5s_ease-out] max-w-md">
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight">
                            {currentSlide.title}
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed px-4">
                            {currentSlide.description}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full flex flex-col items-center gap-8 pb-8">
                    {/* Pagination Dots */}
                    <div className="flex gap-2">
                        {SLIDES.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'w-2 bg-slate-700'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                    >
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
