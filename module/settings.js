export const registerSettings = function() {
    
    game.settings.register("breathless", 'enable_storage', {
        name: 'Enable Storage',
        hint: 'Enables use of storage item like a backpack / war bag',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
    });

   }