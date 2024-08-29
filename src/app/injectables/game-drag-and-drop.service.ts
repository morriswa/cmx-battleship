import {computed, EventEmitter, Injectable, Signal, signal, WritableSignal} from "@angular/core";


export type SimplePosition = {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
}

@Injectable()
export class GameDragAndDropService {

  private _blockedLocations: WritableSignal<Map<number, SimplePosition>> = signal(new Map());
  private _tileLocations: WritableSignal<Map<string, SimplePosition>> = signal(new Map());
  // locationUpdated = new EventEmitter();

  getIsTileCovered(tileId: string): boolean {
    const xOffset = 20;
    const yOffset = 20;
    const tileLocation = this._tileLocations().get(tileId)!;
    for (const ship of this._blockedLocations().values()) {
      if (ship.xStart + xOffset - tileLocation.xStart > 0
        && ship.xEnd + xOffset - tileLocation.xEnd < 0
        && (ship.yStart + yOffset) - tileLocation.yStart > 0
        && ship.yEnd + yOffset - tileLocation.yEnd < 0
      ||
        ship.xStart - xOffset - tileLocation.xStart < 0
        && ship.xEnd - xOffset - tileLocation.xEnd > 0
        && ship.yStart - yOffset - tileLocation.yStart < 0
        && ship.yEnd - yOffset - tileLocation.yEnd > 0
      ) {
        // console.log('decided ship', ship, 'belongs', tileLocation)
        return true;
      }
    }
    return false;
  }

  setBlockedLocations(ship: number, location: SimplePosition) {
    this._blockedLocations.update((val)=>{
      return val.set(ship, location)
    });

    // this.locationUpdated.emit(null);
  }

  get blockedLocations() {
    return this._blockedLocations();
  }

  setTileLocations(ship: string, location: SimplePosition) {
    this._tileLocations.update((val)=>{
      return val.set(ship, location)
    });
  }

  printoff() {
    for (const key of this._blockedLocations().keys()) {
      console.log(key, this._blockedLocations().get(key));
    }
  }
}
