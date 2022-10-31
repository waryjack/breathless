// Imports

import { preloadHandlebarsTemplates } from "./templates.js";
import { registerSettings } from "./settings.js"; 
import { BreathlessActor } from "./actor/BreathlessActor.js";
import { BreathlessItem } from "./item/BreathlessItem.js";
import { BreathlessActorSheet } from "./sheets/BreathlessActorSheet.js";
import { BreathlessItemSheet } from "./sheets/BreathlessItemSheet.js";
import { BREATHLESS } from "./config.js";

// Initialize system

Hooks.once("init", () => {
    console.log("##### Breathless | Initializing Breathless System #####");

    CONFIG.breathless = BREATHLESS; 

    // Add namespace in global 

    game.breathless = {
        BreathlessActor,
        BreathlessActorSheet,
        BreathlessItem,
        BreathlessItemSheet,
        registerSettings,
    }; 

    //CONFIG.debug.hooks = true;
    
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    Actors.registerSheet("breathless", BreathlessActorSheet, { makeDefault:true});
    Items.registerSheet("breathless", BreathlessItemSheet, { makeDefault: true});
    
    CONFIG.Actor.documentClass = BreathlessActor;
    CONFIG.Item.documentClass = BreathlessItem;
    
    // Register system settings
    registerSettings();

    // Register partials templates
    preloadHandlebarsTemplates();

    // Register handlebar helpers
    Handlebars.registerHelper('ife', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper("times", function(n, content) {
       let result = "";
       if (n==0 || n == null) return;
       for (let i = 0; i < n; i++) {
           result += content.fn(i)
       }

       return result;

    });

    //uppercases; needs work
    Handlebars.registerHelper("proper", function(content) {
        let result = "";

        result = content[0].toUpperCase() + content.substring(1);

        return result;

    });

    Handlebars.registerHelper("minus", function(arg1, arg2) {
        let result = arg1 - arg2;

        return result;
    });

    Handlebars.registerHelper("render", function(arg1){

        return new Handlebars.SafeString(arg1);
    });

    // Checks whether a game setting is active
    Handlebars.registerHelper("getSetting", function(arg){
        // console.warn("Passed Setting Name: ", arg);
        if (arg == "" || arg == "non" || arg == undefined) { return ; }
        return game.settings.get('ore', arg);
    });

    
    Handlebars.registerHelper("concat", function(...args){
        let result = "";
        for (let a of args) {
            result += a;
        }

        return result;
    });

    Handlebars.registerHelper("getCustomName", function(a) {
        if (a == "none" || a == "None" || a == "") { return; }
        let result = "Name";
        let truncA = a.substring(0,3);
        result = truncA+result;
       // console.warn("Custom Name", result);
        return result;
    });

    Handlebars.registerHelper("and", function(a, b){
        return (a && b);
    });

    Handlebars.registerHelper("or", function(a, b){
        return (a || b);
    });

});

/**
 * Item and Message Hooks
 */

 Hooks.on('renderChatMessage', (app, html) => {

    html.on('click', '.taskroll-msg', event => {
        event.preventDefault();
        // NOTE: This depends on the exact card template HTML structure.
        $(event.currentTarget).siblings('.taskroll-tt').slideToggle("fast");
     });

     html.on('click', '.taskroll-info', event => {
        event.preventDefault();
        // NOTE: This depends on the exact card template HTML structure.
        $(event.currentTarget).siblings('.taskroll-tt').slideToggle("fast");
     });
});