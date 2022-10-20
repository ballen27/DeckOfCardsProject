const getDeckButton = document.getElementById('.getDeck-btn')
const drawCardsButton = document.getElementById('.drawCards-btn')

//for sorting card values
let correctOrder = ["ACE", '2', '3', '4', '5', '6', '7', '8', '9', '10', "JACK", "QUEEN", "KING"];
const sortCards = values => {
    values.sort((a, b) => correctOrder.indexOf(a) - correctOrder.indexOf(b))
}

//show/hide buttons & images : not necesary for the original project requirements, added for ease of UI
const toggleButton = id => {
    let x = document.getElementById(id);
    if(x.disabled === true){
        x.removeAttribute('disabled')
    }else {
        x.setAttribute('disabled', '')
    }
}

const toggleLoader = command => {
    let x = document.getElementById('loader');
    if(command === 'start'){
        x.style.display = 'flex'
    } else {
        x.style.display = 'none'
    }
}

const showDeckImg = () => document.getElementById('deck-img').style.display = 'flex'

//fucntion for adding cards of a specific suit to the corresponding deck
const addCards = function(card) {
    if(this.hasQueen === false){
        this.values.push(card.value)
        sortCards(this.values)
    }
    if(card.value === 'QUEEN'){
        console.log('QUEEN FOUND', this)
        this.hasQueen = true
    }
    document.getElementById(`${this.suit}-arr`).innerHTML = JSON.stringify(this.values)
}

let spadesDeck = {
    hasQueen: false,
    suit: "spades",
    values: [],
    addCards: addCards,
}
let clubsDeck = {
    hasQueen: false,
    suit: "clubs",
    values: [],
    addCards: addCards
}
let heartsDeck = {
    hasQueen: false,
    suit: "hearts",
    values: [],
    addCards: addCards
}
let diamondsDeck = {
    hasQueen: false,
    suit: "diamonds",
    values: [],
    addCards: addCards
}

let deckId = null

//network request for getting a new deck using fetch
const fetchNewDeck = () => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(Response => {
        return Response.json()
    })
    .then(deck => {
        deckId = deck.deck_id
        console.log(deck)
        toggleButton('getDeck-btn')
        toggleButton('drawCards-btn')
        showDeckImg()
    })  
} 

//network request for drawing cards using async await so that it can fetch on a 1 second interval and clear the interval when complete
const drawCards = () => {
    toggleButton('drawCards-btn')
    toggleLoader('start')
    let intervalID = setInterval(async function getCards() {
        let res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        let draw = await res.json()
        placeCards(draw.cards)
        if (spadesDeck.hasQueen && clubsDeck.hasQueen && heartsDeck.hasQueen && diamondsDeck.hasQueen) {
            clearInterval(intervalID)
            toggleLoader('stop')
        }
    }, 1000);
}

//function for distributing cards to their respective decks to be sorted and added to the deck values arrays
const placeCards = cards => {
    cards.map( card => {
        if(card.suit === 'SPADES'){
            spadesDeck.addCards(card)
        } else if(card.suit === 'CLUBS'){
            clubsDeck.addCards(card) 
        } else if(card.suit === 'HEARTS'){
            heartsDeck.addCards(card) 
        } else if(card.suit === 'DIAMONDS'){
            diamondsDeck.addCards(card) 
        }
    })
}

/* Additional considerations: 
* - There isn't any error handling; this particular API worked easily every time but obviously I would want to catch errors if things were not returned correctly
* - Using vanilla javascript means creating some functions that would probably have been much easier with a framework like React.
* - Specifically with how I am populating the arrays of cards in each suit. I would have preferred to map over the array in JSX and dynamically create the elements based on state changes
* - There is no real state management. 
* - I don't normally commit console logs but I wanted to visualize the data in the UI but check it against the data coming from my network requests
* - No testing
*/