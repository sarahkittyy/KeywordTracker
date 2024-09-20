/**
 * @name KeywordTracker
 * @description Be notified when a message matches a keyword :)
 * @version 1.5.5
 * @author sawahkitty!~<3
 * @authorId 135895345296048128
 * @authorLink https://github.com/sarahkittyy
 * @website https://github.com/sarahkittyy/KeywordTracker
 * @source https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    info: {
        name: "KeywordTracker",
        authors: [
            {
                name: "sawahkitty!~<3",
                discord_id: "135895345296048128",
                github_username: "sarahkittyy",
                twitter_username: "snuggleskittyy"
            }
        ],
        version: "1.5.5",
        description: "Be notified when a message matches a keyword :)",
        github: "https://github.com/sarahkittyy/KeywordTracker",
        github_raw: "https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js",
        authorLink: "https://github.com/sarahkittyy",
        inviteCode: "0Tmfo5ZbORCRqbAd",
        paypalLink: "https://paypal.me/sarahkittyy",
        updateUrl: "https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js"
    },
    changelog: [
        {
            title: "v1.5.5",
            items: [
                "Fix deprecated GuildStore."
            ]
        },
        {
            title: "v1.5.4",
            items: [
                "Fixed for latest betterdiscord update."
            ]
        },
        {
            title: "v1.5.3",
            items: [
                "Typo"
            ]
        },
        {
            title: "v1.5.2",
            items: [
                "Fixed incorrect text coloring in empty inbox."
            ]
        },
        {
            title: "v1.5.1",
            items: [
                "Fixed light theme channel colors.",
                "Removed titles from marked as read and jump to buttons (replaced by tooltips)"
            ]
        },
        {
            title: "v1.5.0",
            items: [
                "Improved inbox icon",
                "Fixed(?) weird line divider in the toolbar sometimes",
                "No longer marks jumped-to messages as read by default.",
                "Added an option in settings to mark messages as read when jumping to them.",
                "Keywords can be filtered to just specific users, specific channels, and specific servers. Highly request feature I think!!! :3",
                "Brand new inbox panel with cleaner buttons and pretty regex markdown!! Thank you ewan for the pr :3.",
                "Cleanups and bugfixes"
            ]
        },
        {
            title: "v1.4.6",
            items: [
                "Bugfixes"
            ]
        },
        {
            title: "v1.4.5",
            items: [
                "Fixed for latest discord update."
            ]
        },
        {
            title: "v1.4.4",
            items: [
                "Fixed settings panel from not showing up."
            ]
        },
        {
            title: "v1.4.3",
            items: [
                "Fixed inbox not showing up."
            ]
        },
        {
            title: "v1.4.2",
            items: [
                "Removed test console log"
            ]
        },
        {
            title: "v1.4.1",
            items: [
                "Fixed after breaking discord update."
            ]
        },
        {
            title: "v1.4.0",
            items: [
                "New user-keyword tracking! See keyword input description for details."
            ]
        },
        {
            title: "v1.3.9",
            items: [
                "Fixed dirtyDispatch being removed"
            ]
        },
        {
            title: "v1.3.8",
            items: [
                "Improved embeds to not track unnecessary words.",
                "Allow bot messages to be enabled or disabled"
            ]
        },
        {
            title: "v1.3.7",
            items: [
                "A long requested feature: Keywords in embeds are now tracked! ^^"
            ]
        },
        {
            title: "v1.3.6",
            items: [
                "Fixed bug with indicator not showing up."
            ]
        },
        {
            title: "v1.3.5",
            items: [
                "Fixed crash."
            ]
        },
        {
            title: "v1.3.4",
            items: [
                "Removed unnecessary logging"
            ]
        },
        {
            title: "v1.3.3",
            items: [
                "Fixed clicking to notifications not jumping to location"
            ]
        },
        {
            title: "v1.3.2",
            items: [
                "Fixed notifications"
            ]
        },
        {
            title: "v1.3.1",
            items: [
                "Fixed user whitelist typo (thanks SoftwareSing)"
            ]
        },
        {
            title: "v1.3.0",
            items: [
                "Fixed issues caused by ZLib's update.",
                "Added toggle to let your own messages trigger notifications. Good for testing :)",
                "Inbox should now show up on languages that are not english."
            ]
        },
        {
            title: "v1.2.6",
            items: [
                "Fixed inbox panel not showing up."
            ]
        },
        {
            title: "v1.2.5",
            items: [
                "Fixed memory leak in inbox panel."
            ]
        },
        {
            title: "v1.2.4",
            items: [
                "Fixed order of changelog.",
                "Fixed the entire plugin, lol :)"
            ]
        },
        {
            title: "v1.2.3",
            items: [
                "Fixed crashing issue related to jumping to a matched keyword."
            ]
        },
        {
            title: "v1.2.2",
            items: [
                "Actually, for realsies, fixes the issue (Thanks Meduxa)"
            ]
        },
        {
            title: "v1.2.1",
            items: [
                "Hopefully fixes the issue of the keyword inbox button not appearing on some clients."
            ]
        },
        {
            title: "v1.2.0",
            items: [
                "Finally added an inbox, oh my god, why didn't I do this sooner.",
                "You can find all recent missed matches from the last 60 days right next to the pinned messages button."
            ]
        },
        {
            title: "v1.1.1",
            items: [
                "Added user whitelist to receive all messages from a specific user. (Thank you @infernix!)",
                "Updated README.md"
            ]
        },
        {
            title: "v1.1.0",
            items: [
                "Updated descriptions for better clarity",
                "Added server name in notification",
                "Added more images",
                "Added mass guild toggle switch",
                "Added toggle switch to allow enabling / disabling of notification sounds.",
                "Added field where you can exclude certain users from notifying you."
            ]
        },
        {
            title: "v1.0.7",
            items: [
                "Added internal check to update when guild is newly joined"
            ]
        },
        {
            title: "v1.0.6",
            items: [
                "Fixed version not showing up on BD website"
            ]
        },
        {
            title: "v1.0.5",
            items: [
                "Fixed issue where notifications would not play a sound."
            ]
        },
        {
            title: "v1.0.4",
            items: [
                "Set all channels to be enabled by default"
            ]
        },
        {
            title: "v1.0.3",
            items: [
                "Fixed typo in RegexEscape",
                "Changed notification icon to sender's profile picture"
            ]
        },
        {
            title: "v1.0.2",
            items: [
                "Fixed dm channels causing console errors",
                "Fixed update url"
            ]
        },
        {
            title: "v1.0.1",
            items: [
                "Removed changes to global RegExp.escape",
                "Updated meta info"
            ]
        },
        {
            title: "Release",
            items: [
                "Initial release."
            ]
        }
    ],
    main: "index.js"
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Library) => {
	const switchCss = `/** Switch
 -------------------------------------*/

