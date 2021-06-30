  # Game of Life GPU
  Minimal library using WebGL GPGPU processing
 
## Usage

```ts

const cells = []
let line = -1

const GameOfLifeGLInstance = new GameOfLifeGL({
    bufferSize: GRID_SIZE // size of your grid,
    initialProbability: 0.5 // probability for cells to be initially filled,
});

for (let i = 0; i < GRID_SIZE; i++) {
    const cell = document.createElement("div");
    main.appendChild(cell);

    if (i % GRID_ROW === 0) {
        line++;
    }

    cell.style.left = `${(i % GRID_ROW) * SIZE}px`;
    cell.style.top = `${line * SIZE}px`;
    cell.style.width = `${SIZE}px`;
    cell.style.height = `${SIZE}px`;

    cells.push(cell);
}

const update = () => {
    // returns array of [1, 0] 
    const grid = GameOfLifeGLInstance.update()
    cells.forEach((cell, index) => {
        cell.style.background = !!grid[index] ? "red" : "white";
    });
}

update()
```

See demo [src/demo/index.ts](https://github.com/silviopaganini/game-of-life-gpu/blob/master/src/demo/index.ts)