
// SwitchRPCEnhanced
// Custom games and Discord asset records are stored in Electron's userData folder.

const DISCORD_APP_ID = '1571385607022710894';

const fs = require('fs');
const path = require('path');
const DiscordRPC = require('discord-rpc');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

let rpcLoginPromise = null;
let rpcConnected = false;
let data;
let mainWindow;
let name = '';
let desc = '';
let customGames = [];
let customGamesFile = '';
let discordAssetsFile = '';
let discordAssets = [];

const DISCORD_ARTWORK_DIR = path.join(__dirname, 'assets', 'Discord Assests');
const GAME_BOX_ARTS_DIR = path.join(__dirname, 'assets', 'Game Box Arts');

const DEFAULT_DISCORD_ASSETS = [
    'gameboy',
    'gamecube',
    'gba',
    'megadrive',
    'n64',
    'n64_mature',
    'nes',
    'nso',
    'snes',
    'switch',
    'switch2',
    'virtualboy'
];

const CONSOLE_ARTWORK_KEYS = new Set(DEFAULT_DISCORD_ASSETS);

const NSO_CONSOLE_KEYS = new Set([
    'nes', 'snes', 'gameboy', 'gba', 'n64',
    'n64_mature', 'megadrive', 'gamecube', 'virtualboy'
]);

const LEGACY_CONSOLE_KEYS = new Set([
    'smd',
    'superfamicom',
    'famicom'
]);

app.commandLine.appendSwitch('disable-seccomp-filter-sandbox');


function reloadGameLibrary() {
    try {
        const rpcFile = require.resolve('./resources/rpc.json');

        delete require.cache[rpcFile];

        data = require(rpcFile);

        console.log('RPC game library reloaded successfully.');
        return true;
    } catch (error) {
        console.error('Could not reload the local game library:', error);
        return false;
    }
}

reloadGameLibrary();

function ensureArtworkFolders() {
    fs.mkdirSync(DISCORD_ARTWORK_DIR, { recursive: true });
    fs.mkdirSync(GAME_BOX_ARTS_DIR, { recursive: true });
}

async function connectToDiscord() {
    if (rpcConnected) return true;
    if (rpcLoginPromise) return rpcLoginPromise;

    rpcLoginPromise = rpc.login({ clientId: DISCORD_APP_ID })
        .then(() => {
            rpcConnected = true;
            console.log('Connected to Discord Rich Presence.');
            return true;
        })
        .catch(error => {
            rpcConnected = false;
            console.error('Could not connect to Discord:', error);
            return false;
        })
        .finally(() => {
            rpcLoginPromise = null;
        });

    return rpcLoginPromise;
}

function cleanText(value, maxLength = 120) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength);
}

function normaliseCategory(value) {
    const category = String(value || '').toLowerCase();

    if (category === 'switch2' || category.includes('switch 2')) return 'switch2';
    if (category === 'nso' || category.includes('online')) return 'nso';

    return 'switch';
}

function cleanArtworkName(value) {
    if (typeof value !== 'string') return '';

    const filename = value.trim().replace(/\.(png|jpe?g|webp)$/i, '');

    return /^[a-zA-Z0-9_-]+$/.test(filename)
        ? filename.toLowerCase()
        : '';
}

// Generate the expected local PNG filename from the game title.
function generateGameArtworkFilename(game) {
    const title = String(
        typeof game === 'string' ? game : (game && game.name) || ''
    );

    const slug = title
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    return slug ? slug + '.png' : '';
}

// Check that a real PNG exists in the individual game artwork folder.
function getAvailableGameBoxArt(game) {
    ensureArtworkFolders();

    const filename = generateGameArtworkFilename(game);

    if (!filename) return '';

    const imagePath = path.join(GAME_BOX_ARTS_DIR, filename);

    return fs.existsSync(imagePath)
        ? filename.replace(/\.png$/i, '')
        : '';
}

function getNSOConsoleArtwork(game) {
    const title = String(game.name || '').toLowerCase();

    if (/nintendo 64 mature|n64 mature/.test(title)) return 'n64_mature';
    if (/super famicom|famicom/.test(title)) return 'snes';
    if (/gamecube/.test(title)) return 'gamecube';
    if (/virtual boy/.test(title)) return 'virtualboy';
    if (/mega drive|\bsmd\b/.test(title)) return 'megadrive';
    if (/\bnes\b/.test(title)) return 'nes';
    if (/\bsnes\b/.test(title)) return 'snes';
    if (/game boy advance|\bgba\b/.test(title)) return 'gba';
    if (/game boy/.test(title)) return 'gameboy';
    if (/\bn64\b|nintendo 64/.test(title)) return 'n64';

    return 'switch';
}

