const PSYCHIATRIC_DIAGNOSES = [
    "schizophrenia",
    "schizoaffective",
    "delusion",
    "bipolar",
    "psychotic",
    "psychosis",
    "OCD",
    "obsessive",
    "compulsive",
    "hallucination",
]

const NEUROCOGNITIVE_DIAGNOSES = [
    "dementia",
    "alzheimers",
    "parkinsons",
    "lewy",
    "frontotemporal",
    "ftd",
    "ftld",
    "vascular",
    "ncd",
    "bpsd",
    "neurocognitive",
]

const OTHER_DIAGNOSES = [
    "huntington",
    "huntingtons"
]

const END_OF_LIFE_DIAGNOSES = [
    "palliative",
    "hospice",
    "terminal",
]
const REGULAR_ANTIPSYCHOTICS = [
    "haloperidol",
    "haldol",
    "risperidone",
    "risperdal",
    "olanzapine",
    "zyprexa",
    "quetiapine",
    "seroquel",
    "aripiprazole",
    "abilify",
    "loxapine",
    "methotrimeprazine",
]

const SPECIAL_ANTIPSYCHOTICS = [
    "clozapine",
    "clozaril",
    "amisulpride",
    "sulpiride",
    "asenapine",
    "saphris",
    "iloperidone",
    "fanapt",
    "lurasidone",
    "latuda",
    "paliperidone",
    "invega",
    "ziprasidone",
    "geodon",
    "cariprazine",
    "vraylar",
    "brexpiprazole",
    "rexulti",
    "cariprazine",
    "vraylar",
    "pimavanserin",
    "nuplazid",
    "flupentixol",
    "zuclopenthixol",
    "fluphenazine",
    "prochlorperazine",
    "perphenazine",
    "thiothixene",
    "trifluoperazine",
    "chlorpromazine",
    "Fluanxol",
    "Clopixol",
    "Stelazine",
    "zotepine",
    "depot",
    "long acting",
    "injectable",
    "lai",
]

const BEHAVIOR_RESPONSIVE = [
    "delirium",
    "delusions",
    "paranoia",
    "auditory_hallucinations",
    "visual_hallucinations",
    "resistance_to_care",
    "sexually_inappropriate_behavior",
    "physical_aggression",
    "verbal_aggression",
];

const BEHAVIOR_NON_RESPONSIVE = [
    "depression",
    "low_mood",
    "anxiety",
    "irritability",
    "crying",
    "apathy",
    "calling_out",
    "repetitive_activities",
    "hoarding",
    "incontinence",
    "inappropriate_undressing",
    "inappropriate_defecation",
    "inappropriate_urination",
    "wandering",
    "exit_seeking",
    "sundowning",
    "insomnia",
    "climbing_out",
    "spitting",
];

var isPsychiatricDx = false
var isNeurocognitiveDx = false
var isOtherDx = false
var isEndOfLife = false
var isMHTInvolved = false

var isSpecialAntipsychotic = false
var isAnyAntipsychotic = false

var isBehaviorPresent = false
var isBehaviorAPResponsive = false
var isBehaviorOngoing = false
var isBehaviorStableLess3Months = false
var isBehaviorStableMore3Months = false

var isNonpharmTried = false
var isSideEffect = false

// ask user to input a list of diagnoses in terminal using readline
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


