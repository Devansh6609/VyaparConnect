// src/components/ui/Icon.tsx
import React from 'react';
import {
  LucideProps,
  // List all icons used in the app to ensure they are bundled.
  Activity,
  AlertCircle,
  BarChart3,
  Check,
  CheckCheck,
  Clock,
  Combine,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  File,
  FileText,
  Filter,
  LayoutDashboard,
  LineChart,
  Lock,
  MessageCircle,
  Package,
  PieChart,
  Radio,
  Settings,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Sunrise, // Added Sunrise icon
  Trash2,
  User,
  UserPlus,
  UserX,
  Users,
  X,
} from 'lucide-react';

// Create a map of all available icons.
// Keys are camelCase, as this is how they are predominantly used in props.
const iconMap = {
  activity: Activity,
  alertCircle: AlertCircle,
  barChart3: BarChart3,
  check: Check,
  checkCheck: CheckCheck,
  clock: Clock,
  combine: Combine,
  creditCard: CreditCard,
  dollarSign: DollarSign,
  download: Download,
  edit: Edit,
  file: File,
  fileText: FileText,
  filter: Filter,
  layoutDashboard: LayoutDashboard,
  lineChart: LineChart,
  lock: Lock,
  messageCircle: MessageCircle,
  package: Package,
  pieChart: PieChart,
  radio: Radio,
  settings: Settings,
  share2: Share2,
  slidersHorizontal: SlidersHorizontal,
  sparkles: Sparkles,
  sunrise: Sunrise, // Added Sunrise icon
  trash2: Trash2,
  user: User,
  userPlus: UserPlus,
  userX: UserX,
  users: Users,
  x: X,
};

export type IconName = keyof typeof iconMap;

export type IconProps = LucideProps & {
  name: string; // Allow any string to be flexible with casing from props.
};

// Helper to normalize name to camelCase for consistent map lookup.
const toCamelCase = (name: string): IconName => {
  if (!name) return 'alertCircle'; // Default to a fallback icon name
  // If it's 'messageCircle', it stays 'messageCircle'.
  // If it's 'MessageCircle', it becomes 'messageCircle'.
  const camel = name.charAt(0).toLowerCase() + name.slice(1);
  return camel as IconName;
};

const Icon = ({ name, ...props }: IconProps) => {
  const normalizedName = toCamelCase(name);
  const LucideIcon = iconMap[normalizedName];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" (normalized to "${normalizedName}") not found in the icon map. Rendering a fallback icon.`);
    // Return a visible error icon to make it clear that an icon is missing.
    return <AlertCircle {...props} color="red" />;
  }

  return <LucideIcon {...props} />;
};

export default Icon;