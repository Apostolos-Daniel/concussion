import { useState, type ReactElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessment, updateAssessmentSection, updateAssessment } from '../hooks/useAssessments';
import { useAthlete } from '../hooks/useAthletes';
import { ProgressBar } from '../components/ProgressBar';
import { Step1PatientInfo } from './steps/Step1PatientInfo';
import { Step2ObservedSigns } from './steps/Step2ObservedSigns';
import { Step3RedFlags } from './steps/Step3RedFlags';
import { Step4MaddocksQuestions } from './steps/Step4MaddocksQuestions';
import { Step5Symptoms } from './steps/Step5Symptoms';
import { Step6CognitiveScreening } from './steps/Step6CognitiveScreening';
import { Step7NeurologicalScreen } from './steps/Step7NeurologicalScreen';
import { Step8TandemGait } from './steps/Step8TandemGait';
import { Step9BESS } from './steps/Step9BESS';
import { Step10DelayedRecall } from './steps/Step10DelayedRecall';
import { Step11Decision } from './steps/Step11Decision';

const STEP_LABELS = [
  'Patient Info',
  'Observed Signs',
  'Red Flags',
  'Maddocks',
  'Symptoms',
  'Cognitive',
  'Neurological',
  'Tandem Gait',
  'BESS',
  'Delayed Recall',
  'Decision',
];

export function AssessmentWizard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const assessment = useAssessment(id!);
  const athlete = useAthlete(assessment?.athleteId || '');
  const [currentStep, setCurrentStep] = useState(0);

  if (assessment === undefined) {
    return <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Loading...</div>;
  }
  if (!assessment) {
    return <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Assessment not found.</div>;
  }

  const isBaseline = assessment.type === 'baseline';
  // For baseline, skip steps 2, 3, 4 (observed signs, red flags, maddocks)
  const steps = isBaseline
    ? [0, 4, 5, 6, 7, 8, 9, 10] // step indices to include
    : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const totalSteps = steps.length;
  const stepIndex = steps[currentStep];

  const saveSection = async (sectionId: string, data: any) => {
    await updateAssessmentSection(id!, sectionId, data);
  };

  const next = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/history');
    }
  };

  const complete = async () => {
    await updateAssessment(id!, { status: 'complete' });
    navigate(`/history/${id}`);
  };

  const commonProps = {
    assessment,
    athlete: athlete || undefined,
    onSave: saveSection,
    onNext: next,
    onPrev: prev,
    isBaseline,
  };

  const stepComponents: { [key: number]: ReactElement } = {
    0: <Step1PatientInfo {...commonProps} />,
    1: <Step2ObservedSigns {...commonProps} />,
    2: <Step3RedFlags {...commonProps} />,
    3: <Step4MaddocksQuestions {...commonProps} />,
    4: <Step5Symptoms {...commonProps} />,
    5: <Step6CognitiveScreening {...commonProps} />,
    6: <Step7NeurologicalScreen {...commonProps} />,
    7: <Step8TandemGait {...commonProps} />,
    8: <Step9BESS {...commonProps} />,
    9: <Step10DelayedRecall {...commonProps} />,
    10: <Step11Decision {...commonProps} onComplete={complete} />,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
      {/* Header */}
      <div style={{ background: '#0D5C63', padding: '12px 16px 8px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button onClick={prev} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: 4, minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
              {athlete?.name || 'Assessment'} · {assessment.type === 'baseline' ? 'Baseline' : 'Post-Incident'}
            </div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
              {STEP_LABELS[stepIndex]}
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            {currentStep + 1}/{totalSteps}
          </div>
        </div>
        <ProgressBar current={currentStep + 1} total={totalSteps} label={`Step ${currentStep + 1} of ${totalSteps}: ${STEP_LABELS[stepIndex]}`} />
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
        {stepComponents[stepIndex]}
      </div>
    </div>
  );
}
