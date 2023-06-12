import {getNewDeck, dealCard } from "./api.js"
// CONSTANTS //

const deckId = await getNewDeck();
const bet = 10

const messageEl = document.getElementById("message-el");

const playerContainer = document.getElementById("player-container");
const dealerContainer = document.getElementById("dealer-container");
const playerSumEl = document.getElementById("player-sum-el");
const dealerSumEl = document.getElementById("dealer-sum-el");

const h1El = document.getElementById("h1-el");
const newRoundBtn = document.getElementById("new-round-btn")
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn")

// determining card value
const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
"10", "JACK", "QUEEN", "KING", "ACE"]

// initializing board
disable(hitBtn)
disable(standBtn)
let playerCards = [];
let dealerCards = [];
let message = ""
let chips = 0
dealerSumEl.textContent = "Sum: ?";

// FUNCTIONS //

function compareSums() {
    let playerSum = getPlayerSum()
    let dealerSum = getDealerSum()

   //house rules
   if ((playerCards.length === 5 && playerSum === 21) && !(dealerSum === 21)) {
        message = "Blackjack! You win triple money!"
        chips += (bet + (bet*3))
        revealEarnings("win", (bet + (bet*3)))
    }

    else if (dealerCards.length === 5 && dealerSum === 21) {
        message = "Dealer has Blackjack... You lose triple money!"
        chips -= bet * 2
        revealEarnings("lose", bet * 3)
    }

    else if (playerCards.length === 5 && playerSum < 21) {
        message = "Full hand! You win double money!"
        chips += (bet + (bet*2))
        revealEarnings("win", (bet + (bet*2)))
    }

    else if (dealerCards.length === 5 && dealerSum < 21) {
        message = "Dealer has full hand... You lose double money!"
        chips -= bet * 1
        revealEarnings("lose", bet * 2)
    }

    //casino rules
    else if (playerSum === 21 && !(dealerSum === 21)) {
        message = "Blackjack! Double money!";
        h1El.classList.add("blackjack-text-effect");
        chips += (bet + (bet*2))
        revealEarnings("win", (bet + (bet*2)))
    }

    else if (!(playerSum === 21) && dealerSum === 21) {
        message = "Dealer has Blackjack...You lose double money!"
        chips -= bet * 1
        revealEarnings("lose", bet * 2)
    }

    else if (playerSum > 21 && dealerSum < 21) {
        message = "You lose..."
        // chips -= bet 
        revealEarnings("lose", bet)
    }
    
    else if (playerSum < 21 && dealerSum > 21) {
        message = "You win!"
        chips += (bet + (bet*1))
        revealEarnings("win", (bet + (bet*1)))
    }
    
    else if (playerSum < 21 && dealerSum < 21 && playerSum > dealerSum) {
        message = "You win!"
        chips += (bet + (bet*1))
        revealEarnings("win", (bet + (bet*1)))
    }
    
    else if (playerSum < 21 && dealerSum < 21 && playerSum < dealerSum) {
        message = "You lose..."
        // chips -= bet
        revealEarnings("lose", bet)
    }

    if (playerSum === dealerSum || (playerSum > 21 && dealerSum > 21)) { 
        message = "Draw!"
        chips += bet
        revealEarnings("draw", bet)
    }
    messageEl.textContent = message;
    document.getElementById("chips-display").textContent = `$${chips}`
}



