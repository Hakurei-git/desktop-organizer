const { execFile } = require("node:child_process");

function runPowerShell(script, timeout = 2500) {
  return new Promise((resolve) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
      { timeout, windowsHide: true },
      (error, stdout, stderr) => {
        if (error) {
          resolve({ ok: false, output: String(stdout || "").trim(), error: String(stderr || error.message || "").trim() });
          return;
        }
        resolve({ ok: true, output: String(stdout || "").trim(), error: "" });
      }
    );
  });
}

const DESKTOP_VIEW_SCRIPT = [
  'Add-Type @"',
  'using System;',
  'using System.Text;',
  'using System.Runtime.InteropServices;',
  'public class DesktopIconsWin32 {',
  '  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);',
  '  [DllImport("user32.dll")]',
  '  public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);',
  '  [DllImport("user32.dll")]',
  '  public static extern IntPtr FindWindowEx(IntPtr hwndParent, IntPtr hwndChildAfter, string lpszClass, string lpszWindow);',
  '  [DllImport("user32.dll")]',
  '  public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);',
  '  [DllImport("user32.dll")]',
  '  public static extern bool EnumChildWindows(IntPtr hWndParent, EnumWindowsProc lpEnumFunc, IntPtr lParam);',
  '  [DllImport("user32.dll")]',
  '  public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);',
  '  [DllImport("user32.dll")]',
  '  public static extern bool IsWindowVisible(IntPtr hWnd);',
  '  [DllImport("user32.dll")]',
  '  public static extern bool PostMessage(IntPtr hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);',
  '}',
  '"@',
  'function Get-WindowClass([IntPtr]$hwnd) {',
  '  if ($hwnd -eq [IntPtr]::Zero) { return "" }',
  '  $name = New-Object System.Text.StringBuilder 256',
  '  [void][DesktopIconsWin32]::GetClassName($hwnd, $name, 256)',
  '  return $name.ToString()',
  '}',
  'function Find-ChildByClass([IntPtr]$root, [string]$className) {',
  '  if ($root -eq [IntPtr]::Zero) { return [IntPtr]::Zero }',
  '  $direct = [DesktopIconsWin32]::FindWindowEx($root, [IntPtr]::Zero, $className, $null)',
  '  if ($direct -ne [IntPtr]::Zero) { return $direct }',
  '  $script:targetClassName = $className',
  '  $script:foundChild = [IntPtr]::Zero',
  '  [DesktopIconsWin32]::EnumChildWindows($root, {',
  '    param([IntPtr]$child, [IntPtr]$lParam)',
  '    if ((Get-WindowClass $child) -eq $script:targetClassName) {',
  '      $script:foundChild = $child',
  '      return $false',
  '    }',
  '    return $true',
  '  }, [IntPtr]::Zero) | Out-Null',
  '  return $script:foundChild',
  '}',
  'function Get-DesktopView {',
  '  $progman = [DesktopIconsWin32]::FindWindow("Progman", $null)',
  '  $view = Find-ChildByClass $progman "SHELLDLL_DefView"',
  '  if ($view -ne [IntPtr]::Zero) { return $view }',
  '  $script:foundView = [IntPtr]::Zero',
  '  [DesktopIconsWin32]::EnumWindows({',
  '    param([IntPtr]$hwnd, [IntPtr]$lParam)',
  '    $className = Get-WindowClass $hwnd',
  '    if ($className -ne "WorkerW" -and $className -ne "Progman") { return $true }',
  '    $worker = Find-ChildByClass $hwnd "SHELLDLL_DefView"',
  '    if ($worker -ne [IntPtr]::Zero) {',
  '      $script:foundView = $worker',
  '      return $false',
  '    }',
  '    return $true',
  '  }, [IntPtr]::Zero) | Out-Null',
  '  return $script:foundView',
  '}',
  'function Get-DesktopListView {',
  '  $view = Get-DesktopView',
  '  if ($view -eq [IntPtr]::Zero) { return [IntPtr]::Zero }',
  '  return Find-ChildByClass $view "SysListView32"',
  '}',
  'function Get-IconsHidden {',
  '  $list = Get-DesktopListView',
  '  if ($list -eq [IntPtr]::Zero) { return $null }',
  '  return -not [DesktopIconsWin32]::IsWindowVisible($list)',
  '}',
  'function Toggle-DesktopIcons {',
  '  $view = Get-DesktopView',
  '  if ($view -eq [IntPtr]::Zero) { return $false }',
  '  [void][DesktopIconsWin32]::PostMessage($view, 0x0111, [IntPtr]0x7402, [IntPtr]::Zero)',
  '  Start-Sleep -Milliseconds 180',
  '  return $true',
  '}'
].join("\n");

const REGISTRY_PATH = "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced";

async function getRegistryHidden() {
  const script = [
    '$path = "' + REGISTRY_PATH + '"',
    '$value = (Get-ItemProperty -Path $path -Name HideIcons -ErrorAction SilentlyContinue).HideIcons',
    'if ($null -eq $value) { "false" } else { [bool]$value | ConvertTo-Json -Compress }'
  ].join("\n");
  const result = await runPowerShell(script);
  return result.output === "true";
}

async function getDesktopIconsHidden() {
  if (process.platform !== "win32") {
    return false;
  }

  const result = await runPowerShell(DESKTOP_VIEW_SCRIPT + '\n$hidden = Get-IconsHidden\nif ($null -eq $hidden) { "unknown" } else { $hidden | ConvertTo-Json -Compress }');
  if (result.output === "true") return true;
  if (result.output === "false") return false;
  return getRegistryHidden();
}

async function setDesktopIconsHidden(hidden) {
  if (process.platform !== "win32") {
    return { supported: false, hidden: false };
  }

  const desired = Boolean(hidden);
  const desiredLiteral = desired ? "$true" : "$false";
  const registryValue = desired ? 1 : 0;
  const script = DESKTOP_VIEW_SCRIPT + "\n" + [
    '$path = "' + REGISTRY_PATH + '"',
    'New-Item -Path $path -Force | Out-Null',
    '$existing = Get-ItemProperty -Path $path -Name HideIcons -ErrorAction SilentlyContinue',
    'if ($null -eq $existing) {',
    '  New-ItemProperty -Path $path -Name HideIcons -Value ' + registryValue + ' -PropertyType DWord -Force | Out-Null',
    '} else {',
    '  Set-ItemProperty -Path $path -Name HideIcons -Value ' + registryValue,
    '}',
    '$before = Get-IconsHidden',
    'if ($before -eq $null -or $before -ne ' + desiredLiteral + ') { [void](Toggle-DesktopIcons) }',
    '$after = Get-IconsHidden',
    '[PSCustomObject]@{ supported = $true; hidden = if ($after -eq $null) { ' + desiredLiteral + ' } else { [bool]$after }; requested = ' + desiredLiteral + '; changed = ($before -ne $after); viewFound = ($after -ne $null) } | ConvertTo-Json -Compress'
  ].join("\n");

  const result = await runPowerShell(script);
  if (!result.ok || !result.output) {
    return { supported: true, hidden: await getDesktopIconsHidden(), requested: desired, error: result.error || "Unable to update desktop icons." };
  }

  try {
    return JSON.parse(result.output);
  } catch {
    return { supported: true, hidden: await getDesktopIconsHidden(), requested: desired, error: "Unable to read desktop icon state." };
  }
}

module.exports = {
  getDesktopIconsHidden,
  setDesktopIconsHidden
};