async function categorize() {
    const diagnoses = await new Promise((resolve) => {
        rl.question("Enter a list of diagnoses (comma, space, or line separated): ", (input) => {
            // Split by comma, space, or line break, remove empty entries
            resolve(
                input
                    .split(/[\s,]+/)
                    .map(d => d.trim().toLowerCase())
                    .filter(Boolean)
            );
        });
    });
    //remove punctuation from diagnoses
    const cleanedDiagnoses = diagnoses.map(d => d.replace(/[.,!?;:']/g, ''));

    // categorize diagnoses, allowing for fuzzy matching
    cleanedDiagnoses.forEach(diagnosis => {
        if (PSYCHIATRIC_DIAGNOSES.some(d => d.includes(diagnosis))) {
            isPsychiatricDx = true;
        } else if (NEUROCOGNITIVE_DIAGNOSES.some(d => d.includes(diagnosis))) {
            isNeurocognitiveDx = true;
        } else if (OTHER_DIAGNOSES.some(d => d.includes(diagnosis))) {
            isOtherDx = true;
        } else if (END_OF_LIFE_DIAGNOSES.some(d => d.includes(diagnosis))) {
            isEndOfLife = true;
        }
    });

    // ask user to input list of medications in terminal
    const medications = await new Promise((resolve) => {
        rl.question("Enter a list of medications (comma, space, or line separated): ", (input) => {
            resolve(
                input
                    .split(/[\s,]+/)
                    .map(d => d.trim().toLowerCase())
                    .filter(Boolean)
            );
        });
    });

    // identify if medications inlude special antipsychotics or regular antipsychotics, then check if special antipsyhotic, if not then note that they are any antipsychotic
    medications.forEach(medication => {
        if (SPECIAL_ANTIPSYCHOTICS.some(m => m.includes(medication))) {
            isSpecialAntipsychotic = true;
        } else if (REGULAR_ANTIPSYCHOTICS.some(m => m.includes(medication))) {
            isAnyAntipsychotic = true;
        }
    });

    // ask uder to input behaviors in terminal
    const behaviors = await new Promise((resolve) => {
        rl.question("Enter a list of behaviors (comma, space, or line separated): ", (input) => {
            resolve(
                input
                    .split(/[\s,]+/)
                    .map(d => d.trim().toLowerCase())
                    .filter(Boolean)
            );
        });
    });

    // ask user to input if behaviors are 1) ongoing, 2) stable less than 3 months, or 3) stable more than 3 months, by given 3 options and then take in put as 1, 2, or 3
    const behaviorStability = await new Promise((resolve) => {
        rl.question("Enter the stability of behaviors (1: ongoing | 2: stable < 3 months | 3: stable > 3 months): ", (input) => {
            const value = parseInt(input);
            if ([1, 2, 3].includes(value)) {
                resolve(value);
            } else {
                console.log("Invalid input. Please enter 1, 2, or 3.");
                resolve(1); // default to ongoing
            }
        });
    });

    // set behavior stability variables based on input
    if (behaviorStability === 1) {
        isBehaviorOngoing = true;
        isBehaviorStableLess3Months = false;
        isBehaviorStableMore3Months = false;
    } else if (behaviorStability === 2) {
        isBehaviorOngoing = false;
        isBehaviorStableLess3Months = true;
        isBehaviorStableMore3Months = false;
    } else if (behaviorStability === 3) {
        isBehaviorOngoing = false;
        isBehaviorStableLess3Months = false;
        isBehaviorStableMore3Months = true;
    }

    // ask user if non-pharmacological treatment has been tried
    const nonpharmTried = await new Promise((resolve) => {
        rl.question("Has non-pharmacological treatment been tried? (yes/no): ", (input) => {
            resolve(input.trim().toLowerCase() === 'yes');
        });
    });
    isNonpharmTried = nonpharmTried;
    // ask user if side effects are present
    const sideEffectPresent = await new Promise((resolve) => {
        rl.question("Are there any side effects present? (yes/no): ", (input) => {
            resolve(input.trim().toLowerCase() === 'yes');
        });
    });
    isSideEffectPresent = sideEffectPresent;
    // ask user if MHT is involved
    const mhtInvolved = await new Promise((resolve) => {
        rl.question("Is the Mental Health Team (MHT) involved? (yes/no): ", (input) => {
            resolve(input.trim().toLowerCase() === 'yes');
        });
    });
    isMHTInvolved = mhtInvolved;
    
    // identify if behaviors are present, responsive to antipsychotics
    behaviors.forEach(behavior => {
        if (BEHAVIOR_RESPONSIVE.some(b => b.includes(behavior))) {
            isBehaviorPresent = true;
            isBehaviorAPResponsive = true;
        } else if (BEHAVIOR_NON_RESPONSIVE.some(b => b.includes(behavior))) {
            isBehaviorPresent = true;
            isBehaviorAPResponsive = false;
        }
    });

    printCategorizationResults();

}    


    // print values of each variable
function printCategorizationResults() {
    console.log("Psychiatric Diagnosis:", isPsychiatricDx);
    console.log("Neurocognitive Diagnosis:", isNeurocognitiveDx);
    console.log("Other Diagnosis:", isOtherDx);
    console.log("End of Life Diagnosis:", isEndOfLife);
    console.log("");
    
    console.log("Special Antipsychotic:", isSpecialAntipsychotic);
    console.log("Any Antipsychotic:", isAnyAntipsychotic);
    console.log("");
    console.log("Behavior Present:", isBehaviorPresent);
    console.log("Behavior AP Responsive:", isBehaviorAPResponsive);
    console.log("Behavior Ongoing:", isBehaviorOngoing);
    console.log("Behavior Stable Less than 3 Months:", isBehaviorStableLess3Months);
    console.log("Behavior Stable More than 3 Months:", isBehaviorStableMore3Months);
    console.log("");

    console.log("Non-pharmacological Treatment Tried:", isNonpharmTried);
    console.log("Side Effect Present:", isSideEffect);
    console.log("MHT Involved:", isMHTInvolved);
    console.log("");

    rl.close();
}
categorize();

