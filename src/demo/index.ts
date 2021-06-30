import GameOfLifeGL from '../lib'
import './styles.css'

const GRID_ROW = 16
const GRID_SIZE = GRID_ROW ** 2
const SIZE = 15

let GameOfLifeGLInstance

document.querySelector('body').innerHTML = `
    <main id="main"></main>
    <button id="button">next step</button>
    <button id="reset">reset</button>
    <button id="loop">loop</button>
    <button id="stop">Stop</button>
`

const main = document.querySelector('#main')
const nextStep = document.querySelector<HTMLButtonElement>('#button')
const resetButton = document.querySelector<HTMLButtonElement>('#reset')
const loopButton = document.querySelector<HTMLButtonElement>('#loop')
const stopButton = document.querySelector<HTMLButtonElement>('#stop')

stopButton.style.display = 'none'
loopButton.style.display = 'block'

let raf = 0
let divs = []

const reset = () => {
  stop()
  main.innerHTML = ''
  divs = []
  let line = -1

  GameOfLifeGLInstance = new GameOfLifeGL({
    bufferSize: GRID_SIZE,
    initialProbability: 0.5,
  })

  for (let i = 0; i < GRID_SIZE; i++) {
    const div = document.createElement('div')
    main.appendChild(div)

    if (i % GRID_ROW === 0) {
      line++
    }

    div.style.left = `${(i % GRID_ROW) * SIZE}px`
    div.style.top = `${line * SIZE}px`
    div.style.width = `${SIZE}px`
    div.style.height = `${SIZE}px`

    divs.push(div)
  }

  update()
}

const loop = () => {
  stopButton.style.display = 'block'
  loopButton.style.display = 'none'
  update()
  raf = requestAnimationFrame(loop)
}

const stop = () => {
  stopButton.style.display = 'none'
  loopButton.style.display = 'block'
  cancelAnimationFrame(raf)
  raf = 0
}

const update = () => {
  const grid = GameOfLifeGLInstance.update()
  divs.forEach((d, index) => {
    d.style.background = !!grid[index] ? 'red' : 'white'
  })
}

nextStep.addEventListener('click', update)
resetButton.addEventListener('click', reset)
loopButton.addEventListener('click', loop)
stopButton.addEventListener('click', stop)

reset()
