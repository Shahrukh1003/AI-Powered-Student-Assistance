
import { fetchRevaAnnouncements } from '@/utils/api/announcementService';
import { formatAnnouncementsMessage } from '@/utils/formatting/announcementFormatter';
import { isAnnouncementQuery } from '@/utils/detection/queryDetection';

// Function to fetch data from REVA University website or API
export const fetchDataFromREVA = async (query: string): Promise<string> => {
  try {
    const lowerCaseQuery = query.toLowerCase();
    
    // Check if the query is related to announcements or updates using our enhanced detection
    if (isAnnouncementQuery(query)) {
      console.log('Announcement query detected, fetching live announcements...');
      
      // Try to fetch live announcements from the API
      try {
        const result = await fetchRevaAnnouncements();
        
        if (result.success && result.data) {
          console.log('Successfully fetched announcements:', result.data.length);
          return formatAnnouncementsMessage(result.data);
        } else {
          // Improved fallback with specific error messages based on error type
          console.warn('Falling back to static announcement content:', result.error);
          
          let fallbackMessage = "I couldn't retrieve the latest announcements right now. ";
          
          // Customize message based on error type
          switch (result.errorType) {
            case 'network':
              fallbackMessage += "There seems to be a network connectivity issue. Please check your internet connection and try again later.";
              break;
            case 'server':
              fallbackMessage += "The university's announcement server is currently unavailable. Please try again later or check the university website directly.";
              break;
            case 'timeout':
              fallbackMessage += "The request timed out while trying to fetch the announcements. This might be due to server congestion or network issues.";
              break;
            case 'parse':
              fallbackMessage += "There was an issue processing the announcement data. The IT team has been notified of this issue.";
              break;
            default:
              fallbackMessage += "Here's what I know from my last update: REVA University regularly posts announcements about academic events, extracurricular activities, and administrative updates on their official website and student portal.";
          }
          
          return fallbackMessage;
        }
      } catch (apiError) {
        console.error('Error in API integration:', apiError);
        return "I encountered an unexpected error while fetching announcements. Please try again later or check the university website directly.";
      }
    }
    
    // This is the existing mock implementation that will serve as fallback for non-announcement queries
    // Simulate fetching with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate fetched data based on query topics
    
    if (lowerCaseQuery.includes('course') || lowerCaseQuery.includes('program') || lowerCaseQuery.includes('schedule')) {
      return `REVA University offers various programs across faculties like Engineering, Management, Commerce, Arts & Humanities, Science, and Law. Undergraduate courses include B.Tech, BBA, BCA, while postgraduate courses include M.Tech, MBA, MCA. The academic schedule typically runs from August to May with two semesters per year. For detailed schedules, students can check the academic calendar on the university portal.`;
    } 
    else if (lowerCaseQuery.includes('facility') || lowerCaseQuery.includes('facilities') || lowerCaseQuery.includes('infrastructure')) {
      return `REVA University provides state-of-the-art facilities including modern classrooms, research labs, library with e-resources, sports complex with indoor and outdoor facilities, health center, hostels, cafeteria, auditorium, and Wi-Fi across campus. The campus is eco-friendly with solar power and rainwater harvesting.`;
    }
    else if (lowerCaseQuery.includes('admission')) {
      return `For admission to REVA University, students need to apply online through the university website. Undergraduate admissions are based on entrance exams like KCET, COMEDK, JEE, or the university's own entrance test. Postgraduate admissions consider graduation marks and entrance scores. International students can apply through the International Student Cell. The admission season typically begins in February-March each year.`;
    }
    else if (lowerCaseQuery.includes('fee') || lowerCaseQuery.includes('payment')) {
      return `Fee structures at REVA University vary by program. Engineering programs cost approximately ₹1.5-2.5 lakhs per year, Management programs around ₹3-5 lakhs, and Arts & Science programs around ₹60,000-1.5 lakhs annually. Various scholarships are available based on merit, sports excellence, and financial need. Fees can be paid online through the student portal or at the finance office.`;
    }
    else if (lowerCaseQuery.includes('event') || lowerCaseQuery.includes('events')) {
      return `REVA University hosts numerous events throughout the academic year including the annual cultural fest "Revamp", technical symposium "TechReva", sports meet "Sportika", and research conference "RICE". There are also regular workshops, guest lectures, industry visits, and department-specific events. The event calendar is regularly updated on the university website and notice boards.`;
    }
    else if (lowerCaseQuery.includes('faculty') || lowerCaseQuery.includes('professor') || lowerCaseQuery.includes('teacher')) {
      return `REVA University has highly qualified faculty members with diverse academic backgrounds and industry experience. Many hold PhDs from prestigious institutions and actively engage in research. The faculty-student ratio is maintained at optimal levels to ensure quality education and personal attention. Faculty members regularly publish in international journals and present at conferences.`;
    }
    else if (lowerCaseQuery.includes('placement') || lowerCaseQuery.includes('job') || lowerCaseQuery.includes('career')) {
      return `The Career Development Center at REVA University facilitates placements with top companies across sectors. Recent placement records show 85-90% placement rates for eligible students, with average package of ₹5-7 lakhs per annum. Companies like Infosys, Wipro, TCS, Amazon, and many others regularly recruit from campus. Pre-placement training including mock interviews and resume building is provided to all students.`;
    }
    else if (lowerCaseQuery.includes('hostel') || lowerCaseQuery.includes('accommodation')) {
      return `REVA University provides separate hostel facilities for boys and girls with furnished rooms, mess facility, Wi-Fi, and 24/7 security. Rooms are available in different configurations including single, double and triple sharing. The hostels have recreation areas, laundry services, and regular maintenance. Applications for hostel accommodation can be submitted during the admission process.`;
    }
    else {
      // Generic response for other queries
      return `Based on your question about "${query}", I recommend checking the REVA University website (www.reva.edu.in) for the most accurate and up-to-date information. You can also contact the university directly at +91-80-6622-6622 or info@reva.edu.in for specific details.`;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return `I'm sorry, I couldn't fetch the information you requested. Please try again later or visit the REVA University website directly at www.reva.edu.in.`;
  }
};