function getConsoleArtwork(game) {
    const category = normaliseCategory(game.category || game.platform);

    if (category === 'nso') {
        if (game.isCustom) {
            const selected = cleanArtworkName(game.nsoConsole);

            return selected && NSO_CONSOLE_KEYS.has(selected)
                ? selected
                : 'nso';
        }

        const requested = cleanArtworkName(game.pic);

        if (requested === 'nso') return 'nso';
        if (requested === 'unassigned') return getNSOConsoleArtwork(game);
        if (requested === 'famicom') return 'nes';
        if (requested === 'superfamicom') return 'snes';
        if (requested === 'smd') return 'megadrive';

        if (
            requested &&
            CONSOLE_ARTWORK_KEYS.has(requested) &&
            requested !== 'switch'
        ) {
            return requested;
        }

        return getNSOConsoleArtwork(game);
    }

    if (category === 'switch2') return 'switch2';

    return 'switch';
}

function getConsoleDisplayName(game) {
    const artwork = getConsoleArtwork(game);
    const category = normaliseCategory(game.category || game.platform);

    const displayNames = {
        gameboy: 'Game Boy',
        gamecube: 'Nintendo GameCube',
        gba: 'Game Boy Advance',
        megadrive: 'SEGA Mega Drive',
        n64: 'Nintendo 64',
        n64_mature: 'Nintendo 64',
        nes: 'Nintendo Entertainment System',
        nso: 'Nintendo Switch Online',
        snes: 'Super Nintendo',
        virtualboy: 'Virtual Boy',
        switch: 'Nintendo Switch',
        switch2: 'Nintendo Switch 2'
    };

    if (category === 'nso' && artwork === 'switch') {
        return 'Nintendo Switch Online';
    }

    return displayNames[artwork] || 'Nintendo Switch';
}

function getDiscordSmallImageKey(game) {
    if (!game) return 'switch';

    const available = new Set(discordAssets);
    const consoleArtwork = getConsoleArtwork(game);

    if (available.has(consoleArtwork)) {
        return consoleArtwork;
    }

    const category = normaliseCategory(game.category || game.platform);

    if (category === 'switch2' && available.has('switch2')) {
        return 'switch2';
    }

    if (available.has('switch')) {
        return 'switch';
    }

    return 'switch';
}

// Individual game covers are selected only when the corresponding PNG exists.
function addLocalArtwork(game) {
    const boxArt = getAvailableGameBoxArt(game);
    const fallbackArt = getConsoleArtwork(game);

    return {
        ...game,
        boxArt: boxArt || '',
        fallbackArt: fallbackArt || 'switch'
    };
}

function loadCustomGames() {
    customGamesFile = path.join(app.getPath('userData'), 'custom-games.json');

    try {
        fs.mkdirSync(path.dirname(customGamesFile), { recursive: true });

        if (!fs.existsSync(customGamesFile)) {
            customGames = [];
            return;
        }

        const saved = JSON.parse(fs.readFileSync(customGamesFile, 'utf8'));

        customGames = Array.isArray(saved)
            ? saved.map(game => {
                const gameName = cleanText(game && game.name);
                if (!gameName) return null;

                const aliases = Array.isArray(game.aliases)
                    ? [...new Set(
                        game.aliases
                            .map(alias => cleanText(alias, 120))
                            .filter(Boolean)
                    )]
                    : [];

                const category = normaliseCategory(game.category);
                const requestedNSOConsole = cleanArtworkName(game.nsoConsole);

                const nsoConsole = category === 'nso' &&
                    NSO_CONSOLE_KEYS.has(requestedNSOConsole)
                    ? requestedNSOConsole
                    : '';

                return {
                    name: gameName,
                    category,
                    aliases,
                    nsoConsole,
                    pic: category === 'switch2'
                        ? 'switch2'
                        : category === 'nso'
                            ? 'nso'
                            : 'switch',
                    isCustom: true
                };
            }).filter(Boolean)
            : [];
    } catch (error) {
        console.error('Could not load custom games:', error);
        customGames = [];
    }
}

