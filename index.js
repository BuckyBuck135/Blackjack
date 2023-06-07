
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

        //disable "HIT" button at 5 cards -- currently not working as intended: doesnt render 5th card and score
        if(playerCards.length === 5) {
            disable(hitBtn)
            handlePlayerSum()
            renderPlayerCards()

            // return
        } else {
            handlePlayerSum()
            renderPlayerCards()
        }

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

        // // check ACE - currently = 11
        if (cardValueIndex == 12 ) {
                dealerSum += 11
            
        // check JACK QUEEN KING
        } else if (cardValueIndex > 8 ) {
            dealerSum += 10

        // check 2 to 10
        } else {
            dealerSum += (cardValueIndex+2)
        }

         dealerSumEl.textContent = "Sum: " + dealerSum;
        
        renderDealerCards()
    }) 
    .then(function() {
        if(dealerSum < 17) fetchCardsDealer()
        if (dealerSum > 21 && hasAceInHand(dealerCards)) {
            dealerSum -= 10
            dealerSumEl.textContent = "Sum: " + dealerSum
            fetchCardsDealer()
        }
    })
}




function getPlayerSum() {
    let playerSum = 0; 
    for(let i =0; i<playerCards.length; i++) {
        let cardValueIndex = valueOptions.indexOf(playerCards[i].value)
        // check ACE - currently 1
        if (cardValueIndex == 12 ) {
                playerSum += 11
            
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

    let playerSum = getPlayerSum()
    playerSumEl.textContent = "Sum: " + playerSum
    if (playerSum > 21 && hasAceInHand(playerCards)) {
        playerSum -= 10
        message = "Draw a card?";
        playerSumEl.textContent = "Sum: " + playerSum
    }

    if (playerCards.length === 5 && playerSum === 21) {
        message = "You win! Triple money!";
        revealDealerCards()
    }

    if (playerCards.length === 5 && playerSum <21) {
        message = "You win! Double money!";
        revealDealerCards()
    }

    if (playerSum === 21 && !(dealerSum === 21)) {
        message = "Blackjack! Double money!";
        h1El.classList.add("blackjack-text-effect");
        revealDealerCards() 
    } 

    if (playerSum > 21 && dealerSum < 21) {
        message = "You lose..."
        revealDealerCards() 
    }
    
    if (playerSum <= 20) {
        message = "Draw a card?";
    }
    
    messageEl.textContent = message;
}

function compareSums() {
    let playerSum = getPlayerSum()
    if (playerSum > 21 && hasAceInHand(playerCards)) {
        playerSum -= 10
        playerSumEl.textContent = "Sum: " + playerSum
    }

    if (dealerSum > 21 && hasAceInHand(dealerCards)) {
        dealerSum -= 10
        dealerSumEl.textContent = "Sum: " + dealerSum
    }

    else if (dealerCards.length === 5 && dealerSum === 21) {
        message = "Dealer has Blackjack...You lose triple money!"
    }

    else if (dealerCards.length === 5 && dealerSum < 21) {
        message = "You lose double money!"
    }

    else if (!(playerSum === 21) && dealerSum === 21) {
        message = "Dealer has Blackjack...You lose double money!"
    }

    else if (playerSum > 21 && dealerSum < 21) {
        message = "You lose..."
    }
    
    else if (playerSum < 21 && dealerSum > 21) {
        message = "You win!"
    }
    
    else if (playerSum < 21 && dealerSum < 21 && playerSum > dealerSum) {
        message = "You win!"
    }
    
    else if (playerSum < 21 && dealerSum < 21 && playerSum < dealerSum) {
        message = "You lose..."
    }

    
    else if (playerSum === dealerSum) { 
        message = "Draw!"
    }
    messageEl.textContent = message;
}

function renderPlayerCards() {
    for (let i = 0; i<playerCards.length; i++) {
        playerContainer.children[i].innerHTML = `
    <img src=${playerCards[i].image} class="card" alt="A random playing card." crossorigin="anonymous">
        `
    }
}

function renderDealerCards() {
    // reveals 1st card
    dealerContainer.children[0].innerHTML = 
    `
        <img src=${dealerCards[0].image} class="card dealer-card" alt="A random playing card." crossorigin="anonymous">
    `
    //hides remaining cards
    for (let i = 1; i<dealerCards.length; i++) {
        dealerContainer.children[i].innerHTML = 
        `
            <img src=${dealerCards[i].image} class="card dealer-card hidden" alt="A random playing card." crossorigin="anonymous">
        `
    }   
    document.querySelector("div#dealer-container .card-slot:nth-child(2)").classList.add("grey-bg")
    document.querySelector("div#dealer-container .card-slot:nth-child(2)").setAttribute("data-after", "?")
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
  
function revealDealerCards() {
    const dealerCardSlots = Array.from(document.querySelectorAll(".dealer-card"))
    for (let element of dealerCardSlots) {
        element.classList.remove("hidden")
    };
    dealerSumEl.style.visibility = "visible";
    document.querySelector("div#dealer-container .card-slot:nth-child(2)").classList.remove("grey-bg")
    document.querySelector("div#dealer-container .card-slot:nth-child(2)").removeAttribute("data-after")
    enable(newRoundBtn)
    disable(hitBtn) 
    disable(stayBtn)
}

function resetBoardforNewRound() {
    getNewDeck()
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


/// TESTS
function hasAceInHand(hand) {
    return hand.some(card => card.value === "ACE")
  }

