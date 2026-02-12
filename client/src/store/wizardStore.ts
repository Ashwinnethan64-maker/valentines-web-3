import { create } from 'zustand';
import { LovePageData, defaultPageData } from '../types';

interface WizardState {
    data: LovePageData;
    currentStep: number;
    updateData: (partial: Partial<LovePageData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
    data: defaultPageData,
    currentStep: 0,
    updateData: (partial) => set((state) => ({ data: { ...state.data, ...partial } })),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
    setStep: (step) => set({ currentStep: step }),
    reset: () => set({ data: defaultPageData, currentStep: 0 })
}));