function saveCustomGames(gamesToSave) {
    const temporaryFile = customGamesFile + '.tmp';

    fs.writeFileSync(
        temporaryFile,
        JSON.stringify(gamesToSave, null, 2),
        'utf8'
    );

    fs.renameSync(temporaryFile, customGamesFile);
}

function loadDiscordAssets() {
    discordAssetsFile = path.join(
        app.getPath('userData'),
        'discord-assets.json'
    );

    try {
        fs.mkdirSync(path.dirname(discordAssetsFile), {
            recursive: true
        });

        if (!fs.existsSync(discordAssetsFile)) {
            discordAssets = [...DEFAULT_DISCORD_ASSETS];
            saveDiscordAssets();
            return;
        }

        const saved = JSON.parse(
            fs.readFileSync(discordAssetsFile, 'utf8')
        );

        discordAssets = Array.isArray(saved)
            ? [...new Set([
                ...DEFAULT_DISCORD_ASSETS,
                ...saved.map(cleanArtworkName).filter(Boolean)
            ])]
            : [...DEFAULT_DISCORD_ASSETS];

        saveDiscordAssets();
    } catch (error) {
        console.error(
            'Could not load Discord asset list:',
            error
        );

        discordAssets = [...DEFAULT_DISCORD_ASSETS];
    }
}

function saveDiscordAssets() {
    const temporaryFile = discordAssetsFile + '.tmp';

    fs.writeFileSync(
        temporaryFile,
        JSON.stringify(discordAssets, null, 2),
        'utf8'
    );

    fs.renameSync(temporaryFile, discordAssetsFile);
}

function getBuiltInGames() {
    if (!data || !Array.isArray(data.gameLibrary)) return [];

    const gamesByName = new Map();

    data.gameLibrary
        .filter(game =>
            typeof game === 'string' ||
            (game && typeof game.name === 'string' && game.name.trim())
        )
        .map(game => {
            if (typeof game === 'string') {
                return {
                    name: game.trim(),
                    category: 'switch',
                    pic: 'switch',
                    aliases: [],
                    isCustom: false
                };
            }

            return {
                ...game,
                name: cleanText(game.name),
                category: normaliseCategory(game.category || game.platform),
                pic: game.pic || 'switch',
                aliases: Array.isArray(game.aliases) ? game.aliases : [],
                isCustom: false
            };
        })
        .filter(game => game.name)
        .forEach(game => {
            const key = game.name.toLocaleLowerCase();

            if (!gamesByName.has(key)) {
                gamesByName.set(key, {
                    ...game,
                    aliases: [...new Set(game.aliases)]
                });
                return;
            }

            const existing = gamesByName.get(key);

            existing.aliases = [
                ...new Set([...existing.aliases, ...game.aliases])
            ];

            if (!existing.pic && game.pic) existing.pic = game.pic;
            if (!existing.boxArt && game.boxArt) existing.boxArt = game.boxArt;

            if (!existing.fallbackArt && game.fallbackArt) {
                existing.fallbackArt = game.fallbackArt;
            }
        });

    return Array.from(gamesByName.values()).map(addLocalArtwork);
}

function getGameBoxArtFiles() {
    try {
        ensureArtworkFolders();

        return fs.readdirSync(GAME_BOX_ARTS_DIR)
            .filter(file => /\.png$/i.test(file))
            .sort((a, b) => a.localeCompare(b));
    } catch (error) {
        console.error('Could not read game box art folder:', error);
        return [];
    }
}

function getConsoleArtworkFiles() {
    try {
        ensureArtworkFolders();

        return fs.readdirSync(DISCORD_ARTWORK_DIR)
            .filter(file => /\.(png|jpe?g|webp)$/i.test(file))
            .map(file => path.basename(file, path.extname(file)).toLowerCase())
            .sort();
    } catch (error) {
        console.error('Could not read console artwork folder:', error);
        return [];
    }
}

