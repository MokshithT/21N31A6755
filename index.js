const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

// Initialize states
let windowPrevState = [];
let windowCurrState = [];

// Utility function to calculate average
function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

// Placeholder function to fetch numbers from a third-party API
async function fetchNumbers(type) {
    switch (type) {
        case 'p': // Prime numbers
            return [2, 3, 5, 7];
        case 'f': // Fibonacci numbers
            return [1, 1, 2, 3, 5];
        case 'e': // Even numbers
            return [2, 4, 6, 8, 10];
        case 'r': // Random numbers
            return Array.from({ length: 4 }, () => Math.floor(Math.random() * 100));
        default:
            return [];
    }
}
// API endpoint
app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    let numbers = [];

    // Fetch numbers based on type
    switch (numberid) {
        case 'p': // Prime numbers
        case 'f': // Fibonacci numbers
        case 'e': // Even numbers
        case 'r': // Random numbers
            numbers = await fetchNumbers(numberid);
            break;
        default:
            return res.status(400).send('Invalid number type');
    }

    // Filter out duplicates and merge with current state
    numbers = numbers.filter(num => !windowCurrState.includes(num));
    windowPrevState = [...windowCurrState];
    windowCurrState = [...windowCurrState, ...numbers];

    // Maintain window size
    if (windowCurrState.length > WINDOW_SIZE) {
        windowCurrState = windowCurrState.slice(-WINDOW_SIZE);
    }

    const avg = calculateAverage(windowCurrState);

    res.json({
        windowPrevState,
        windowCurrState,
        numbers,
        avg: avg.toFixed(2),
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
