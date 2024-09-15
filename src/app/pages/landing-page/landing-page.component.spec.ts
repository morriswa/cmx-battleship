import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LandingPageComponent } from "./landing-page.component";
import { TestConfig } from "../../test.config";
import { LobbyService } from "../../services/lobby.service";
import { ApiClient } from "../../services/api-client.service";
import { SessionAuthenticationService } from "../../services/session-authentication.service";
import { NewUserSession, OnlineStats } from "../../types/lobby.types";
import anything = jasmine.anything; // Jasmine-specific utility for checking any argument

// Define a test suite for the LandingPageComponent
describe('LandingPageComponent', () => {

  let component: LandingPageComponent; // Component instance to be tested
  let fixture: ComponentFixture<LandingPageComponent>; // Test fixture for component

  // Before each test, set up the environment and dependencies
  beforeEach(() => {
    let baseConfig = TestConfig; // Base test configuration
    baseConfig.providers.push(
      // Add services that are used by the component
      LobbyService,  // Service for handling lobby interactions
      SessionAuthenticationService, // Service for session authentication

      // Provide a mock implementation of ApiClient service
      {
        provide: ApiClient,
        useValue: {
          // Mock implementation of getOnlineStats()
          getOnlineStats(): Promise<OnlineStats> {
            return Promise.resolve({ playerCount: 123 }); // Mock player count
          },
          // Mock implementation of startUserSession()
          startUserSession(): Promise<NewUserSession | undefined> {
            return Promise.resolve({ session_id: "session-id", player_id: "123" }); // Mock session data
          },
          // Mock implementation of confirmValidSession()
          confirmValidSession(): Promise<boolean> {
            return Promise.resolve(true); // Always return true for valid session
          }
        }
      }
    );
    // Set up the TestBed with the component and dependencies
    TestBed.configureTestingModule(baseConfig);

    // Create the component and test fixture
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance; // Initialize the component instance
  });

  // Test case to ensure the component is created successfully
  it('should create landing page', () => {
    expect(component).toBeDefined(); // Check that the component is defined
  });

  // Test case to check that game stats are retrieved
  it('should retrieve game stats', async () => {

    // Spy on the 'gameStats' method of the lobby service
    const gameStats = spyOn(component.lobby, 'gameStats').and.callThrough();

    component.ngOnInit(); // Trigger ngOnInit to fetch game stats

    await fixture.whenStable(); // Wait for asynchronous tasks to complete

    expect(gameStats).toHaveBeenCalledWith(); // Check that gameStats method was called

    expect(component.stats()).toBeDefined(); // Ensure the stats are defined
    expect(component.stats()).toEqual({ playerCount: 123 }); // Check that stats match the mock data
  });

  // Test case to check starting a user session when the form is valid
  it('should start session on valid form submit', async () => {

    // Spy on the 'joinLobby' method of the lobby service
    const joinLobby = spyOn(component.lobby, 'joinLobby').and.callThrough();
    const resetPlayerNameForm = spyOn(component.playerNameForm, 'reset').and.callThrough(); // Spy on the form reset
    const resetShipForm = spyOn(component.shipForm, 'reset').and.callThrough(); // Spy on the ship form reset
    const routerNavigate = spyOn(component.router, 'navigate').and.callThrough(); // Spy on router navigation

    // Set up valid form data for the test
    component.playerNameForm.setValue('test');
    component.shipForm._value.set({ value: '1', label: '1' });

    // Check that both forms are valid
    expect(component.playerNameForm.valid).toBeTrue();
    expect(component.shipForm.valid).toBeTrue();

    // Call the onSubmit method to simulate form submission
    await component.onSubmit();

    // Ensure all the relevant methods were called after submission
    expect(joinLobby).toHaveBeenCalledWith(anything()); // joinLobby should be called
    expect(resetPlayerNameForm).toHaveBeenCalledWith(); // Player name form should be reset
    expect(resetShipForm).toHaveBeenCalledWith(); // Ship form should be reset
    expect(routerNavigate).toHaveBeenCalledWith(anything()); // Router should navigate to the correct page
  });

  // Test case to check that session doesn't start when ship number is missing
  it('should not start session on submit missing ship number', async () => {

    // Same spies as the previous test
    const joinLobby = spyOn(component.lobby, 'joinLobby').and.callThrough();
    const resetPlayerNameForm = spyOn(component.playerNameForm, 'reset').and.callThrough();
    const resetShipForm = spyOn(component.shipForm, 'reset').and.callThrough();
    const routerNavigate = spyOn(component.router, 'navigate').and.callThrough();

    // Set valid player name but leave the ship form invalid
    component.playerNameForm.setValue('test');

    // Validate form states
    expect(component.playerNameForm.valid).toBeTrue(); // Player name form is valid
    expect(component.shipForm.valid).toBeFalse(); // Ship form is invalid

    // Call the onSubmit method to attempt form submission
    await component.onSubmit();

    // Ensure none of the key methods were called since the form is invalid
    expect(joinLobby).toHaveBeenCalledTimes(0); // joinLobby should not be called
    expect(resetPlayerNameForm).toHaveBeenCalledTimes(0); // Player name form should not reset
    expect(resetShipForm).toHaveBeenCalledTimes(0); // Ship form should not reset
    expect(routerNavigate).toHaveBeenCalledTimes(0); // Navigation should not occur
  });

  // Test case to check that session doesn't start when player name is missing
  it('should not start session on submit missing player name', async () => {

    const joinLobby = spyOn(component.lobby, 'joinLobby').and.callThrough();
    const resetPlayerNameForm = spyOn(component.playerNameForm, 'reset').and.callThrough();
    const resetShipForm = spyOn(component.shipForm, 'reset').and.callThrough();
    const routerNavigate = spyOn(component.router, 'navigate').and.callThrough();

    // Set valid ship form but leave the player name form invalid
    component.shipForm._value.set({ value: '1', label: '1' });

    // Validate form states
    expect(component.playerNameForm.valid).toBeFalse(); // Player name form is invalid
    expect(component.shipForm.valid).toBeTrue(); // Ship form is valid

    // Call the onSubmit method to attempt form submission
    await component.onSubmit();

    // Ensure none of the key methods were called since the player name is missing
    expect(joinLobby).toHaveBeenCalledTimes(0); // joinLobby should not be called
    expect(resetPlayerNameForm).toHaveBeenCalledTimes(0); // Player name form should not reset
    expect(resetShipForm).toHaveBeenCalledTimes(0); // Ship form should not reset
    expect(routerNavigate).toHaveBeenCalledTimes(0); // Navigation should not occur
  });

  // Test case to check that session doesn't start when the player name is too short
  it('should not start session on short player name', async () => {

    const joinLobby = spyOn(component.lobby, 'joinLobby').and.callThrough();
    const resetPlayerNameForm = spyOn(component.playerNameForm, 'reset').and.callThrough();
    const resetShipForm = spyOn(component.shipForm, 'reset').and.callThrough();
    const routerNavigate = spyOn(component.router, 'navigate').and.callThrough();

    // Set an invalid short player name but a valid ship form
    component.playerNameForm.setValue('tes'); // Short name
    component.shipForm._value.set({ value: '1', label: '1' });

    // Validate form states
    expect(component.playerNameForm.valid).toBeFalse(); // Player name form is invalid due to short name
    expect(component.shipForm.valid).toBeTrue(); // Ship form is valid

    // Call the onSubmit method to attempt form submission
    await component.onSubmit();

    // Ensure none of the key methods were called since the player name is invalid
    expect(joinLobby).toHaveBeenCalledTimes(0); // joinLobby should not be called
    expect(resetPlayerNameForm).toHaveBeenCalledTimes(0); // Player name form should not reset
    expect(resetShipForm).toHaveBeenCalledTimes(0); // Ship form should not reset
    expect(routerNavigate).toHaveBeenCalledTimes(0); // Navigation should not occur
  });
});
