# Memos Fetch

This plugin for [Obsidian](https://obsidian.md) allow you to fetch [Memos](https://github.com/usememos/memos) and save into obsidian. 

## How to use

1. run command after setting `Memos Fetch: Sync To Remote Discard Local`

![WeChatWorkScreenshot_f2788cdc-bc0c-41f5-9256-d4b3479bd67d.png](https://s2.loli.net/2023/07/31/E273ozx5VrBYKRl.png)

### Setting
![WeChatWorkScreenshot_48fea904-2ae4-4da3-a955-3d8046f9a7ab.png](https://s2.loli.net/2023/07/31/1qwQ326Nb9vZDtl.png)

## Installation

### Adding plugin via BRAT

1. Install BRAT from the Community Plugins in Obsidian
2. Open the command palette and run the command **BRAT: Add a beta plugin for testing** (If you want the plugin version to be frozen, use the command **BRAT: Add a beta plugin with frozen version based on a release tag**.)
3. Using `catnu/obsidian-memos-fetch`, copy that into the modal that opens up
4. Click on **Add Plugin** -- wait a few seconds and BRAT will tell you what is going on
5. After BRAT confirms the installation, in Settings go to the **Community plugins** tab.
6. Refresh the list of plugins
7. Find `obsidian-memos-fetch` you just installed and Enable it.

### Manually installing the plugin

- Copy over `main.js`, `manifest.json` from release into your vault `VaultFolder/.obsidian/plugins/obsidian-memos-fetch/`.

## How to develop

Quick starting guide for plugin devs:

- Fork and Clone to local
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.
