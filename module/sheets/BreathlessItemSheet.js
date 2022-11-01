export class BreathlessItemSheet extends ItemSheet {
    get template() {
        const path = 'systems/breathless/templates/item/';
        return `${path}${this.item.type}sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['breathless', 'sheet', 'actor', 'actor-sheet'],
            width: 400,
            left:120,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheetbody", initial: "main"}],
            dragDrop: [{dragSelector: ".dragline", dropSelector: null}]
            });
    }

    getData () {
        const iData = this.item.system;
        iData.item = this.item;
        iData.name = this.item.name;
        iData.config = CONFIG.breathless; 
        
        return iData;
    }
}