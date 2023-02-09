
// CONSTANTS //

let playerCards = [];
let dealerCards = [];

let hasBlackjack = false;
let sum = 0;
let message = "";
let deckId = "";

const messageEl = document.getElementById("message-el");

const playerEl = document.getElementById("player-el");

const playerCardsEl = document.getElementById("player-cards-el");
const playerSumEl = document.getElementById("player-sum-el");

const playerContainer = document.getElementById("player-container");
const dealerContainer = document.getElementById("dealer-container");
// const dealerCardsEl = document.getElementById("dealer-cards-el");
// const dealerSumEl = document.getElementById("dealer-sum-el");

const h1El = document.getElementById("h1-el");
const splashDiv = document.querySelector(".splash");
const form = document.querySelector("form");
const main = document.querySelector("main");

const startGameBtn = document.getElementById("start-game-btn");
const drawCardBtn = document.getElementById("draw-card-btn");
const compareSumsBtn = document.getElementById("compare-sums-btn")

//Hides the main container and the dealer container by default//
// main.style.display = 'none';
// dealerCardsEl.style.visibility = 'hidden';
// dealerSumEl.style.visibility = 'hidden';


// FUNCTIONS //

//Submit names on click //
// form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     splashDiv.style.display = 'none';
//     main.style.display = 'block';
//     let player = {
//         name: document.getElementById("name-input").value,
//         chips: document.getElementById("chips-input").value
//     };
//     playerEl.textContent = player.name + " ($" + player.chips + ")";
//     startGame()
//     })
getNewDeck()

    // startGame()

function getNewDeck() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
        })
}


function drawCards(number, element, cardsArray) {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=${number}`)
        .then(res =>res.json())
        .then(data => {

            //push cards to array
            for (let i=0; i<data.cards.length; i++) {
                cardsArray.push(data.cards[i])
            }
            
            // determine card value
            const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
            "10", "JACK", "QUEEN", "KING", "ACE"]
            const cardValueIndex = valueOptions.indexOf(data.cards[0].value)

            // check ACE - change of value NOT WORKING
            if (cardValueIndex == 12 ) {
                if (cardsArray.length == 0) {
                    console.log(11)
                } else {
                    console.log(1)
                }
            
            // check JACK QUEEN KING
            } else if (cardValueIndex > 8 ) {
                console.log(10)

            // check 2 to 10
            } else {
                console.log(cardValueIndex+2)
            }



            //disable "HIT" button at 5 cards
            if(cardsArray.length === 5) {
                disable(drawCardBtn)
            }

            //render
            for (let i = 0; i<cardsArray.length; i++) {
                element.children[i].innerHTML = `
            <img src=${cardsArray[i].image} class="card" alt="A random playing card.">
             `
            }



        })
}

    
    
    // if (randomCard === 1) {
    //     return 11;
    // } else if (randomCard > 10) {
    //     return 10;
    // } else return randomCard;


function startGame() {
    enable(drawCardBtn)
    // find a way to empty card array and element.children innerHTML
    
    drawCards(2, playerContainer, playerCards)
    drawCards(2, dealerContainer, dealerCards)


//     dealerCardsEl.style.visibility = 'hidden';
//     dealerSumEl.style.visibility = 'hidden';
//     isAlive = true;
//     hasBlackjack = false;
//     h1El.classList.remove("blackjack-text-effect");
//     if (isAlive === true && hasBlackjack === false) {
        // let playerFirstCard = fetchCard();
        // let playerSecondCard = fetchCard();
        // let dealerFirstCard = fetchCard();
        // let dealerSecondCard = fetchCard();
        // playerCards = [fetchCard(), fetchCard()];
//         playerSum = playerFirstCard + playerSecondCard;
        // dealerCards = [fetchCard(), fetchCard()];
//         dealerSum = dealerFirstCard + dealerSecondCard;
//         drawCardBtn.style.backgroundColor = '';
//         compareSumsBtn.style.background = '';
//         drawCardBtn.style.color = '';
//         compareSumsBtn.style.color = '';
//         renderGame();
}

// function renderGame() {
//     playerCardsEl.textContent = "Cards: ";
//     dealerCardsEl.textContent = "Cards: ";

//     //Logic for player//
//     if (playerSum <= 20) {
//         message = "Draw a card?";
//     } else if (playerSum === 21) {
//         message = "Blackjack!";
//         hasBlackjack = true;
//         greyOut();
//         dealerCardsEl.style.visibility = 'visible';
//         dealerSumEl.style.visibility = 'visible';
//     } else {
//         message = "Bust...";
//         isAlive = false;
//         greyOut();
//         dealerCardsEl.style.visibility = 'visible';
//         dealerSumEl.style.visibility = 'visible';
//     }
//     if (hasBlackjack===true) {
//         h1El.classList.add("blackjack-text-effect");
//     }
//     //Logic for dealer - draws until hard 16//
//     while (dealerSum <16) {
//         let newCard = getRandomCard();
//         dealerCards.push(newCard)
//         dealerSum += newCard;
//     }
    
//     playerSumEl.textContent = "Sum: " + playerSum;
//     dealerSumEl.textContent = "Sum: " + dealerSum;
//     for (let i = 0; i < playerCards.length; i++) {
//         playerCardsEl.textContent += playerCards[i] + " ";
//     }
//     for (let i = 0; i < dealerCards.length; i++) {
//         dealerCardsEl.textContent += dealerCards[i] + " ";
//     }
//     messageEl.textContent = message;
// }

function drawCard() {
    if(playerCards.length < 5) {
        drawCards(1, playerContainer, playerCards)
    } 
// console.log(playerCards)
    // drawCards(1, playerContainer)
    // if (isAlive === true && hasBlackjack === false) {
    //     let newCard = getRandomCard();
    //     playerCards.push(newCard);
    //     playerSum += newCard;
    //     renderGame()
    // }
}

// function compareSums() {
//     dealerCardsEl.style.visibility = 'visible';
//     dealerSumEl.style.visibility = 'visible';
//     if (playerSum > 21) {
//         message = "Bust..."
//     } else if (dealerSum > 21) {
//         message = "You win!"
//     } else if (playerSum > dealerSum) {
//         message = "You win!"
//     } else if (playerSum < dealerSum) {
//         isAlive === false
//         message = "You lose..."
//     } else if (dealerSum === 21) {
//         isAlive === false
//         message = "Dealer has Blackjack...You lose..."
//     } else {
//         message = "Draw!"
//     }
//     greyOut();
//     messageEl.textContent = message;
// }

function greyOut() {
        drawCardBtn.style.backgroundColor = "grey";
        compareSumsBtn.style.backgroundColor = "grey"
        drawCardBtn.style.color = "darkgrey";
        compareSumsBtn.style.color = "darkgrey";
}

function disable(button) {
    button.disabled = true
    button.classList.add("disabled")
}

function enable(button) {
    button.disabled = false
    button.classList.remove("disabled")
}
// function reloadGame() {
//     location.reload();
// }



//////////////////////////////////////
// Event listener versions of functions
document.getElementById("new-round-btn").addEventListener("click", startGame)

drawCardBtn.addEventListener("click", drawCard)
// drawCardBtn.addEventListener('click', function() {
//     if (isAlive === true && hasBlackjack === false) {
//         let card = getRandomCard();
//         cards.push(card);
//         sum += card;
//         renderGame();
//     }
// })