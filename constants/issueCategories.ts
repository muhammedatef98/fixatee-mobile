// Issue categories for filtering

export interface IssueCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
}

export const ISSUE_CATEGORIES: IssueCategory[] = [
  {
    id: 'all',
    name: 'All Issues',
    nameAr: 'كل الأعطال',
    icon: 'view-grid',
    color: '#10B981'
  },
  {
    id: 'screen',
    name: 'Screen',
    nameAr: 'الشاشة',
    icon: 'cellphone-screenshot',
    color: '#3B82F6'
  },
  {
    id: 'battery',
    name: 'Battery',
    nameAr: 'البطارية',
    icon: 'battery-alert',
    color: '#EF4444'
  },
  {
    id: 'charging',
    name: 'Charging',
    nameAr: 'الشحن',
    icon: 'lightning-bolt',
    color: '#F59E0B'
  },
  {
    id: 'camera',
    name: 'Camera',
    nameAr: 'الكاميرا',
    icon: 'camera',
    color: '#8B5CF6'
  },
  {
    id: 'audio',
    name: 'Audio',
    nameAr: 'الصوت',
    icon: 'volume-high',
    color: '#EC4899'
  },
  {
    id: 'button',
    name: 'Buttons',
    nameAr: 'الأزرار',
    icon: 'gesture-tap',
    color: '#6366F1'
  },
  {
    id: 'software',
    name: 'Software',
    nameAr: 'السوفتوير',
    icon: 'update',
    color: '#14B8A6'
  },
  {
    id: 'connectivity',
    name: 'Connectivity',
    nameAr: 'الاتصال',
    icon: 'wifi',
    color: '#06B6D4'
  },
  {
    id: 'physical',
    name: 'Physical Damage',
    nameAr: 'أضرار مادية',
    icon: 'water',
    color: '#F97316'
  },
  {
    id: 'security',
    name: 'Security',
    nameAr: 'الأمان',
    icon: 'fingerprint',
    color: '#A855F7'
  },
  {
    id: 'other',
    name: 'Other',
    nameAr: 'أخرى',
    icon: 'help-circle',
    color: '#64748B'
  }
];

// Map issue IDs to categories
export const ISSUE_TO_CATEGORY_MAP: Record<string, string> = {
  // Screen issues
  'screen_broken': 'screen',
  'screen_crack': 'screen',
  'screen_black': 'screen',
  'screen_lines': 'screen',
  'touch_not_working': 'screen',
  'screen_flickering': 'screen',
  
  // Battery issues
  'battery_drain': 'battery',
  'battery_not_charging': 'battery',
  'battery_swollen': 'battery',
  'battery_replacement': 'battery',
  'charging_slow': 'battery',
  
  // Charging port issues
  'charging_port': 'charging',
  'charging_port_loose': 'charging',
  'charging_port_damaged': 'charging',
  
  // Camera issues
  'camera_not_working': 'camera',
  'camera_blurry': 'camera',
  'camera_lens_broken': 'camera',
  'front_camera_issue': 'camera',
  'back_camera_issue': 'camera',
  
  // Audio issues
  'speaker_not_working': 'audio',
  'microphone_issue': 'audio',
  'earpiece_issue': 'audio',
  'no_sound': 'audio',
  'headphone_jack': 'audio',
  
  // Button issues
  'power_button': 'button',
  'volume_button': 'button',
  'home_button': 'button',
  
  // Software issues
  'software_crash': 'software',
  'slow_performance': 'software',
  'wont_turn_on': 'software',
  'freezing': 'software',
  'boot_loop': 'software',
  'virus_malware': 'software',
  'system_update': 'software',
  
  // Connectivity issues
  'wifi_not_working': 'connectivity',
  'bluetooth_issue': 'connectivity',
  'no_signal': 'connectivity',
  'sim_not_detected': 'connectivity',
  'gps_not_working': 'connectivity',
  
  // Physical damage
  'water_damage': 'physical',
  'back_glass_broken': 'physical',
  'frame_bent': 'physical',
  'overheating': 'physical',
  
  // Security
  'face_id_issue': 'security',
  'fingerprint_issue': 'security',
  
  // Other
  'storage_full': 'other',
  'sd_card_issue': 'other',
  'vibration_issue': 'other',
  'proximity_sensor': 'other',
  'data_recovery': 'other',
  'factory_reset': 'other',
  'other': 'other'
};

// Helper function to get category for an issue
export const getIssueCategory = (issueId: string): string => {
  return ISSUE_TO_CATEGORY_MAP[issueId] || 'other';
};

// Helper function to filter issues by category
export const filterIssuesByCategory = (issues: any[], categoryId: string): any[] => {
  if (categoryId === 'all') return issues;
  
  return issues.filter(issue => {
    const category = getIssueCategory(issue.id);
    return category === categoryId;
  });
};
