# Memos Fetch

This plugin for [Obsidian](https://obsidian.md) allow you to fetch [Memos](https://github.com/usememos/memos) and save into obsidian. 

## How to use

1. run command `Memos Fetch: Sync To Remote Discard Local`

![image.png](https://s2.loli.net/2023/07/31/GHr8kZOfVhRcjSx.png)

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

## Development

If you are working on the plugin, you can use the following commands to build and run the plugin:

- Clone this repo.
- `npm i` to install dependencies
- `npm run dev` to start compilation in watch mode.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

### Adding your plugin to the community plugin list

- Check <https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md>
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at <https://github.com/obsidianmd/obsidian-releases> to add your plugin.

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

### API Documentation

See <https://github.com/obsidianmd/obsidian-api>