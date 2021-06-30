export default class GameOfLifeGL {
    private gl;
    private bufferSize;
    private updateShader;
    private state;
    private current;
    private pixels;
    private initialProbability;
    constructor({ bufferSize, initialProbability }: {
        bufferSize?: number;
        initialProbability?: number;
    });
    private init;
    update(): Uint8Array;
}
