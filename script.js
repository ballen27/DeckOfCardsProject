const getDeckButton = document.getElementById('.getDeck-btn')
const drawCardsButton = document.getElementById('.drawCards-btn')

let correctOrder = ["ACE", '2', '3', '4', '5', '6', '7', '8', '9', '10', "JACK", "QUEEN", "KING"];
const sortCards = (values) => {
    values.sort((a, b) => correctOrder.indexOf(a) - correctOrder.indexOf(b))
}

const toggleButton = (id) =>{
    let x = document.getElementById(id);
    if(x.disabled === true){
        x.removeAttribute('disabled')
    }else {
        x.setAttribute('disabled', '')
    }
}

const toggleLoader = (command) => {
    let x = document.getElementById('loader');
    if(command === 'start'){
        x.style.display = 'flex'
    } else {
        x.style.display = 'none'
    }
}

const showDeckImg = () => {
    document.getElementById('deck-img').style.display = 'flex'
}

// add functionality to the addcards function to populate the image from each card. could be cool.
const addCards = function(card) {
    if(this.hasQueen === false){
        this.values.push(card.value)
        sortCards(this.values)
    }
    if(card.value === 'QUEEN'){
        console.log('QUEEN FOUND', this)
        this.hasQueen = true
    }
    document.getElementById(`${this.name}-arr`).innerHTML = JSON.stringify(this.values)
}

let spadesDeck = {
    hasQueen: false,
    name: "spades",
    values: [],
    addCards: addCards,
}
let clubsDeck = {
    hasQueen: false,
    name: "clubs",
    values: [],
    addCards: addCards
}
let heartsDeck = {
    hasQueen: false,
    name: "hearts",
    values: [],
    addCards: addCards
}
let diamondsDeck = {
    hasQueen: false,
    name: "diamonds",
    values: [],
    addCards: addCards
}

let deckId = null
let allQueensFound = spadesDeck.hasQueen && clubsDeck.hasQueen && heartsDeck.hasQueen && diamondsDeck.hasQueen

const fetchNewDeck = () => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(Response => {
        return Response.json()
    })
    .then(deck => {
        deckId = deck.deck_id
        console.log(deck)
        console.log(deckId)
        toggleButton('getDeck-btn')
        toggleButton('drawCards-btn')
        showDeckImg()
    })  
} 

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

const placeCards = (cards) => {
    for (let i = 0; i < cards.length; i++){
        if(cards[i].suit === 'SPADES'){
            spadesDeck.addCards(cards[i])
        } else if(cards[i].suit === 'CLUBS'){
            clubsDeck.addCards(cards[i]) 
        } else if(cards[i].suit === 'HEARTS'){
            heartsDeck.addCards(cards[i]) 
        } else if(cards[i].suit === 'DIAMONDS'){
            diamondsDeck.addCards(cards[i]) 
        }
    }
}