function getLocalArtworkCandidates(game) {
    const category = normaliseCategory(game.category);
    const candidates = [];

    if (game.boxArt) {
        candidates.push({
            folder: 'box',
            name: cleanArtworkName(game.boxArt)
        });
    }

    if (game.fallbackArt) {
        candidates.push({
            folder: 'console',
            name: cleanArtworkName(game.fallbackArt)
        });
    }

    const consoleFallback = category === 'nso'
        ? 'nso'
        : category === 'switch2'
            ? 'switch2'
            : 'switch';

    candidates.push({
        folder: 'console',
        name: consoleFallback
    });

    const seen = new Set();

    return candidates.filter(candidate => {
        if (!candidate.name) return false;

        const key = candidate.folder + ':' + candidate.name;

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
}

// Discord uses uploaded Developer Portal assets, not local file paths.
function getDiscordImageKey(game) {
    if (!game) return 'switch';

    const available = new Set(discordAssets);
    const localBoxArt = getAvailableGameBoxArt(game);
    const requestedPic = cleanArtworkName(game.pic);

    const isGameAsset = requestedPic &&
        requestedPic !== 'unassigned' &&
        !CONSOLE_ARTWORK_KEYS.has(requestedPic) &&
        !LEGACY_CONSOLE_KEYS.has(requestedPic);

    const individualAssetKey = isGameAsset
        ? requestedPic
        : localBoxArt;

    if (
        localBoxArt &&
        individualAssetKey &&
        available.has(individualAssetKey)
    ) {
        return individualAssetKey;
    }

    const category = normaliseCategory(game.category || game.platform);
    const fallback = getConsoleArtwork(game);

    if (available.has(fallback)) {
        return fallback;
    }

    if (category === 'nso' && available.has('nso')) {
        return 'nso';
    }

    if (category === 'switch2' && available.has('switch2')) {
        return 'switch2';
    }

    return 'switch';
}

// Find generated filenames shared by multiple games.
function getArtworkFilenameConflicts(games) {
    const filenameGroups = new Map();

    games.forEach(game => {
        const filename = generateGameArtworkFilename(game);

        if (!filename) return;

        const key = filename.toLowerCase();

        if (!filenameGroups.has(key)) {
            filenameGroups.set(key, []);
        }

        filenameGroups.get(key).push(game.name);
    });

    const conflicts = new Map();

    filenameGroups.forEach((gameNames, filename) => {
        if (gameNames.length > 1) {
            gameNames.forEach(gameName => {
                conflicts.set(gameName.toLocaleLowerCase(), {
                    filename,
                    games: gameNames
                });
            });
        }
    });

    return conflicts;
}

// Check whether a new or renamed custom game would share a generated filename.
function findArtworkFilenameConflict(gameName, otherGames) {
    const filename = generateGameArtworkFilename(gameName);

    if (!filename) return null;

    const matchingGame = otherGames.find(game =>
        generateGameArtworkFilename(game).toLowerCase() ===
        filename.toLowerCase()
    );

    return matchingGame
        ? {
            filename,
            game: matchingGame.name
        }
        : null;
}

function getArtworkInventory() {
    const gameBoxArtFiles = getGameBoxArtFiles();
    const consoleArtworkFiles = getConsoleArtworkFiles();

    const gameBoxArtSet = new Set(
        gameBoxArtFiles.map(file =>
            path.basename(file, path.extname(file)).toLowerCase()
        )
    );

    const consoleSet = new Set(consoleArtworkFiles);
    const discordSet = new Set(discordAssets);

    const allGames = [
        ...getBuiltInGames(),
        ...customGames.map(addLocalArtwork)
    ];

    const filenameConflicts = getArtworkFilenameConflicts(allGames);

    const games = allGames.map(game => {
        const requested = cleanArtworkName(game.pic);
        const boxArt = cleanArtworkName(game.boxArt);
        const fallback = getConsoleArtwork(game);

        const generatedFilename = generateGameArtworkFilename(game);
        const generatedSlug = generatedFilename
            ? generatedFilename.replace(/\.png$/i, '')
            : '';

        const expectedFilename = generatedFilename;

        const localCoverAvailable = !!(
            generatedSlug && gameBoxArtSet.has(generatedSlug)
        );

        const isGameAsset = requested &&
            requested !== 'unassigned' &&
            !CONSOLE_ARTWORK_KEYS.has(requested) &&
            !LEGACY_CONSOLE_KEYS.has(requested);

        const discordAssetKey = isGameAsset
            ? requested
            : generatedSlug;

        const discordAssetRegistered = !!(
            localCoverAvailable &&
            discordAssetKey &&
            discordSet.has(discordAssetKey)
        );

        const effectiveAsset = getDiscordImageKey(game);
        const fallbackAvailable = consoleSet.has(fallback);

        const filenameConflict = filenameConflicts.get(
            game.name.toLocaleLowerCase()
        );

        return {
            name: game.name,
            category: game.category,

            requestedAsset: requested || '',
            boxArt: boxArt || '',
            expectedFilename,

            discordAssetKey: discordAssetKey || '',
            localCoverAvailable,
            discordAssetRegistered,

            filenameConflict: !!filenameConflict,
            filenameConflictWith: filenameConflict
                ? filenameConflict.games.filter(
                    gameName => gameName !== game.name
                )
                : [],

            fallbackAsset: fallback,
            fallbackAvailable,

            effectiveAsset,

            localCandidates: getLocalArtworkCandidates(game)
        };
    });

    return {
        gameBoxArtFiles,
        consoleArtworkFiles,
        discordAssets: [...discordAssets].sort(),
        games
    };
}

function sendArtworkData(sender) {
    if (sender && !sender.isDestroyed()) {
        sender.send('artworkManagerData', getArtworkInventory());
    }
}

function sendGameData(sender) {
    if (sender && !sender.isDestroyed()) {
        sender.send('sendingGameData', {
            builtIn: getBuiltInGames(),
            custom: customGames,
            gameDescriptions: data && Array.isArray(data.gameDescriptions)
                ? data.gameDescriptions
                : []
        });
    }
}

function nameKeys(game) {
    return [
        game && game.name,
        ...(Array.isArray(game && game.aliases) ? game.aliases : [])
    ]
        .filter(value => typeof value === 'string' && value.trim())
        .map(value => value.trim().toLocaleLowerCase());
}

function addCustomGame(sender, input) {
    const gameName = cleanText(input && input.name);

    if (!gameName) {
        sender.send('gameAdded', {
            success: false,
            message: 'Enter a game title.'
        });
        return;
    }

    const category = normaliseCategory(input && input.category);
    const aliasesInput = Array.isArray(input && input.aliases)
        ? input.aliases
        : [];

    const aliases = [...new Set(
        aliasesInput
            .map(alias => cleanText(alias, 120))
            .filter(alias =>
                alias &&
                alias.toLocaleLowerCase() !== gameName.toLocaleLowerCase()
            )
    )];

    const requestedNSOConsole = cleanArtworkName(input && input.nsoConsole);

    const nsoConsole = category === 'nso' &&
        NSO_CONSOLE_KEYS.has(requestedNSOConsole)
        ? requestedNSOConsole
        : '';

    const candidateKeys = new Set(
        [gameName, ...aliases].map(value => value.toLocaleLowerCase())
    );

    const existingGames = [...getBuiltInGames(), ...customGames];

    const duplicate = existingGames.find(game =>
        nameKeys(game).some(key => candidateKeys.has(key))
    );

    if (duplicate) {
        sender.send('gameAdded', {
            success: false,
            message: `"${duplicate.name}" or one of its aliases is already in the library.`
        });
        return;
    }

    const filenameConflict = findArtworkFilenameConflict(
        gameName,
        existingGames
    );

    if (filenameConflict) {
        sender.send('gameAdded', {
            success: false,
            message: `"${gameName}" would use ${filenameConflict.filename}, which is already used by "${filenameConflict.game}". Choose a different title to avoid sharing artwork.`
        });
        return;
    }

    const newGame = {
        name: gameName,
        category,
        aliases,
        nsoConsole,
        pic: category === 'switch2'
            ? 'switch2'
            : category === 'nso'
                ? 'nso'
                : 'switch',
        isCustom: true
    };

    const updatedGames = [...customGames, newGame];

    try {
        saveCustomGames(updatedGames);
        customGames = updatedGames;

        sender.send('gameAdded', {
            success: true,
            message: `${gameName} was added to Custom Games.`
        });

        sendGameData(sender);
    } catch (error) {
        console.error('Could not save custom game:', error);

        sender.send('gameAdded', {
            success: false,
            message: 'The game could not be saved. Check the app folder permissions and try again.'
        });
    }
}

function editCustomGame(sender, input) {
    const originalName = cleanText(input.originalName, 120);
    const gameName = cleanText(input.name, 120);
    const category = normaliseCategory(input.category);

    const aliases = Array.isArray(input.aliases)
        ? [...new Set(input.aliases
            .map(alias => cleanText(alias, 120))
            .filter(alias =>
                alias &&
                alias.toLocaleLowerCase() !== gameName.toLocaleLowerCase()
            ))]
        : [];

    if (!originalName || !gameName || !category) {
        sender.send('customGameEdited', {
            success: false,
            message: 'Please provide a game name and platform.'
        });
        return;
    }

    const existing = customGames.find(game =>
        game.name.toLocaleLowerCase() === originalName.toLocaleLowerCase()
    );

    if (!existing) {
        sender.send('customGameEdited', {
            success: false,
            message: 'That custom game could not be found.'
        });
        return;
    }

    const requestedNSOConsole = cleanArtworkName(input.nsoConsole);

    const nsoConsole = category === 'nso' &&
        NSO_CONSOLE_KEYS.has(requestedNSOConsole)
        ? requestedNSOConsole
        : '';

    const candidateKeys = new Set([
        gameName.toLocaleLowerCase(),
        ...aliases.map(alias => alias.toLocaleLowerCase())
    ]);

    const otherGames = [
        ...getBuiltInGames(),
        ...customGames.filter(game => game !== existing)
    ];

    const duplicate = otherGames.some(game =>
        nameKeys(game).some(key => candidateKeys.has(key))
    );

    if (duplicate) {
        sender.send('customGameEdited', {
            success: false,
            message: 'That game name or one of its aliases is already in the library.'
        });
        return;
    }

    const filenameConflict = findArtworkFilenameConflict(
        gameName,
        otherGames
    );

    if (filenameConflict) {
        sender.send('customGameEdited', {
            success: false,
            message: `"${gameName}" would use ${filenameConflict.filename}, which is already used by "${filenameConflict.game}". Choose a different title to avoid sharing artwork.`
        });
        return;
    }

    const updatedGame = {
        ...existing,
        name: gameName,
        category,
        aliases,
        nsoConsole,
        pic: category === 'switch2'
            ? 'switch2'
            : category === 'nso'
                ? 'nso'
                : 'switch',
        isCustom: true
    };

    const updatedGames = customGames.map(game =>
        game === existing ? updatedGame : game
    );

    try {
        saveCustomGames(updatedGames);
        customGames = updatedGames;

        sender.send('customGameEdited', {
            success: true,
            originalName: existing.name,
            name: gameName,
            message: `${gameName} was updated successfully.`
        });

        sendGameData(sender);
    } catch (error) {
        console.error('Could not edit custom game:', error);

        sender.send('customGameEdited', {
            success: false,
            message: 'The custom game could not be updated. Please try again.'
        });
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, 'build', 'icon.ico'),
        width: 900,
        height: 700,
        minWidth: 680,
        minHeight: 560,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.setMenu(null);

    if (!data || !Array.isArray(data.gameLibrary)) {
        mainWindow.loadFile('error.html');
        return;
    }

    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Initialise the app.
app.whenReady().then(() => {
    ensureArtworkFolders();
    loadCustomGames();
    loadDiscordAssets();
    createWindow();
});

app.on('window-all-closed', () => app.quit());


ipcMain.on('getGameData', event => {
    reloadGameLibrary();
    loadCustomGames();
    sendGameData(event.sender);
});

ipcMain.on('addGame', (event, input) => addCustomGame(event.sender, input || {}));
ipcMain.on('editCustomGame', (event, input) => editCustomGame(event.sender, input || {}));

// Return the PNG files in the Game Box Arts folder.
ipcMain.on('getBoxArtFiles', event => {
    try {
        ensureArtworkFolders();

        const files = getGameBoxArtFiles();
        const inventory = getArtworkInventory();

        console.log(
            'Artwork inventory games:',
            inventory.games.length
        );

        console.log(
            'Tetris 99 artwork:',
            inventory.games.find(game =>
                game.name.toLowerCase().includes('tetris 99')
            )
        );

        event.sender.send('boxArtFiles', {
            success: true,
            files,
            inventory
        });
    } catch (error) {
        console.error('Could not read game box art folder:', error);

        event.sender.send('boxArtFiles', {
            success: false,
            error: error.message
        });
    }
});

// Import a PNG into Game Box Arts.
ipcMain.on('importBoxArt', async event => {
    try {
        ensureArtworkFolders();

        const result = await dialog.showOpenDialog({
            title: 'Choose game box art',
            properties: ['openFile'],
            filters: [
                { name: 'PNG Images', extensions: ['png'] }
            ]
        });

        if (result.canceled || !result.filePaths.length) {
            event.sender.send('boxArtImported', {
                success: false,
                message: 'Import cancelled.'
            });
            return;
        }

        const source = result.filePaths[0];
        const originalName = path.basename(source, path.extname(source));

        // Use the same slug convention as generated game artwork filenames.
        const safeName = originalName
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');

        if (!safeName) {
            event.sender.send('boxArtImported', {
                success: false,
                message: 'That filename is not valid.'
            });
            return;
        }

        const destination = path.join(
            GAME_BOX_ARTS_DIR,
            safeName + '.png'
        );

        fs.copyFileSync(source, destination);

        event.sender.send('boxArtImported', {
            success: true,
            message: 'Imported ' + safeName + '.png into Game Box Arts.'
        });

        sendArtworkData(event.sender);
        sendGameData(event.sender);
    } catch (error) {
        console.error('Could not import game box art:', error);

        event.sender.send('boxArtImported', {
            success: false,
            message: error.message
        });
    }
});

ipcMain.on('removeCustomGame', (event, gameName) => {
    const targetName = cleanText(gameName, 120).toLocaleLowerCase();

    const existing = customGames.find(game =>
        game.name.toLocaleLowerCase() === targetName
    );

    if (!existing) {
        event.sender.send('customGameRemoved', {
            success: false,
            message: 'That custom game could not be found.'
        });
        return;
    }

    const updatedGames = customGames.filter(game =>
        game.name.toLocaleLowerCase() !== targetName
    );

    try {
        saveCustomGames(updatedGames);
        customGames = updatedGames;

        event.sender.send('customGameRemoved', {
            success: true,
            name: existing.name,
            message: `${existing.name} was removed from Custom Games.`
        });

        sendGameData(event.sender);
    } catch (error) {
        console.error('Could not remove custom game:', error);

        event.sender.send('customGameRemoved', {
            success: false,
            message: 'The custom game could not be removed. Please try again.'
        });
    }
});

// Artwork Manager data.
ipcMain.on('getArtworkData', event => sendArtworkData(event.sender));

// Register an asset after uploading it in the Discord Developer Portal.
ipcMain.on('registerDiscordAsset', (event, value) => {
    const assetName = cleanArtworkName(value);

    if (!assetName) {
        event.sender.send('artworkActionResult', {
            success: false,
            message: 'Use letters, numbers, underscores or hyphens for the asset name.'
        });
        return;
    }

    if (discordAssets.includes(assetName)) {
        event.sender.send('artworkActionResult', {
            success: false,
            message: `${assetName} is already in your Discord asset list.`
        });
        return;
    }

    try {
        discordAssets.push(assetName);
        discordAssets.sort();
        saveDiscordAssets();

        event.sender.send('artworkActionResult', {
            success: true,
            message: `${assetName} was added to your Discord asset list.`
        });

        sendArtworkData(event.sender);
    } catch (error) {
        console.error('Could not save Discord asset list:', error);

        event.sender.send('artworkActionResult', {
            success: false,
            message: 'Could not save the Discord asset list.'
        });
    }
});

// Remove an asset from the confirmed list. This does not delete it from Discord.
ipcMain.on('unregisterDiscordAsset', (event, value) => {
    const assetName = cleanArtworkName(value);

    if (!assetName || !discordAssets.includes(assetName)) return;

    try {
        discordAssets = discordAssets.filter(asset => asset !== assetName);
        saveDiscordAssets();

        event.sender.send('artworkActionResult', {
            success: true,
            message: `${assetName} was removed from the confirmed list.`
        });

        sendArtworkData(event.sender);
    } catch (error) {
        console.error('Could not update Discord asset list:', error);

        event.sender.send('artworkActionResult', {
            success: false,
            message: 'Could not update the Discord asset list.'
        });
    }
});

// Choose a PNG and copy it into Game Box Arts.
ipcMain.on('addLocalArtwork', async (event, requestedName) => {
    const artworkName = cleanArtworkName(requestedName);

    if (!artworkName) {
        event.sender.send('artworkActionResult', {
            success: false,
            message: 'Enter a valid filename first.'
        });
        return;
    }

    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            title: 'Choose game box art',
            properties: ['openFile'],
            filters: [{ name: 'PNG images', extensions: ['png'] }]
        });

        if (result.canceled || !result.filePaths.length) return;

        ensureArtworkFolders();

        const destination = path.join(
            GAME_BOX_ARTS_DIR,
            artworkName + '.png'
        );

        fs.copyFileSync(result.filePaths[0], destination);

        event.sender.send('artworkActionResult', {
            success: true,
            message: `${artworkName}.png was added to Game Box Arts.`
        });

        sendArtworkData(event.sender);
        sendGameData(event.sender);
    } catch (error) {
        console.error('Could not add game box art:', error);

        event.sender.send('artworkActionResult', {
            success: false,
            message: 'Could not add that image. Check the file and folder permissions.'
        });
    }
});