function getPlayerSum() {
    let playerSum = 0
    for(let i =0; i<playerCards.length; i++) {
        let cardValueIndex = valueOptions.indexOf(playerCards[i].value)
        // check ACE - currently 11
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
    // when hand is calculated, check ACE again - turn into 1 if sum is over 21
    if (playerSum > 21 && hasAceInHand(playerCards)) {
        playerSum -= 10
    }
    return playerSum
}

function getDealerSum() {
    let dealerSum = 0
    for(let i =0; i<dealerCards.length; i++) {
        let cardValueIndex = valueOptions.indexOf(dealerCards[i].value)
        // check ACE - default 11
        if (cardValueIndex == 12 ) {
            dealerSum += 11
            
        // check JACK QUEEN KING
        } else if (cardValueIndex > 8 ) {
            dealerSum += 10

        // check 2 to 10
        } else {
            dealerSum += (cardValueIndex+2)
        }
    }
    // when hand is calculated, check ACE again - turn into 1 if sum is over 21
    if (dealerSum > 21 && hasAceInHand(dealerCards)) {
        dealerSum -= 10
    }
    return dealerSum
}


async function newRound() {
    await resetBoardforNewRound()
    playerCards.push(await dealCard(deckId))
    dealerCards.push(await dealCard(deckId))
    playerCards.push(await dealCard(deckId))
    dealerCards.push(await dealCard(deckId))
    renderPlayerCards()
    renderDealerCards()
    getPlayerSum()
    getDealerSum()
    chips -= bet
    document.getElementById("chips-display").textContent = `$${chips}`

    //If player goes over 21 to finish the game and open the dealers cards
    const playerSum = getPlayerSum()
    if (playerSum >= 21) {
        stand()
    } 
}

async function hit() {
    if(playerCards.length < 5) {
        playerCards.push(await dealCard(deckId))
    } 
    renderPlayerCards()
    //If player goes over 21 to finish the game and open the dealers cards
    const playerSum = getPlayerSum()
    if (playerSum >= 21) {
        stand()
    } 
}

async function stand() {
    let dealerSum = getDealerSum()
    //To hit the Dealer till he's over 17 or over
    while(dealerSum < 17) {
        dealerCards.push(await dealCard(deckId))
        dealerSum = getDealerSum()
    }
    if (dealerSum >= 17){
        compareSums()
    }

    if (chips <= 0) {
        gameOver()
    } else {
        dealerSumEl.textContent = "Sum: " + dealerSum
        revealDealerCards()
        enable(newRoundBtn)
        disable(hitBtn) 
        disable(standBtn)
    } 
}
 
//renders remaining cards and score 
function revealDealerCards() {
    renderDealerCards()
    dealerSumEl.style.visibility = "visible";
    const dealerCardSlots = Array.from(document.querySelectorAll(".dealer-card"))
    for (let element of dealerCardSlots) {
        element.classList.remove("hidden")
    };
    document.querySelector("div#dealer-container .card-slot:nth-child(2)").classList.remove("grey-bg")
    document.querySelector("div#dealer-container .card-slot:nth-child(2)").removeAttribute("data-after")
}

async function resetBoardforNewRound() {
    await getNewDeck()
    disable(newRoundBtn)
    enable(hitBtn)
    enable(standBtn)
    h1El.classList.remove("blackjack-text-effect");
    dealerSumEl.style.visibility = "hidden";
    message = "";
    for (let i = 0; i<playerCards.length; i++) {
        playerContainer.children[i].innerHTML = ""
    }
    
    for (let i = 0; i<dealerCards.length; i++) {
        dealerContainer.children[i].innerHTML = ""
    }
    playerCards = [];
    dealerCards = [];
}

function renderPlayerCards() {
    for (let i = 0; i<playerCards.length; i++) {
        playerContainer.children[i].innerHTML = `
    <img src=${playerCards[i].image} class="card" alt="A random playing card." crossorigin="anonymous">
        `
    }
    const playerSum = getPlayerSum()
    playerSumEl.textContent = "Sum: " + playerSum
    if (playerSum <= 20) {
        message = "Draw a card?";
    }
    messageEl.textContent = message
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


function revealEarnings(result, amount) {
    const betEl = document.getElementById("bet-el")
    betEl.style.opacity="1"
    
    if(result === "win") {
        betEl.classList.add("win-color")
        betEl.textContent = `+ $${amount}`
    } else if (result === "lose"){
        betEl.classList.add("lose-color")
        betEl.textContent = `- $${amount}`
    } else {
        betEl.classList.add("draw-color")
        betEl.textContent = `+ $${amount}`
    }
      setTimeout(() => {
        document.getElementById("bet-el").style.opacity="0"
        betEl.textContent = ""
        betEl.classList.remove("win-color", "lose-color", "draw-color")
      }, 3000)
}

function gameOver() {
    messageEl.textContent = "GAME OVER... NEW GAME?"
    disable(hitBtn)
    disable(standBtn)
    disable(newRoundBtn)
    setTimeout(() => {
        modal.style.display = "flex"
    }, 3000)

}

function disable(button) {
    button.disabled = true
    button.classList.add("disabled")
}

function enable(button) {
    button.disabled = false
    button.classList.remove("disabled")
}

function hasAceInHand(hand) {
    return hand.some(card => card.value === "ACE")
}

// function reloadGame() {
//     location.reload();
// }



// Event listeners //
newRoundBtn.addEventListener("click", newRound)
hitBtn.addEventListener("click", hit)
standBtn.addEventListener("click", stand)


//// MODAL ////
const modal = document.getElementById("modal")
const playerEl = document.getElementById("player-el");
const inputFields = document.getElementsByTagName("input")
const nameInput = document.getElementById("name-input")
const chipsInput = document.getElementById("chips-input")
const submitBtn = document.getElementById("submit-btn")
const kingImg = document.getElementById("king-img")
const bubbleText = document.getElementById("bubble-text")
const bubble = document.getElementById("bubble")
submitBtn.addEventListener("click", handleSubmit)

function handleSubmit(e) {
    e.preventDefault()
    // grab inputs    
    chips = Number(chipsInput.value)
    playerEl.textContent = nameInput.value

    for (let i = 0; i<inputFields.length; i++) {
        inputFields[i].classList.remove("alert-outline")
    }

    //validates
    if ( nameInput.value == null ||  nameInput.value == "") {
        bubble.style.opacity = "1"
        bubbleText.textContent = "YOUR NAME?"
        submitBtn.classList.add("alert-btn")
        nameInput.classList.add("alert-outline")
        kingImg.classList.add("alert-king")
        return false
    } else if (chipsInput.value == null || chipsInput.value == 0) {
        bubble.style.opacity = "1"
        bubbleText.textContent = "YOUR CHIPS?"
        submitBtn.classList.add("alert-btn")
        chipsInput.classList.add("alert-outline")
        kingImg.classList.add("alert-king")
        return false 
    } else {
        // prepares the game and reset the board
        document.getElementById("chips-display").textContent = `($${chips})`
        for (let i = 0; i<inputFields.length; i++) {
            inputFields[i].value = ""
        }
        modal.style.display = "none"
        enable(newRoundBtn)
        chipsInput.value = ""
        for (let i = 0; i<5; i++) {
            playerContainer.children[i].innerHTML = ""
            dealerContainer.children[i].innerHTML = ""
        }
        playerSumEl.textContent = "Sum: ?"
        dealerSumEl.textContent = "Sum: ?"
        messageEl.textContent = "Want to play a round?"
        document.querySelector("div#dealer-container .card-slot:nth-child(2)").classList.remove("grey-bg")
        document.querySelector("div#dealer-container .card-slot:nth-child(2)").removeAttribute("data-after")
        bubble.style.opacity = "0"
        bubbleText.textContent = ""
        submitBtn.classList.remove("alert-btn")
        nameInput.classList.remove("alert-outline")
        chipsInput.classList.remove("alert-outline")
        kingImg.classList.remove("alert-king")
    }
}
