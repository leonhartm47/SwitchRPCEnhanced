# SwitchRPCEnhanced

### An enhanced Nintendo Switch/Switch 2 Discord integration available for Linux, macOS, and Windows, now with an updated game list.

The library now comes with [500 game titles built-in](https://github.com/leonhartm47/SwitchRPCEnhanced/blob/master/resources/rpc.json), you can also add your own titles under *Custom Games*, as well as, local box-art for them in the menu via the *Game Box Art Manager*.

All games have a fallback image of the console they are played on, this will also show in the *Rich Presence* on Discord *out-of-the-box* since it's currently linked to mine...

If you want to add your own custom box-art images for showing on Discord you'd need to update the *"Application ID"* at the top of the [index.js](https://github.com/leonhartm47/SwitchRPCEnhanced/blob/master/index.js) file, after *creating your own application* on the [Discord Developer Portal](https://discord.com/developers/home) and finally upload them as *Rich Presence Art Assets*.  You'll still have access to just under 300 potential box-art images of your choice after uploading the needed [Discord Assets](https://github.com/leonhartm47/SwitchRPCEnhanced/tree/master/assets/Discord%20Assests) images within the directory, these are required to provide fallback console images to Discord for games currently without any box-art.  The expected filenames of the discord assets can be found by going to the *Game Box Art Manager* and searching for game titles... this is explained more in the screenshots shown later.

## 

The project this was built from is explained more below... all of this still applies really i.e. it doesn't directly use a Nintendo API and is a completely independent and manual way of doing this as locally as possible, it's just a stand-alone application.

### Explanation:

An enhanced implementation of Discord Rich Presence for the Nintendo Switch/Switch 2. Instead of directly interfacing with Nintendo's servers like [nxapi](https://github.com/samuelthomas2774/nxapi), the app allows you to manually set your Rich Presence by setting a game and a description. While not automatic, this method is reliable and is not going to break when Nintendo updates their APIs, unlike nxapi. This project is mainly intended as a backup in case nxapi stops working, but it can also be used in its own right.

### Why a fork?

This fork of the original SwitchRPC was made because it was seemingly abandoned in 2020, leaving only a very small and outdated list of supported titles. The supported title list for the original project was also hosted remotely on the developer's server, making it impossible to update it manually. I would normally be way out of my depth programming something like this from scratch, but fortunately the codebase for SwitchRPC is very small and easy to understand, so I was able to create a fork without much issue. After figuring out how the app worked and how to modify the title list, I decided to make this fork so that the app could be made more useful by adding more titles.

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

*You can click the "Add Game Cover" button to imported box-art images to the correct folder ([assets/Game Box Arts](https://github.com/leonhartm47/SwitchRPCEnhanced/tree/master/assets/Game%20Box%20Arts)) these will be shown near the top, the images must match their "expected filename" in order to display in the app library, this is explained more below...*
<p>
<img width="671" height="524" alt="image" src="https://github.com/user-attachments/assets/f895332e-4418-49be-be97-c2efaa9a23e7" />
</p>

*Further down you can "search for the game title" you want to check the "current box-art/discord registration status" for, by default it will show the box-art for the console of the game it's played on (this is a fallback for missing artwork) unless there's an box-art image already imported for that specific game in the correct folder ([assets/Game Box Arts](https://github.com/leonhartm47/SwitchRPCEnhanced/tree/master/assets/Game%20Box%20Arts)), if it matches the "expected filename" it will show in the local artwork on the app automatically.*

*For Discord you can choose to either keep the standard console image or if the box-art has been uploaded already to the "[Discord Developer Portal](https://discord.com/developers/home)" under the name shown next to the "Discord asset key", you can click the "Register Discord Asset" key to override the default console image and allow it to use the Discord asset image instead.  Where it says "Discord image" it shows what the current image is set to show on Discord when you use the feature... don't worry if you register one which isn't already added to the portal it'll fallback anyway to the console image, just you'll need to upload the correct box-art as an asset for it to show on Discord.*
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

*Your game will also appear in the category it was added to at the very bottom of the list, you can add box-art for these as shown earlier*
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

[queenbiscuit](https://github.com/queenbiscuit311/SwitchRPCUpdated) for creating the SwitchUpdated version.

[realdevon](https://github.com/realdevon) for creating the original SwitchRPC.

[simonliii](https://github.com/simonliii) for creating pull request realdevon/SwitchRPC/[#59](https://github.com/realdevon/SwitchRPC/pull/59), which made the games list clickable.

[davidcralph](https://github.com/davidcralph) for creating pull request realdevon/SwitchRPC/[#17](https://github.com/realdevon/SwitchRPC/pull/17), which replaced the `request` package with `axios`.

## Copyright Acknowledgements

### Copyright 2018-2021 NintenZone Technologies. Nintendo Switch, Nintendo Switch 2, the Nintendo Switch logos, and Nintendo Switch 2 logos are property of Nintendo.
