export class RuntimeName {
    constructor(readonly name: string) {
        // for now just assign the argument
        // TODO: run the validation of the passed argument
    }

    public isEqual(name: RuntimeName | string): boolean {
        if (name instanceof RuntimeName) {
            return this.name === name.name;
        }
        return this.name === name;
    }

    public toString() {
        return this.name;
    }
}