.switch input {
  position: absolute;
  opacity: 0;
}

/**
 * 1. Adjust this to size
 */

.switch {
  display: inline-block;
  font-size: 20px; /* 1 */
  height: 1em;
  width: 2em;
  background: #ADD8E6;
  border-radius: 1em;
}

.switch div {
  height: 1em;
  width: 1em;
  border-radius: 1em;
  background: #FFF;
  box-shadow: 0 0.1em 0.3em rgba(0,0,0,0.3);
  -webkit-transition: all 300ms;
     -moz-transition: all 300ms;
          transition: all 300ms;
}

.switch input:checked + div {
  -webkit-transform: translate3d(100%, 0, 0);
     -moz-transform: translate3d(100%, 0, 0);
          transform: translate3d(100%, 0, 0);
}

`;
	const inboxCss = `.kt-inbox-entry {
  padding: 5px;
  color: var(--text-normal);
}

.kt-inbox-entry:not(:last-child) {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--background-secondary-alt);
}

.kt-spacer {
  flex: 1;
}

.kt-entry-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kt-usericon {
  border-radius: 50%;
  width: 24px;
  height: 24px;
}

.kt-username {
  color: var(--text-normal);
  margin-left: -2px;
}

.kt-channel-container {
	width: 95%;
	margin-left: 2.5%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 3px;
}

.kt-channel-name {
  color: var(--header-primary);
  font-size: 16px;
}

.kt-timestamp {
  color: var(--text-muted);
  font-size: .75rem;
}

.kt-content {
  padding: 8px 0 5px;
  line-height: 1.25rem;
}

.kt-matched {
  color: var(--text-muted);
  font-size: .75rem;
  display: flex;
  align-items: center;
}

.kt-matched > code {
  background-color: var(--background-secondary);
  font-size: .75rem;
  border: 1px solid var(--background-tertiary);
  border-radius: 4px;
  padding: 3px 5px;
  margin-left: 3px;
  color: var(--text-secondary);
  max-width: 10px;
  overflow: hidden;
  white-space: nowrap;
  max-width: 250px;
  display: inline-block;
  text-overflow: ellipsis;
}

.kt-button {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: var(--background-secondary-alt);
  transition: background-color .2s;
}

.kt-button:hover {
  background-color: var(--background-tertiary);
}

.kt-button path {
  transition: fill .2s;
}

