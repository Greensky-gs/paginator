# paginator
This code is a paginator.

## Usage
```js
const paginator = require('./paginator.js');

// For the example, I'll use an adminlist. It can be everything you want.
const adminList = message.guild.members.cache.filter(m => m.permissions.has('ADMINISTRATOR')).toJSON();

if (adminList.length < 5) {
    // In this case, there's less than 5 admins, don't need to create a paginator.
    const embed = new Discord.Message()
        .setTitle("Admins")
        .setDescription(adminList.map(admin => `<@${admin.id}>`).join(' '))
        
    message.channel.send({ embeds: [ embed ] }).catch(() => {});
} else {
    // Here we have more than 5 admins, let's create our paginator

    // Create embed that will be updated.
    let now = new Discord.MessageEmbed()
        .setTitle("Admins")
        .setDescription(`Here is the admin list`)
        .setColor('ORANGE')
    
    // Create an array that will contains all the embeds.
    let embeds = [];
    // This variable is made for know if all embeds have been pushed in array.
    let pile = false;
    // Count variable.
    let count = 0;
    
    // Create a loop 
    for (let i = 0; i < adminList.length; i++) {
        const admin = adminList[i];
        
        // add field
        now.addField(admin.user.username, `<@${admin.id}>`, false);

        // Set pile on false, because it's not pushed.
        pile = false;

        // Increase the count
        count++;
        if (count === 5) {
            // Reset count
            count=0;
            // Push in arrays
            embeds.push(now);
            // Set as pushed
            pile = true;

            // Undefine embed
            now = null;
            
            // Redefine it
            now = new Discord.MessageEmbed()
        .setTitle("Admins")
        .setDescription(`Here is the admin list`)
        .setColor('ORANGE')

        }
    };

    // If ther's one missing, add it to the list
    if (!pile) embeds.push(now);
            
    paginator(message.author, message.channel, embeds, `admin list.`);
}
```

## Discord.js
This script is made for discord.js v13.

## Errors
If you got any error, or need more explainations, contact me on [this discord server](https://discord.gg/fHyN5w84g6)