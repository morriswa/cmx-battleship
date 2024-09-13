import {Component, inject, OnInit, signal, WritableSignal} from "@angular/core";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  RadioButtonFormControl,
  RadioButtonGroupComponent
} from "../../components/radio-button-group/radio-button-group.component";
import {LobbyService} from "../../services/lobby.service";
import {Router} from "@angular/router";
import {AsyncPipe, NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {OnlineStats} from "../../types/lobby.types";

@Component({
    selector: "app-landing-page",
    standalone: true,
    templateUrl: "./landing-page.component.html",
    styleUrl: "./landing-page.component.scss",
  imports: [ReactiveFormsModule, RadioButtonGroupComponent, NgIf, NgClass, AsyncPipe, NgOptimizedImage]
})
export class LandingPageComponent implements OnInit{
    // services
    lobby = inject(LobbyService);
    router = inject(Router);
    stats: WritableSignal<OnlineStats | undefined> = signal(undefined);

    //variables
    playerNameForm = new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(32),
    ]); // new variable of type FormControl(), which will be used to save user input
    shipForm = new RadioButtonFormControl([
        {label: '1', value: 1},
        {label: '2', value: 2},
        {label: '3', value: 3},
        {label: '4', value: 4},
        {label: '5', value: 5},
    ]);

    ngOnInit(): void {
        this.lobby.gameStats().then(r=>this.stats.set(r))
    }

    //methods
    async onSubmit() { // method that is called when the submit button (in landing-page.component.html) is clicked or enter key is pressed
        // 'this.' is like 'self.' in python, it just references the variables in itself

        if (this.playerNameForm.valid && this.shipForm.valid) {
            await this.lobby.joinLobby({
                player_name: this.playerNameForm.value!,
                num_ships: String(this.shipForm.value),
            });
            this.playerNameForm.reset(); // reset is a method that will get rid of the input text after submitting it
            this.shipForm.reset();
            this.router.navigate(['/lobby'])
        }
    }

}
