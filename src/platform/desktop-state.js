const { execFile } = require("node:child_process");

function runPowerShell(script, timeout = 1200) {
  return new Promise((resolve) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
      { timeout, windowsHide: true },
      (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }
        resolve(String(stdout || "").trim());
      }
    );
  });
}

async function getWindowsForegroundInfo() {
  const script = [
    'Add-Type @"',
    'using System;',
    'using System.Text;',
    'using System.Runtime.InteropServices;',
    'public class Win32Foreground {',
    '  [StructLayout(LayoutKind.Sequential)]',
    '  public struct RECT {',
    '    public int Left;',
    '    public int Top;',
    '    public int Right;',
    '    public int Bottom;',
    '  }',
    '  [StructLayout(LayoutKind.Sequential)]',
    '  public struct MONITORINFO {',
    '    public int cbSize;',
    '    public RECT rcMonitor;',
    '    public RECT rcWork;',
    '    public uint dwFlags;',
    '  }',
    '  [DllImport("user32.dll")]',
    '  public static extern IntPtr GetForegroundWindow();',
    '  [DllImport("user32.dll", CharSet = CharSet.Auto)]',
    '  public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);',
    '  [DllImport("user32.dll")]',
    '  public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);',
    '  [DllImport("user32.dll")]',
    '  public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);',
    '  [DllImport("user32.dll")]',
    '  public static extern bool IsZoomed(IntPtr hWnd);',
    '  [DllImport("user32.dll")]',
    '  public static extern IntPtr MonitorFromWindow(IntPtr hwnd, uint dwFlags);',
    '  [DllImport("user32.dll")]',
    '  public static extern bool GetMonitorInfo(IntPtr hMonitor, ref MONITORINFO lpmi);',
    '}',
    '"@',
    '$handle = [Win32Foreground]::GetForegroundWindow()',
    '$builder = New-Object System.Text.StringBuilder 256',
    '[void][Win32Foreground]::GetClassName($handle, $builder, $builder.Capacity)',
    '$processId = 0',
    '[void][Win32Foreground]::GetWindowThreadProcessId($handle, [ref]$processId)',
    '$process = Get-Process -Id $processId -ErrorAction SilentlyContinue',
    '$rect = New-Object Win32Foreground+RECT',
    '$hasRect = [Win32Foreground]::GetWindowRect($handle, [ref]$rect)',
    '$monitor = [Win32Foreground]::MonitorFromWindow($handle, 2)',
    '$monitorInfo = New-Object Win32Foreground+MONITORINFO',
    '$monitorInfo.cbSize = [System.Runtime.InteropServices.Marshal]::SizeOf([type][Win32Foreground+MONITORINFO])',
    '$hasMonitor = [Win32Foreground]::GetMonitorInfo($monitor, [ref]$monitorInfo)',
    '$isFullscreen = $false',
    'if ($hasRect -and $hasMonitor) {',
    '  $tolerance = 2',
    '  $isFullscreen = ([Math]::Abs($rect.Left - $monitorInfo.rcMonitor.Left) -le $tolerance) -and ([Math]::Abs($rect.Top - $monitorInfo.rcMonitor.Top) -le $tolerance) -and ([Math]::Abs($rect.Right - $monitorInfo.rcMonitor.Right) -le $tolerance) -and ([Math]::Abs($rect.Bottom - $monitorInfo.rcMonitor.Bottom) -le $tolerance)',
    '}',
    '[PSCustomObject]@{',
    '  supported = $true',
    '  className = $builder.ToString()',
    '  processName = if ($process) { $process.ProcessName } else { "" }',
    '  isMaximized = [Win32Foreground]::IsZoomed($handle)',
    '  isFullscreen = $isFullscreen',
    '} | ConvertTo-Json -Compress'
  ].join("\n");

  const output = await runPowerShell(script);
  if (!output) {
    return null;
  }

  try {
    return JSON.parse(output);
  } catch {
    return null;
  }
}

async function getForegroundState() {
  if (process.platform !== "win32") {
    return {
      supported: false,
      className: "",
      processName: "",
      isMaximized: false,
      isFullscreen: false
    };
  }

  return (await getWindowsForegroundInfo()) || {
    supported: false,
    className: "",
    processName: "",
    isMaximized: false,
    isFullscreen: false
  };
}

async function isDesktopSurfaceActive() {
  if (process.platform !== "win32") {
    return true;
  }

  const info = await getForegroundState();
  if (!info.supported) {
    return true;
  }

  const className = String(info.className || "").toLowerCase();
  const processName = String(info.processName || "").toLowerCase();
  const desktopClasses = new Set(["progman", "workerw", "cabinetwclass", "explorewclass"]);

  if (desktopClasses.has(className)) {
    return true;
  }

  return processName === "explorer" && className.includes("shell");
}

module.exports = {
  isDesktopSurfaceActive,
  getForegroundState,
  getWindowsForegroundInfo
};
