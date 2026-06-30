# Desktop Organizer / 桌面整理

[English README](./README.md)

Desktop Organizer 是一个轻量级 Electron 桌面整理工具，主要面向 Windows。它提供贴边抽屉面板，可以用本地规则整理桌面文件、应用快捷方式和自定义目录，不依赖云端 AI。

## 功能

- 圆形月牙抽屉把手：默认缩进屏幕边缘，鼠标靠近只弹出把手，点击后展开面板。
- 本地分类规则：文档、图片、视频、音频、压缩包、游戏、开发工具、应用、文件夹和其他。
- 支持扫描桌面、开始菜单/应用入口和自定义目录。
- 支持当前分类搜索和全分类搜索。
- 支持自定义分类，并可以拖拽项目到指定分类。
- 移动文件前需要用户确认，并支持撤销最近移动。
- Windows 桌面图标一键隐藏/显示，只切换可见性，不删除、不移动文件。
- 支持应用/文件系统图标、自定义抽屉图标、面板皮肤、模糊和透明度设置。
- 应用内支持中文/英文切换，Windows 安装器支持中文/英文语言选择。

## 下载

Windows 安装包请从 GitHub Releases 页面下载：

- [Latest release](https://github.com/Hakurei-git/desktop-organizer/releases/latest)

源码仓库不保存安装包二进制文件。安装包应该作为 GitHub Release 附件发布，仓库主体只保留源码、测试和构建配置。

当前 MVP 没有代码签名，所以 Windows SmartScreen 可能会提示风险。卸载应用只会移除程序本身，不会删除用户已经整理的文件。

Linux 打包配置已保留，但在没有完成 Linux 测试前不发布 Linux 产物。

## 开发运行

```powershell
npm.cmd install
npm.cmd start
```

如果 PowerShell 阻止 `npm.ps1`，请像上面一样使用 `npm.cmd`。

## 测试

```powershell
npm.cmd test
```

检查 JavaScript 语法：

```powershell
Get-ChildItem src,tests,scripts -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
```

## 维护者

安装包由本地或 CI 构建后上传到 GitHub Releases。构建产物会被 Git 忽略，避免大体积二进制文件出现在源码仓库中。

## 隐私

Desktop Organizer 只使用本地规则和本地 JSON 配置，不会把文件、路径、图标或分类数据上传到云端。
