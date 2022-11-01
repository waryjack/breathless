export class BreathlessActorSheet extends ActorSheet {
    
    get template() {
        return 'systems/breathless/templates/actor/actorsheet.hbs';
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['breathless', 'sheet', 'actor', 'actor-sheet'],
            width: 775,
            height: 685,
            left:120,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheetbody", initial: "main"}],
            dragDrop: [{dragSelector: ".dragline", dropSelector: null}]
            });
    }

    /** 
     * @override
     */

    getData() {
        const charData = deepClone(this.actor.system);
        
        charData.config = CONFIG.BREATHLESS;

        let charItems = this.actor.items;

        charData.skills = charItems.filter(i => i.type === "skill");
        charData.gear = charItems.filter(i => i.type === "gear");
        charData.special = this.actor.system.special;
        charData.storage = this.actor.system.storage;
        charData.stress = this.actor.system.stress;
        charData.name = this.actor.name;
        charData.pronouns = this.actor.system.pronouns;
        charData.healing = this.actor.system.healing;
        // charData.useHealing = (get system setting here)
    }

    /**
     * @override
     */

    activateListeners(html) {
        super.activateListeners(html);

        if (!this.options.editable) return;

        // Popout editing of items / skills using their individual sheets
        html.find('.item-create').click(this._onCreateItem.bind(this));
        html.find('.item-edit').click(this._onEditItem.bind(this));
        html.find('.item-delete').click(this._onDeleteItem.bind(this));

        // Inline editing
        html.find('.inline-edit').blur(this._onInlineEdit.bind(this));
        html.find('.toggle-stress').click(this._onToggleStress.bind(this));

        // Rolling dice and using items
        html.find('.roll-dice').click(this._onRollDice.bind(this));
        html.find('.use-special').click(this._onUseSpecial.bind(this));
        html.find('.use-healing').click(this._onUseHealing.bind(this));

        // Drag/drop support
        let handler = (ev) => this._onDragStart(ev);
        html.find('.item-name').each((i, item) => {
            if (item.dataset && item.dataset.itemId) {
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', handler, false);
            }
        });

    }

    _onCreateItem(e) {
        e.preventDefault();

        let el = e.currentTarget;
        let iType = el.dataset.type;
        let loc = "breathless.gen.new."+itype;

        let iData = {
            name: game.i18n.localize(loc),
            type: iType
        }

        return Item.create(iData, {parent:this.actor, renderSheet:true});

    }

    _onEditItem(e) {
        e.prevenDefault();

        let el = e.currentTarget;
        let id = el.closest(".item").dataset.itemId;
        let item = this.actor.items.get(id);

        item.sheet.render(true);

    }

    _onDeleteItem(e) {
        e.preventDefault();

        let el = e.currentTarget;
        let id = elem.closest(".item").dataset.itemId;

        let d = new Dialog({
            title: game.i18n.localize("breathless.dialogs.delete.title"),
            content: game.i18n.localize("breathless.dialogs.delete.confirm"),
            buttons: {
             one: {
              icon: '<i class="fas fa-check"></i>',
              label: game.i18n.localize("breathless.dialogs.labels.yes"),
              callback: () => { 
                  let itemToDelete = this.actor.items.get(itemId);
                  itemToDelete.delete();
                }
             },
             two: {
              icon: '<i class="fas fa-times"></i>',
              label: game.i18n.localize("breathless.dialogs.labels.cancel"),
              callback: () => { return; }
             }
            },
            default: "two",
            render: html => console.log("Register interactivity in the rendered dialog"),
            close: html => console.log("This always is logged no matter which option is chosen")
           });
           d.render(true);

    }

    _onInlineEdit(e) {
        e.preventDefault();

        let el = e.currentTarget;
        let id = el.closest(".item").dataset.itemId;
        let field = el.dataset.field;
        let item = this.actor.items.get(id);

        return item.update({[field]:el.value});
    }

    _onToggleStress(e) {
        e.preventDefault();

        let el = e.currentTarget;
        let pos = el.dataset.pos;
        let currentArray = this.actor.system.stress.states;
        let currentState = currentArray[pos];
        let newState = 0;

        if(currentState === 0) {
            newState = 1
        } else {
            newState = 0
        }

        currentArray[pos] = newState;

        return this.actor.update({["system.stress.states"]:currentArray});
    }

    _onRollDice(e) {
        e.preventDefault();
        let el = e.currentTarget;
        let id = el.closest(".item").dataset.itemId;
        
        return this.actor.rollDice(id);
    }

    _onUseSpecial(e) {

        return this.actor.useSpecial();

    }

    _onUseHealing(e) {

        return this.actor.useHealing();

    }
}