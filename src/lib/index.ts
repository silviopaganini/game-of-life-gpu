import createFBO from "gl-fbo";
import createShader from "gl-shader";
import ndarray from "ndarray";
import fill from "ndarray-fill";
import fillScreen from "a-big-triangle";

export default class GameOfLifeGL {
  private gl: WebGLRenderingContext | null = null;
  private bufferSize: number;
  private updateShader: any;
  private state: any[] = [];
  private current = 0;
  private pixels: Uint8Array | null = null;
  private initialProbability: number;

  constructor({ bufferSize = 1024, initialProbability = 0.7 }) {
    this.initialProbability = initialProbability;
    const canvas = document.createElement("canvas");
    this.gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
    this.bufferSize = bufferSize;

    this.init();
  }

  private init() {
    if (!this.gl) return;

    this.gl.disable(this.gl.DEPTH_TEST);

    this.updateShader = createShader(this.gl, {
      vertex: `
        attribute vec2 position; 
        varying vec2 uv; 
        void main() { 
            gl_Position = vec4(position,0.0,1.0); 
            uv = 0.5 * (position+1.0); 
        }
        `,
      fragment: `
          precision mediump float;
          uniform sampler2D buffer;
          uniform vec2 dims;
          varying vec2 uv;

          int getPix(float x, float y) {
              return int(texture2D(buffer, (uv + vec2(x, y)/dims)).r);
          }

          void main() {
            //count the "living" neighbour texels
            int sum = getPix(-1., -1.) +
                      getPix(-1.,  0.) +
                      getPix(-1.,  1.) +
                      getPix( 0., -1.) +
                      getPix( 0.,  1.) +
                      getPix( 1., -1.) +
                      getPix( 1.,  0.) +
                      getPix( 1.,  1.);

            if (sum == 3)
            {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
            else if (sum == 2)
            {
                float current = float(getPix(0., 0.));
                gl_FragColor = vec4(current, current, current, 1.0);
            }
            else
            {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
          }
        `,
    });

    this.state = [
      createFBO(this.gl, [this.bufferSize, this.bufferSize]),
      createFBO(this.gl, [this.bufferSize, this.bufferSize]),
    ];

    //Initialize this.state buffer
    const initial_conditions = ndarray(
      new Uint8Array(this.bufferSize * this.bufferSize * 4),
      [this.bufferSize, this.bufferSize, 4]
    );

    fill(initial_conditions, (_x: number, _y: number, c: number) => {
      if (c === 0) return Math.random() >= this.initialProbability ? 255 : 0;
      return 255;
    });

    this.state[0]?.color[0]?.setPixels(initial_conditions);
  }

  public update() {
    if (!this.gl) return;

    const prevState = this.state[this.current];
    const curState = this.state[(this.current ^= 1)];

    //Switch to this.state fbo
    curState.bind();

    //Run update shader
    this.updateShader.bind();
    this.updateShader.uniforms.buffer = prevState.color[0].bind();
    this.updateShader.uniforms.dims = prevState.shape;

    fillScreen(this.gl);

    this.pixels = new Uint8Array(this.bufferSize * this.bufferSize * 4);
    this.gl.readPixels(
      0,
      0,
      this.bufferSize,
      this.bufferSize,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.pixels
    );

    return this.pixels
      .filter((_a, i) => i === 0 || i % 4 === 0)
      .map((a) => (a === 255 ? 1 : 0));
  }
}
