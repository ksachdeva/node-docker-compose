export class NetworkMode {
    constructor(readonly mode: string) {
        // for now just assign the argument
        // TODO: run the validation of the passed argument
    }

    public isEqual(mode: NetworkMode | string): boolean {
        if (mode instanceof NetworkMode) {
            return this.mode === mode.mode;
        }
        return this.mode === mode;
    }

    public toString() {
        return this.mode;
    }
}
