/**
 * @name KeywordTracker
 * @invite 0Tmfo5ZbORCRqbAd
 * @authorLink https://github.com/sarahkittyy
 * @donate https://paypal.me/sarahkittyy
 * @website https://github.com/sarahkittyy/KeywordTracker
 * @source https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js
 * @version 1.1.0
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
    const config = {"info":{"name":"KeywordTracker","authors":[{"name":"sawahkitty!~<3","discord_id":"135895345296048128","github_username":"sarahkittyy","twitter_username":"snuggleskittyy"}],"version":"1.1.0","description":"Be notified when a message matches a keyword :)","github":"https://github.com/sarahkittyy/KeywordTracker","github_raw":"https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js","authorLink":"https://github.com/sarahkittyy","inviteCode":"0Tmfo5ZbORCRqbAd","paypalLink":"https://paypal.me/sarahkittyy","updateUrl":"https://raw.githubusercontent.com/sarahkittyy/KeywordTracker/main/KeywordTracker.plugin.js"},"changelog":[{"title":"Release","items":["Initial release."]},{"title":"v1.0.1","items":["Removed changes to global RegExp.escape","Updated meta info"]},{"title":"v1.0.2","items":["Fixed dm channels causing console errors","Fixed update url"]},{"title":"v1.0.3","items":["Fixed typo in RegexEscape","Changed notification icon to sender's profile picture"]},{"title":"v1.0.4","items":["Set all channels to be enabled by default"]},{"title":"v1.0.5","items":["Fixed issue where notifications would not play a sound."]},{"title":"v1.0.6","items":["Fixed version not showing up on BD website"]},{"title":"v1.0.7","items":["Added internal check to update when guild is newly joined"]},{"title":"v1.1.0","items":["Updated descriptions for better clarity","Added more images","Added mass guild toggle switch","Added toggle switch to allow enabling / disabling of notification sounds.","Added field where you can exclude certain users from notifying you."]}],"main":"index.js"};

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
  const defaultSettings = {
    userIds: [],
    keywords: [],
    ignoredUsers: [],
    guilds: {},
    enabled: true,
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
    Modals,
    Toasts: Toast,
    DiscordModules: Modules,
  } = Library;

  const RegexEscape = function(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  };

  return class KeywordTracker extends Plugin {
    async onStart() {
      this.loadSettings();
      PluginUtilities.addStyle(this.getName(), switchCss);

      let dispatchModule = BdApi.findModuleByProps('dispatch');
      this.cancelPatch = BdApi.monkeyPatch(dispatchModule, 'dispatch', { after: this.handleMessage.bind(this) });

      this.userId = BdApi.findModuleByProps('getId').getId();
    }

    onStop() {
      this.saveSettings();

      Patcher.unpatchAll(this.getName());
      this.cancelPatch();
      PluginUtilities.removeStyle(this.getName());
    }

    handleMessage(data) {
      try {
        const { guilds } = DiscordAPI;
        const { methodArguments: args } = data;
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

        this.settings.userIds.every((userId) => {
          if (message.author.id === userId) {
            this.pingSuccess(message, channel, guild.name, userId);
            return false; // stop searching
          }
          return true;
        })

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

    pingSuccess(message, channel, guild, match) {
      Logger.info('Match found!');
      Modules.NotificationModule.showNotification(
        `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=256`, // icon
        `Keyword match in ${guild}!`, // title
        `${message.author.username} matched ${match} in #${channel.name}.`,
        // opts
        {
          onClick: () => {
            Modules.NavigationUtils.transitionTo(
              `/channels/${message.guild_id}/${channel.id}/${message.id}`,
              undefined,
              undefined,
            );
          }
        }
      );
      if (this.settings.notifications) {
        Modules.SoundModule.playSound("message1", 0.4);
      }
      //Toast.info(`Message by ${message.author.username} in #${channel.name} matches ${match}`);
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
      
      let useridstip = new SettingField('', 'Ignore users here. One user ID per line. (Right click name -> Copy ID). Be sure developer options are on.', null, document.createElement('div'));
      other.append(useridstip);
      
      // add keyword textbox
      let userids = document.createElement('textarea');
      userids.value = this.settings.ignoredUsers.join('\n');
      userids.addEventListener('change', () => {
        this.settings.ignoredUsers = userids.value.split('\n');
        this.saveSettings();
      });
      userids.setAttribute('rows', '8');
      userids.style.width = '95%';
      userids.style.resize = 'none';
      userids.style['margin-left'] = '2.5%';
      userids.style.borderRadius = '3px';
      userids.style.border = '2px solid grey';
      userids.style.backgroundColor = '#ddd';
      other.append(userids);

      this.saveSettings();
      return panel;
    }
  };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/