export interface IFontOptions {
  fontFamily: string;
  fontWeight: string;
  characterSet: string[];
  fontSize: number;
  buffer: number;
  sdf: boolean;
  cutoff: number;
  radius: number;
}
export interface IFontMappingOption {
  characterSet: string[];
  getFontWidth: (char: string, i: number) => number;
  fontHeight: number;
  buffer: number;
  maxCanvasWidth: number;
  mapping: IFontMapping;
  xOffset: number;
  yOffset: number;
}
export interface IFontMappingItem {
  x: number;
  y: number;
  width: number;
  height: number;
  advance: number;
}
export interface IFontMapping {
  [key: string]: IFontMappingItem;
  [key: number]: IFontMappingItem;
}
export interface IFontAtlas {
  xOffset: number;
  yOffset: number;
  mapping: IFontMapping;
  data: HTMLCanvasElement;
  width: number;
  height: number;
}
export interface IIconFontGlyph {
  name: string;
  unicode: string;
  [key: string]: any;
}
export interface IFontService {
  mapping: IFontMapping;
  fontAtlas: IFontAtlas;
  canvas: HTMLCanvasElement;
  scale: number;
  init(): void;
  addIconGlyphs(glyphs: IIconFontGlyph[]): void;
  getGlyph(name: string): string;
  setFontOptions(option: Partial<IFontOptions>): void;
  destroy(): void;
}
