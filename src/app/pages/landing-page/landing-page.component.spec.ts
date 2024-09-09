import {ComponentFixture, TestBed} from "@angular/core/testing";
import {LandingPageComponent} from "./landing-page.component";
import {TestConfig} from "../../test.config";
import {LobbyService} from "../../services/lobby.service";
import {ApiClient} from "../../services/api-client.service";
import {SessionAuthenticationService} from "../../services/session-authentication.service";
import {NewUserSession, OnlineStats} from "../../types/lobby.types";
import anything = jasmine.anything;


describe('LandingPageComponent', () => {

  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(()=>{
    let baseConfig = TestConfig;
    baseConfig.providers.push(
      LobbyService,
      SessionAuthenticationService,
      {
        provide: ApiClient,
        useValue: {
          getOnlineStats(): Promise<OnlineStats> {
            return Promise.resolve({playerCount: 123 });
          },
          startUserSession(): Promise<NewUserSession|undefined> {
            return Promise.resolve({ session_id: "session-id", player_id: "123" });
          },
          confirmValidSession(): Promise<boolean> {
            return Promise.resolve(true);
          }
        }
      }
    );
    TestBed.configureTestingModule(baseConfig)

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
  });

  it('should create landing page', () => {
    expect(component).toBeDefined();
  });

  it('should retrieve game stats', async () => {

    const gameStats = spyOn(component.lobby, 'gameStats').and.callThrough();

    component.ngOnInit()

    await fixture.whenStable();

    expect(gameStats).toHaveBeenCalledWith()

    expect(component.stats()).toBeDefined();
    expect(component.stats()).toEqual({playerCount: 123});
  });

  it('should start session on valid form submit', async () => {

    const joinLobby = spyOn(component.lobby, 'joinLobby').and.callThrough();
    const resetPlayerNameForm = spyOn(component.playerNameForm, 'reset').and.callThrough();
    const resetShipForm = spyOn(component.shipForm, 'reset').and.callThrough();
    const routerNavigate = spyOn(component.router, 'navigate').and.callThrough();

    component.playerNameForm.setValue('test')
    component.shipForm._value.set({value: '1', label: '1'})

    expect(component.playerNameForm.valid).toBeTrue();
    expect(component.shipForm.valid).toBeTrue();

    await component.onSubmit()

    expect(joinLobby).toHaveBeenCalledWith(anything())
    expect(resetPlayerNameForm).toHaveBeenCalledWith()
    expect(resetShipForm).toHaveBeenCalledWith()
    expect(routerNavigate).toHaveBeenCalledWith(anything())
  });

  it('should not start session on submit missing ship number', async () => {

    const joinLobby = spyOn(component.lobby, 'joinLobby').and.callThrough();
    const resetPlayerNameForm = spyOn(component.playerNameForm, 'reset').and.callThrough();
    const resetShipForm = spyOn(component.shipForm, 'reset').and.callThrough();
    const routerNavigate = spyOn(component.router, 'navigate').and.callThrough();

    component.playerNameForm.setValue('test')

    expect(component.playerNameForm.valid).toBeTrue();
    expect(component.shipForm.valid).toBeFalse();

    await component.onSubmit()

    expect(joinLobby).toHaveBeenCalledTimes(0)
    expect(resetPlayerNameForm).toHaveBeenCalledTimes(0)
    expect(resetShipForm).toHaveBeenCalledTimes(0)
    expect(routerNavigate).toHaveBeenCalledTimes(0)
  });

  it('should not start session on submit missing player name', async () => {

    const joinLobby = spyOn(component.lobby, 'joinLobby').and.callThrough();
    const resetPlayerNameForm = spyOn(component.playerNameForm, 'reset').and.callThrough();
    const resetShipForm = spyOn(component.shipForm, 'reset').and.callThrough();
    const routerNavigate = spyOn(component.router, 'navigate').and.callThrough();

    component.shipForm._value.set({value: '1', label: '1'})

    expect(component.playerNameForm.valid).toBeFalse();
    expect(component.shipForm.valid).toBeTrue();

    await component.onSubmit()

    expect(joinLobby).toHaveBeenCalledTimes(0)
    expect(resetPlayerNameForm).toHaveBeenCalledTimes(0)
    expect(resetShipForm).toHaveBeenCalledTimes(0)
    expect(routerNavigate).toHaveBeenCalledTimes(0)
  });

  it('should not start session on short player name', async () => {

    const joinLobby = spyOn(component.lobby, 'joinLobby').and.callThrough();
    const resetPlayerNameForm = spyOn(component.playerNameForm, 'reset').and.callThrough();
    const resetShipForm = spyOn(component.shipForm, 'reset').and.callThrough();
    const routerNavigate = spyOn(component.router, 'navigate').and.callThrough();

    component.playerNameForm.setValue('tes')
    component.shipForm._value.set({value: '1', label: '1'})

    expect(component.playerNameForm.valid).toBeFalse();
    expect(component.shipForm.valid).toBeTrue();

    await component.onSubmit()

    expect(joinLobby).toHaveBeenCalledTimes(0)
    expect(resetPlayerNameForm).toHaveBeenCalledTimes(0)
    expect(resetShipForm).toHaveBeenCalledTimes(0)
    expect(routerNavigate).toHaveBeenCalledTimes(0)
  });
})