.kt-button:hover path {
  fill: var(--interactive-active);
}`;
	const iconSVG = `<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12,73.51q.2-34.74.39-69.38A3.21,3.21,0,0,1,15,1h0C23.4-.75,36.64-.31,45.63,3.14a35.46,35.46,0,0,1,16,11.65,37.34,37.34,0,0,1,16-11.15C86.12.4,99-.38,108.23,1A3.2,3.2,0,0,1,111,4.14h0V73.8A3.21,3.21,0,0,1,107.77,77a3.49,3.49,0,0,1-.74-.09A53.45,53.45,0,0,0,83.58,79.1a71,71,0,0,0-15.77,8.26,69.09,69.09,0,0,1,21.24-3.1,125.42,125.42,0,0,1,27.41,3.48V14.84h3.21a3.21,3.21,0,0,1,3.21,3.21V91.94a3.21,3.21,0,0,1-3.21,3.21,3.18,3.18,0,0,1-1-.17A121.77,121.77,0,0,0,89,90.65a61.89,61.89,0,0,0-25.76,5.26,3.39,3.39,0,0,1-3.64,0,61.86,61.86,0,0,0-25.76-5.26A121.77,121.77,0,0,0,4.24,95a3.18,3.18,0,0,1-1,.17A3.21,3.21,0,0,1,0,91.94V18.05a3.21,3.21,0,0,1,3.21-3.21H6.42v72.9a125.42,125.42,0,0,1,27.41-3.48,68.84,68.84,0,0,1,22.71,3.57A48.7,48.7,0,0,0,41,79.39c-7-2.3-17.68-3.07-25.49-2.4A3.21,3.21,0,0,1,12,74.06a5,5,0,0,1,0-.55ZM73.64,64.4a2.3,2.3,0,1,1-2.5-3.85,51.46,51.46,0,0,1,11.8-5.4,53.73,53.73,0,0,1,13-2.67,2.29,2.29,0,1,1,.25,4.58,49.42,49.42,0,0,0-11.79,2.46A46.73,46.73,0,0,0,73.64,64.4Zm.2-17.76a2.29,2.29,0,0,1-2.46-3.87,52.71,52.71,0,0,1,11.74-5.3A54.12,54.12,0,0,1,95.9,34.85a2.3,2.3,0,0,1,.25,4.59,49.3,49.3,0,0,0-11.63,2.4,48,48,0,0,0-10.68,4.8Zm.06-17.7a2.3,2.3,0,1,1-2.46-3.89,52.54,52.54,0,0,1,11.72-5.27,53.71,53.71,0,0,1,12.74-2.6,2.29,2.29,0,1,1,.25,4.58,49.35,49.35,0,0,0-11.59,2.39A47.91,47.91,0,0,0,73.9,28.94ZM51.74,60.55a2.3,2.3,0,1,1-2.5,3.85,46.73,46.73,0,0,0-10.72-4.88,49.42,49.42,0,0,0-11.79-2.46A2.29,2.29,0,1,1,27,52.48a53.73,53.73,0,0,1,13,2.67,51.46,51.46,0,0,1,11.8,5.4ZM51.5,42.77A2.29,2.29,0,0,1,49,46.64a48,48,0,0,0-10.68-4.8,49.3,49.3,0,0,0-11.63-2.4A2.3,2.3,0,0,1,27,34.85a54.12,54.12,0,0,1,12.78,2.62,52.71,52.71,0,0,1,11.74,5.3Zm-.06-17.72A2.3,2.3,0,1,1,49,28.94a47.91,47.91,0,0,0-10.66-4.79,49.35,49.35,0,0,0-11.59-2.39A2.29,2.29,0,1,1,27,17.18a53.71,53.71,0,0,1,12.74,2.6,52.54,52.54,0,0,1,11.72,5.27ZM104.56,7c-7.42-.7-18.06.12-24.73,2.65A30,30,0,0,0,64.7,21.46V81.72a76.76,76.76,0,0,1,16.72-8.66,62.85,62.85,0,0,1,23.14-2.87V7ZM58.28,81.1V21.37c-3.36-5.93-8.79-9.89-14.93-12.24-7-2.67-17.75-3.27-24.56-2.3l-.36,63.56c7.43-.27,17.69.68,24.52,2.91a54.94,54.94,0,0,1,15.33,7.8Z"/></path>`;
	const defaultSettings = {
		whitelistedUsers: [],
		keywords: [],
		ignoredUsers: [],
		guilds: {},
		enabled: true,
		unreadMatches: {},
		notifications: true,
		allowSelf: false,
		allowEmbeds: true,
		allowBots: true,
		markJumpedRead: false,
	};
	const {
		ReactTools,
		Logger,
		Settings,
		Utilities,
		PluginUtilities,
		Modals,
		Tooltip,
		Toasts: Toast,
		DiscordModules: Modules,
	} = Library;
	const {
		Patcher,
		Webpack,
		DOM,
		ReactUtils,
		React,
	} = BdApi;

	const NotificationModule = Webpack.getByKeys("showNotification");
	const ModalActions = Webpack.getByKeys("openModal", "updateModal");
	const ButtonData = Webpack.getByKeys("ButtonColors");
	const GuildStore = Webpack.getStore("GuildStore");

	const RegexEscape = function(string) {
		return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	const log = (...args) => {
		Logger.info(...args);
	};

	return class KeywordTracker extends Plugin {
		/**
		 * Plugin init
		 *
		 * @async
		 */
		async onStart() {
			PluginUtilities.addStyle(this.getName(), switchCss);
			PluginUtilities.addStyle(this.getName(), inboxCss);
			this.loadSettings();
			this.inboxPanel = null;

			let dispatchModule = Webpack.getByKeys('dispatch', 'subscribe');
			Patcher.after(this.getName(), dispatchModule, 'dispatch', this.handleMessage.bind(this));

			const stringFilter = BdApi.Webpack.Filters.byStrings(".GUILD_HOME");
			const keyFilter = BdApi.Webpack.Filters.byKeys("Icon", "Title");

			// patch the title bar to add the inbox button
			const [ titlebarModule, titlebarKey ] = Webpack.getWithKey((m) => keyFilter(m) && !stringFilter(m));
			Patcher.before(this.getName(), titlebarModule, titlebarKey, (that, [ props ]) => {
				if (props.toolbar.type === 'function') return;
				if (this.inboxPanel == null) { // build the panel if it's not already built
					this.inboxPanel = this.buildInboxPanel();
				}
				if (typeof props.toolbar.props.children[0].splice !== 'function') return; // make sure the splice function exists :p
				let idx = Math.max(3, props.toolbar.props.children[0].length - 1);
				// insert the panel
				props.toolbar.props.children[0].splice(idx, 0, this.inboxPanel);
			});

			this.userId = Modules.UserStore.getCurrentUser().id;

		}

		onStop() {
			this.saveSettings();

			Patcher.unpatchAll(this.getName());
			PluginUtilities.removeStyle(this.getName());
		}

		objectValues(object) {
			if (!object) return [];
			const res = [];
			for(const [k, v] of Object.entries(object)) {
				if (typeof v === 'object') {
					res.push(...this.objectValues(v));
				} else {
					res.push(v);
				}
			}
			return res;
		}

		// fired when a message is received
		handleMessage(_, args) {
			try {
				const guilds = Object.values(GuildStore.getGuilds());
				let event = args[0];
				if (event.type !== 'MESSAGE_CREATE') return;
				// get me  data
				let { message } = event;
				// get channel data
				let channel = Modules.ChannelStore.getChannel(message.channel_id);
				// assert message data is right
				if (!message.author) {
					message = Modules.MessageStore.getMessage(channel.id, message.id);
					if (!message || !message.author) return;
				}
				if (this.settings.allowSelf === false && message.author.id === this.userId) return;
				// ignore ignored users
				if (this.settings.ignoredUsers.includes(message.author.id)) return;

				if (!message.content && (!message.embeds || message.embeds.length === 0)) return;
				if (message.author.bot && !this.settings.allowBots) return;
				// i don't know what optimistic means exactly but it only happens on self messages and this line fixes double pings in testing
				if (event.optimistic === true) return;

				// no dms!
				if (!channel.guild_id) return;
				if (!message.guild_id) message.guild_id = channel.guild_id;

				// add guild to settings if it does not exist
				if (this.settings.guilds[channel.guild_id] == null) {
					let g = guilds.find(g => g.id === channel.guild_id);
					if (!g) return;
					this.settings.guilds[g.id] = {
						// set all channels to enabled by default
						channels: g.channels
							.filter(c => c.type === 'GUILD_TEXT')
							.reduce((obj, c) => {
								obj[c.id] = true;
								return obj;
							}, {}),
						enabled: true,
					};
					this.saveSettings();
				}

				// ensure that the channel this is from is enabled
				if (!this.settings.guilds[channel.guild_id].channels[channel.id]) return;

				let whitelistedUserFound = !this.settings.whitelistedUsers.every((userId) => {
					if (message.author.id === userId) {
						const guild = guilds.find(g => g.id === channel.guild_id);
						this.pingWhitelistMatch(message, channel, guild.name);
						return false; // stop searching
					}
					return true;
				});

				// do not bother scanning keywords if the user themself was matched
				if (whitelistedUserFound) {
					return;
				}

				// run through every single keyword as a regex
				this.settings.keywords.every((keyword) => {
					let regex = undefined; // the regex to run on the message content
					let filter = undefined; 
					// retrieve the filter (user, channel, server) if there is any
					//								 type		 id		 regex
					let isFiltered = /^([@#]?)(\d+):(.*)$/g.exec(keyword);
					if (isFiltered != null) {
						filter = {
							type: isFiltered[1],
							id: isFiltered[2],
						};
						keyword = isFiltered[3];
					}
					// then convert the rest into a regex
					let isSlashRegex = /^\/(.*)\/([a-z]*)$/g.exec(keyword);
					if (isSlashRegex != null) {
						let text = isSlashRegex[1];
						let flags = isSlashRegex[2];
						regex = new RegExp(text, flags);
					} else {
						regex = new RegExp(RegexEscape(keyword));
					}

					// if there is a filter,,, and it doesn't pass, keep searching
					if (filter != undefined && !this.passesFilter(filter, message)) {
						return true;
					}

					if (regex.test(message.content) || (
						message.embeds &&
						this.settings.allowEmbeds &&
						regex.test(JSON.stringify(this.objectValues(message.embeds)))
					)) {
						let guild = guilds.find(g => g.id === channel.guild_id);
						this.pingSuccess(message, channel, guild.name, regex);
						return false; // stop searching
					}
					return true;
				});
			} catch (e) {
				Logger.error(`${e}`);
			}
		}

		// type = @userid, #channelid, or serverid, message object, true if the message passes the filter and the content should be matched.
		passesFilter({ type, id }, message) {
			switch (type) {
				case '@':
					return message.author.id === id;
				case '#':
					return message.channel_id === id;
				case '':
					return message.guild_id === id;
				default:
					return false;
			}
		}

		sendMatchNotification(thumbnail, title, text, redirect, message) {
			NotificationModule.showNotification(
				thumbnail,
				title,
				text,
				{
				},
				// opts
				{
					sound: this.settings.notifications ? 'message1' : null,
					onClick: () => {
						if (this.settings.markJumpedRead) {
							delete this.settings.unreadMatches[message.id];
						}
						this.saveSettings();
						console.log(Modules.NavigationUtils.transitionTo);
						Modules.NavigationUtils.transitionTo(
							redirect,
							undefined,
							undefined,
						);
					}
				}
			);
		}

		pingWhitelistMatch(message, channel, guild) {
			log('Whitelist match found!');
			this.sendMatchNotification(
				`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=256`,
				`User match in ${guild}!`,
				`${message.author.username} typed in #${channel.name}.`,
				`/channels/${message.guild_id}/${channel.id}/${message.id}`,
				message,
			);
			message._match = `User ID ${message.author.id}`;
			this.settings.unreadMatches[message.id] = message;
			this.saveSettings();
		}

		pingSuccess(message, channel, guild, match) {
			log('Match found!');
			this.sendMatchNotification(
				`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=256`,
				`Keyword match in ${guild}!`,
				`${message.author.username} matched ${match} in #${channel.name}.`,
				`/channels/${message.guild_id}/${channel.id}/${message.id}`,
				message,
			);
			message._match = `${match}`;
			this.settings.unreadMatches[message.id] = message;
			this.saveSettings();
		}

		/**
		 * A single on/off switch
		 *
		 * @param {bool} iv - the initial state of the switch
		 * @param {function} callback - the function to run when the switch is flipped
		 * @returns {html} html element
		 */
		makeSwitch(iv, callback) {
			let label = document.createElement('label');
			label.className = 'switch';
			let input = document.createElement('input');
			input.setAttribute('type', 'checkbox');
			input.checked = iv;
			let div = document.createElement('div');
			label.append(input);
			label.append(div);
			input.addEventListener('input', function (e) { 
				callback(this.checked);
			});
			return label;
		}

		/**
		 * For Zere's to render the settings panel.
		 *
		 */
		getSettingsPanel() {
			return this.buildSettings().getElement();
		}

		/**
		 * Saves settings to file.
		 *
		 */
		saveSettings() {
			// clears out empty keywords before saving :)
			this.settings.keywords = this.settings.keywords.filter((v) => v.trim().length > 0);
			PluginUtilities.saveSettings('KeywordTracker', this.settings);
		}

		/**
		 * Loads settings from storage.
		 *
		 */
		loadSettings() {
			// load settings
			this.settings = Utilities.deepclone(PluginUtilities.loadSettings('KeywordTracker', defaultSettings));
		}

		// from ui_modals.js in bd plugin lib, rewriting to fix since broken as of 4/2/2024
		showModal(title, children, options = {}) {
			const {danger = false, confirmText = "Okay", cancelText = "Cancel", onConfirm = () => {}, onCancel = () => {}} = options;
			return ModalActions.openModal(props => {
					return React.createElement(Modules.ConfirmationModal, Object.assign({
							header: title,
							confirmButtonColor: danger ? ButtonData.ButtonColors.RED : ButtonData.ButtonColors.BRAND,
							confirmText: confirmText,
							cancelText: cancelText,
							onConfirm: onConfirm,
							onCancel: onCancel
					}, props), children);
			});
		}

		// build the inbox panel placed directly after the pinned messages button
		buildInboxPanel() {
			let pinned = document.querySelector('div[class^="toolbar" i] > div:first-child');
			if (!pinned) {
				return;
			}

			const ModalCloseEvent = new Event('modalclose');

			let inbox = pinned.cloneNode(true);
			inbox.querySelector('span')?.remove();
			inbox.setAttribute('is-keyword-tracker-inbox', true);
			inbox.setAttribute('aria-label', 'Keyword Matches');
			let icon = inbox.querySelector('svg');
			icon.setAttribute('viewBox', '0 0 122 96');
			// icon!
			icon.innerHTML = iconSVG;
			inbox.appendChild(icon);

			// add hover tooltip
			let tooltip = new Tooltip(inbox, 'Keyword Matches');

			// actual modal window on-click
			const openModal = () => {
				var modalKey = undefined;
				const closeModal = () => {
					Modules.ModalActions.closeModal(modalKey);
				};
				modalKey = this.showModal('Keyword Matches', this.renderInbox(closeModal), {
					confirmText: 'Close',
					cancelText: 'Mark as Read',
					onCancel: () => {
						this.settings.unreadMatches = {};
						this.saveSettings();
					},
					onConfirm: () => {
						this.saveSettings();
					}
				});
				inbox.removeEventListener('modalclose', closeModal);
				inbox.addEventListener('modalclose', closeModal);
			};
			inbox.removeEventListener('click', openModal);
			inbox.addEventListener('click', openModal);

			return ReactTools.createWrappedElement(inbox);
		}

		// render all messages from settings.unreadMatches
		renderInbox(closeModal) {
			let root = document.createElement('div');
			root.className = 'kt-inbox-container';

			const EntryFlushEvent = new Event('entryflush');

			const setupEntries = () => {
				let sortedMatches = Object.values(this.settings.unreadMatches)
					.sort((a, b) => {
						return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
					})
					.filter(msg => { // filter messages older than 60 days
						let timeDiff = Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime());
						let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
						return daysDiff <= 60;
					});

				const matchEntry = (msg) => {
					const entry = document.createElement('div');
					entry.className = 'kt-inbox-entry';
					entry.innerHTML = `
						<div class="kt-entry-row">
							<img class="kt-usericon" src="https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.webp?size=24" />
							<span class="kt-username"></span>
							<span class="kt-timestamp">${new Date(msg.timestamp).toLocaleString()}</span>
						</div>
						<div class="kt-content"></div>
						<div class="kt-entry-row">
							<span class="kt-matched">Matched <code></code></span>
							<span class="kt-spacer"></span>
							<div class="kt-button kt-read">
								<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.58l11.3-11.3a1 1 0 0 1 1.4 0Z"></path></svg>
							</div>
							<div class="kt-button kt-jump">
								<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M15 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V4.41l-4.3 4.3a1 1 0 1 1-1.4-1.42L19.58 3H16a1 1 0 0 1-1-1Z" class=""></path><path fill="currentColor" d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 1 0-2 0v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 1 0 0-2H5Z"></path></svg>
							</div>
						</div>
					`;

					entry.querySelector('.kt-username').textContent = msg.author.username;
					entry.querySelector('.kt-content').textContent = msg.content;
					entry.querySelector('.kt-matched > code').textContent = msg._match;

					let read_btn = entry.querySelector('.kt-read');
					new Tooltip(read_btn, 'Mark as read');
					read_btn.addEventListener('click', e => {
						delete this.settings.unreadMatches[msg.id];
						this.saveSettings();
						root.dispatchEvent(EntryFlushEvent);
					});

					let jump_btn = entry.querySelector('.kt-jump');
					new Tooltip(jump_btn, 'Jump to message');
					jump_btn.addEventListener('click', e => {
						if (this.settings.markJumpedRead) {
							delete this.settings.unreadMatches[msg.id];
						}
						this.saveSettings();
						closeModal();
						Modules.NavigationUtils.transitionTo(
							`/channels/${msg.guild_id}/${msg.channel_id}/${msg.id}`,
							undefined,
							undefined,
						);
					});

					return entry;
				};
				if (sortedMatches.length === 0) {
					root.textContent = 'No recent matches.';
					root.setAttribute('style', 'line-height: 90px; text-align: center;	color: var(--text-normal);');
				} else {
					for(let msg of sortedMatches) {
						root.appendChild(matchEntry(msg));
					}
				}
			};
			setupEntries();

			root.addEventListener('entryflush', () => {
				root.textContent = '';
				setupEntries();
			});

			return ReactTools.createWrappedElement(root);
		}

		//TODO: god why
		buildSettings() {
			const { Textbox, SettingPanel, SettingGroup, Keybind, SettingField, /*Switch*/ } = Settings;
			const guilds = Object.values(GuildStore.getGuilds())
											.sort((a, b) => `${a.id}`.localeCompare(`${b.id}`))
											.map(g => {
												g.channels = Modules.GuildChannelsStore.getChannels(g.id).SELECTABLE.map(c => c.channel);
												return g;
											});
			const { parseHTML } = DOM;

			// when the main guild switch is hit this event is fired, causing all channel switches to sync
			const GuildFlushEvent = new Event('guildflushevent');

			let panel = new SettingPanel();
			// !! KEYWORDS
			let keywords = new SettingGroup('Keywords');
			panel.append(keywords);

			let tip = new SettingField('', 'One case-sensitive keyword per line. Regex syntax allowed, eg. /sarah/i. You can filter to specific users, channels, or servers. Examples:', null, document.createElement('div'));
			keywords.append(tip);
			let tip2 = new SettingField('', '@12345678:Keyword watches for "Keyword" from user id 12345678 (Right click user -> Copy User ID, requires developer mode)', null, document.createElement('div'));
			keywords.append(tip2);
			let tip3 = new SettingField('', '#442312345:/case-insensitive/i watches messages in channel id 442312345 (Right click channel -> Copy Channel ID, requires developer mode)', null, document.createElement('div'));
			keywords.append(tip3);
			let tip4 = new SettingField('', '1239871234:/\d+/i watches numbers from server id 1239871234 (Right click server -> Copy Server ID, requires developer mode)', null, document.createElement('div'));
			keywords.append(tip4);
			
			// add keyword textbox
			let textbox = document.createElement('textarea');
			textbox.value = this.settings.keywords.join('\n');
			textbox.addEventListener('change', () => {
				this.settings.keywords = textbox.value.split('\n');
				this.saveSettings();
			});
			textbox.setAttribute('rows', '8');
			textbox.style.width = '95%';
			textbox.style.resize = 'none';
			textbox.style['margin-left'] = '2.5%';
			textbox.style.borderRadius = '3px';
			textbox.style.border = '2px solid grey';
			textbox.style.backgroundColor = '#ddd';
			keywords.append(textbox);

			// !! CHANNELS
			let channels = new SettingGroup('Channels');
			panel.append(channels);

			if (this.settings.enabled == null) {
				this.settings.enabled = true;
			}

			let masstoggleSwitch = this.makeSwitch(this.settings.enabled, (v) => {
				this.enabled = v;
				for (let gid in this.settings.guilds) {
					this.settings.guilds[gid].enabled = v;
					for (let cid in this.settings.guilds[gid].channels) {
						this.settings.guilds[gid].channels[cid] = v;
					}
				}
				// refresh
				groups.forEach(g => g());
				this.saveSettings();
			});

			let masstoggle = new SettingField('', 'Toggle every single guild and channel on / off (careful!)', null, masstoggleSwitch, { noteOnTop: true });
			channels.append(masstoggle);
			// for every guild...
			var groups = [];
			guilds.forEach(g => {
				// create the group, and thumbnail
				let guildGroup = new SettingGroup(g.name);
				guildGroup.getElement().style['min-height'] = '34px';
				groups.push(() => guildGroup.getElement().dispatchEvent(GuildFlushEvent));
				if (g.icon != null) {
					let thumbnail = parseHTML(
						`<img src="https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp?size=256}" />`
					);
					thumbnail.style.width = '32px';
					thumbnail.style.height = '32px';
					thumbnail.style.float = 'left';
					thumbnail.setAttribute('align', 'left');
					channels.append(thumbnail);
				} else {
					guildGroup.getElement().style['padding-left'] = '16px';
				}

				// add group to settings if it does not exist
				if (this.settings.guilds[g.id] == null) {
					this.settings.guilds[g.id] = {
						// set all channels to enabled by default
						channels: g.channels
							.reduce((obj, c) => {
								obj[c.id] = true;
								return obj;
							}, {}),
						enabled: true,
					};
				}
				// add switch next to guild to toggle all channels
				if (this.settings.guilds[g.id].enabled == null) {
					this.settings.guilds[g.id].enabled = true;
				}
				var guildSwitch = this.makeSwitch(this.settings.guilds[g.id].enabled, (v) => {
					this.settings.guilds[g.id].enabled = v;
					for(let cid in this.settings.guilds[g.id].channels) {
						this.settings.guilds[g.id].channels[cid] = v;
					}
					guildGroup.getElement().dispatchEvent(GuildFlushEvent);
					this.saveSettings();
				});
				guildSwitch.style.marginLeft = '4px';
				if (g.icon == null) {
					guildSwitch.style['margin-left'] = '36px';
				}
				guildGroup.getElement().addEventListener('guildflushevent', () => {
					guildSwitch.firstElementChild.checked = this.settings.guilds[g.id].enabled;
				}, false);

				channels.append(guildSwitch);
				channels.append(guildGroup);

				// load channels on click
				let channelLoader = () => {
					// for every channel...
					g.channels
						.forEach((c, i) => {
							// ...add a switch
							let status = this.settings.guilds[g.id].channels[c.id];
							if (status == null) {
								Logger.warn(`channel ${c.id} of guild ${g.id} doesn't exist. creating it.`);
								this.settings.guilds[g.id].channels[c.id] = true;
							}
							let channelSwitch = this.makeSwitch(status, (v) => {
								this.settings.guilds[g.id].channels[c.id] = v;
								this.saveSettings();
							});
							let channelSwitchContainer = document.createElement('div');
							channelSwitchContainer.className = 'kt-channel-container';
							let channelSwitchText = document.createElement('h2');
							channelSwitchText.className = 'kt-channel-name';
							channelSwitchText.innerText = `${c.name}`;
							channelSwitchContainer.append(channelSwitchText);
							channelSwitchContainer.append(channelSwitch);
							guildGroup.append(channelSwitchContainer);
							// when the guild switch is hit, toggle all these switches
							guildGroup.getElement().addEventListener('guildflushevent', () => {
								channelSwitch.firstElementChild.checked = this.settings.guilds[g.id].enabled;
							}, false);
						});
					// ignore future attempts to load this data :)
					guildGroup.getElement().removeEventListener('click', channelLoader);
				};
				guildGroup.getElement().addEventListener('click', channelLoader);
			});

			//!! OTHER
			let other = new SettingGroup('Other');
			panel.append(other);

			let markJumpedReadSwitch = this.makeSwitch(this.settings.markJumpedRead, (v) => {
				this.settings.markJumpedRead = v;
				this.saveSettings();
			});

			let notificationSwitch = this.makeSwitch(this.settings.notifications, (v) => {
				this.settings.notifications = v;
				this.saveSettings();
			});

			let selfPingSwitch = this.makeSwitch(this.settings.allowSelf, (v) => {
				this.settings.allowSelf = v;
				this.saveSettings();
			});

			let botSwitch = this.makeSwitch(this.settings.allowBots, (v) => {
				this.settings.allowBots = v;
				this.saveSettings();
			});

			let embedSwitch = this.makeSwitch(this.settings.allowEmbeds, (v) => {
				this.settings.allowEmbeds = v;
				this.saveSettings();
			});

			let markJumpedReadToggle = new SettingField('', 'Mark messages as read when jumping to them.', null, markJumpedReadSwitch, { noteOnTop: true });
			other.append(markJumpedReadToggle);

			let notificationToggle = new SettingField('', 'Enable notification sounds', null, notificationSwitch, { noteOnTop: true });
			other.append(notificationToggle);

			let embedToggle = new SettingField('', 'Enable matching embed content.', null, embedSwitch, { noteOnTop: true });
			other.append(embedToggle);

			let botToggle = new SettingField('', 'Enable bots to trigger notifications.', null, botSwitch, { noteOnTop: true });
			other.append(botToggle);

			let selfPingToggle = new SettingField('', 'Enable own messages to trigger notifications.', null, selfPingSwitch, { noteOnTop: true });
			other.append(selfPingToggle);


			let ignoreuseridstip = new SettingField('', 'Ignore users here. One user ID per line. (Right click name -> Copy ID). Be sure developer options are on.', null, document.createElement('div'));
			other.append(ignoreuseridstip);

			// add keyword textbox
			let ignoreuserids = document.createElement('textarea');
			ignoreuserids.value = this.settings.ignoredUsers.join('\n');
			ignoreuserids.addEventListener('change', () => {
				this.settings.ignoredUsers = ignoreuserids.value.split('\n');
				this.saveSettings();
			});
			ignoreuserids.setAttribute('rows', '8');
			ignoreuserids.style.width = '95%';
			ignoreuserids.style.resize = 'none';
			ignoreuserids.style['margin-left'] = '2.5%';
			ignoreuserids.style.borderRadius = '3px';
			ignoreuserids.style.border = '2px solid grey';
			ignoreuserids.style.backgroundColor = '#ddd';
			other.append(ignoreuserids);

			let whitelistuseridstip = new SettingField('', 'Whitelist users here (all their messages will trigger notifications). One user ID per line. (Right click name -> Copy ID). Be sure developer options are on.', null, document.createElement('div'));
			other.append(whitelistuseridstip);

			let whitelistuserids = document.createElement('textarea');
			whitelistuserids.value = this.settings.whitelistedUsers.join('\n');
			whitelistuserids.addEventListener('change', () => {
				this.settings.whitelistedUsers = whitelistuserids.value.split('\n');
				this.saveSettings();
			});
			whitelistuserids.setAttribute('rows', '8');
			whitelistuserids.style.width = '95%';
			whitelistuserids.style.resize = 'none';
			whitelistuserids.style['margin-left'] = '2.5%';
			whitelistuserids.style.borderRadius = '3px';
			whitelistuserids.style.border = '2px solid grey';
			whitelistuserids.style.backgroundColor = '#ddd';
			other.append(whitelistuserids);

			this.saveSettings();
			return panel;
		}
	};
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/