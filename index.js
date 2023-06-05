
// CONSTANTS //

let playerCards = [];
let dealerCards = [];

let hasBlackjack = false;
let dealerSum = 0;
let message = "";
let deckId = "";

const messageEl = document.getElementById("message-el");

const playerEl = document.getElementById("player-el");

const playerContainer = document.getElementById("player-container");
const dealerContainer = document.getElementById("dealer-container");
const playerSumEl = document.getElementById("player-sum-el");
const dealerSumEl = document.getElementById("dealer-sum-el");

const h1El = document.getElementById("h1-el");
const splashDiv = document.querySelector(".splash");
const form = document.querySelector("form");
const main = document.querySelector("main");

const newRoundBtn = document.getElementById("new-round-btn")
const hitBtn = document.getElementById("hit-btn");
const stayBtn = document.getElementById("stay-btn")


// determine card value
const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
"10", "JACK", "QUEEN", "KING", "ACE"]

// initializing board
disable(hitBtn)
disable(stayBtn)
dealerSumEl.style.visibility = "hidden";


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
//     newRound()
//     })

    // newRound()
getNewDeck()

function getNewDeck() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
        })
}

// draws cards for Player
function drawCards(number) {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=${number}`)
        .then(res =>res.json())
        .then(data => {

        //push cards to array
        for (let i=0; i<data.cards.length; i++) {
            playerCards.push(data.cards[i])
        }

        //disable "HIT" button at 5 cards
        if(playerCards.length === 5) {
            disable(hitBtn)
        }
        handlePlayerSum()
        renderPlayerCards()
    })
}


function fetchCardsDealer() {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=1`)
    .then(res =>res.json())
    .then(data => {
            //push cards to array
            for (let i=0; i<data.cards.length; i++) {
                dealerCards.push(data.cards[i])
            }
                        
            let cardValueIndex = valueOptions.indexOf(data.cards[0].value)
            // check ACE - currently = 1
            if (cardValueIndex == 12 ) {
                    dealerSum += 1
                
            // check JACK QUEEN KING
            } else if (cardValueIndex > 8 ) {
                dealerSum += 10

            // check 2 to 10
            } else {
                dealerSum += (cardValueIndex+2)
            }

            setTimeout(() => {
                dealerSumEl.textContent = "Sum: " + dealerSum;
                }, 500)

            for (let i = 0; i<dealerCards.length; i++) {
                dealerContainer.children[i].innerHTML = 
                `
                    <img src=${dealerCards[i].image} class="card dealer-card hidden" alt="A random playing card." crossorigin="anonymous">
                `
            }   
    }) 
    .then(function() {
        if(dealerSum < 16) fetchCardsDealer()
    })
}

function getPlayerSum() {
    let playerSum = 0; 
    for(let i =0; i<playerCards.length; i++) {
        let cardValueIndex = valueOptions.indexOf(playerCards[i].value)
        // check ACE - currently = 1
        if (cardValueIndex == 12 ) {
                playerSum += 1
            
        // check JACK QUEEN KING
        } else if (cardValueIndex > 8 ) {
            playerSum += 10

        // check 2 to 10
        } else {
            playerSum += (cardValueIndex+2)
        }
    }
    return playerSum
}

function handlePlayerSum() {
    const playerSum = getPlayerSum()
    playerSumEl.textContent = "Sum: " + playerSum

    if (playerSum > 21) {
        message = "Bust..."
        revealDealerCards()
        enable(newRoundBtn)
        disable(hitBtn) 
        disable(stayBtn) 
    } else if (playerSum <= 20) {
        message = "Draw a card?";
    } else if (playerSum === 21) {
        message = "Blackjack! Double money!";
        h1El.classList.add("blackjack-text-effect");
        revealDealerCards()
        enable(newRoundBtn)
        disable(hitBtn) 
        disable(stayBtn) 
    } else if (playerCards.length == 5 && playerSum <21) {
        message = "You win! Double money!";
    } else if (playerCards.length == 5 && playerSum === 21) {
        message = "You win! Triple money!";
    }

    // handle length = 5 && playerSum < 21
    messageEl.textContent = message;

}

function renderPlayerCards() {
    for (let i = 0; i<playerCards.length; i++) {
        playerContainer.children[i].innerHTML = `
    <img src=${playerCards[i].image} class="card" alt="A random playing card." crossorigin="anonymous">
        `
    }
}

    
function newRound() {
    resetBoardforNewRound()
    drawCards(2)
    fetchCardsDealer()
}

function hit() {
    if(playerCards.length < 5) {
        drawCards(1)
    } 
}

function stay() {
    enable(newRoundBtn)
    disable(hitBtn) 
    disable(stayBtn) 
    compareSums()
    revealDealerCards()
}   


function compareSums() {
    const playerSum = getPlayerSum()
    if (playerSum > 21) {
        message = "Bust..."
    } else if (dealerSum > 21) {
        message = "You win!"
    } else if (playerSum > dealerSum) {
        message = "You win!"
    } else if (playerSum < dealerSum) {
        // isAlive === false
        message = "You lose..."
    } else if (dealerSum === 21) {
        message = "Dealer has Blackjack...You lose double money!"
    } else if (dealerCards.length === 5 && dealerSum < 21) {
        message = "Dealer has Blackjack...You lose double money!"
    } else if (dealerCards.length === 5 && dealerSum === 21) {
        message = "Dealer has Blackjack...You lose triple money!"
    } else {
        message = "Draw!"
    }
    messageEl.textContent = message;
}
   
function revealDealerCards() {
    const dealerCardSlots = Array.from(document.querySelectorAll(".dealer-card"))
    for (let element of dealerCardSlots) {
        element.classList.remove("hidden")
    };
    dealerSumEl.style.visibility = "visible";
}
function resetBoardforNewRound() {
    getNewDeck()

    isAlive = true;
    hasBlackjack = false;
    dealerSum = 0;
    message = "";
    disable(newRoundBtn)
    enable(hitBtn)
    enable(stayBtn)
    h1El.classList.remove("blackjack-text-effect");
    dealerSumEl.style.visibility = "hidden";

    for (let i = 0; i<playerCards.length; i++) {
        playerContainer.children[i].innerHTML = ""
    }
    
    for (let i = 0; i<dealerCards.length; i++) {
        dealerContainer.children[i].innerHTML = ""
    }
    playerCards = [];
    dealerCards = [];
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



/////////////////////
// Event listeners //
/////////////////////
newRoundBtn.addEventListener("click", newRound)
hitBtn.addEventListener("click", hit)
stayBtn.addEventListener("click", stay)