// Window controls.
ipcMain.on('x', () => app.quit());

ipcMain.on('max', () => {
    if (!mainWindow) return;

    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on('min', () => {
    if (mainWindow) mainWindow.minimize();
});

// Receive selected game.
ipcMain.on('game:value', (event, value) => {
    name = cleanText(value, 200);
});

// Receive description and update Discord.
ipcMain.on('desc:value', (event, value) => {
    desc = cleanText(value, 200);
    findGame(event.sender);
});

// Match built-in games first. Custom and manual titles use generic Switch artwork.
async function findGame(sender) {
    if (!name) return;

    const searchName = name.toLocaleLowerCase();
    const allGames = [...getBuiltInGames(), ...customGames];

    const matchedGame = allGames.find(game => {
        if (game.name && game.name.toLocaleLowerCase() === searchName) {
            return true;
        }

        return Array.isArray(game.aliases) &&
            game.aliases.some(alias =>
                typeof alias === 'string' &&
                alias.toLocaleLowerCase() === searchName
            );
    });

    const gameTitle = matchedGame ? matchedGame.name : name;
    const imageKey = matchedGame ? getDiscordImageKey(matchedGame) : 'switch';

    const smallImageKey = matchedGame
        ? getDiscordSmallImageKey(matchedGame)
        : 'switch';

    const smallImageText = matchedGame
        ? getConsoleDisplayName(matchedGame)
        : 'Nintendo Switch';

    const success = await setPresence(
        gameTitle,
        desc,
        imageKey,
        smallImageKey,
        smallImageText
    );

    if (sender && !sender.isDestroyed()) {
        sender.send('activityUpdated', {
            success,
            game: gameTitle
        });
    }
}

async function setPresence(
    game,
    description,
    imageKey,
    smallImageKey,
    smallImageText
) {
    const presenceDescription =
        description && description.length >= 2 ? description : 'Online';

    try {
        const connected = await connectToDiscord();

        if (!connected) {
            console.error('Discord RPC is not connected.');
            return false;
        }

        await rpc.setActivity({
            state: presenceDescription,
            details: game,
            largeImageKey: imageKey,
            largeImageText: game,
            smallImageKey: smallImageKey,
            smallImageText: smallImageText
        });

        console.log(
            'Discord activity updated:',
            game,
            'Large image:',
            imageKey,
            'Small image:',
            smallImageKey
        );

        return true;
    } catch (error) {
        console.error('Could not update Discord Rich Presence:', error);
        return false;
    }
}

// Clear Discord Rich Presence without closing the app.
ipcMain.on('clearActivity', async event => {
    try {
        const connected = await connectToDiscord();

        if (!connected) {
            event.sender.send('activityCleared', {
                success: false,
                error: 'Could not connect to Discord.'
            });
            return;
        }

        await rpc.clearActivity(process.pid);

        name = '';
        desc = '';

        event.sender.send('activityCleared', {
            success: true
        });
    } catch (error) {
        console.error('Failed to clear Discord activity:', error);

        event.sender.send('activityCleared', {
            success: false,
            error: error.message
        });
    }
});

app.on('before-quit', () => {
    try {
        if (rpcConnected) {
            rpc.destroy();
            rpcConnected = false;
        }
    } catch (error) {
        console.error('Could not close Discord RPC cleanly:', error);
    }
});
