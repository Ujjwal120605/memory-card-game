const symbols = ['🍎', '🍌', '🍇', '🍒', '🍓', '🍍', '🥝', '🍉']
const gameBoard = document.getElementById('game-board')
const movesText = document.getElementById('moves')
const timerText = document.getElementById('timer')
const winPopup = document.getElementById('win-popup')
const winSound = document.getElementById('win-sound')
const highscoreText = document.getElementById('highscore')

let cards = []
let flippedCards = []
let lockBoard = false
let moves = 0
let matches = 0
let timer = 0
let timerInterval = null

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function startTimer() {
  timer = 0
  timerInterval = setInterval(() => {
    timer++
    timerText.textContent = `Time: ${timer}s`
  }, 1000)
}

function resetBoard() {
  gameBoard.innerHTML = ''
  cards = []
  flippedCards = []
  lockBoard = false
  moves = 0
  matches = 0
  movesText.textContent = 'Moves: 0'
  timerText.textContent = 'Time: 0s'
  clearInterval(timerInterval)
  winPopup.classList.add('hidden')
}

function createBoard() {
  resetBoard()
  const doubled = shuffle([...symbols, ...symbols])
  doubled.forEach(symbol => {
    const card = document.createElement('div')
    card.classList.add('card')
    card.dataset.symbol = symbol

    const cardInner = document.createElement('div')
    cardInner.classList.add('card-inner')

    const front = document.createElement('div')
    front.classList.add('card-front')
    front.textContent = symbol

    const back = document.createElement('div')
    back.classList.add('card-back')

    cardInner.appendChild(front)
    cardInner.appendChild(back)
    card.appendChild(cardInner)
    gameBoard.appendChild(card)

    card.addEventListener('click', flipCard)
    cards.push(card)
  })
  startTimer()
  updateHighScore()
}

function flipCard() {
  if (lockBoard || this.classList.contains('flip')) return
  this.classList.add('flip')
  flippedCards.push(this)
  if (flippedCards.length === 2) {
    lockBoard = true
    moves++
    movesText.textContent = `Moves: ${moves}`
    checkMatch()
  }
}

function checkMatch() {
  const [first, second] = flippedCards
  if (first.dataset.symbol === second.dataset.symbol) {
    flippedCards = []
    lockBoard = false
    matches++
    if (matches === symbols.length) handleWin()
  } else {
    setTimeout(() => {
      first.classList.remove('flip')
      second.classList.remove('flip')
      flippedCards = []
      lockBoard = false
    }, 800)
  }
}

function handleWin() {
  clearInterval(timerInterval)
  winPopup.classList.remove('hidden')
  winSound.play()
  saveHighScore()
}

function saveHighScore() {
  const best = localStorage.getItem('memoryHighScore')
  if (!best || timer < parseInt(best)) {
    localStorage.setItem('memoryHighScore', timer)
    updateHighScore()
  }
}

function updateHighScore() {
  const best = localStorage.getItem('memoryHighScore')
  highscoreText.textContent = `Best: ${best ? best + 's' : '--'}`
}

createBoard()
