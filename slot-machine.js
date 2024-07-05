// STEPS IN THE GAME:
// 1. Deposit money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if user won
// 6. Give the user winnings or take their bet
// 7. Play again or end game

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 3,
    B: 6,
    C: 12,
    D: 30
}

const SYMBOLS_VALUES = {
    A: 10,
    B: 6,
    C: 3,
    D: 2
}

const deposit = () => {
    while (true){
        const amount = parseFloat(prompt("Enter the deposit amount: "));
        if (isNaN(amount) || amount <= 0) {
            console.log("Invalid Deposit: deposit amount must be a positive number. Try again.")
        } else {
            return amount;
        }
    }
};

const getNumLines = () => {
    while (true){
        const numLines = parseFloat(prompt("Enter the number of lines you want to bet on (1-"+ROWS+"): "));
        if (isNaN(numLines) || numLines <= 0 || numLines > 3) {
            console.log("Invalid Number: must be a number in the range 1-"+ROWS+". Try again.")
        } else {
            return numLines;
        }
    }
};

const getBet = (balance, lines) => {
    const maxBet = balance / lines;
    while (true){
        const bet = parseFloat(prompt("Enter your bet per line: "));
        if (isNaN(bet) || bet <= 0) {
            console.log("Invalid Bet: must be a positive number. Try again.")
        } else if (bet > maxBet) {
            console.log("Invalid Bet: you do not have sufficient funds to make this bet. Try again.");
        } else {
            return bet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([])
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j< COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length -1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            console.log("Won Line "+(row+1)+"!")
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();
    while (true) {
        console.log("Current Balance: $"+balance)
        const lines = getNumLines();
        const bet = getBet(balance, lines);
        balance -= bet*lines
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, lines)
        console.log("You won $"+winnings);
        balance += winnings;
        if (balance <= 0) {
            console.log("You ran out of money!");
            return;
        }
        while (true) {
            const playAgain = prompt("Do you want to play again (y/n)? ");
            if (playAgain == 'n') {
                console.log("Final Balance: $"+balance);
                return;
            } else if (playAgain == 'y') {
                break;
            }
        }
    }
}

game();