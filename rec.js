const imp1 = "Likely appropriate use of antipsychotics."
const imp2 = "Possibly appropriate use of antipsychotics."
const imp3 = "Possibly inappropriate use of antipsychotics."
const imp4 = "Likely inappropriate use of antipsychotics."
const imp0 = "Not on any antipsychotic."

const aprec1 = "Continue current antipsychotics."
const aprec2 = "Continue current antipsychotic and reassess in 3 months."
const aprec3 = "Trial taper of current antipsychotics using Gradual Dose Reduction (GDR)."
const aprec4 = "Recommend discontinuation of antipsychotics."  
const aprec5 = "Consider gradual taper of antipsychotics to minimize side effects."
const aprec0 = ""

const nonpharm1 = "Optimize non-pharmacological approaches for behaviors."
const nonpharm0 = ""

const mon1 = "Monitor for antipsychotic side effects."
const mon2 = "Monitor for recurrence of psychiatric symptoms or behaviors."
const mon0 = ""

const ref1 = "Recommend referral to Geriatric Psychiatry."
const ref2 = "Consider referral to Geriatric Psychiatry."
const ref3 = "Contact Mental Health Team about current concerns."
const ref4 = "No indication for referral to Geriatric Psychiatry at this time."
const ref5 = "Consider referral to Geriatric Psychiatry if behaviors persist."
const ref6 = "Has ongoing Mental Health Team follow-up. Contact them if concerns arise."
const ref7 = "Consider referral to Geriatric Psychiatry if considering tapering antipsychotics."
const ref0 = ""

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

var impression = ""
var apRecommendation = ""
var nonpharmRecommendation = ""
var monitoringRecommendation = ""
var referralRecommendation = ""

var isComplete = false
var binaryInput = "";

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => readline.question(query, ans => resolve(ans)));
};

// user input function
async function main() {
    


    // Give option to enter input a 14 digit binary code instead of answering questions
    
    const binaryInput = await askQuestion("Enter a 14 digit binary code if you have one (e.g., 1100000000000): ");
        if (binaryInput.length !== 14 || !/^[01]+$/.test(binaryInput)) {
            console.log("Invalid code. Please answer the following questions with 'y' for yes or 'n' for no.");
               // Prompt user for each variable
            isEndOfLife = (await askQuestion("Is End of Life? (y/n): ")).toLowerCase() === 'y';
            isPsychiatricDx = (await askQuestion("Is Psychiatric Diagnosis? (y/n): ")).toLowerCase() === 'y';
            isOtherDx = (await askQuestion("Is Other Diagnosis? (y/n): ")).toLowerCase() === 'y';
            isNeurocognitiveDx = (await askQuestion("Is Neurocognitive Diagnosis? (y/n): ")).toLowerCase() === 'y';
            isAnyAntipsychotic = (await askQuestion("Is Any Antipsychotic? (y/n): ")).toLowerCase() === 'y';
            isSpecialAntipsychotic = (await askQuestion("Is Special Antipsychotic? (y/n): ")).toLowerCase() === 'y';
            isBehaviorPresent = (await askQuestion("Is Behavior Present? (y/n): ")).toLowerCase() === 'y';
            isBehaviorAPResponsive = (await askQuestion("Is Behavior AP Responsive? (y/n): ")).toLowerCase() === 'y';
            isBehaviorOngoing= (await askQuestion("Is Behavior Ongoing? (y/n): ")).toLowerCase() === 'y';
            isBehaviorStableLess3Months = (await askQuestion("Is Behavior Stable for Less Than 3 Months? (y/n): ")).toLowerCase() === 'y';
            isBehaviorStableMore3Months = (await askQuestion("Is Behavior Stable for More Than 3 Months? (y/n): ")).toLowerCase() === 'y';
            
            readline.close();
        } else {
            isEndOfLife = binaryInput[0] === '1';
            isPsychiatricDx = binaryInput[1] === '1';
            isOtherDx = binaryInput[2] === '1';
            isNeurocognitiveDx = binaryInput[3] === '1';
            isAnyAntipsychotic = binaryInput[4] === '1';
            isSpecialAntipsychotic = binaryInput[5] === '1';
            isBehaviorPresent = binaryInput[6] === '1';
            isBehaviorAPResponsive = binaryInput[7] === '1';
            isBehaviorOngoing = binaryInput[8] === '1';
            isBehaviorStableLess3Months = binaryInput[9] === '1';
            isBehaviorStableMore3Months = binaryInput[10] === '1';
            isNonpharmTried = binaryInput[11] === '1';
            isSideEffect = binaryInput[12] === '1';
            isMHTInvolved = binaryInput[13] === '1';
        }
    logic(); // Call the logic function to process the input
    outputResults(); // Call the output function to display the results
    readline.close();
}

