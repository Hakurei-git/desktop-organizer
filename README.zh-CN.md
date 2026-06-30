# Desktop Organizer / 桌面整理

[English README](./README.md)

Desktop Organizer: 桌面整理, Windows, Electron, local rules.

## 桌面整理

- 搜索应用和文件
- 全部项目: Documents / Images / Videos / Audio / Archives / 文件夹 / 打开 / 详情
- 来源: 添加文件夹
- 选择 / 移动 / 撤销
- 隐藏桌面图标 / 显示桌面图标
- 更换图标 / 重置图标
- 更换面板皮肤 / 重置面板皮肤
- 面板透明度 / 背景模糊 / 把手透明度
- 唤醒范围 / 隐藏范围 / 动画 / 隐藏延迟
- 语言: Chinese / English

## Windows Installer

Windows installer:

```text
dist/Desktop Organizer Setup 0.1.0.exe
```

This Windows installer is unsigned. Windows SmartScreen may show a warning.

Linux .deb packaging is configured, but this release only uploads the Windows installer because Linux was not tested.

## Development

```powershell
npm.cmd install
npm.cmd start
```

## Test

```powershell
npm.cmd test
```

## Package

```powershell
npm.cmd run pack
npm.cmd run dist:win
```

## Privacy

Local rules and local JSON settings only. No cloud upload.
