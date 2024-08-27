import {Directive, ElementRef, HostListener, inject, Input, Renderer2} from "@angular/core";

@Directive({
  selector: '[game-tile]',
  standalone: true
})
export class GameTileDirective {

  @Input('game-tile') tileId!: string;

  private tileHtml: ElementRef = inject(ElementRef);
  private htmlRenderer: Renderer2 = inject(Renderer2);

  @HostListener('mousedown')
  onClick() {
    console.log(`click detected ${this.tileId}`);
    
  }
}
