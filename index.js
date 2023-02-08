
// CONSTANTS //

let cards = [];
let hasBlackjack = false;
let sum = 0;
let message = "";

const messageEl = document.getElementById("message-el");

const playerEl = document.getElementById("player-el");

const playerCardsEl = document.getElementById("player-cards-el");
const playerSumEl = document.getElementById("player-sum-el");

const dealerCardsEl = document.getElementById("dealer-cards-el");
const dealerSumEl = document.getElementById("dealer-sum-el");

const h1El = document.getElementById("h1-el");
const splashDiv = document.querySelector(".splash");
const form = document.querySelector("form");
const main = document.querySelector("main");

const startGameBtn = document.getElementById("start-game-btn");
const drawCardBtn = document.getElementById("draw-card-btn");
const compareSumsBtn = document.getElementById("compare-sums-btn")

//Hides the main container and the dealer container by default//
main.style.display = 'none';
dealerCardsEl.style.visibility = 'hidden';
dealerSumEl.style.visibility = 'hidden';


// Note: 
// style.display = 'none' / 'block' will remove the div and not take up the space
// style.visibility = 'hidden' / 'visible' will take up the space as the div is just hidden and not removed


// FUNCTIONS //

//Submit names on click //
form.addEventListener('submit', function(e) {
    e.preventDefault();
    splashDiv.style.display = 'none';
    main.style.display = 'block';
    let player = {
        name: document.getElementById("name-input").value,
        chips: document.getElementById("chips-input").value
    };
    playerEl.textContent = player.name + " ($" + player.chips + ")";
    startGame()
    })


function getRandomCard() {
    ////////Notes on Math function////////
    //Math.random => generates a number between 0.000 and 9.999
    //Math.random()*13 => generates a number between 0.000 and 12.999
    //Math.floor => removed decimals => between 0 and 12
    //+1 => shifts the number by 1 => between 1 and 13
    /////////////////////////
    let randomCard = Math.floor( Math.random()*13 ) + 1;
    if (randomCard === 1) {
        return 11;
    } else if (randomCard > 10) {
        return 10;
    } else return randomCard;
}   

function startGame() {
    dealerCardsEl.style.visibility = 'hidden';
    dealerSumEl.style.visibility = 'hidden';
    isAlive = true;
    hasBlackjack = false;
    h1El.classList.remove("blackjack-text-effect");
    if (isAlive === true && hasBlackjack === false) {
        let playerFirstCard = getRandomCard();
        let playerSecondCard = getRandomCard();
        let dealerFirstCard = getRandomCard();
        let dealerSecondCard = getRandomCard();
        playerCards = [playerFirstCard, playerSecondCard];
        playerSum = playerFirstCard + playerSecondCard;
        dealerCards = [dealerFirstCard, dealerSecondCard];
        dealerSum = dealerFirstCard + dealerSecondCard;
        drawCardBtn.style.backgroundColor = '';
        compareSumsBtn.style.background = '';
        drawCardBtn.style.color = '';
        compareSumsBtn.style.color = '';
        renderGame();
}
}

function renderGame() {
    playerCardsEl.textContent = "Cards: ";
    dealerCardsEl.textContent = "Cards: ";

    //Logic for player//
    if (playerSum <= 20) {
        message = "Draw a card?";
    } else if (playerSum === 21) {
        message = "Blackjack!";
        hasBlackjack = true;
        greyOut();
        // drawCardBtn.style.backgroundColor = "grey";
        // compareSumsBtn.style.backgroundColor = "grey"
        // drawCardBtn.style.color = "darkgrey";
        // compareSumsBtn.style.color = "darkgrey";
        dealerCardsEl.style.visibility = 'visible';
        dealerSumEl.style.visibility = 'visible';
    } else {
        message = "Bust...";
        isAlive = false;
        greyOut();
        // drawCardBtn.style.backgroundColor = "grey";
        // compareSumsBtn.style.backgroundColor = "grey"
        // drawCardBtn.style.color = "darkgrey";
        // compareSumsBtn.style.color = "darkgrey";
        dealerCardsEl.style.visibility = 'visible';
        dealerSumEl.style.visibility = 'visible';
    }
    if (hasBlackjack===true) {
        h1El.classList.add("blackjack-text-effect");
    }
    //Logic for dealer - draws until hard 16//
    while (dealerSum <16) {
        let newCard = getRandomCard();
        dealerCards.push(newCard)
        dealerSum += newCard;
    }
    
    playerSumEl.textContent = "Sum: " + playerSum;
    dealerSumEl.textContent = "Sum: " + dealerSum;
    for (let i = 0; i < playerCards.length; i++) {
        playerCardsEl.textContent += playerCards[i] + " ";
    }
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardsEl.textContent += dealerCards[i] + " ";
    }
    messageEl.textContent = message;
}

function drawCard() {
    if (isAlive === true && hasBlackjack === false) {
        let newCard = getRandomCard();
        playerCards.push(newCard);
        playerSum += newCard;
        renderGame()
    }
}

function compareSums() {
    dealerCardsEl.style.visibility = 'visible';
    dealerSumEl.style.visibility = 'visible';
    if (playerSum > 21) {
        message = "Bust..."
    } else if (dealerSum > 21) {
        message = "You win!"
    } else if (playerSum > dealerSum) {
        message = "You win!"
    } else if (playerSum < dealerSum) {
        isAlive === false
        message = "You lose..."
    } else if (dealerSum === 21) {
        isAlive === false
        message = "Dealer has Blackjack...You lose..."
    } else {
        message = "Draw!"
    }
    greyOut();
    messageEl.textContent = message;
}

function greyOut() {
    drawCardBtn.style.backgroundColor = "grey";
        compareSumsBtn.style.backgroundColor = "grey"
        drawCardBtn.style.color = "darkgrey";
        compareSumsBtn.style.color = "darkgrey";
}

function reloadGame() {
    location.reload();
}



//////////////////////////////////////
// Event listener versions of functions

// drawCardBtn.addEventListener('click', function() {
//     if (isAlive === true && hasBlackjack === false) {
//         let card = getRandomCard();
//         cards.push(card);
//         sum += card;
//         renderGame();
//     }
// })