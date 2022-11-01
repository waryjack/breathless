export const registerSettings = function() {
    
    game.settings.register("breathless", 'enable_storage', {
        name: 'Enable Storage',
        hint: 'Enables use of storage item like a backpack / war bag',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register("breathless", "enable_healing", {
        name: "Enable Healing",
        hint: "Characters can use healing item (e.g. medkit, healing spell, etc.)",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register("breathless", "enable_lootcheck", {
        name: "Enable Loot Check",
        hint: "Show loot check button on character sheet",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register("breathless", "cs_title", {
        name: "Character Sheet Title",
        hint: "Custom title for the character sheet",
        scope: "world",
        config: true,
        type: String,
        default: "Character Sheet"
    });

    game.settings.register("breathless", "skill_name", {
        name:"Skills Custom Name",
        hint:"Set the displayed name for skills in your game (e.g. abilities, talents, etc.)",
        scope: "world",
        config:true,
        type:String,
        default:"Skills"
    });

    game.settings.register("breathless", "storage_name", {
        name: "Storage Custom Name",
        hint: "Custom name for storage - e.g. backpack, bag, kit, etc.",
        scope: "world",
        config: true,
        type: String,
        default: "Backpack"
    });

    game.settings.register("breathless", "healing_name", {
        name:"Healing Custom Name",
        hint:"Set the displayed name for Healing in your game (e.g. medkit, spell, bandage, etc.)",
        scope: "world",
        config:true,
        type:String,
        default:"Medkit"
    });


    game.settings.register("breathless", "stress_name", {
        name: "Stress Custom Name",
        hint: "Custom name for Stress in your game",
        scope: "World",
        config: true,
        type: String,
        default: "Stress"
    });

    game.settings.register("breathless", "special_name", {
        name: "Special Ability Custom Name",
        hint: "Name for special ability - e.g. Stunt, Truth, etc.",
        scope: "world",
        config: true,
        type: String,
        default: "Stunt"
    });

    game.settings.register("breathless", "special_unrolled", {
        name: "Special Ability Unrolled",
        hint: "Check this if the character's special ability does NOT trigger a dice roll",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
}