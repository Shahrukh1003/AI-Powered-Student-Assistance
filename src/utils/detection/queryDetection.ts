
/**
 * Utilities for detecting types of user queries
 */

/**
 * Detect if a user query is related to announcements
 */
export const isAnnouncementQuery = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  
  // More comprehensive list of announcement-related keywords
  const announcementKeywords = [
    'announcement', 'announce', 'news', 'update', 'latest', 
    'recent', 'notification', 'alert', 'bulletin', 'inform',
    'what\'s new', 'what\'s happening', 'current events',
    'university news', 'college news', 'campus news',
    'reva news', 'reva updates', 'reva announcements',
    'important information', 'bulletin board', 'notice board',
    'events', 'upcoming events', 'calendar', 'schedule',
    'new information', 'anything new', 'what\'s going on',
    'any updates', 'latest happenings', 'recent developments',
    'notices', 'circulars', 'memos', 'announcements', 
    'whats new', 'tell me news', 'any news', 'current news',
    'updates from reva', 'university updates', 'college updates'
  ];
  
  // Check for exact and partial matches
  return announcementKeywords.some(keyword => 
    lowerQuery.includes(keyword) || 
    // Handle word boundaries and plurals
    new RegExp(`\\b${keyword}(s|es|ing|ed|ment)?\\b`).test(lowerQuery)
  );
};
