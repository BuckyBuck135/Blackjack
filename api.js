export async function getNewDeck() {
    try {
        let res = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        let data = await res.json()
        const deckId = data.deck_id
        return deckId
    }
    catch(err) {
        console.log(err)
    }
}

export async function dealCard(deckId) {
    try {
        let res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=1`)
        let data = await res.json()
        return data.cards[0]
    }
    catch(err) {
        console.log(err)
    }
}