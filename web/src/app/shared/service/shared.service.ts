import { Injectable } from "@angular/core";

@Injectable()
export class SharedService {
    isScreenToggled = false;
    constructor() {}
    public showLoader() {
        $("#spinnerContainer").removeClass("hiddenLoader");
        $("#spinnerContainer").addClass("visible");
    }

    public hideLoader() {
        $("#spinnerContainer").removeClass("visible");
        $("#spinnerContainer").addClass("hiddenLoader");
    }
}
