import {inject, Injectable, signal, WritableSignal} from "@angular/core";
import {LobbyService} from "./lobby.service";
import {countOccurrences} from "../utils";
import {BehaviorSubject} from "rxjs";
import {GameBoard} from "../types/game.types";


type SimplePosition = {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
}

@Injectable()
export class ShipDragAndDropService {


  // service
  lobby = inject(LobbyService);


  // internal state
  private _blockedLocations: WritableSignal<Map<number, SimplePosition>> = signal(new Map());
  private _tileLocations: WritableSignal<Map<string, SimplePosition>> = signal(new Map());
  private _shipLocations: WritableSignal<Map<number, string[]>> = signal(new Map());
  private _reportShipError: WritableSignal<string|undefined> = signal(undefined);
  private _viewActive = signal(false);


  // public state
  event = new BehaviorSubject<{type: 'SUBMIT' | 'RESET' | 'READYUP'}>({type: "RESET"});


  // getters
  get active(): boolean {
    return this._viewActive();
  }

  get shipLocations() {
    const locationMap = this._shipLocations();
    return new GameBoard({
      'ship_1': locationMap.get(1),
      'ship_2': locationMap.get(2),
      'ship_3': locationMap.get(3),
      'ship_4': locationMap.get(4),
      'ship_5': locationMap.get(5)
    })
  }

  get error() {
    return this._reportShipError();
  }

  get coveredTiles(): Map<string, {covered: boolean, coveredByShip: number | undefined}> {
    return this._computeCoveredTiles();
  }

  get readyToPlay(): boolean {
    return !this.error && this.allShipsPlaced && this._viewActive()
  };

  get allShipsPlaced(): boolean {
    const count = Array.from(this._shipLocations().entries()).length;
    // console.log(`got count ${count}`)
    return count === Number(this.lobby.sessionInfo()?.num_ships);
  };

  get duplicatePlacement() {

    let ship = this._shipLocations();
    let allTilesOccupied: string[] = [];

    for (const occupiedTiles of ship.values())
      for (const tile of occupiedTiles)
        allTilesOccupied.push(tile);

    for (const occupiedTiles of ship.values())
      for (const tile of occupiedTiles)
        if (countOccurrences(allTilesOccupied, tile) > 1) return true

    return false
  }


  // control
  hideShips() {
    this._viewActive.set(false);
  }

  showShips() {
    this._viewActive.set(true);
  }

  enableTileFeedback() {
    this.event.next({type: "READYUP"});
  }

  disableTileFeedback() {
    this.event.next({type: 'RESET'});
  }

  submitCurrentSelection() {
    this.event.next({type: 'SUBMIT'});
  }

  resetError() {
    this._reportShipError.set(undefined);
  }

  resetShipLocations() {
    this._shipLocations.update(()=>new Map());
    this._blockedLocations.set(new Map());
    this.resetError();
  }

  showShipsAndEnableTileFeedback() {
    this.showShips();
    this.enableTileFeedback();
  }

  resetShipSelectorService() {
    this.hideShips();
    this.disableTileFeedback();
    this.resetShipLocations();
  }

  submitAndHideShips() {
    this.hideShips();
    this.submitCurrentSelection();
  }

  updateShipLocation(ship: number, location: SimplePosition) {
    this._blockedLocations.update((val)=>{
      return val.set(ship, location)
    });
    return this._getTileIdsCoveredByShip(ship);
  }

  setTileLocations(tileId: string, location: SimplePosition) {
    this._tileLocations.update((val)=>{
      return val.set(tileId, location)
    });
  }

  setShipStatus(shipLength: number, coveredIds: string[]) {
    this._shipLocations.update((val)=>val.set(shipLength, coveredIds));
  }

  raiseError(msg: string) {
    this._reportShipError.set(msg);
  }

  removeShip(shipLength: number) {
    this._shipLocations.update((val)=>{
      val.delete(shipLength)
      return val;
    });
  }


  // internal logic
  private _getTileIdsCoveredByShip(ship: number) {
    let tileIds = []
    for (const [tileId, val] of this._computeCoveredTiles().entries()) {
      if (val.coveredByShip === ship) {
        tileIds.push(tileId);
      }
    }
    return tileIds;
  }

  private _computeCoveredTiles(): Map<string, {covered: boolean, coveredByShip: number | undefined}> {
    const tileLocations = this._tileLocations();
    const blockedLocations = this._blockedLocations();

    const offset = -1;

    let mapCoveredTiles = new Map<string, { covered: boolean, coveredByShip: number | undefined }>()
    for (const [tileId, tileLocation] of tileLocations.entries()) {

      let covered = false;
      let coveredByShip: number | undefined = undefined;

      for (const [shipNum, ship] of blockedLocations.entries()) {

        const xTileCenter = (tileLocation.xEnd + tileLocation.xStart) / 2;
        const yTileCenter = (tileLocation.yEnd + tileLocation.yStart) / 2;

        if ((ship.yEnd + offset > yTileCenter && yTileCenter > ship.yStart - offset)
          &&  (ship.xEnd + offset > xTileCenter && xTileCenter > ship.xStart - offset)) {
          // console.log('decided ship', ship, 'belongs', tileLocation)
          covered = true;
          coveredByShip = shipNum;
          break;
        }
      }

      mapCoveredTiles.set(tileId, {
        covered: covered,
        coveredByShip: coveredByShip
      });
    }

    return mapCoveredTiles;
  }

}
