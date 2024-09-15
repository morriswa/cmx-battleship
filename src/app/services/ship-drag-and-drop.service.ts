import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { LobbyService } from "./lobby.service"; // Service to manage lobby-related functionalities
import { countOccurrences } from "../utils"; // Utility function to count occurrences in an array
import { BehaviorSubject } from "rxjs"; // RxJS BehaviorSubject for event-based state management
import { GameBoard } from "../types/game.types"; // Type for the game board configuration

// Defines a simple position structure for ships on the board
type SimplePosition = {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
};

@Injectable() // Mark this class as injectable in Angular's dependency injection system
export class ShipDragAndDropService {

  // Inject lobby service to manage session and player info
  lobby = inject(LobbyService);

  // Internal state signals
  private _blockedLocations: WritableSignal<Map<number, SimplePosition>> = signal(new Map()); // Tracks blocked locations by ship
  private _tileLocations: WritableSignal<Map<string, SimplePosition>> = signal(new Map()); // Tracks tile locations on the board
  private _shipLocations: WritableSignal<Map<number, string[]>> = signal(new Map()); // Tracks locations of ships by their lengths
  private _reportShipError: WritableSignal<string | undefined> = signal(undefined); // Tracks any errors related to ship placement
  private _viewActive = signal(false); // Tracks if ship view is active

  // Public state using BehaviorSubject for event handling
  event = new BehaviorSubject<{ type: 'SUBMIT' | 'RESET' | 'READYUP' }>({ type: "RESET" });

  // Getters for state properties

  // Returns whether the ship view is active
  get active(): boolean {
    return this._viewActive();
  }

  // Returns the current ship locations formatted as a GameBoard object
  get shipLocations() {
    const locationMap = this._shipLocations();
    return new GameBoard({
      'ship_1': locationMap.get(1),
      'ship_2': locationMap.get(2),
      'ship_3': locationMap.get(3),
      'ship_4': locationMap.get(4),
      'ship_5': locationMap.get(5),
    });
  }

  // Returns the current ship placement error (if any)
  get error() {
    return this._reportShipError();
  }

  // Returns a map of covered tiles and which ship (if any) covers each tile
  get coveredTiles(): Map<string, { covered: boolean; coveredByShip: number | undefined }> {
    return this._computeCoveredTiles(); // Calculates which tiles are covered by ships
  }

  // Returns whether the player is ready to play (i.e., all ships placed without errors)
  get readyToPlay(): boolean {
    return !this.error && this.allShipsPlaced && this._viewActive(); // Checks if all ships are placed, no errors, and view is active
  }

  // Checks if all ships are placed based on the number of ships the player has
  get allShipsPlaced(): boolean {
    const count = Array.from(this._shipLocations().entries()).length;
    return count === Number(this.lobby.sessionInfo()?.num_ships); // Compares the number of placed ships with the required number
  }

  // Returns whether there is any duplicate ship placement (i.e., overlap)
  get duplicatePlacement() {
    let ship = this._shipLocations();
    let allTilesOccupied: string[] = [];

    for (const occupiedTiles of ship.values()) {
      for (const tile of occupiedTiles) {
        allTilesOccupied.push(tile); // Collect all occupied tiles
      }
    }

    for (const occupiedTiles of ship.values()) {
      for (const tile of occupiedTiles) {
        if (countOccurrences(allTilesOccupied, tile) > 1) return true; // Check for overlapping tiles
      }
    }

    return false; // No duplicates
  }

  // Control functions for managing ship and tile view

  // Hides ships from the view
  hideShips() {
    this._viewActive.set(false);
  }

  // Shows ships on the view
  showShips() {
    this._viewActive.set(true);
  }

  // Enables tile feedback for ship placement
  enableTileFeedback() {
    this.event.next({ type: "READYUP" });
  }

  // Disables tile feedback
  disableTileFeedback() {
    this.event.next({ type: 'RESET' });
  }

  // Submits the current ship selection
  submitCurrentSelection() {
    this.event.next({ type: 'SUBMIT' });
  }

