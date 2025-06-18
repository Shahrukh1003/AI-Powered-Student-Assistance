
/**
 * Main API service module that exports functions from specialized modules
 */

// Re-export all functions from specialized modules
export { fetchRevaAnnouncements } from './api/announcementService';
export { formatAnnouncementsMessage } from './formatting/announcementFormatter';
export { isAnnouncementQuery } from './detection/queryDetection';
