# Desktop Organizer

[Chinese README](./README.zh-CN.md)

Desktop Organizer is a lightweight Electron desktop organizer for Windows. It provides an edge-docked drawer for desktop files, application shortcuts, custom folders, and local categories without relying on cloud AI.

## Features

- Circular crescent drawer handle: stays tucked into the screen edge, peeks on pointer approach, and expands only after click.
- Local classification rules for documents, images, videos, audio, archives, games, development tools, applications, folders, and other items.
- Scans Desktop, Start Menu/application entries, and custom folders.
- Search within the selected category or across all categories.
- Custom categories with drag-and-drop item assignment.
- Confirm-before-move workflow into `~/Documents/Desktop Organizer/<Category>/`, plus recent move undo.
- One-click Windows desktop icon show/hide. This only toggles icon visibility and does not delete or move desktop files.
- Per-item OS icons with fallback icons.
- Custom drawer button image crop, panel skin crop, blur, opacity, and drawer animation settings.
- Chinese and English in-app UI, plus Chinese/English Windows installer language selection.

## Download

Download the Windows installer from GitHub Releases:

- [Latest release](https://github.com/Hakurei-git/desktop-organizer/releases/latest)

The installer file is named like this:

```text
Desktop Organizer Setup 0.1.0.exe
```

This MVP installer is unsigned, so Windows SmartScreen may show a warning. Uninstalling the app removes the program only; it does not delete files moved into `~/Documents/Desktop Organizer`.

Linux `.deb` packaging is configured but not published because it has not been tested in this release.

## Development

```powershell
npm.cmd install
npm.cmd start
```

PowerShell may block `npm.ps1`; use `npm.cmd` as shown.

## Test

```powershell
npm.cmd test
```

Syntax-check the JavaScript files:

```powershell
Get-ChildItem src,tests,scripts -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
```

## Packaging

Generate or refresh the built-in icon assets:

```powershell
npm.cmd run icons
```

Create an unpacked app for a fast packaging smoke test:

```powershell
npm.cmd run pack
```

Build the Windows NSIS installer into `dist/`:

```powershell
npm.cmd run dist:win
```

Build the Linux `.deb` package from Linux, WSL Ubuntu, or CI:

```bash
npm run dist:linux
```

## Privacy

Desktop Organizer uses local rules and local JSON settings. It does not upload files, paths, icons, or classification data to a cloud service.
