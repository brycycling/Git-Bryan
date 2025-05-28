// BC mental health act certificate app
// write javascript code to calculate expiry dates for the BC mental health act certificate based on the BC Mental Health Act guide
const { DateTime } = require('luxon');

class MHACertificate {
    constructor(admissionDate, form41Date) {
        this.admissionDate = MHACertificate.parseDate(admissionDate);
        this.form41Date = MHACertificate.parseDate(form41Date);
        this.certificates = [];
    }

    static parseDate(input) {
        // Accepts YYYY-MM-DDTHH:mm or YYYYMMMDD (e.g., 2024JAN31)
        if (/^\d{4}[A-Za-z]{3}\d{2}$/.test(input)) {
            // Convert to YYYY-MM-DD
            const year = input.slice(0, 4);
            const monthStr = input.slice(4, 7).toUpperCase();
            const day = input.slice(7, 9);
            const months = {
                JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
                JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
            };
            const month = months[monthStr] || '01';
            return DateTime.fromISO(`${year}-${month}-${day}`);
        }
        // Otherwise, try ISO
        return DateTime.fromISO(input);
    }

    calculateCertificates(numberOfForms = 5) {
        // Form 4.1 (Initial) - expires 48 hours from admission
        this.certificates.push({
            type: 'Initial',
            form: 'Form 4.1',
            start: this.form41Date,
            expiry: this.admissionDate.plus({ hours: 48 })
        });

        // Helper function to handle month end dates
        const getMonthEnd = (startDate) => {
            // Get the last day of the next month after startDate
            return startDate.endOf('month');
        };

        // Form 4.2 - expires at end of first month
        const form42End = getMonthEnd(this.admissionDate.plus({ months: 1 }));
        this.certificates.push({
            type: 'Second',
            form: 'Form 4.2',
            start: this.admissionDate,
            expiry: form42End
        });

        // Form 6 (one month)
        let startDate = form42End.plus({ days: 1 }); // Start next day
        let endDate = getMonthEnd(startDate);
        this.certificates.push({
            type: 'First Renewal',
            form: 'Form 6 (1 month)',
            start: startDate,
            expiry: endDate
        });

        // Form 6 (three months)
        startDate = endDate.plus({ days: 1 }); // Start next day
        endDate = startDate.plus({ months: 3 }).minus({ days: 1 });
        this.certificates.push({
            type: 'Second Renewal',
            form: 'Form 6 (3 months)',
            start: startDate,
            expiry: endDate
        });

        // Form 6 (six months) and subsequent renewals
        for (let i = 4; i < numberOfForms; i++) {
            startDate = endDate.plus({ days: 1 }); // Start next day
            endDate = startDate.plus({ months: 6 }).minus({ days: 1 });
            this.certificates.push({
                type: `Renewal ${i-1}`,
                form: 'Form 6 (6 months)',
                start: startDate,
                expiry: endDate
            });
        }
    }

    printCertificates() {
        console.log('\nMHA Certificate Timeline:');
        this.certificates.forEach(cert => {
            console.log(`\n${cert.type} (${cert.form})`);
            console.log(`Start: ${cert.start.toLocaleString(DateTime.DATETIME_FULL)}`);
            console.log(`Expiry: ${cert.expiry.toLocaleString(DateTime.DATETIME_FULL)}`);
        });
    }
}

const readline = require('readline');

function promptUser() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const promptForMore = (mha) => {
        rl.question('\nCalculate another 5 forms? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                mha.calculateCertificates(mha.certificates.length + 5);
                mha.printCertificates();
                promptForMore(mha);
            } else {
                rl.close();
            }
        });
    };

    rl.question('Enter admission date/time (YYYY-MM-DDTHH:mm): ', (admissionInput) => {
        rl.question('Enter Form 4.1 date/time (YYYY-MM-DDTHH:mm): ', (form41Input) => {
            const mha = new MHACertificate(admissionInput, form41Input);
            mha.calculateCertificates();
            mha.printCertificates();
            promptForMore(mha);
        });
    });
}

// Uncomment the following line to use terminal input:
promptUser();
// Example usage (comment out if using promptUser):
// const mha = new MHACertificate('2024-05-27T09:00');
// let lastExpiry = mha.addInitialCertificate();
// lastExpiry = mha.addRenewal(lastExpiry);  // First renewal
// lastExpiry = mha.addRenewal(lastExpiry);  // Second renewal
// lastExpiry = mha.addRenewal(lastExpiry);  // Third renewal
// mha.printCertificates();