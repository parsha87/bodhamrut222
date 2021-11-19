import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { MusiclistPage } from "../musiclist/musiclist.page";
import { MusicplayerPage } from "../musicplayer/musicplayer.page";
import { DialogService } from "./dialog.service";

@Injectable()
export class MusicCanDeactivateGuard implements CanDeactivate<MusicplayerPage> {

    constructor(private dialogService: DialogService) { }

    canDeactivate(
        component: MusicplayerPage,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {

        let url: string = state.url;
        console.log('Url: ' + url);

        if (!component.tobeplayed) {
            component.tobeplayed = false;
             return this.dialogService.confirm('डाउनलोडची प्रतीक्षा करत आहे...');
            //return false;
        }
        return true;
    }
}