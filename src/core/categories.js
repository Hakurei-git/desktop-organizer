const DEFAULT_CATEGORIES = [
  {
    id: "documents",
    name: "Documents",
    accent: "#2563eb",
    icon: "DOC",
    extensions: [
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
      ".rtf",
      ".md",
      ".csv",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".odt",
      ".ods",
      ".odp",
      ".json",
      ".xml",
      ".yaml",
      ".yml"
    ],
    keywords: ["document", "docs", "report", "paper", "invoice", "resume", "notes"]
  },
  {
    id: "images",
    name: "Images",
    accent: "#059669",
    icon: "IMG",
    extensions: [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
      ".ico",
      ".heic",
      ".tif",
      ".tiff",
      ".psd",
      ".ai"
    ],
    keywords: ["image", "photo", "picture", "screenshot", "wallpaper", "camera"]
  },
  {
    id: "videos",
    name: "Videos",
    accent: "#dc2626",
    icon: "VID",
    extensions: [
      ".mp4",
      ".mov",
      ".avi",
      ".mkv",
      ".webm",
      ".wmv",
      ".flv",
      ".m4v",
      ".mpeg",
      ".mpg"
    ],
    keywords: ["video", "movie", "recording", "clip", "capture"]
  },
  {
    id: "audio",
    name: "Audio",
    accent: "#7c3aed",
    icon: "AUD",
    extensions: [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a", ".wma", ".mid"],
    keywords: ["audio", "music", "sound", "voice", "podcast"]
  },
  {
    id: "archives",
    name: "Archives",
    accent: "#b45309",
    icon: "ZIP",
    extensions: [
      ".zip",
      ".rar",
      ".7z",
      ".tar",
      ".gz",
      ".tgz",
      ".bz2",
      ".xz",
      ".iso",
      ".dmg"
    ],
    keywords: ["archive", "backup", "package", "compressed"]
  },
  {
    id: "development",
    name: "Development",
    accent: "#0f766e",
    icon: "DEV",
    extensions: [
      ".code-workspace",
      ".sln",
      ".csproj",
      ".xcodeproj",
      ".xcworkspace",
      ".iml",
      ".ipynb"
    ],
    keywords: [
      "visual studio",
      "vscode",
      "vs code",
      "code",
      "cursor",
      "intellij",
      "pycharm",
      "webstorm",
      "goland",
      "clion",
      "rider",
      "android studio",
      "xcode",
      "sublime",
      "notepad++",
      "terminal",
      "powershell",
      "github",
      "git",
      "node",
      "python",
      "jetbrains"
    ]
  },
  {
    id: "games",
    name: "Games",
    accent: "#e11d48",
    icon: "GAME",
    extensions: [],
    keywords: [
      "steam",
      "epic games",
      "riot",
      "battle.net",
      "minecraft",
      "genshin",
      "honkai",
      "valorant",
      "league of legends",
      "game",
      "games",
      "xbox",
      "ubisoft",
      "ea app",
      "origin"
    ]
  },
  {
    id: "applications",
    name: "Applications",
    accent: "#475569",
    icon: "APP",
    extensions: [".lnk", ".url", ".desktop", ".app", ".exe", ".msi", ".appref-ms"],
    keywords: ["app", "application", "shortcut", "launcher"]
  },
  {
    id: "folders",
    name: "Folders",
    accent: "#9333ea",
    icon: "DIR",
    extensions: [],
    keywords: ["folder", "project", "workspace"]
  },
  {
    id: "other",
    name: "Other",
    accent: "#64748b",
    icon: "ETC",
    extensions: [],
    keywords: []
  }
];

const CATEGORY_BY_ID = new Map(DEFAULT_CATEGORIES.map((category) => [category.id, category]));

function getCategory(categoryId) {
  return CATEGORY_BY_ID.get(categoryId) || CATEGORY_BY_ID.get("other");
}

module.exports = {
  DEFAULT_CATEGORIES,
  getCategory
};
