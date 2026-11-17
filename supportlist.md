Quickest way is to check out the database:
https://github.com/leonhartm47/SwitchRPCEnhanced/blob/master/resources/rpc.json
although you can add your own *custom games* by using the in-app menu, as well as, add local images for your games within the *Game Box Art Manager*
while in the above manager, you can also if you've added a game's boxart also register it for Discord... although it'll only show if it's been added to Discord's Developer Portal...
it's not a problem if it's not there, it'll fall back to the console image anyway.

You can also create your own *[Discord Developer Portal](https://discord.com/developers/home)* Application really easily and update the ID at the top of this file:

https://github.com/leonhartm47/SwitchRPCEnhanced/blob/master/index.js\
**const DISCORD_APP_ID = ' *Your ID* ';**

This will allow you to upload around 300 game boxart images (less the console default images etc.) for using with the Discord Rich Presence...
or you can just use the one attached which if a game's boxart image is missing it'll fallback to the consoles image etc.
