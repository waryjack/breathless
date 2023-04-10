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

        // charData.useHealing = (get system setting here)

        return charData;
    }

    /**
     * @override
     */
    activateListeners(html) {
        super.activateListeners(html);

        if (!this.options.editable) return;

        html.find('.on-click').click(this._onRoll.bind(this));

        // Drag/drop support
        let handler = (ev) => this._onDragStart(ev);
        html.find('.item-block').each((i, item) => {
            if (item.dataset && item.dataset.itemId) {
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', handler, false);
            }
        });
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        // Handle rolls.
        if (dataset.rollType) {
            switch (dataset.rollType) {
                case 'item-create': {
                    this._onCreateItem(dataset.type);
                    return;
                }
                case 'item-edit': {
                    this._onEditItem(element);
                    return;
                }
                case 'item-delete': {
                    this._onDeleteItem(element);
                    return;
                }
                case 'catch-breath': {
                    this.actor.catchBreath();
                    return;
                }
                case 'loot-check': {
                    this._onCheckLoot();
                    return;
                }
                case 'toggle-stress': {
                    this._onToggleStress(dataset.pos);
                    return;
                }
                case 'stepup': {
                    this._onStepUp(element);
                    return;
                }
                case 'stepdown': {
                    this._onStepDown(element);
                    return;
                }
                case 'use-special': {
                    this.actor.useSpecial();
                    return;
                }
                case 'use-healing': {
                    this.actor.useHealing();
                    return;
                }
                case 'roll-dice': {
                    this._onRollDice(element);
                    return;
                }
                default: {
                    console.error("_onRoll, bad roll type.");
                    return;
                }
            }
        }

        // Handle rolls that supply the formula directly.
        if (dataset.roll) {
            let label = dataset.label ? `[ability] ${dataset.label}` : '';
            let roll = new Roll(dataset.roll, this.actor.getRollData());
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
                rollMode: game.settings.get('core', 'rollMode'),
            });
            return roll;
        }
    }

    _onCreateItem(iType) {
        // TODO use the Skill setting, but need a singular form for defaultName
        let defaultName = "breathless.gen.new."+iType;

        let iData = {
            name: game.i18n.localize(defaultName),
            type: iType
        }

        return Item.create(iData, {parent:this.actor, renderSheet:false});
    }

    _onEditItem(el) {
        let id = el.closest(".item").dataset.itemId;
        let item = this.actor.items.get(id);

        item.sheet.render(true);
    }

    _onDeleteItem(el) {
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
            }
        );
        d.render(true);
    }


    _onToggleStress(pos) {
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

    _onRollDice(el) {
        let id = el.closest(".item").dataset.itemId;
        return this.actor.rollDice(id);
    }

    _onStepUp(el) {
        let id = el.closest(".item").dataset.itemId;
        let field = el.closest(".item").dataset.field;
        return this.actor.stepUp(id, field);
    }

    _onStepDown(el) {
        let id = el.closest(".item").dataset.itemId;
        let field = el.closest(".item").dataset.field;
        return this.actor.stepDown(id, field);
    }

    async _onCheckLoot() {
        const loot = game.tables.filter(table => table.name === "Loot")[0];
        if(loot === undefined) {
            return ui.notifications.error(game.i18n.localize("breathless.error.lootCheck"))
        }

        let newLoot = await loot.draw({displayChat:true});
    }
}