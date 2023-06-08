
// CONSTANTS //

let playerCards = [];
let dealerCards = [];

let hasBlackjack = false;
// let playerSum = 0;
// let dealerSum = 0;
let deckId = "";

const messageEl = document.getElementById("message-el");
let message = ""

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
const standBtn = document.getElementById("stand-btn")


// determine card value
const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
"10", "JACK", "QUEEN", "KING", "ACE"]

// initializing board
disable(hitBtn)
disable(standBtn)
dealerSumEl.style.visibility = "hidden";
getNewDeck()


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



function compareSums() {
    let playerSum = getPlayerSum()
    let dealerSum = getDealerSum()

   //house rules
   if ((playerCards.length === 5 && playerSum === 21) && !(dealerSum === 21)) {
    message = "Blackjack! You win triple money!"
}

    if ((playerCards.length === 5 && playerSum < 21) && playerSum > dealerSum) {
        message = "You win double money!"
    }

    if (dealerCards.length === 5 && dealerSum === 21) {
        message = "Dealer has Blackjack...You lose triple money!"
    }

    if (dealerCards.length === 5 && dealerSum < 21) {
        message = "You lose double money!"
    }

    //casino rules
    if (playerSum === 21 && !(dealerSum === 21)) {
        message = "Blackjack! Double money!";
        h1El.classList.add("blackjack-text-effect");
    }

    if (!(playerSum === 21) && dealerSum === 21) {
        message = "Dealer has Blackjack...You lose double money!"
    }

    if (playerSum > 21 && dealerSum < 21) {
        message = "You lose..."
    }
    
    if (playerSum < 21 && dealerSum > 21) {
        message = "You win!"
    }
    
    if (playerSum < 21 && dealerSum < 21 && playerSum > dealerSum) {
        message = "You win!"
    }
    
    if (playerSum < 21 && dealerSum < 21 && playerSum < dealerSum) {
        message = "You lose..."
    }

    if (playerSum === dealerSum || (playerSum > 21 && dealerSum > 21)) { 
        message = "Draw!"
    }
    messageEl.textContent = message;

 
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
    // console.log(dealerSum)
    return dealerSum
}


async function newRound() {
    await resetBoardforNewRound()
    // fetchCardsDealer()
    // drawCards(2)
    playerCards.push(await dealCard())
    dealerCards.push(await dealCard())
    playerCards.push(await dealCard())
    dealerCards.push(await dealCard())
    renderPlayerCards()
    renderDealerCards()
    getPlayerSum()
    getDealerSum()


}

async function hit() {
    if(playerCards.length < 5) {
        playerCards.push(await dealCard())
    } 
    renderPlayerCards()
    //If player goes over 21 to finish the game and open the dealers cards
    const playerSum = getPlayerSum()
    if (playerSum >= 21) {
        stand()
        compareSums()
    } 

}

async function stand() {
    let dealerSum = getDealerSum()
    //To hit the Dealer till he's over 17 or over
    while(dealerSum < 17) {
         dealerCards.push(await dealCard())
        dealerSum = getDealerSum()
    }
    if (dealerSum >= 17){
        compareSums()
    }
    dealerSumEl.textContent = "Sum: " + dealerSum
    revealDealerCards()
    enable(newRoundBtn)
    disable(hitBtn) 
    disable(standBtn)
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


async function getNewDeck() {
    try {
        let res = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        let data = await res.json()
        deckId = data.deck_id
    }
    catch(err) {
        console.log(err)
    }
}

async function dealCard() {
    try {
        let res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=1`)
        let data = await res.json()
        return data.cards[0]
    }
    catch(err) {
        console.log(err)
    }
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