  // Resets the ship placement error state
  resetError() {
    this._reportShipError.set(undefined);
  }

  // Resets all ship locations and error state
  resetShipLocations() {
    this._shipLocations.update(() => new Map()); // Clear all ship locations
    this._blockedLocations.set(new Map()); // Clear blocked locations
    this.resetError(); // Clear any error
  }

  // Shows ships and enables tile feedback simultaneously
  showShipsAndEnableTileFeedback() {
    this.showShips();
    this.enableTileFeedback();
  }

  // Resets the entire ship selector service, clearing view, feedback, and ship locations
  resetShipSelectorService() {
    this.hideShips();
    this.disableTileFeedback();
    this.resetShipLocations();
  }

  // Submits the current selection and hides the ships
  submitAndHideShips() {
    this.hideShips();
    this.submitCurrentSelection();
  }

  // Updates the location of a specific ship and returns the tile IDs it covers
  updateShipLocation(ship: number, location: SimplePosition) {
    this._blockedLocations.update((val) => {
      return val.set(ship, location); // Update blocked locations with the ship's position
    });
    return this._getTileIdsCoveredByShip(ship); // Get the list of tile IDs covered by the ship
  }

  // Sets the location of a specific tile
  setTileLocations(tileId: string, location: SimplePosition) {
    this._tileLocations.update((val) => {
      return val.set(tileId, location); // Update the tile's position
    });
  }

  // Sets the status of a ship by length, associating it with covered tiles
  setShipStatus(shipLength: number, coveredIds: string[]) {
    this._shipLocations.update((val) => val.set(shipLength, coveredIds)); // Associate the ship with its covered tiles
  }

  // Raises an error related to ship placement
  raiseError(msg: string) {
    this._reportShipError.set(msg); // Set the error message
  }

  // Removes a ship from the list of placed ships
  removeShip(shipLength: number) {
    this._shipLocations.update((val) => {
      val.delete(shipLength); // Remove the ship from the map
      return val;
    });
  }

  // Internal logic for calculating covered tiles

  // Returns a list of tile IDs covered by a specific ship
  private _getTileIdsCoveredByShip(ship: number) {
    let tileIds = [];
    for (const [tileId, val] of this._computeCoveredTiles().entries()) {
      if (val.coveredByShip === ship) {
        tileIds.push(tileId); // Collect tile IDs covered by this ship
      }
    }
    return tileIds;
  }

  // Computes which tiles are covered by ships based on their positions
  private _computeCoveredTiles(): Map<string, { covered: boolean; coveredByShip: number | undefined }> {
    const tileLocations = this._tileLocations(); // Get the locations of all tiles
    const blockedLocations = this._blockedLocations(); // Get the blocked locations (occupied by ships)

    const offset = -1; // An offset to help calculate coverage

    let mapCoveredTiles = new Map<string, { covered: boolean; coveredByShip: number | undefined }>(); // Initialize the map for covered tiles

    for (const [tileId, tileLocation] of tileLocations.entries()) {
      let covered = false;
      let coveredByShip: number | undefined = undefined;

      // Iterate over the blocked (ship) locations to check if the tile is covered by a ship
      for (const [shipNum, ship] of blockedLocations.entries()) {
        const xTileCenter = (tileLocation.xEnd + tileLocation.xStart) / 2;
        const yTileCenter = (tileLocation.yEnd + tileLocation.yStart) / 2;

        // Check if the tile center is within the ship's bounds
        if ((ship.yEnd + offset > yTileCenter && yTileCenter > ship.yStart - offset)
          && (ship.xEnd + offset > xTileCenter && xTileCenter > ship.xStart - offset)) {
          covered = true;
          coveredByShip = shipNum; // Mark the tile as covered by this ship
          break;
        }
      }

      mapCoveredTiles.set(tileId, { covered: covered, coveredByShip: coveredByShip }); // Store the tile's coverage status
    }

    return mapCoveredTiles; // Return the map of covered tiles
  }
}
