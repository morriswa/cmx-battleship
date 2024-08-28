import {Component, inject} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  RadioButtonFormControl,
  RadioButtonGroupComponent
} from "../../components/radio-button-group/radio-button-group.component";
import {UserSessionService} from "../../injectables/user-session.service";
import {Router} from "@angular/router";

@Component({
    selector: "app-landing-page",
    standalone: true,
    templateUrl: "./landing-page.component.html",
    styleUrl: "./landing-page.component.scss",
  imports: [ReactiveFormsModule, RadioButtonGroupComponent]
})
export class LandingPageComponent{
    // services
    userSS = inject(UserSessionService);
    router = inject(Router);

    //variables
    playerNameForm = new FormControl(); // new variable of type FormControl(), which will be used to save user input
    shipForm = new RadioButtonFormControl([
        {label: '1', value: 1},
        {label: '2', value: 2},
        {label: '3', value: 3},
        {label: '4', value: 4},
        {label: '5', value: 5},
    ]);

    //methods
    async onSubmit() { // method that is called when the submit button (in landing-page.component.html) is clicked or enter key is pressed
        // 'this.' is like 'self.' in python, it just references the variables in itself

        if (this.playerNameForm.valid && this.shipForm.valid) {
            await this.userSS.startSession({
                player_name: this.playerNameForm.value,
                num_ships: String(this.shipForm.value),
            });
            this.playerNameForm.reset(); // reset is a method that will get rid of the input text after submitting it
            this.shipForm.reset();
            this.router.navigate(['/play'])
        }
    }

}