// logical function
function logic() {
    while (isComplete == false) {

        // no antipsychotic check
        if (isAnyAntipsychotic == false) {
                impression = imp0
                apRecommendation = aprec0
                isComplete = true
                break;
            }

        // end of life check
        if (isEndOfLife == true) {
            impression = imp1 + " End of Life."
            apRecommendation = aprec1
            referralRecommendation = ref0
            isComplete = true
            break;
        }

        // special antipsychotic check
        if (isSpecialAntipsychotic == true) {
            impression = imp1 + " On special antipsychotic."
            apRecommendation = aprec1

            // use of special antipsychotic not needing geriatric psychiatry referral
            if (isPsychiatricDx == true || isBehaviorPresent == false || isBehaviorStableLess3Months == true || isBehaviorStableMore3Months == true) {
                referralRecommendation = ref0
                isComplete = true
                break;
            }

            // use of special antipsychotic needing geriatric psychiatry referral
            if (isPsychiatricDx == false || isBehaviorOngoing == true) {
                referralRecommendation = ref1
                isComplete = true
                break;
            }

        }

        // psychiatric diagnosis check
        if (isPsychiatricDx == true && isNeurocognitiveDx == false) {
            impression = imp1 + " Has appropriate psychiatric diagnosis."
            apRecommendation = aprec1
            referralRecommendation = ref0
            isComplete = true
            break;
        }

        if (isPsychiatricDx == true && isNeurocognitiveDx == true) {
            impression = imp2 + " Has appropriate psychiatric diagnosis with neurocognitive disorder."
            apRecommendation = aprec1
            referralRecommendation = ref7
            isComplete = true
            break;
        }

        // other diagnosis check
        if (isOtherDx == true && isNeurocognitiveDx == false) {
            impression = imp1 + " Has appropriate other diagnosis."
            apRecommendation = aprec1
            referralRecommendation = ref0
            isComplete = true
            break;
        }

        // neurocognitive diagnosis check
        if (isNeurocognitiveDx == true) {

            // on antipsychotic
            if (isAnyAntipsychotic == true) {

                // behavior present check

                // no behavior present
                if (isBehaviorPresent == false) {
                    impression = imp4 + " No behavior present."
                    apRecommendation = aprec3
                    referralRecommendation = ref0
                    isComplete = true
                    break;
                }

                // behavior is present
                if (isBehaviorPresent == true) {

                    // behavior is present but not AP responsive
                    if (isBehaviorAPResponsive == false) {
                        impression = imp4 + " Behaviors best managed with non-pharmacological approaches. Antipsychotics mainly causing sedation."
                        apRecommendation = aprec3
                        referralRecommendation = ref5
                        isComplete = true
                        break;
                    }

                    // behavior is present and AP responsive
                    if (isBehaviorAPResponsive == true) {
                        impression = imp2 + " Behavior may be responsive to antipsychotics, but need to optimize non-pharmacological approaches."
                        referralRecommendation = ref4

                        // behavior present, AP responsive, but non-pharm approaches not tried
                        if (isNonpharmTried == false) {
                            impression = imp3 + " Behavior may be responsive to antipsychotics, but non-pharmacological approaches need to be tried first."
                            nonpharmRecommendation = nonpharm1
                        }

                        // behavior duration check

                        // behavior ongoing
                        if (isBehaviorOngoing == true) {
                            apRecommendation = aprec2
                            referralRecommendation = ref5
                            isComplete = true
                            break;
                        }

                        // behavior stable less than 3 months
                        if (isBehaviorStableLess3Months == true) {
                            apRecommendation = aprec2
                            isComplete = true
                            break;
                        }

                        // behavior stable more than 3 months
                        if (isBehaviorStableMore3Months == true) {
                            apRecommendation = aprec3
                            isComplete = true
                            break;
                        }


                    }
                }
            }

        }
        
    }

    //side effect recommendation
    if (apRecommendation == aprec1 && isSideEffect == true) {
        apRecommendation = aprec5
    }

    //nonpharmRecommendation
    if (isBehaviorPresent == false) {
        nonpharmRecommendation = nonpharm0
    } else {
        nonpharmRecommendation = nonpharm1
    }

    //monitoringRecommendation from apRecommendation
    if (apRecommendation == aprec1) {
        monitoringRecommendation = mon1

    } else if (apRecommendation == aprec0) {
        monitoringRecommendation = mon0

    } else {
        monitoringRecommendation = mon2
    }

    //MHT involvement recommendations
    if (isMHTInvolved == true) {
        if (referralRecommendation == ref1 || referralRecommendation == ref2) {
            referralRecommendation = ref3;
        } else {
            referralRecommendation = ref6;
        }
    }
}

