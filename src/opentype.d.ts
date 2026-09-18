declare module 'opentype.js' {
  export interface RenderOptions {
    kerning?: boolean;
    letterSpacing?: number;
    tracking?: number;
    features?: Record<string, boolean>;
  }
  export interface Path {
    toPathData(decimals?: number): string;
  }
  export interface Glyph {
    getPath(x: number, y: number, fontSize: number, options?: RenderOptions, font?: Font): Path;
  }
  export interface Font {
    unitsPerEm: number;
    getPath(text: string, x: number, y: number, fontSize: number, options?: RenderOptions): Path;
    getAdvanceWidth(text: string, fontSize: number, options?: RenderOptions): number;
    forEachGlyph(
      text: string,
      x: number,
      y: number,
      fontSize: number,
      options: RenderOptions | undefined,
      callback: (glyph: Glyph, gX: number, gY: number, gFontSize: number) => void,
    ): number;
  }
  export function parse(buffer: ArrayBuffer): Font;
  const _default: { parse: typeof parse };
  export default _default;
}
