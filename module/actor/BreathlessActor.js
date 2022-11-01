export class BreathlessActor extends Actor {
 
    /**
     * @override
     */

    prepareBaseData() {
        super.prepareBaseData();
        const charData = this.system;
    }

    rollDice(id) {
        // set some basic variables
      
        let outcome = "";
        
        // find the item's current die value, and roll it
        let item = this.items.get(id);
        let die = item.system.current;
        let type = item.type;
        let r = new Roll("1"+die).evaluate({async:false});
        let result = r.total;

        // step the die value down until reset
        let newDiceVal = this.stepDown(id);
        item.update({["system.current"]:newDiceVal});

        // determine the level of success
        if (result >= 5) {
            outcome = game.i18n.localize("breathless.gen.success.full");
        } else if (result < 3) {
            outcome = game.i18n.localize("breathless.gen.fail");
        } else {
            outcome = game.i18n.localize("breathless.gen.success.withcost");
        }

        let image = `<img src="systems/breathless/assets/dice_img/${die}.png" style="border:none" height="48" width="48">`;

        let dialogData = {
            roll_name: item.name,
            roll_type: item.type,
            roll_die: die,
            roll_result: result,
            roll_outcome: outcome,
            roll_die_image: image
        }
       
        this.outputChatMessage(dialogData);

        
    }

    useSpecial() {
        let r = new Roll("1d12").evaluate({async:false});
        let result = r.total;

        // step the die value down until reset
        let newDiceVal = this.stepDown(id);
        item.update({"system.current":newDiceVal});

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
            roll_type: item.type,
            roll_die: die,
            roll_result: result,
            roll_outcome: outcome,
            roll_die_image: image
        }
       
        this.outputChatMessage(dialogData);
        this.update({"system.special.used":true});

    }

    useHealing() {
        this.update({"system.healing.used":true});
    }

    stepDown(id) {
        let item = this.items.get(id);
        let iType = item.type;
        let stepdown = "";

        if(iType === "gear") {
            let current = item.system.current;
            switch (current) {
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
            let current = item.system.current;
            switch(current) {
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
        return stepdown;
    }


    outputChatMessage(data) {
        let template = 'systems/breathless/templates/msg/chatmessage.hbs';
        renderTemplate(template, data).then((dlg) => {
            ChatMessage.create({
                user:game.user_id,
                speaker: ChatMessage.getSpeaker(),
                content: dlg
            });
        });

    }
}