// output function
function outputResults() {
    // Output the results of the logic only if not blank
    function printIfNotBlank(label, value) {
        if (value && value.trim() !== "") {
            console.log("> " + label + ": " + value);
        }
    }
    console.log("");
    console.log("== Recommendations ==");
    printIfNotBlank("Impression", impression);
    printIfNotBlank("Antipsychotic Recommendation", apRecommendation);
    printIfNotBlank("Non-Pharmacological Recommendation", nonpharmRecommendation);
    printIfNotBlank("Monitoring Recommendation", monitoringRecommendation);
    printIfNotBlank("Referral Recommendation", referralRecommendation);
    console.log("");


    // Output the summary of the input data only if true
    function printIfTrue(label, value) {
        if (value) {
            console.log("> " + label + ": " + value);
        }
    }
    console.log("== Summary ==");
    printIfTrue("End of Life", isEndOfLife);
    printIfTrue("Psychiatric Diagnosis", isPsychiatricDx);
    printIfTrue("Other Diagnosis", isOtherDx);
    printIfTrue("Neurocognitive Diagnosis", isNeurocognitiveDx);
    printIfTrue("Any Antipsychotic", isAnyAntipsychotic);
    printIfTrue("Special Antipsychotic", isSpecialAntipsychotic);
    printIfTrue("Behavior Present", isBehaviorPresent);
    printIfTrue("Behavior AP Responsive", isBehaviorAPResponsive);
    printIfTrue("Behavior Ongoing", isBehaviorOngoing);
    printIfTrue("Behavior Stable Less Than 3 Months", isBehaviorStableLess3Months);
    printIfTrue("Behavior Stable More Than 3 Months", isBehaviorStableMore3Months);
    printIfTrue("Non-Pharmacological Approaches Tried", isNonpharmTried);
    printIfTrue("Side Effect", isSideEffect);
    printIfTrue("MHT Involved", isMHTInvolved);
    console.log("");

    // Output a binary summary of the input data that is a single line of text

    const binarySummary = [
        isEndOfLife ? "1" : "0",
        isPsychiatricDx ? "1" : "0",
        isOtherDx ? "1" : "0",
        isNeurocognitiveDx ? "1" : "0",
        isAnyAntipsychotic ? "1" : "0",
        isSpecialAntipsychotic ? "1" : "0",
        isBehaviorPresent ? "1" : "0",
        isBehaviorAPResponsive ? "1" : "0",
        isBehaviorOngoing ? "1" : "0",
        isBehaviorStableLess3Months ? "1" : "0",
        isBehaviorStableMore3Months ? "1" : "0",
        isNonpharmTried ? "1" : "0",
        isSideEffect ? "1" : "0",
        isMHTInvolved ? "1" : "0"
    ].join("");
    console.log("Input code: " + binarySummary);
    console.log("");
    console.log("== End of logic ==");

}

// Run the functions in order
main();

//test git