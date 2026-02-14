export const BIN_STATUS_COLORS = {
  empty: '#4CAF50', // Green
  filling: '#FFC107', // Yellow
  full: '#FF9800', // Orange
  overflow: '#F44336', // Red
  offline: '#9E9E9E', // Gray
};

export const BIN_STATUS_LABELS = {
  empty: 'Empty',
  filling: 'Filling',
  full: 'Full',
  overflow: 'Overflow',
  offline: 'Offline',
};

export const ALERT_THRESHOLD = 85; // Fill level percentage to trigger alerts

export const REFRESH_INTERVAL = 30000; // 30 seconds

export const REPORT_TYPES = [
  { value: 'missed-collection', label: 'Missed Collection' },
  { value: 'bin-damage', label: 'Bin Damage' },
  { value: 'illegal-dumping', label: 'Illegal Dumping' },
  { value: 'other', label: 'Other' },
] as const;

export const RESIDENTIAL_ZONES = [
  {
    name: 'Gulberg III',
    region: {
      latitude: 31.5104,
      longitude: 74.3441,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    },
  },
  {
    name: 'Sector A',
    region: {
      latitude: 33.6844,
      longitude: 73.0479,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    },
  },
  {
    name: 'DHA Phase 5',
    region: {
      latitude: 31.4697,
      longitude: 74.4119,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    },
  },
] as const;

export const getZoneRegion = (zone?: string) => {
  if (!zone) return undefined;
  return RESIDENTIAL_ZONES.find((z) => z.name === zone)?.region;
};

