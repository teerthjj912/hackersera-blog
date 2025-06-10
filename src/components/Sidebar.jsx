import { Input } from "@/components/ui/input";
import { useState, useMemo, useRef, useEffect, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { topicsData } from "@/data/topics";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Info, Search } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const SidebarContent = memo(function SidebarContent({
  selectedTopic,
  search,
  searchInputRef,
  handleSearchChange,
  handleTopicClick,
  handleSubtopicClick,
  filteredTopics,
  location,
  isDark,
  isMobile = false,
}) {
  useEffect(() => {
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [search, searchInputRef]);

  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <div className="p-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            key="sidebar-search-input"
            ref={searchInputRef}
            placeholder="Search topics..."
            value={search}
            onChange={(e) => handleSearchChange(e)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-3 pb-8 invisible-scrollbar">
        {filteredTopics.map((topic) => {
          const isOpen = selectedTopic === topic.id || search.trim() !== "";

          return (
            <div key={topic.id} className="space-y-2">
              <button
                onClick={() => handleTopicClick(topic)}
                className={`w-full flex items-center justify-between p-3 text-left font-semibold rounded-lg transition-all duration-200 cursor-pointer border shadow-sm hover:shadow-md
                  ${selectedTopic === topic.id ? `bg-primary ${isDark ? 'text-white' : 'text-black'} border-primary` : 'text-foreground border-border hover:bg-primary/10 hover:border-primary'}
                `}
              >
                <span className="text-base">{topic.name}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'} ${isOpen ? `${isDark ? 'text-white' : 'text-black'}` : 'text-muted-foreground'}`}
                />
              </button>

              <div
                className={`overflow-hidden transform transition-all duration-300 ease-in-out origin-top ${isOpen
                    ? "max-h-[2000px] opacity-100 scale-y-100 translate-y-0"
                    : "max-h-0 opacity-0 scale-y-95 -translate-y-2"
                  }`}
              >
                <ul className="space-y-2 py-2 pl-4">
                  {topic.subtopics.map((sub) => (
                    <li key={sub.id}>
                      <button
                        onClick={() => handleSubtopicClick(topic, sub)}
                        className={`w-full text-left text-sm rounded-lg transition-all duration-200 cursor-pointer border shadow-sm hover:shadow-md
                          ${location.pathname.includes(sub.id) ? `bg-primary ${isDark ? 'text-white' : 'text-black'} border-primary` : 'text-foreground border-border hover:bg-primary/10 hover:text-primary hover:border-primary'}
                        `}
                      >
                        <div className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded-md">
                              <Info className={`h-4 w-4 ${location.pathname.includes(sub.id) ? `${isDark ? 'text-white' : 'text-black'}` : 'text-muted-foreground'}`} />
                            </div>
                            <div className={`font-medium ${location.pathname.includes(sub.id) ? `${isDark ? 'text-white' : 'text-black'}` : 'text-muted-foreground'}`}>
                              {sub.id}
                            </div>
                          </div>
                          <div className={`text-sm mt-2 pl-8 ${location.pathname.includes(sub.id) ? `${isDark ? 'text-white' : 'text-black'}` : 'text-muted-foreground'}`}>
                            {sub.name}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default function Sidebar({ onSelectSubtopic, onSelectTopic }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 3) {
      const topicName = pathParts[2].replace(/-/g, ' ');
      const topic = topicsData.find(t => t.name.toLowerCase() === topicName);
      if (topic) {
        setSelectedTopic(topic.id);
      }
    } else {
      setSelectedTopic(null);
    }
  }, [location.pathname]);

  const filteredTopics = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return topicsData;

    return topicsData
      .map((topic) => {
        const filteredSubs = topic.subtopics.filter((sub) =>
          sub.id.toLowerCase().includes(searchLower) ||
          sub.name.toLowerCase().includes(searchLower)
        );
        const topicMatches = topic.name.toLowerCase().includes(searchLower);

        if (topicMatches || filteredSubs.length > 0) {
          return {
            ...topic,
            subtopics: topicMatches ? topic.subtopics : filteredSubs,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [search]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleTopicClick = useCallback((topic) => {
    setSelectedTopic(selectedTopic === topic.id ? null : topic.id);
    navigate(`/topic/${topic.name.toLowerCase().replace(/\s+/g, '-')}`);
    if (onSelectTopic) onSelectTopic(topic);
  }, [selectedTopic, navigate, onSelectTopic]);

  const handleSubtopicClick = useCallback((topic, subtopic) => {
    if (onSelectSubtopic) onSelectSubtopic(subtopic.id);
    navigate(`/topic/${topic.name.toLowerCase().replace(/\s+/g, '-')}/${subtopic.id}`);

    // Close mobile drawer after subtopic click:
    setIsMobileDrawerOpen(false);
  }, [onSelectSubtopic, navigate]);

  return (
    <div className="h-full flex flex-col md:flex-none">
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Drawer open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className={`h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary-hover cursor-pointer ${isDark ? 'text-white' : 'text-black'}`}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle topics menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh] flex flex-col">
            <SidebarContent
              selectedTopic={selectedTopic}
              search={search}
              searchInputRef={searchInputRef}
              handleSearchChange={handleSearchChange}
              handleTopicClick={handleTopicClick}
              handleSubtopicClick={handleSubtopicClick}
              filteredTopics={filteredTopics}
              location={location}
              isDark={isDark}
              isMobile={true}
            />
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-full w-[280px] overflow-y-auto overflow-x-hidden border-r bg-muted/40 flex-shrink-0">
        <SidebarContent
          selectedTopic={selectedTopic}
          search={search}
          searchInputRef={searchInputRef}
          handleSearchChange={handleSearchChange}
          handleTopicClick={handleTopicClick}
          handleSubtopicClick={handleSubtopicClick}
          filteredTopics={filteredTopics}
          location={location}
          isDark={isDark}
          isMobile={false}
        />
      </aside>
    </div>
  );
}
