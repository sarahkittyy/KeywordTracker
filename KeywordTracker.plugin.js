/**
 * @name KeywordTracker
 * @invite 0Tmfo5ZbORCRqbAd
 * @authorLink https://github.com/sarahkittyy
 * @donate https://paypal.me/sarahkittyy
 * @website https://github.com/sarahkittyy/KeywordTracker
 * @source https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js
 * @version 1.2.3
 * @updateUrl https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
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

module.exports = (() => {
    const config = {"info":{"name":"KeywordTracker","authors":[{"name":"sawahkitty!~<3","discord_id":"135895345296048128","github_username":"sarahkittyy","twitter_username":"snuggleskittyy"}],"version":"1.2.3","description":"Be notified when a message matches a keyword :)","github":"https://github.com/sarahkittyy/KeywordTracker","github_raw":"https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js","authorLink":"https://github.com/sarahkittyy","inviteCode":"0Tmfo5ZbORCRqbAd","paypalLink":"https://paypal.me/sarahkittyy","updateUrl":"https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js"},"changelog":[{"title":"Release","items":["Initial release."]},{"title":"v1.0.1","items":["Removed changes to global RegExp.escape","Updated meta info"]},{"title":"v1.0.2","items":["Fixed dm channels causing console errors","Fixed update url"]},{"title":"v1.0.3","items":["Fixed typo in RegexEscape","Changed notification icon to sender's profile picture"]},{"title":"v1.0.4","items":["Set all channels to be enabled by default"]},{"title":"v1.0.5","items":["Fixed issue where notifications would not play a sound."]},{"title":"v1.0.6","items":["Fixed version not showing up on BD website"]},{"title":"v1.0.7","items":["Added internal check to update when guild is newly joined"]},{"title":"v1.1.0","items":["Updated descriptions for better clarity","Added server name in notification","Added more images","Added mass guild toggle switch","Added toggle switch to allow enabling / disabling of notification sounds.","Added field where you can exclude certain users from notifying you."]},{"title":"v1.1.1","items":["Added user whitelist to receive all messages from a specific user. (Thank you @infernix!)","Updated README.md"]},{"title":"v1.2.0","items":["Finally added an inbox, oh my god, why didn't I do this sooner.","You can find all recent missed matches from the last 60 days right next to the pinned messages button."]},{"title":"v1.2.1","items":["Hopefully fixes the issue of the keyword inbox button not appearing on some clients."]},{"title":"v1.2.2","items":["Actually, for realsies, fixes the issue (Thanks Meduxa)"]},{"title":"v1.2.3","items":["Fixed crashing issue related to jumping to a matched keyword."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
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
  const inboxCss = `.kt-inbox-container {
	color: white;
}

.kt-inbox-entry {
	color: white;
	padding: 5px;
	padding-bottom: 10px;
	margin: 10px;
	margin-top: 0px;
	margin-bottom: 0px;
	border-bottom: 1px solid #444;
	line-height: 22px;
}

.kt-inbox-entry > .timestamp {
	font-size: 8pt;
	color: #888;
}

.kt-inbox-entry > .usericon {
	max-width: 24px;
	max-height: 24px;
	transform: translateY(8px);
	margin-left: 5px;
	border-radius: 50%;
}

.kt-inbox-entry > .username {
	margin-left: 5px;
}

.kt-inbox-entry > .content {
	color: #88a;
}

.kt-inbox-entry > .matched {
	font-size: 10pt;
	color: #abc;
}

.kt-inbox-entry > button {
	display: inline-block;
	font-family: Whitney, "Open Sans", Helvetica, sans-serif;
	font-weight: 400;
	font-size: 11pt;
	border-radius: 3px;
	cursor: pointer;
	width: auto;
	height: auto;
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
	background-color: #7289da;
	border: 2px solid #7289da;
	color: #fff;
	margin-left: 5px;
	transition: all 200ms;
}

.kt-inbox-entry > button:active {
	transform: translateY(2px);
}
`;
  const defaultSettings = {
    whitelistedUsers: [],
    keywords: [],
    ignoredUsers: [],
    guilds: {},
    enabled: true,
    unreadMatches: {},
    notifications: true,
  };
  const {
    DiscordAPI,
    DOMTools,
    Patcher,
    Logger,
    Settings,
    Utilities,
    PluginUtilities,
    ReactTools,
    Modals,
    Tooltip,
    Toasts: Toast,
    DiscordModules: Modules,
  } = Library;

  const RegexEscape = function(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  };

  return class KeywordTracker extends Plugin {
    async onStart() {
      this.cancelPatches = [];
      this.loadSettings();
      PluginUtilities.addStyle(this.getName(), switchCss);
      PluginUtilities.addStyle(this.getName(), inboxCss);

      let dispatchModule = BdApi.findModuleByProps('dispatch');
      BdApi.Patcher.after(this.getName(), dispatchModule, 'dispatch', this.handleMessage.bind(this));

      const TitleBar = BdApi.findModuleByProps('Title', 'default', 'Caret');
      BdApi.Patcher.before(this.getName(), TitleBar, "default", (_, [props], ret) => {
        if (props.toolbar.type === 'function') return;
        props.toolbar.props.children[0].splice(Math.max(3, props.toolbar.props.children[0].length - 1), 0, this.buildInboxPanel());
      });

      this.userId = BdApi.findModuleByProps('getId').getId();
    }

    onStop() {
      this.saveSettings();

      BdApi.Patcher.unpatchAll(this.getName());
      PluginUtilities.removeStyle(this.getName());
    }

    handleMessage(_, args) {
      try {
        const { guilds } = DiscordAPI;
        let event = args[0];
        if (event.type !== 'MESSAGE_CREATE') return;
        // get message data
        let { message } = event;
        // get channel data
        let channel = Modules.ChannelStore.getChannel(message.channel_id);
        // assert message data is right
        if (!message.author) {
          message = Modules.MessageStore.getMessage(channel.id, message.id);
          if (!message || !message.author) return;
        }
        if (message.author.id === this.userId) return;
        // ignore ignored users
        if (this.settings.ignoredUsers.includes(message.author.id)) return;
        if (!message.content) return;

        // no dms!
        if (!channel.guild_id) return;

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
        this.settings.keywords.every((kw) => {
          let rx;
          let isSlashRegex = /^\/(.*)\/([a-z]*)$/g.exec(kw);
          if (isSlashRegex != null) {
            let text = isSlashRegex[1];
            let flags = isSlashRegex[2];
            rx = new RegExp(text, flags);
          } else {
            rx = new RegExp(RegexEscape(kw));
          }

          if (rx.test(message.content)) {
            let guild = guilds.find(g => g.id === channel.guild_id);
            this.pingSuccess(message, channel, guild.name, rx);
            return false; // stop searching
          }
          return true;
        });
      } catch (e) {
        Logger.error(`${e}`);
      }
    }

    sendMatchNotification(thumbnail, title, text, redirect, message) {
      Modules.NotificationModule.showNotification(
        thumbnail,
        title,
        text,
        // opts
        {
          onClick: () => {
            delete this.settings.unreadMatches[message.id];
            this.saveSettings();
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
      Logger.info('Match found!');
      this.sendMatchNotification(
        `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=256`,
        `User match in ${guild}!`,
        `${message.author.username} typed in #${channel.name}.`,
        `/channels/${message.guild_id}/${channel.id}/${message.id}`,
        message,
      );
      if (this.settings.notifications) {
        Modules.SoundModule.playSound("message1", 0.4);
      }
      message._match = `User ID ${message.author.id}`;
      this.settings.unreadMatches[message.id] = message;
      this.saveSettings();
    }

    pingSuccess(message, channel, guild, match) {
      Logger.info('Match found!');
      this.sendMatchNotification(
        `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=256`,
        `Keyword match in ${guild}!`,
        `${message.author.username} matched ${match} in #${channel.name}.`,
        `/channels/${message.guild_id}/${channel.id}/${message.id}`,
        message,
      );
      if (this.settings.notifications) {
        Modules.SoundModule.playSound("message1", 0.4);
      }
      message._match = `${match}`;
      this.settings.unreadMatches[message.id] = message;
      this.saveSettings();
    }

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

    getSettingsPanel() {
      return this.buildSettings().getElement();
    }

    saveSettings() {
      // clear out empty keywords :)
      this.settings.keywords = this.settings.keywords.filter((v) => v.trim().length > 0);
      PluginUtilities.saveSettings('KeywordTracker', this.settings);
    }

    loadSettings() {
      // load settings
      this.settings = Utilities.deepclone(PluginUtilities.loadSettings('KeywordTracker', defaultSettings));
    }

    // build the inbox panel placed directly after the pinned messages button
    buildInboxPanel() {
      let pinned = document.querySelector('div[aria-label*="Pinned Messages" i]');
      Logger.info(pinned);
      if (!pinned) {
        return;
      }
      console.log(pinned);

      const ModalCloseEvent = new Event('modalclose');

      let inbox = pinned.cloneNode(true);
      inbox.setAttribute('is-keyword-tracker-inbox', true);
      inbox.setAttribute('aria-label', 'Keyword Matches');
      let icon = inbox.querySelector('svg');
      icon.setAttribute('viewBox', '0 0 20 20');
      // icon!
      let iconSVG = `<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M8.627,7.885C8.499,8.388,7.873,8.101,8.13,8.177L4.12,7.143c-0.218-0.057-0.351-0.28-0.293-0.498c0.057-0.218,0.279-0.351,0.497-0.294l4.011,1.037C8.552,7.444,8.685,7.667,8.627,7.885 M8.334,10.123L4.323,9.086C4.105,9.031,3.883,9.162,3.826,9.38C3.769,9.598,3.901,9.82,4.12,9.877l4.01,1.037c-0.262-0.062,0.373,0.192,0.497-0.294C8.685,10.401,8.552,10.18,8.334,10.123 M7.131,12.507L4.323,11.78c-0.218-0.057-0.44,0.076-0.497,0.295c-0.057,0.218,0.075,0.439,0.293,0.495l2.809,0.726c-0.265-0.062,0.37,0.193,0.495-0.293C7.48,12.784,7.35,12.562,7.131,12.507M18.159,3.677v10.701c0,0.186-0.126,0.348-0.306,0.393l-7.755,1.948c-0.07,0.016-0.134,0.016-0.204,0l-7.748-1.948c-0.179-0.045-0.306-0.207-0.306-0.393V3.677c0-0.267,0.249-0.461,0.509-0.396l7.646,1.921l7.654-1.921C17.91,3.216,18.159,3.41,18.159,3.677 M9.589,5.939L2.656,4.203v9.857l6.933,1.737V5.939z M17.344,4.203l-6.939,1.736v9.859l6.939-1.737V4.203z M16.168,6.645c-0.058-0.218-0.279-0.351-0.498-0.294l-4.011,1.037c-0.218,0.057-0.351,0.28-0.293,0.498c0.128,0.503,0.755,0.216,0.498,0.292l4.009-1.034C16.092,7.085,16.225,6.863,16.168,6.645 M16.168,9.38c-0.058-0.218-0.279-0.349-0.498-0.294l-4.011,1.036c-0.218,0.057-0.351,0.279-0.293,0.498c0.124,0.486,0.759,0.232,0.498,0.294l4.009-1.037C16.092,9.82,16.225,9.598,16.168,9.38 M14.963,12.385c-0.055-0.219-0.276-0.35-0.495-0.294l-2.809,0.726c-0.218,0.056-0.351,0.279-0.293,0.496c0.127,0.506,0.755,0.218,0.498,0.293l2.807-0.723C14.89,12.825,15.021,12.603,14.963,12.385"></path>`;
      icon.innerHTML = iconSVG;
      inbox.appendChild(icon);

      // add hover tooltip
      let tooltip = new Tooltip(inbox, 'Keyword Matches');

      // actual modal window on-click
      const openModal = () => {
        let modalKey = Modals.showModal('Keyword Matches', this.renderInbox(() => { Modules.ModalActions.closeModal(modalKey); }), {
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
        const closeModal = () => {
          Modules.ModalActions.closeModal(modalKey);
        };
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
          let entry = document.createElement('div');
          entry.className = 'kt-inbox-entry';

          let timestamp = document.createElement('span');
          timestamp.className = 'timestamp';
          timestamp.innerHTML = `${new Date(msg.timestamp).toLocaleString()}`;
          entry.appendChild(timestamp);

          let icon = document.createElement('img');
          let iconUrl = `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.webp?size=256`
          icon.className = 'usericon';
          icon.setAttribute('src', iconUrl);
          entry.appendChild(icon);

          let username = document.createElement('span');
          username.className = 'username';
          username.innerHTML = `${msg.author.username}: `;
          entry.appendChild(username);
          
          let content = document.createElement('span');
          content.className = 'content';
          content.innerHTML = msg.content;
          entry.appendChild(content);

          entry.appendChild(document.createElement('br'));

          let matched = document.createElement('span');
          matched.className = 'matched';
          matched.innerHTML = `Matched ${msg._match}`;
          entry.appendChild(matched);

          let markRead = document.createElement('button');
          markRead.addEventListener('click', () => {
            delete this.settings.unreadMatches[msg.id];
            this.saveSettings();
            root.dispatchEvent(EntryFlushEvent);
          });
          markRead.innerHTML = 'Mark as Read';
          entry.appendChild(markRead);

          let jump = document.createElement('button');
          jump.addEventListener('click', () => {
            delete this.settings.unreadMatches[msg.id];
            this.saveSettings();
            closeModal();
            Modules.NavigationUtils.transitionTo(
              `/channels/${msg.guild_id}/${msg.channel_id}/${msg.id}`,
              undefined,
              undefined,
            );
          });
          jump.innerHTML = 'Jump';
          entry.appendChild(jump);

          return entry;
        };
        if (sortedMatches.length === 0) {
          root.innerHTML = 'No recent matches.';
          root.setAttribute('style', 'line-height: 90px; text-align: center;');
        } else {
          for(let msg of sortedMatches) {
            root.appendChild(matchEntry(msg));
          }
        }
      };
      setupEntries();

      root.addEventListener('entryflush', () => {
        root.innerHTML = '';
        setupEntries();
      });

      return ReactTools.createWrappedElement(root);
    }

    //TODO: god why
    buildSettings() {
      const { Textbox, SettingPanel, SettingGroup, Keybind, SettingField, /*Switch*/ } = Settings;
      const { sortedGuilds, guilds: normGuilds } = DiscordAPI;
      const { parseHTML } = DOMTools;

      // sorted guilds doesn't have critical data, and the normal guild list isn't sorted.
      const guilds = sortedGuilds.reduce((arr, gobj) => {
        return arr.concat(gobj.discordObject.guilds.map(g => {
          return normGuilds.find(v => v.id === g.id);
        }));
      }, []);
      // when the main guild switch is hit this event is fired, causing all channel switches to sync
      const GuildFlushEvent = new Event('guildflushevent');

      let panel = new SettingPanel();
      // !! KEYWORDS
      let keywords = new SettingGroup('Keywords');
      panel.append(keywords);

      let tip = new SettingField('', 'One keyword per line. Regex syntax allowed, eg. /sarah/i.', null, document.createElement('div'));
      keywords.append(tip);
      
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
              .filter(c => c.type === 'GUILD_TEXT')
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
            .filter(c => c.type === 'GUILD_TEXT')
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
              channelSwitchContainer.style.width = '95%';
              channelSwitchContainer.style['margin-left'] = '2.5%';
              channelSwitchContainer.style.display = 'flex';
              channelSwitchContainer.style['justify-content'] = 'space-between';
              channelSwitchContainer.style['margin-bottom'] = '3px';
              channelSwitchContainer.style['border-bottom'] = '1px solid #333';
              let channelSwitchText = document.createElement('h2');
              channelSwitchText.style['font-size'] = '16px';
              channelSwitchText.style['color'] = 'white';
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

      let notificationSwitch = this.makeSwitch(this.settings.notifications, (v) => {
        this.settings.notifications = v;
        this.saveSettings();
      });
      let notificationToggle = new SettingField('', 'Enable notification sounds', null, notificationSwitch, { noteOnTop: true });
      other.append(notificationToggle);

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
})();
/*@end@*/