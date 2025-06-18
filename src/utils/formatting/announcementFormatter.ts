
/**
 * Utilities for formatting announcement data into readable messages
 */

/**
 * Format announcements into a readable message with enhanced formatting
 */
export const formatAnnouncementsMessage = (announcements: any[]): string => {
  if (!announcements || announcements.length === 0) {
    return "I couldn't find any recent announcements from REVA University.";
  }
  
  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
  
  // Enhanced formatting with categories and better structure
  let message = "📢 Here are the latest announcements from REVA University:\n\n";
  
  // Group announcements by category if available
  const categories: Record<string, any[]> = {};
  
  sortedAnnouncements.forEach((announcement) => {
    const category = announcement.category || 'General';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(announcement);
  });
  
  // If we have categories, format by category
  if (Object.keys(categories).length > 1) {
    Object.entries(categories).forEach(([category, items]) => {
      message += `📌 ${category}:\n`;
      
      items.forEach((announcement, index) => {
        const title = announcement.title || 'Untitled Announcement';
        const date = announcement.date 
          ? new Date(announcement.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })
          : 'No date available';
        
        message += `  ${index + 1}. ${title} (${date})\n`;
        
        // Add brief description if available
        if (announcement.description) {
          const shortDesc = announcement.description.length > 100 
            ? announcement.description.substring(0, 97) + '...' 
            : announcement.description;
          message += `     ${shortDesc}\n`;
        }
        
        // Add link if available
        if (announcement.link) {
          message += `     Read more: ${announcement.link}\n`;
        }
      });
      
      message += '\n';
    });
  } else {
    // Simple flat list if no categories
    sortedAnnouncements.forEach((announcement, index) => {
      const title = announcement.title || 'Untitled Announcement';
      const date = announcement.date 
        ? new Date(announcement.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        : 'No date available';
      
      message += `${index + 1}. 📋 ${title} (${date})\n`;
      
      // Add brief description if available
      if (announcement.description) {
        const shortDesc = announcement.description.length > 100 
          ? announcement.description.substring(0, 97) + '...' 
          : announcement.description;
        message += `   ${shortDesc}\n\n`;
      }
      
      // Add link if available
      if (announcement.link) {
        message += `   Read more: ${announcement.link}\n\n`;
      }
    });
  }
  
  message += "\nFor more details on these announcements, visit the university website or student portal.";
  
  return message;
};
