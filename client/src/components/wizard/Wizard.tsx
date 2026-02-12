import { useWizardStore } from '../../store/wizardStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import BasicInfo from './BasicInfo';
import PhotoGallery from './PhotoGallery';
import LoveLetter from './LoveLetter';
import Music from './Music';
import Privacy from './Privacy';
import Review from './Review';

const steps = [
    { component: BasicInfo, title: "Basics" },
    { component: PhotoGallery, title: "Photos" },
    { component: LoveLetter, title: "Letter" },
    { component: Music, title: "Music" },
    { component: Privacy, title: "Privacy" },
    { component: Review, title: "Review" }
];

const Wizard = () => {
    const { currentStep, nextStep, prevStep } = useWizardStore();
    const CurrentStepComponent = steps[currentStep].component;

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className="min-h-screen bg-secondary-light flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-primary font-heading font-bold text-xl">ForeverUs</Link>
                <div className="text-sm text-gray-500">
                    Step {currentStep + 1} of {steps.length}: <span className="font-semibold text-gray-800">{steps[currentStep].title}</span>
                </div>
                <div className="w-20"></div> {/* Spacer */}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-1">
                <div
                    className="bg-primary h-1 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
            </div>

            {/* Content */}
            <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 min-h-[500px]">
                    <CurrentStepComponent />
                </div>
            </div>

            {/* Footer / Navigation */}
            <div className="bg-white border-t px-6 py-4">
                <div className="max-w-2xl mx-auto flex justify-between">
                    <button
                        onClick={prevStep}
                        disabled={isFirstStep}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition ${isFirstStep ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <ChevronLeft size={20} /> Back
                    </button>

                    {!isLastStep && (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-hover shadow-lg transition hover:-translate-y-1"
                        >
                            Next <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wizard;
