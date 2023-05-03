export const registerSettings = function() {
    
    // TODO: use this
    // game.settings.register("breathless", 'enable_storage', {
    //     name: "breathless.settings.enable_storage.name",
    //     hint: "breathless.settings.enable_storage.hint",
    //     scope: 'world',
    //     config: true,
    //     type: Boolean,
    //     default: true,
    // });

    game.settings.register("breathless", "enable_healing", {
        name: "breathless.settings.enable_healing.name",
        hint: "breathless.settings.enable_healing.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register("breathless", "enable_lootcheck", {
        name: "breathless.settings.enable_lootcheck.name",
        hint: "breathless.settings.enable_lootcheck.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register("breathless", "cs_title", {
        name: "breathless.settings.cs_title.name",
        hint: "breathless.settings.cs_title.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Character Sheet"
    });

    game.settings.register("breathless", "job_name", {
        name:"breathless.settings.job_name.name",
        hint:"breathless.settings.job_name.hint",
        scope: "world",
        config:true,
        type:String,
        default:"breathless.gen.job"
    });

    game.settings.register("breathless", "skill_name", {
        name:"breathless.settings.skill_name.name",
        hint:"breathless.settings.skill_name.hint",
        scope: "world",
        config:true,
        type:String,
        default:"Skills"
    });

    game.settings.register("breathless", "storage_name", {
        name: "breathless.settings.storage_name.name",
        hint: "breathless.settings.storage_name.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Backpack"
    });

    game.settings.register("breathless", "storage_max", {
        name: "breathless.settings.storage_max.name",
        hint: "breathless.settings.storage_max.hint",
        scope: "world",
        config: true,
        type: Number,
        default: 3
    });

    game.settings.register("breathless", "healing_name", {
        name:"breathless.settings.healing_name.name",
        hint:"breathless.settings.healing_name.hint",
        scope: "world",
        config:true,
        type:String,
        default:"Medkit"
    });

    game.settings.register("breathless", "stress_name", {
        name: "breathless.settings.stress_name.name",
        hint: "breathless.settings.stress_name.hint",
        scope: "World",
        config: true,
        type: String,
        default: "Stress"
    });

    game.settings.register("breathless", "special_name", {
        name: "breathless.settings.special_name.name",
        hint: "breathless.settings.special_name.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Stunt"
    });

    game.settings.register("breathless", "special_unrolled", {
        name: "breathless.settings.special_unrolled.name",
        hint: "breathless.settings.special_unrolled.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
}