import {EventEmitter, Injectable, signal, WritableSignal} from "@angular/core";


@Injectable()
export class GameDragAndDropService {

  private _blockedLocations: WritableSignal<Map<number, any>> = signal(new Map());
  locationUpdated = new EventEmitter();

  setBlockedLocations(ship: number, location: number) {
    this._blockedLocations.update((val)=>{
      return val.set(ship, location)
    });

    this.locationUpdated.emit(null);
  }

  get blockedLocations() {
    return this._blockedLocations();
  }

  printoff() {
    for (const key of this._blockedLocations().keys()) {
      console.log(key, this._blockedLocations().get(key));
    }
  }
}
