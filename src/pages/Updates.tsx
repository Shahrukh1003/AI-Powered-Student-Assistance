
import { useState, useEffect } from 'react';
import { Calendar, Bell, Users, BookOpen, BadgePlus } from 'lucide-react';
import { speak } from '@/utils/textToSpeech';

interface Update {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'event' | 'notice' | 'news' | 'academic';
}

const Updates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  // Simulated data fetch
  useEffect(() => {
    const fetchUpdates = async () => {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dummyUpdates: Update[] = [
        {
          id: 1,
          title: 'New Semester Registration',
          description: 'Registration for the Fall 2023 semester is now open. Please complete your registration by August 15.',
          date: '2023-07-30',
          type: 'academic'
        },
        {
          id: 2,
          title: 'Annual Tech Fest',
          description: 'Join us for the annual technology festival featuring workshops, competitions, and guest lectures.',
          date: '2023-08-25',
          type: 'event'
        },
        {
          id: 3,
          title: 'Library Hours Extended',
          description: 'The main library will now be open until midnight during the exam preparation period.',
          date: '2023-07-25',
          type: 'notice'
        },
        {
          id: 4,
          title: 'New Research Grant',
          description: 'REVA University has received a prestigious research grant in the field of Artificial Intelligence.',
          date: '2023-07-22',
          type: 'news'
        },
        {
          id: 5,
          title: 'International Conference',
          description: 'Call for papers: International Conference on Emerging Technologies to be held in September.',
          date: '2023-09-15',
          type: 'event'
        },
        {
          id: 6,
          title: 'Scholarship Announcement',
          description: 'Applications are now open for the merit scholarship program for the academic year 2023-24.',
          date: '2023-08-01',
          type: 'academic'
        },
        {
          id: 7,
          title: 'Campus Recruitment Drive',
          description: 'Major tech companies will be visiting campus for placements next month.',
          date: '2023-08-10',
          type: 'news'
        },
        {
          id: 8,
          title: 'Holiday Announcement',
          description: 'The university will remain closed on August 15 for Independence Day celebrations.',
          date: '2023-08-15',
          type: 'notice'
        }
      ];
      
      setUpdates(dummyUpdates);
      setLoading(false);

      // Announce the page is loaded using text-to-speech
      speak("University updates page loaded. You can filter updates by category using the buttons at the top.");
    };
    
    fetchUpdates();
  }, []);
  
  const filteredUpdates = filter === 'all' 
    ? updates 
    : updates.filter(update => update.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-5 w-5 text-green-400" />;
      case 'notice':
        return <Bell className="h-5 w-5 text-yellow-400" />;
      case 'news':
        return <BadgePlus className="h-5 w-5 text-blue-400" />;
      case 'academic':
        return <BookOpen className="h-5 w-5 text-purple-400" />;
      default:
        return <Users className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    
    // Announce filter changes using text-to-speech
    let filterText = newFilter === 'all' ? 'all updates' : `${newFilter} updates`;
    speak(`Showing ${filterText}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10 opacity-0 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-white dark:text-white light:text-reva-dark">University Updates</h1>
          <p className="text-white/70 dark:text-white/70 light:text-reva-dark/70">
            Stay informed with the latest events, notices, and news from REVA University
          </p>
        </div>
        
        {/* Filter Tabs - Improved for light theme */}
        <div className="flex justify-center mb-8 space-x-2 opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {[
            { id: 'all', label: 'All Updates' },
            { id: 'event', label: 'Events' },
            { id: 'notice', label: 'Notices' },
            { id: 'news', label: 'News' },
            { id: 'academic', label: 'Academic' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                filter === tab.id 
                  ? 'bg-reva-blue text-white' 
                  : 'bg-white/5 dark:text-white/70 light:text-reva-dark light:bg-black/5 hover:bg-white/10 light:hover:bg-black/10'
              }`}
              onClick={() => handleFilterChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Updates List */}
        <div className="space-y-4 mb-8">
          {loading ? (
            // Skeleton loader
            Array(5).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="glass p-6 rounded-xl animate-pulse opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 100 + 400}ms` }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/10 light:bg-black/10 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-white/10 light:bg-black/10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/10 light:bg-black/10 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 h-12 bg-white/5 light:bg-black/5 rounded"></div>
              </div>
            ))
          ) : (
            filteredUpdates.map((update, index) => (
              <div 
                key={update.id}
                className="glass p-6 rounded-xl transform transition-all duration-500 hover:bg-white/10 light:hover:bg-black/10 opacity-0 animate-slide-in-bottom"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <div className="flex items-start">
                  <div className="p-2 glass rounded-full">
                    {getIcon(update.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-medium text-white dark:text-white light:text-reva-dark">{update.title}</h3>
                    <p className="text-sm text-white/60 dark:text-white/60 light:text-reva-dark/60 mb-3">
                      {new Date(update.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-white/80 dark:text-white/80 light:text-reva-dark/80">{update.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {!loading && filteredUpdates.length === 0 && (
            <div className="text-center py-10 glass rounded-xl opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <p className="text-white/70 dark:text-white/70 light:text-reva-dark/70">No updates available for this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Updates;
