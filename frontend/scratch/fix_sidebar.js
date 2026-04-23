const fs = require('fs');
let content = fs.readFileSync('src/components/layout/AdminSidebar.jsx', 'utf8');

const getWrappedIcon = (iconName) => `<div className="p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-sm flex items-center justify-center">
              <${iconName} className="w-5 h-5 text-white/80" />
            </div>`;

// Replace imports first
content = content.replace('import { useAuth } from "../../context/AuthContext";', 'import { useAuth } from "../../context/AuthContext";\nimport { LayoutDashboard, Bell, Users, ClipboardList, User, Shield, Radio, Key, Settings, UserCircle } from "lucide-react";');

// Manual safe replacements:
content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-90"[\s\S]*?<\/svg>/, getWrappedIcon('LayoutDashboard'));
content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-70"[\s\S]*?d="M15 17h5l[\s\S]*?<\/svg>/, getWrappedIcon('Bell'));

// Replacing "Users" requires replacing the matched SVG and keeping the label
content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-70"[\s\S]*?d="M12 4.354a4[\s\S]*?Users\n\s*<\/Link>/, getWrappedIcon('Users') + '\n            Users\n          </Link>');

content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-70"[\s\S]*?d="M9 12h6[\s\S]*?<\/svg>/, getWrappedIcon('ClipboardList'));

content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-70"[\s\S]*?d="M16 7a4[\s\S]*?User Dashboard\n\s*<\/Link>/, getWrappedIcon('User') + '\n            User Dashboard\n          </Link>');

content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-70"[\s\S]*?d="M12 4.354a4[\s\S]*?User Roles\n\s*<\/button>/, getWrappedIcon('Shield') + '\n            User Roles\n          </button>');

content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-70"[\s\S]*?d="M11 5.882[\s\S]*?<\/svg>/, getWrappedIcon('Radio'));
content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-70"[\s\S]*?d="M9 12l2[\s\S]*?<\/svg>/, getWrappedIcon('Key'));
content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-70"[\s\S]*?d="M10.325[\s\S]*?<\/svg>/, getWrappedIcon('Settings'));

content = content.replace(/<svg className="w-\[18px\] h-\[18px\] opacity-70"[\s\S]*?d="M16 7a4[\s\S]*?My Profile\n\s*<\/Link>/, getWrappedIcon('UserCircle') + '\n            My Profile\n          </Link>');


fs.writeFileSync('src/components/layout/AdminSidebar.jsx', content, 'utf8');
console.log('AdminSidebar updated.');
