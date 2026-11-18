# SwitchRPCEnhanced

### An enhanced Nintendo Switch/Switch 2 Discord integration available for Linux, macOS, and Windows, now with an updated game list.

The library now comes with [500 built-in game titles](https://github.com/leonhartm47/SwitchRPCEnhanced/blob/master/resources/rpc.json). You can also add your own titles under *Custom Games* and import local box art for them using the *Game Box Art Manager*.

All games have a console image available as a fallback when game-specific artwork is unavailable. This fallback will also appear in Discord Rich Presence out of the box, as the application is currently configured to use my Discord application.

If you want to use your own custom game box art images in Discord Rich Presence, you'll need to update the *"Application ID"* at the top of the [index.js](https://github.com/leonhartm47/SwitchRPCEnhanced/blob/master/index.js) file after creating your own application on the [Discord Developer Portal](https://discord.com/developers/home), then upload your chosen images as *Rich Presence Art Assets*.

Discord allows up to 300 Rich Presence Art Assets to be uploaded to each application. The `assets/Game Box Arts` directory provides a place to store individual game covers imported by the user, which can then be chosen when deciding which artwork to upload to Discord. The console fallback images are provided separately in `assets/Discord Assests` and are used for games without individual box art.

The expected filenames and Discord asset keys can be found by opening the *Game Box Art Manager* and searching for individual game titles. This is explained further in the screenshots below.

## 

SwitchRPCEnhanced builds upon the original concept of manually setting Nintendo Switch activity through Discord Rich Presence. It does not directly interact with Nintendo's APIs, instead operating as a standalone application and keeping as much of its functionality and data on the user's own system as possible.

The application is currently configured to use my own Discord application and its uploaded artwork. Due to the way Discord handles Rich Presence artwork, images must be uploaded to the [Discord Developer Portal](https://discord.com/developers/applications) before they can be displayed in a user's activity status.

Fallback images are provided to display the relevant console artwork whenever a game's box art is unavailable. If you want to display individual game artwork in your own Rich Presence status, you'll need to create your own Discord application and upload the required Rich Presence assets, as explained in the setup instructions at the beginning of this README.


### Explanation:

An enhanced implementation of Discord Rich Presence for the Nintendo Switch/Switch 2. Instead of directly interfacing with Nintendo's servers through services such as [nxapi](https://github.com/samuelthomas2774/nxapi), the application allows you to manually set your Rich Presence by selecting a game and description.

Although this approach isn't automatic, it provides a reliable alternative that doesn't depend on Nintendo's APIs and therefore isn't affected by changes to those APIs. It also offers a more self-contained approach, keeping the process local rather than relying on unofficial third-party API services.

### Project History

The original [SwitchRPC](https://github.com/realdevon/SwitchRPC) project was created by [realdevon](https://github.com/realdevon) in 2018 and was actively maintained, with [public releases](https://github.com/realdevon/SwitchRPC/releases) continuing until 2020, after which development appears to have ceased.

In 2023, [queenbiscuit311](https://github.com/queenbiscuit311) picked up the project by creating [SwitchRPCUpdated](https://github.com/queenbiscuit311/SwitchRPCUpdated), a continuation of the original. They helped bring the project up to date by maintaining its Discord Rich Presence artwork, updating dependencies, upgrading to a newer version of Electron, improving the original user interface, and expanding platform support. They also continued publishing [public releases](https://github.com/queenbiscuit311/SwitchRPCUpdated/releases), making the application more accessible to users.

I initially forked SwitchRPCUpdated to create [SwitchRPCEnhanced](https://github.com/leonhartm47/SwitchRPCEnhanced). While exploring the updated version, I learned how its Discord Rich Presence integration worked and saw the potential to take the project much further. This gave me the idea to develop a substantially enhanced version, with a focus on introducing the functionality, refinements and quality-of-life improvements needed to make the application a more complete and polished experience.

SwitchRPCEnhanced has since evolved in its own direction, building upon the foundations of the earlier projects with a broader range of features and quality-of-life improvements. SwitchRPCUpdated remains a simpler, more lightweight alternative for users who prefer the original approach without the additional functionality. Both projects offer their own take on the same underlying concept, catering to different preferences.


### Screenshots:

*Main Menu*
<p>
<img width="663" height="517" alt="image" src="https://github.com/user-attachments/assets/a5345514-609f-4ef6-9e62-02fe290c7f4d" />
</p>

*Game Selection with Description Selector*
<p>
<img width="669" height="521" alt="image" src="https://github.com/user-attachments/assets/23cd1c8b-5001-4e8b-8af1-2c9b0ef60551" />
</p>

*The search is localised to the selected category, when the "Show all" category is selected it searches the whole library including Custom Games*
<p>
<img width="666" height="520" alt="image" src="https://github.com/user-attachments/assets/4cfec1d5-627d-422e-b065-31ad42590226" />
</p>

*Starred Games are shown in the Favourites section*
<p>
<img width="666" height="522" alt="image" src="https://github.com/user-attachments/assets/2a734d33-ec5e-4500-a45f-70ef7208b189" />
</p>

*Games which have been used before are shown in the Recently Played section*
<p>
<img width="667" height="520" alt="image" src="https://github.com/user-attachments/assets/eadfbbee-bfb7-4a8b-91d7-1daacd83a020" />
</p>

*Unused categories can be hidden for simplicity if needed*
<p>
<img width="671" height="524" alt="image" src="https://github.com/user-attachments/assets/4f8d5753-5b2e-4ec1-b952-f481e3feb889" />
</p>

*You can click the "Add Game Cover" button to import box art images to the correct folder `assets/Game Box Arts` these will be shown near the top, the images must match their "expected filename" in order to display in the app library, this is explained more below...*
<p>
<img width="671" height="524" alt="image" src="https://github.com/user-attachments/assets/f895332e-4418-49be-be97-c2efaa9a23e7" />
</p>

*Further down, you can search for the game title you want to check the current box art and Discord asset registration status for.

By default, the application displays the relevant console artwork as a fallback when a game's box art is unavailable. However, if you've imported box art for that specific game into the correct folder `assets/Game Box Arts` and the filename matches the expected naming convention, it will automatically be detected and displayed as the game's local artwork.*

*For Discord you can choose to either keep the standard console image or if the box art has been uploaded already to the "[Discord Developer Portal](https://discord.com/developers/home)" under the name shown next to the "Discord asset key", you can click the "Register Discord Asset" button to override the default console image and allow it to use the Discord asset image instead.  Where it says "Discord image" it shows what the current image is set to show on Discord when you use the feature... don't worry if you register one which isn't already added to the portal it'll fallback anyway to the console image, just you'll need to upload the correct box art as an asset for it to show on Discord.*
<p>
<img width="664" height="521" alt="image" src="https://github.com/user-attachments/assets/04f46772-9778-4acd-a581-6a9c98ca36b2" />
</p>

*NSO - Selecting specific consoles or exclusive games*
<p>
<img width="665" height="521" alt="image" src="https://github.com/user-attachments/assets/084588b0-f186-432b-8d70-53d978eb6c58" />
</p>

*Adding your own game which isn't already in the database*
<p>
<img width="666" height="519" alt="image" src="https://github.com/user-attachments/assets/e43160c4-ad1f-4e48-a5f1-ddb31e1c36ce" />
</p>

*The game can be found in the "Custom Games" section*
<p>
<img width="665" height="521" alt="image" src="https://github.com/user-attachments/assets/3e65a013-c19e-465a-a0bc-07946519dda2" />
</p>

*Your game will also appear in the category it was added to at the very bottom of the list, you can add box art for these as shown earlier*
<p>
<img width="665" height="521" alt="image" src="https://github.com/user-attachments/assets/67c7ad68-0d45-49da-b9f3-03872524e397" />
</p>

*This is an example of it working on Discord*
<p>
<img width="224" height="358" alt="image" src="https://github.com/user-attachments/assets/fd82b5f9-7123-4e7f-b2d9-743b69a61d3b" />
</p>

## Currently Available Build Types

- Windows (Portable)
- Linux (AppImage)
- macOS (Apple Silicon)

Pre-built downloads are available in the [Releases](https://github.com/leonhartm47/SwitchRPCEnhanced/releases) section.

**Note:** macOS Intel (x86_64) users will need to build the application from source, as I do not currently have access to an Intel-based Mac to produce and test that build.


## Building from source:

## Prerequisites

Before building, ensure that **Node.js and npm** are installed on your device.

You can install them using the instructions for your operating system below.

**Linux**

- Arch Linux and related distributions (Manjaro, EndeavourOS):
  `sudo pacman -S nodejs npm`
- Fedora/RHEL and related distributions:
  `sudo dnf install nodejs npm`
- Debian and related distributions (Ubuntu, Linux Mint):
  `sudo apt install nodejs npm`
- Gentoo Linux:
  `emerge nodejs`
- Void Linux:
  `sudo xbps-install nodejs`

**macOS**

- Using [Homebrew](https://brew.sh/):
  `brew install node`

**Windows**

- Option 1: Follow Microsoft's [Node.js installation instructions](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
- Option 2: Using [Chocolatey](https://chocolatey.org/):
  `choco install nodejs`

No additional global Electron or Electron Packager installation is required. All necessary project dependencies are declared in `package.json`.

## Building

1. Clone this repository:

   `git clone https://github.com/leonhartm47/SwitchRPCEnhanced.git`

2. Enter the project directory:

   `cd SwitchRPCEnhanced`

3. Install project dependencies:

   `npm install`

4. Build the application:

   `npm run build`

5. Once completed, the packaged application will be available in the `dist` folder.


**Windows:** The build produces a portable Windows x64 application in `dist/SwitchRPCEnhanced-win32-x64`. 

Run `SwitchRPCEnhanced.exe` to launch it.

## Credits

Credits to:

[queenbiscuit](https://github.com/queenbiscuit311) for continuing development of the original project through [SwitchRPCUpdated](https://github.com/queenbiscuit311/SwitchRPCUpdated).

[realdevon](https://github.com/realdevon) for creating the original [SwitchRPC](https://github.com/realdevon/SwitchRPC).

[simonliii](https://github.com/simonliii) for creating pull request realdevon/SwitchRPC/[#59](https://github.com/realdevon/SwitchRPC/pull/59), which made the games list clickable.

[davidcralph](https://github.com/davidcralph) for creating pull request realdevon/SwitchRPC/[#17](https://github.com/realdevon/SwitchRPC/pull/17), which replaced the `request` package with `axios`.

## Copyright Acknowledgements

### Copyright 2018-2021 NintenZone Technologies. Nintendo Switch, Nintendo Switch 2, the Nintendo Switch logos, and Nintendo Switch 2 logos are property of Nintendo.
