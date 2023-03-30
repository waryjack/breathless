export class BreathlessActor extends Actor {
 
    /**
     * @override
     */

    prepareBaseData() {
        super.prepareBaseData();
        const charData = this.system;

       this.prepareCharacterData(charData);
    }

    prepareCharacterData(charData){
        super.prepareDerivedData();
        let strStates = this.system.stress.states;
        console.log("Stress states: ", strStates);

        if(strStates[0] == true && strStates[1] == true && strStates[2] == true && strStates[3] == true) {
            this.system.stress.vulnerable = true;
        } else {
            this.system.stress.vulnerable = false;
        }


    }

    rollDice(id) {
        // set some basic variables
      
        let outcome = "";
        let validDice = ["d4", "d6", "d8", "d10", "d12", "d20"];
        // find the item's current die value, and roll it
        let item = this.items.get(id);
        let die = item.system.current;

        // error catch on a non-evaluatable die value:

        /* if (!validDice.includes(String.toLowerCase(die))) { 
            return ui.notifications.warn("This is not a valid die value - check your character sheet!");
        } */

        let r = new Roll("1"+die).evaluate({async:false});
        let result = r.total;

        // step the die value down until reset
        this.stepDown(id, "current");
        

        // determine the level of success
        if (result >= 5) {
            outcome = game.i18n.localize("breathless.gen.success.full");
        } else if (result < 3) {
            outcome = game.i18n.localize("breathless.gen.fail");
        } else {
            outcome = game.i18n.localize("breathless.gen.success.withcost");
        }

        let image = `<img class="flex0" src="systems/breathless/assets/dice_img/${die}.png" style="border:none" height="48" width="48">`;

        let dialogData = {
            roll_name: item.name,
            roll_type: item.type,
            roll_object: [r],
            roll_die: die,
            roll_result: result,
            roll_outcome: outcome,
            roll_die_image: image
        }
       
        this.outputChatMessage(dialogData);

        
    }

    useSpecial() {
        // Allow it to toggle back to an unused state with a simple click
        if (this.system.special.used === true) {
            this.update({"system.special.used":false});
            return;
        }

        if (game.settings.get("breathless", "special_unrolled")) {
            this.update({"system.special.used":true});
            return;
        } 

        let outcome = "";

        // if NOT used, then roll dice and toggle to "used"
        let r = new Roll("1d12").evaluate({async:false});
        let result = r.total;
        let die = "d12";

        // determine the level of success
        if (result >= 5) {
            outcome = game.i18n.localize("breathless.gen.success.full");
        } else if (result < 3) {
            outcome = game.i18n.localize("breathless.gen.fail");
        } else {
            outcome = game.i18n.localize("breathless.gen.success.withcost");
        }

        let image = '<img src="systems/breathless/assets/dice_img/d12.png" style="border:none" height="48" width="48">';

        let dialogData = {
            roll_name: this.system.special.game_name,
            roll_object: [r],
            roll_type: "",
            roll_die: die,
            roll_result: result,
            roll_outcome: outcome,
            roll_die_image: image
        }
       
        this.outputChatMessage(dialogData);
        this.update({"system.special.used":true});

    }

    useHealing() {

        // allow quick clearing of the toggle without triggering a heal
        if(this.system.healing.used == true) {
            this.update({"system.healing.used":false});
            return;
        }

        let healToggle = this.system.healing.used;
        this.update({"system.healing.used":!healToggle});

        // toggle down at least 2 stress boxes
        let states = this.system.stress.states;
        console.log('heal before: ', states);
        if(states[3] == true && states[2] == true) {
            states[3] = false;
            states[2] = false;
        } else if (states[2] == true && states[1] == true) {
            states[2] = false;
            states[1] = false;
        } else if (states[1] == true && states[0] == true) {
            states[1] = false;
            states[0] = false;
        } else if (states[0] == true) {
            states[0] = false;
        }

        console.log('heal after: ', states);
        this.update({"system.stress.states":states});
        this.sheet.render(true);
    }

    stepUp(id, field) {
        let item = this.items.get(id);
        let iType = item.type;
        let die = item.system[field];
        let stepup = "";

        switch (die) {
            case "d10": {
                stepup = "d10";break;
            }
            case "d8": {
                stepup = "d10"; break;
            }
            case "d6": {
                stepup = "d8"; break;
            }
            case "d4": {
                stepup = "d6"; break;
            }
            default: { stepup = "d4"; break;}
        }
        let updateField = `system.${field}`;
        console.warn("in Stepup method, iType, field, die, stepup: ", item, iType, die, stepup);
        return item.update({[updateField]:stepup});

    }

    stepDown(id, field) {
        let item = this.items.get(id);
        let iType = item.type;
        let die = item.system[field]
        let stepdown = "";

        console.log("Item: ", item, "type: ", iType);
        if(iType === "gear") {
            
            switch (die) {
                case "d10": {
                    stepdown = "d8";break;
                }
                case "d8": {
                    stepdown = "d6"; break;
                }
                case "d6":
                default: { stepdown = "d6"; break;}
            }
        } else {
            
            switch(die) {
                case "d10": {
                    stepdown = "d8"; break;
                }
                case "d8": {
                    stepdown = "d6"; break;
                }
                case "d6": {
                    stepdown = "d4"; break;
                }
                case "d4":
                default:{stepdown = "d4"; break;}
            }
        }
        let updateField = `system.${field}`;
        return item.update({[updateField]:stepdown});
        
    }

    catchBreath() {
        let stress = this.system.stress;
        let states = stress.states;
        let skills = this.items;

        // reset all skills to initial levels
        skills.forEach(s => {
            if (s.type != "gear") {
                let init = s.system.initial;
                s.update({"system.current":init});
            }
        });


        // clear 1 stress
        console.log("stress states in catchBreath: ", states);
        if(states[3] == true) {
            states[3] = false;
        } else if (states[2] == true) {
            states[2] = false;
        } else if (states[1] == true) {
            states[1] = false;
        } else if (states[0] == true) {
            states[0] = false;
        }
        console.log("stress states in catchBreath 2: ", states);
        this.update({"system.stress.states":states});
        this.sheet.render(true);

        let pcname = this.name;
        // notify GM that it happened
        ChatMessage.create({
            user:game.user_id,
            rollMode:'gmroll',
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: `<b>NOTE</b>: ${pcname} used Catch Your Breath.`
        });
        


    }

    outputChatMessage(data) {
        let template = 'systems/breathless/templates/msg/chatmessage.hbs';
        renderTemplate(template, data).then((dlg) => {
            ChatMessage.create({
                user:game.user_id,
                type:CONST.CHAT_MESSAGE_TYPES.ROLL,
                rolls: data.roll_object,
                speaker: ChatMessage.getSpeaker(),
                content: dlg
            });
        });

    }

    /* checkStorageCap() {
        let gear = this.items.filter(i => i.type === "gear");
        let maxCap = game.settings.get("breathless", "storage_max");
        if(gear.length < maxCap) {
            return false;
        } else {
            return true;
        }
    }*/
}