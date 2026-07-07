declare module 'gsap-trial/SplitText' {
  export class SplitText {
    constructor(target: unknown, vars?: unknown);
    lines: HTMLElement[];
    words: HTMLElement[];
    chars: HTMLElement[];
    revert(): void;
  }
  export default SplitText;
}
