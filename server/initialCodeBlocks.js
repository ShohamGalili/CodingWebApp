const initialCodeBlocks = [
    {
        blockId: '1',  // מזהה מחרוזת פשוטה
        title: 'Async case',
        initialTemplate: `// Async Function Example:
    // Fetching data from an API using fetch with async/await.
    async function example() {
        /* solution here */
    }`,
        solution: `// Async Function Example:
    // Fetching data from an API using fetch with async/await.
    async function example() {
         try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }`,
        currentContent: `// Async Function Example:
    // Fetching data from an API using fetch with async/await.
    async function example() {
        /* solution here */
    }`,
    },
    {
        blockId: '2',  // Simple string identifier
        title: 'Promise Example',
        initialTemplate: `// Promise Example: Fetching data from an API using Promises

function fetchData() {
    /* solution here */
}

fetchData();`,
        solution: `// Promise Example: Fetching data from an API using Promises

function fetchData() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

fetchData();`,
        currentContent: `// Promise Example: Fetching data from an API using Promises

function fetchData() {
    /* solution here */
}

fetchData();`,

    },
    {
        blockId: '3',  // Simple string identifier
        title: 'Closures',
        initialTemplate: `// Closure Example: Creating a private counter using a closure

function createCounter() {
    let count = 0;  // Private variable
    return function() {
        /* solution here */
    };
}

const counter = createCounter();  // Create a new counter

counter();  // Output: Current count: 1
counter();  // Output: Current count: 2`,
        solution: `// Closure Example: Creating a private counter using a closure

function createCounter() {
    let count = 0;  // Private variable
    return function() {
        count++;
        console.log('Current count:', count);
    };
}

const counter = createCounter();  // Create a new counter

counter();  // Output: Current count: 1
counter();  // Output: Current count: 2`,
        currentContent: `// Closure Example: Creating a private counter using a closure

function createCounter() {
    let count = 0;  // Private variable
    return function() {
        /* solution here */
    };
}

const counter = createCounter();  // Create a new counter

counter();  // Output: Current count: 1
counter();  // Output: Current count: 2`,


    },
    {
        blockId: '4',  // Simple string identifier
        title: 'Event Loop',
        initialTemplate: `// Event Loop Example: Demonstrating event loop behavior with setTimeout

function demonstrateEventLoop() {
    console.log('Start');

    /* solution here */

    console.log('End');
}

demonstrateEventLoop();`,
        solution: `// Event Loop Example: Demonstrating event loop behavior with setTimeout

function demonstrateEventLoop() {
    console.log('Start');

    setTimeout(() => {
        console.log('This message is from the timeout callback');
    }, 0);

    console.log('End');
}

demonstrateEventLoop();`,
        currentContent: `// Event Loop Example: Demonstrating event loop behavior with setTimeout

function demonstrateEventLoop() {
    console.log('Start');

    /* solution here */

    console.log('End');
}

demonstrateEventLoop();`,

    },
];

module.exports = initialCodeBlocks;
