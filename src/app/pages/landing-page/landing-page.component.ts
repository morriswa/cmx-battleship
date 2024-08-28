import { Component, WritableSignal, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-landing-page",
    standalone: true,
    templateUrl: "./landing-page.component.html",
    styleUrl: "./landing-page.component.scss",
    imports: [ReactiveFormsModule]
})


export class LandingPageComponent{
    //variables
    playerNameForm = new FormControl(); // new variable of type FormControl(), which will be used to save user input
    playerLoginMessage = signal(""); // create variable that saves a value that can be changed (thanks to the signal method!)
    numberOfShips:WritableSignal<number|undefined> = signal(undefined); // variable that will store the chosen number of battleships
    playerShipMessage = signal("");

    //methods
    onSubmit() { // method that is called when the submit button (in landing-page.component.html) is clicked or enter key is pressed
        // 'this.' is like 'self.' in python, it just references the variables in itself

        console.log(`Logged in as ${this.playerNameForm.value}`); //puts playerName into console using console.log(), and prints the statement in quotes. $ is used to refer to a variable 
        this.playerLoginMessage.set(`Welcome, ${this.playerNameForm.value}`); // .set will set playerLoginMessage to whatever is input when the button is clicked
        this.playerNameForm.reset(); // reset is a method that will get rid of the input text after submitting it
    }

    shipSelector(selection:number) {

        this.numberOfShips.set(selection);
        console.log(`Picked ${this.numberOfShips()}`);
        if (selection===1) {
            this.playerShipMessage.set(`You chose 1 ship`);
        }
        else {
            this.playerShipMessage.set(`You chose ${selection} ships`);
        }
    }
}