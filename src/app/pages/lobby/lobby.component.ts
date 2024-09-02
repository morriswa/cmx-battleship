import {Component, OnInit, WritableSignal, inject, signal} from "@angular/core";
import { FormControl, ReactiveFormsModule} from "@angular/forms";
import { LobbyService } from "src/app/services/lobby.service";
import { sleep } from "src/app/utils";

@Component ({
    selector: "app-lobby",
    standalone: true,
    templateUrl: "./lobby.component.html",
    styleUrl: "./lobby.component.scss",
    imports: [ReactiveFormsModule]
})

export class LobbyComponent implements OnInit {

    // get only lobby service[]
    lobbyService = inject(LobbyService) // create variable, inject is used to access methods in lobby.service.ts
    availablePlayerCache: WritableSignal<any[]|undefined> = signal(undefined);
    gameRequestCache: WritableSignal<any[] |undefined> = signal(undefined);


    ngOnInit(): void {
        this.pollGameRequests()
        this.lobbyService.getAvailablePlayers().then((players: any[] | undefined)=>{
            this.availablePlayerCache.set(players)
        })
    }

    async pollGameRequests() {
        while (true) {
            const games = await this.lobbyService.getGameRequests();
            this.gameRequestCache.set(games);

            await sleep(10_000)
        }
    }

    searchedPlayer = new FormControl();

    async onSubmit() { 
        console.log("Submitted")
    }
}