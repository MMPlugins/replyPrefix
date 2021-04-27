## A plugin for [Dragory's ModMail](https://github.com/dragory/modmailbot) that allows users to open threads with reactions  
**Currently on Version 1**  
A full [changelog can be found here](https://github.com/MMPlugins/replyPrefixes/blob/main/CHANGELOG.md).  
Plugin written and maintained by [DarkView](https://github.com/DarkView) (Dark#1010 on Discord)  
  
Table of Contents:
- [Setup](#setup)
- [Usage](#usage)
  - [General](#general)
  - [Bugs](#bugs)
  - [Feature Requests](#feature-requests)
- [Commands](#commands)
  - [Setting your prefix](#setting-your-prefix)
  - [Removing your prefix](#removing-your-prefix)

## Setup
Make sure you are running at least v3.3.2 of Modmail.
in your config.ini file, create a new line and add  
```
plugins[] = npm:MMPlugins/replyPrefixes
``` 
You need to restart the bot in order for the plugin to be loaded!

## Usage
### General
Simply adding the plugin will allow you to use all of its features instantly.  
All commands require you to be able to execute bot commands and only work on the inbox server.
### Bugs
There are currently no known bugs.  
If you have found a bug, please report it at the [issues page for the plugin](https://github.com/MMPlugins/replyPrefixes/issues)!  
You can also find the plugin author (Dark#1010) on the [official support discord](https://discord.gg/vRuhG9R) in case you have any specific questions.
### Feature Requests
If you want to request or suggest a feature, open an issue on the [plugins issue page](https://github.com/MMPlugins/replyPrefixes/issues)!
In case the feature you want to request is outside of the scope of this plugin (anything not to do with reactions creating threads) please use the `#plugin-requests` channel on the [official support discord](https://discord.gg/vRuhG9R).
## Commands

Parameters in <> are required.  
These commands only work on the inbox server, just like regular ModMail commands.  
### Setting your prefix
Signature: `!setPrefix <prefix>`  
This will set your prefix to whatever text you pass it, so long as it is **48 characters at most**.  
If you want to include spaces, or use multiple words put quotation marks (") around your text, e.g. `!setPrefix "PrefixWithSpace "`.  
You can also simply put emoji into your prefix to use them, they will be formatted properly in all visible text.

### Removing your prefix
Signature: `!removePrefix`  
This will remove your prefix, effective immediately.


Table of Contents:
- [Setup](#setup)
- [Usage](#usage)
  - [General](#general)
  - [Bugs](#bugs)
  - [Feature Requests](#feature-requests)
- [Commands](#commands)
  - [Setting your prefix](#setting-your-prefix)
  - [Removing your prefix](#removing-your-prefix)
  
Plugin written and maintained by [DarkView](https://github.com/DarkView) (Dark#1010 on Discord)  
