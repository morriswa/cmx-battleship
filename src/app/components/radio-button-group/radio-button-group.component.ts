import {Component, Input, OnInit, signal, WritableSignal} from "@angular/core";
import {NgClass} from "@angular/common";


export type RadioButtonOptions = {
  value: any;
  label: string;
}

export class RadioButtonFormControl {

  _value: WritableSignal<RadioButtonOptions | undefined> = signal(undefined)

  constructor(public options: RadioButtonOptions[]) { }

  get value(): any {
    return this._value()?.value;
  }

  get valid(): boolean {
    return !!this._value();
  };

  reset() {
    this._value.set(undefined);
  }
}

@Component({
  selector: "app-radio-button-group",
  templateUrl: "./radio-button-group.component.html",
  styleUrl: "./radio-button-group.component.scss",
  imports: [
    NgClass
  ],
  standalone: true
})
export class RadioButtonGroupComponent implements OnInit {
  @Input() public radioButtonFormControl!: RadioButtonFormControl;

  ngOnInit(): void {
    if (!this.radioButtonFormControl) throw new Error("radioButtonFormControl is required");
  }

  selectOption(button: RadioButtonOptions) {
    this.radioButtonFormControl._value.set(button);
  }
}
