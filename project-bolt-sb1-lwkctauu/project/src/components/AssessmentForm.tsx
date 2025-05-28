import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Behavior {
  id: string;
  description: string;
}

interface Assessment {
  impression: string;
  apRecommendation: string;
  nonpharmRecommendation: string;
  monitoringRecommendation: string;
  referralRecommendation: string;
}

export const AssessmentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    diagnoses: '',
    medications: '',
    isEndOfLife: false,
    hasTriedNonPharm: false,
    hasSideEffects: false,
    hasmentalHealthTeam: false,
    behaviors: [] as Behavior[],
    behaviorStability: '1', // 1: ongoing, 2: stable < 3 months, 3: stable > 3 months
  });

  const [newBehavior, setNewBehavior] = useState('');
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  const addBehavior = () => {
    if (newBehavior.trim()) {
      setFormData(prev => ({
        ...prev,
        behaviors: [...prev.behaviors, { id: crypto.randomUUID(), description: newBehavior.trim() }]
      }));
      setNewBehavior('');
    }
  };

  const removeBehavior = (id: string) => {
    setFormData(prev => ({
      ...prev,
      behaviors: prev.behaviors.filter(b => b.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Initialize variables for logic
    let isPsychiatricDx = false;
    let isNeurocognitiveDx = false;
    let isOtherDx = false;
    let isEndOfLife = formData.isEndOfLife;
    let isMHTInvolved = formData.hasmentalHealthTeam;
    let isSpecialAntipsychotic = false;
    let isAnyAntipsychotic = false;
    let isBehaviorPresent = formData.behaviors.length > 0;
    let isBehaviorAPResponsive = false;
    let isBehaviorOngoing = formData.behaviorStability === '1';
    let isBehaviorStableLess3Months = formData.behaviorStability === '2';
    let isBehaviorStableMore3Months = formData.behaviorStability === '3';
    let isNonpharmTried = formData.hasTriedNonPharm;
    let isSideEffect = formData.hasSideEffects;

    // Process diagnoses
    const diagnoses = formData.diagnoses.toLowerCase().split(/[\s,]+/);
    const PSYCHIATRIC_DIAGNOSES = ["schizophrenia", "schizoaffective", "delusion", "bipolar", "psychotic", "psychosis", "ocd", "obsessive", "compulsive", "hallucination"];
    const NEUROCOGNITIVE_DIAGNOSES = ["dementia", "alzheimers", "parkinsons", "lewy", "frontotemporal", "ftd", "ftld", "vascular", "ncd", "bpsd", "neurocognitive"];
    const OTHER_DIAGNOSES = ["huntington", "huntingtons"];

    diagnoses.forEach(dx => {
      if (PSYCHIATRIC_DIAGNOSES.some(d => dx.includes(d))) isPsychiatricDx = true;
      if (NEUROCOGNITIVE_DIAGNOSES.some(d => dx.includes(d))) isNeurocognitiveDx = true;
      if (OTHER_DIAGNOSES.some(d => dx.includes(d))) isOtherDx = true;
    });

    // Process medications
    const medications = formData.medications.toLowerCase().split(/[\s,]+/);
    const SPECIAL_ANTIPSYCHOTICS = ["clozapine", "clozaril", "amisulpride", "sulpiride", "asenapine", "saphris", "iloperidone", "fanapt", "lurasidone", "latuda", "paliperidone", "invega", "ziprasidone", "geodon", "cariprazine", "vraylar", "brexpiprazole", "rexulti", "pimavanserin", "nuplazid", "flupentixol", "zuclopenthixol", "fluphenazine", "prochlorperazine", "perphenazine", "thiothixene", "trifluoperazine", "chlorpromazine", "depot", "long acting", "injectable", "lai"];
    const REGULAR_ANTIPSYCHOTICS = ["haloperidol", "haldol", "risperidone", "risperdal", "olanzapine", "zyprexa", "quetiapine", "seroquel", "aripiprazole", "abilify", "loxapine", "methotrimeprazine"];

    medications.forEach(med => {
      if (SPECIAL_ANTIPSYCHOTICS.some(m => med.includes(m))) {
        isSpecialAntipsychotic = true;
        isAnyAntipsychotic = true;
      } else if (REGULAR_ANTIPSYCHOTICS.some(m => med.includes(m))) {
        isAnyAntipsychotic = true;
      }
    });

    // Process behaviors
    const BEHAVIOR_RESPONSIVE = ["delirium", "delusions", "paranoia", "auditory_hallucinations", "visual_hallucinations", "resistance_to_care", "sexually_inappropriate_behavior", "physical_aggression", "verbal_aggression"];
    const behaviors = formData.behaviors.map(b => b.description.toLowerCase());
    
    behaviors.forEach(behavior => {
      if (BEHAVIOR_RESPONSIVE.some(b => behavior.includes(b))) {
        isBehaviorAPResponsive = true;
      }
    });

    // Initialize recommendation variables
    let impression = "";
    let apRecommendation = "";
    let nonpharmRecommendation = "";
    let monitoringRecommendation = "";
    let referralRecommendation = "";
    let isComplete = false;

    // Logic implementation
    const imp1 = "Likely appropriate use of antipsychotics.";
    const imp2 = "Possibly appropriate use of antipsychotics.";
    const imp3 = "Possibly inappropriate use of antipsychotics.";
    const imp4 = "Likely inappropriate use of antipsychotics.";
    const imp0 = "Not on any antipsychotic.";

    const aprec1 = "Continue current antipsychotics.";
    const aprec2 = "Continue current antipsychotic and reassess in 3 months.";
    const aprec3 = "Trial taper of current antipsychotics using Gradual Dose Reduction (GDR).";
    const aprec4 = "Recommend discontinuation of antipsychotics.";
    const aprec5 = "Consider gradual taper of antipsychotics to minimize side effects.";
    const aprec0 = "";

    const nonpharm1 = "Optimize non-pharmacological approaches for behaviors.";
    const nonpharm0 = "";

    const mon1 = "Monitor for antipsychotic side effects.";
    const mon2 = "Monitor for recurrence of psychiatric symptoms or behaviors.";
    const mon0 = "";

    const ref1 = "Recommend referral to Geriatric Psychiatry.";
    const ref2 = "Consider referral to Geriatric Psychiatry.";
    const ref3 = "Contact Mental Health Team about current concerns.";
    const ref4 = "No indication for referral to Geriatric Psychiatry at this time.";
    const ref5 = "Consider referral to Geriatric Psychiatry if behaviors persist.";
    const ref6 = "Has ongoing Mental Health Team follow-up. Contact them if concerns arise.";
    const ref7 = "Consider referral to Geriatric Psychiatry if considering tapering antipsychotics.";
    const ref0 = "";

    while (!isComplete) {
      // No antipsychotic check
      if (!isAnyAntipsychotic) {
        impression = imp0;
        apRecommendation = aprec0;
        isComplete = true;
        break;
      }

      // End of life check
      if (isEndOfLife) {
        impression = imp1 + " End of Life.";
        apRecommendation = aprec1;
        referralRecommendation = ref0;
        isComplete = true;
        break;
      }

      // Special antipsychotic check
      if (isSpecialAntipsychotic) {
        impression = imp1 + " On special antipsychotic.";
        apRecommendation = aprec1;

        if (isPsychiatricDx || !isBehaviorPresent || isBehaviorStableLess3Months || isBehaviorStableMore3Months) {
          referralRecommendation = ref0;
          isComplete = true;
          break;
        }

        if (!isPsychiatricDx || isBehaviorOngoing) {
          referralRecommendation = ref1;
          isComplete = true;
          break;
        }
      }

      // Psychiatric diagnosis check
      if (isPsychiatricDx && !isNeurocognitiveDx) {
        impression = imp1 + " Has appropriate psychiatric diagnosis.";
        apRecommendation = aprec1;
        referralRecommendation = ref0;
        isComplete = true;
        break;
      }

      if (isPsychiatricDx && isNeurocognitiveDx) {
        impression = imp2 + " Has appropriate psychiatric diagnosis with neurocognitive disorder.";
        apRecommendation = aprec1;
        referralRecommendation = ref7;
        isComplete = true;
        break;
      }

      // Other diagnosis check
      if (isOtherDx && !isNeurocognitiveDx) {
        impression = imp1 + " Has appropriate other diagnosis.";
        apRecommendation = aprec1;
        referralRecommendation = ref0;
        isComplete = true;
        break;
      }

      // Neurocognitive diagnosis check
      if (isNeurocognitiveDx) {
        if (isAnyAntipsychotic) {
          if (!isBehaviorPresent) {
            impression = imp4 + " No behavior present.";
            apRecommendation = aprec3;
            referralRecommendation = ref0;
            isComplete = true;
            break;
          }

          if (isBehaviorPresent) {
            if (!isBehaviorAPResponsive) {
              impression = imp4 + " Behaviors best managed with non-pharmacological approaches. Antipsychotics mainly causing sedation.";
              apRecommendation = aprec3;
              referralRecommendation = ref5;
              isComplete = true;
              break;
            }

            if (isBehaviorAPResponsive) {
              impression = imp2 + " Behavior may be responsive to antipsychotics, but need to optimize non-pharmacological approaches.";
              referralRecommendation = ref4;

              if (!isNonpharmTried) {
                impression = imp3 + " Behavior may be responsive to antipsychotics, but non-pharmacological approaches need to be tried first.";
                nonpharmRecommendation = nonpharm1;
              }

              if (isBehaviorOngoing) {
                apRecommendation = aprec2;
                referralRecommendation = ref5;
                isComplete = true;
                break;
              }

              if (isBehaviorStableLess3Months) {
                apRecommendation = aprec2;
                isComplete = true;
                break;
              }

              if (isBehaviorStableMore3Months) {
                apRecommendation = aprec3;
                isComplete = true;
                break;
              }
            }
          }
        }
      }
    }

    // Side effect recommendation
    if (apRecommendation === aprec1 && isSideEffect) {
      apRecommendation = aprec5;
    }

    // Nonpharm recommendation
    nonpharmRecommendation = isBehaviorPresent ? nonpharm1 : nonpharm0;

    // Monitoring recommendation
    if (apRecommendation === aprec1) {
      monitoringRecommendation = mon1;
    } else if (apRecommendation === aprec0) {
      monitoringRecommendation = mon0;
    } else {
      monitoringRecommendation = mon2;
    }

    // MHT involvement recommendations
    if (isMHTInvolved) {
      if (referralRecommendation === ref1 || referralRecommendation === ref2) {
        referralRecommendation = ref3;
      } else {
        referralRecommendation = ref6;
      }
    }

    setAssessment({
      impression,
      apRecommendation,
      nonpharmRecommendation,
      monitoringRecommendation,
      referralRecommendation
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Antipsychotic Medication Assessment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium">Medical Diagnoses</span>
              <textarea
                name="diagnoses"
                value={formData.diagnoses}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Enter relevant medical diagnoses..."
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Current Medications</span>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="List current medications..."
              />
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Clinical Assessment</h3>
            
            <div className="space-y-4">
              {[
                { id: 'isEndOfLife', label: 'Patient is receiving end-of-life care' },
                { id: 'hasTriedNonPharm', label: 'Non-pharmacological approaches have been attempted' },
                { id: 'hasSideEffects', label: 'Patient is experiencing antipsychotic side effects' },
                { id: 'hasmentalHealthTeam', label: 'Patient is followed by mental health team' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData[item.id as keyof typeof formData]}
                    onClick={() => handleToggleChange(item.id)}
                    className={`toggle-switch ${
                      formData[item.id as keyof typeof formData]
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`toggle-switch-slider ${
                        formData[item.id as keyof typeof formData]
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Behavioral Assessment</h3>
            
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">Behavior Stability</span>
                <select
                  name="behaviorStability"
                  value={formData.behaviorStability}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="1">Ongoing behaviors</option>
                  <option value="2">Stable for less than 3 months</option>
                  <option value="3">Stable for more than 3 months</option>
                </select>
              </label>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newBehavior}
                  onChange={(e) => setNewBehavior(e.target.value)}
                  placeholder="Enter observed behavior..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addBehavior}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {formData.behaviors.map(behavior => (
                  <div key={behavior.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-700">{behavior.description}</span>
                    <button
                      type="button"
                      onClick={() => removeBehavior(behavior.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate Assessment
          </button>
        </form>

        {assessment && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Assessment Results</h3>
            <div className="space-y-4">
              {[
                { label: 'Impression', value: assessment.impression },
                { label: 'Antipsychotic Recommendation', value: assessment.apRecommendation },
                { label: 'Non-Pharmacological Recommendation', value: assessment.nonpharmRecommendation },
                { label: 'Monitoring Recommendation', value: assessment.monitoringRecommendation },
                { label: 'Referral Recommendation', value: assessment.referralRecommendation }
              ].map((item, index) => (
                item.value && (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-700">{item.label}</h4>
                    <p className="text-gray-600 mt-1">{item.value}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};