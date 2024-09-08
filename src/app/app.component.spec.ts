import {ComponentFixture, TestBed} from "@angular/core/testing";
import {TestConfig} from "./test.config";
import {AppComponent} from "./app.component";

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(()=>{
    TestBed.configureTestingModule(TestConfig)

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create application', () => {
    expect(component).toBeDefined();
  });
})
