document.addEventListener("DOMContentLoaded", () => {
    let balance = 0;
    let firstSpin = true;

    const depositBtn = document.getElementById('deposit-btn');
    const spinBtn = document.getElementById('spin-btn');
    const depositAmount = document.getElementById('deposit-amount');
    const betAmount = document.getElementById('bet-amount');
    const numLines = document.getElementById('num-lines');
    const balanceDisplay = document.getElementById('balance');
    const winningsDisplay = document.getElementById('winnings');
    const instructionsBtn = document.getElementById('instructions-btn');
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('close-btn');

    const SYMBOLS_COUNT = {
        A: 15,
        B: 18,
        C: 20,
        D: 30
    };

    const SYMBOLS_VALUES = {
        A: 30,
        B: 15,
        C: 5,
        D: 3
    };

    const SYMBOL_IMAGES = {
        A: 'images/A.png', // Ensure these paths are correct
        B: 'images/B.png',
        C: 'images/C.png',
        D: 'images/D.png'
    };

    const updateBalance = () => {
        balanceDisplay.textContent = balance.toFixed(2);
    };

    depositBtn.addEventListener('click', () => {
        const amount = parseFloat(depositAmount.value);
        if (isNaN(amount) || amount <= 0) {
            alert("Invalid Deposit: deposit amount must be a positive number.");
        } else {
            balance += amount;
            updateBalance();
        }
    });

    spinBtn.addEventListener('click', () => {
        const bet = parseFloat(betAmount.value);
        const lines = parseInt(numLines.value);

        if (isNaN(bet) || bet <= 0 || isNaN(lines) || lines <= 0 || lines > 3) {
            alert("Invalid Bet or Number of Lines.");
            return;
        }

        const maxBet = balance / lines;
        if (bet > maxBet) {
            alert("Invalid Bet: you do not have sufficient funds to make this bet.");
            return;
        }

        balance -= bet * lines;
        updateBalance();

        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);

        const winnings = getWinnings(rows, bet, lines);
        balance += winnings;
        winningsDisplay.textContent = winnings.toFixed(2);
        updateBalance();

        if (balance <= 0) {
            alert("You ran out of money!");
        }

        if (firstSpin) {
            showLineLabels();
            firstSpin = false;
        }
    });

    instructionsBtn.addEventListener('click', () => {
        popup.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    const spin = () => {
        const symbols = [];
        for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
            for (let i = 0; i < count; i++) {
                symbols.push(symbol);
            }
        }

        const reels = [];
        for (let i = 0; i < 3; i++) {
            reels.push([]);
            const reelSymbols = [...symbols];
            for (let j = 0; j < 3; j++) {
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
        for (let i = 0; i < 3; i++) {
            rows.push([]);
            for (let j = 0; j < 3; j++) {
                rows[i].push(reels[j][i]);
            }
        }
        return rows;
    };

    const printRows = (rows) => {
        const slotMachine = document.querySelector('.slot-machine');
        const rowElements = slotMachine.querySelectorAll('.row');

        rows.forEach((row, index) => {
            const rowDiv = rowElements[index];
            rowDiv.innerHTML = '';

            row.forEach(symbol => {
                const symbolDiv = document.createElement('div');
                symbolDiv.classList.add('symbol');
                const img = document.createElement('img');
                img.src = SYMBOL_IMAGES[symbol];
                symbolDiv.appendChild(img);
                rowDiv.appendChild(symbolDiv);
            });
        });
    };

    const showLineLabels = () => {
        const lineLabels = document.querySelectorAll('.line-label');
        lineLabels.forEach(label => {
            label.style.display = 'block';
        });
    };

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
                winnings += bet * SYMBOLS_VALUES[symbols[0]];
            }
        }
        return winnings;
    };
});
