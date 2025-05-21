import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class StylesService {
    private primary_background: string = "#3a64ae";
    private secondary_background: string = "#26abcb";
    private contrast: string = "#e9551e";
    private white: string = "#ffffff";
    private light_gray: string = "#eeeeee";
    private gray: string = "#949494";
    private red: string = "#D43447";
    private green: string = "#5dc460";
    private black: string = "#353535";
    private shine_word: string = "#B46F90";
    private male_word: string = "#6e78ff";

    constructor() { }

    getPrimaryBackground(): string {
        return this.primary_background;
    }

    getSecondaryBackground(): string {
        return this.secondary_background;
    }

    getContrast(): string {
        return this.contrast;
    }

    getWhite(): string {
        return this.white;
    }

    getLightGray(): string {
        return this.light_gray;
    }

    getGray(): string {
        return this.gray;
    }

    getRed(): string {
        return this.red;
    }

    getGreen(): string {
        return this.green;
    }

    getBlack(): string {
        return this.black;
    }

    getShineWord(): string {
        return this.shine_word;
    }

    getMaleWord(): string {
        return this.male_word;
    }
}