import './style.css'
const game = document.querySelector('.game')
const headDOM = document.createElement('div')
const btn = document.querySelector('.start')
const apple = document.createElement('div')
const content = document.querySelector('.content')
const speed = document.querySelector('.speed')
apple.className = 'apple'
headDOM.className = 'head'
let stopTurning = false
let intervalID = null
let tail = []
let appleCoords = {}
let tailCoords = []
let head = {}
let direction = 'right'
const grid = coord => {
    if(coord >= 1 && coord < 50) return coord*10 + 'px'
    if(coord < 1) return '0px'
    if(coord >= 50) return '490px'
} 
function Update() {
    tailMove()
    switch(direction) {
        case 'right': {
            head.x += 1
            break
        }
        case 'left': {
            head.x -= 1
            break
        }
        case 'bottom': {
            head.y += 1
            break
        }
        case 'top': {
            head.y -= 1
            break
        }
        default: {
            head.x += 1
            break
        }
    }
    if(head.x < 0 || head.y < 0 || head.x >= 50 || head.y >= 50) gameOver()
    tailCoords.map(el=>{
        if(el.x == head.x && el.y == head.y) {clearInterval(intervalID); console.log('Game over');}
    })
    headDOM.style.top = grid(head.y)
    headDOM.style.left = grid(head.x)
    if(head.x == appleCoords.x && head.y == appleCoords.y) eatApple()
}

function eatApple() {
    let Xrandom = Math.round(Math.random()*50)
    let Yrandom = Math.round(Math.random()*50)
    appleCoords.x = Xrandom
    appleCoords.y = Yrandom
    apple.style.left = grid(appleCoords.x)
    apple.style.top = grid(appleCoords.y)
    tailCoords.push({x: tailCoords[tailCoords.length-1].x, y: tailCoords[tailCoords.length-1].y})
    let newTail = document.createElement('div')
    newTail.className = 'tail'
    game.append(newTail)
    tail.push(newTail)
}

function tailMove() {
    tailCoords.reverse()
    tailCoords.map((el, index) => {
        if(index == tailCoords.length-1) {el.x = head.x; el.y = head.y}
        else{
            el.x = tailCoords[index+1].x
            el.y = tailCoords[index+1].y
        }
    }) 
    tailCoords.reverse()
    tail.map((el, index) => {
        el.style.left = grid(tailCoords[index].x)
        el.style.top = grid(tailCoords[index].y)
    })
}

function gameOver() {
    let gameOverH1 = document.createElement('h1')
    gameOverH1.className = 'GameOver'
    gameOverH1.innerHTML = 'Game over!'
    content.append(gameOverH1)
    clearInterval(intervalID)
}

function changeDir(e) {
    if (stopTurning === false){
        switch(e.code){
            case 'KeyW': {
                if(direction != 'bottom') direction = 'top'
                break
            }
            case 'KeyS': {
                if(direction != 'top') direction = 'bottom'
                break
            }
            case 'KeyA': {
                if(direction != 'right') direction = 'left'
                break
            }
            case 'KeyD': {
                if(direction != 'left') direction = 'right'
                break
            }
        }
    }
    stopTurning = true
    setTimeout(()=>stopTurning=false, speed.value)
}

document.addEventListener('keydown', changeDir)
btn.onpointerdown = () => {
    let oldTails = Array.from(document.querySelectorAll('.tail'))
    oldTails.map(el=>el.remove())
    try {document.querySelector('.GameOver').remove()} catch {}
    game.append(headDOM)
    game.append(apple)
    head = {x: 10, y: 40}
    appleCoords = {x: 40, y: 5}
    apple.style.left = grid(appleCoords.x)
    apple.style.top = grid(appleCoords.y)
    tail = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div')
    ]
    tailCoords = [
        {x: head.x-1, y: head.y},
        {x: head.x-2, y: head.y},
        {x: head.x-3, y: head.y}
    ]
    tail.map((el, index)=>{
        el.className = 'tail'
        game.append(el)
        el.style.left = grid(tailCoords[index].x)
        el.style.top = grid(tailCoords[index].y)
    })
    clearInterval(intervalID)
    direction = 'right'
    intervalID = setInterval(Update, speed.value)
}