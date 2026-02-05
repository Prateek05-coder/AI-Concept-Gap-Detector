export type ViewState = 'ONBOARDING' | 'AUTH' | 'DASHBOARD' | 'CHAT';

export interface UserProfile {
    name: string;
    avatarUrl: string;
}

export interface SlideData {
    id: number;
    title: string;
    description: string;
    iconType: 'robot' | 'bulb' | 'unlock';
}
