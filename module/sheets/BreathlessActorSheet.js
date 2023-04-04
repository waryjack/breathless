export class BreathlessActorSheet extends ActorSheet {
    
    get template() {
        return 'systems/breathless/templates/actor/actorsheet.hbs';
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['breathless', 'csbg', 'sheet', 'actor', 'actor-sheet'],
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
        // console.log("Actor: ", this.actor);
        charData.actor = this.actor;
        charData.skills = charItems.filter(i => i.type === "skill");
        charData.gear = charItems.filter(i => i.type === "gear");
        charData.special = this.actor.system.special;
        charData.storage = this.actor.system.storage;
        charData.stress = this.actor.system.stress;
        charData.name = this.actor.name;
        charData.pronouns = this.actor.system.pronouns;
        charData.job = this.actor.system.job;
        charData.healing = this.actor.system.healing;

        // console.log("Chardata name, pronouns, job: ", charData.name, charData.pronouns, charData.job.name);
        // charData.useHealing = (get system setting here)

        return charData;
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
        html.find('.inline-edit-item').blur(this._onInlineEditItem.bind(this));
        html.find('.toggle-stress').click(this._onToggleStress.bind(this));
        
        // on-sheet manipulations
        html.find('.stepup').click(this._onStepUp.bind(this));
        html.find('.stepdown').click(this._onStepDown.bind(this));

        // Rolling dice and using items
        html.find('.roll-dice').click(this._onRollDice.bind(this));
        html.find('.use-special').click(this._onUseSpecial.bind(this));
        html.find('.use-healing').click(this._onUseHealing.bind(this));
        html.find('.catch-breath').click(this._onCatchBreath.bind(this));
        html.find('.loot-check').click(this._onCheckLoot.bind(this));

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
        // TODO use the Skill setting, but need a singlular form for this
        let loc = "breathless.gen.new."+iType;

        let iData = {
            name: game.i18n.localize(loc),
            type: iType
        }

        return Item.create(iData, {parent:this.actor, renderSheet:false});
    }

    _onEditItem(e) {
        e.preventDefault();

        let el = e.currentTarget;
        let id = el.closest(".item").dataset.itemId;
        let item = this.actor.items.get(id);

        item.sheet.render(true);
    }

    _onDeleteItem(e) {
        e.preventDefault();

        let el = e.currentTarget;
        let id = el.closest(".item").dataset.itemId;

        let d = new Dialog(
            {
                title: game.i18n.localize("breathless.dialogs.delete.title"),
                content: game.i18n.localize("breathless.dialogs.delete.confirm"),
                buttons: {
                    one: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("breathless.dialogs.labels.yes"),
                        callback: () => { 
                            let itemToDelete = this.actor.items.get(id);
                            itemToDelete.delete();
                        }
                    },
                        two: {
                        icon: '<i class="fas fa-times"></i>',
                        label: game.i18n.localize("breathless.dialogs.labels.cancel"),
                        callback: () => { return; }
                    }
                },
                default: "two"
                // render: html => console.log("Register interactivity in the rendered dialog"),
                // close: html => console.log("This always is logged no matter which option is chosen")
            }
        );
        d.render(true);
    }

    _onInlineEdit(e) {
        e.preventDefault();
        // console.log("fired inline edit method");

        let el = e.currentTarget;
        let field = el.dataset.field;
        // console.log("Edited actor field, new value: ", field, el.innerText);
        return this.actor.update({[field]:el.innerText});
    }

    _onInlineEditItem(e) {
        e.preventDefault();
        // console.log("fired inline edit item method");

        let el = e.currentTarget;
        let id = el.closest(".item").dataset.itemId;
        let field = el.dataset.field;
        let item = this.actor.items.get(id);

        // console.log("Edited item field, new value: ", field, el.innerText);
        return item.update({[field]:el.innerText});
    }


    _onToggleStress(e) {
        e.preventDefault();

        let el = e.currentTarget;
        let pos = el.dataset.pos;
        let currentArray = this.actor.system.stress.states;
        let currentState = currentArray[pos];
        let newState = 0;

        if(currentState === false) {
            newState = true;
        } else {
            newState = false;
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
        e.preventDefault();
        return this.actor.useSpecial();
    }

    _onUseHealing(e) {
        e.preventDefault();
        return this.actor.useHealing();
    }

    _onCatchBreath(e) {
        e.preventDefault();
        return this.actor.catchBreath();
    }

    _onStepUp(e) {
        e.preventDefault();
        let el = e.currentTarget;
        let id = el.closest(".item").dataset.itemId;
        let field = el.closest(".item").dataset.field;

        // console.warn("Item id, field for stepup: ", id, field);
        return this.actor.stepUp(id, field);
    }

    _onStepDown(e) {
        e.preventDefault();
        let el = e.currentTarget;
        let id = el.closest(".item").dataset.itemId;
        let field = el.closest(".item").dataset.field;

        // console.warn("Item id, field for stepup: ", id, field);
        return this.actor.stepDown(id, field);
    }

    async _onCheckLoot(e) {
        e.preventDefault();
        const loot = game.tables.filter(table => table.name === "Loot")[0];
        if(loot === undefined) {
            return ui.notifications.error(game.i18n.localize("breathless.error.lootCheck"))
        }

        let newLoot = await loot.draw({displayChat:true});
    }
}