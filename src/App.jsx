import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { topicsData } from "@/data/topics";

import TopicCards from "@/components/TopicCards";
import SubtopicsList from "@/components/SubtopicsList";
import BlogView from "@/components/BlogView";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);

  useEffect(() => {
    if (params.topicId) {
      const topicName = params.topicId.replace(/-/g, " ");
      const topic = topicsData.find(
        (t) => t.name.toLowerCase() === topicName
      );
      if (topic) {
        setSelectedTopic(topic);
        if (params.subtopicId) {
          const subtopic = topic.subtopics.find(
            (s) => s.id === params.subtopicId
          );
          if (subtopic) {
            setSelectedSubtopic(subtopic);
          }
        } else {
          setSelectedSubtopic(null);
        }
      }
    } else {
      setSelectedTopic(null);
      setSelectedSubtopic(null);
    }
  }, [params.topicId, params.subtopicId]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(null);
    navigate(`/topic/${topic.name.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleSubtopicSelect = (sub) => {
    if (selectedTopic) {
      setSelectedSubtopic(sub);
      navigate(
        `/topic/${selectedTopic.name
          .toLowerCase()
          .replace(/\s+/g, "-")}/${sub.id}`
      );
    }
  };

  const handleSidebarSubtopic = (subtopicId) => {
    const result = getSubtopicById(subtopicId);
    if (result) {
      setSelectedTopic(result.topic);
      setSelectedSubtopic(result.sub);
      navigate(
        `/topic/${result.topic.name
          .toLowerCase()
          .replace(/\s+/g, "-")}/${result.sub.id}`
      );
    }
  };

  const getSubtopicById = (id) => {
    for (let topic of topicsData) {
      const found = topic.subtopics.find((sub) => sub.id === id);
      if (found) return { topic, sub: found };
    }
    return null;
  };

  return (
    <div className="bg-background text-foreground flex flex-col h-screen">
      <Navbar />
      {/* Flex container for sidebar and main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onSelectSubtopic={handleSidebarSubtopic}
          onSelectTopic={handleTopicSelect}
        />

        {/* Main content area */}
        <main className="flex flex-col flex-1 overflow-y-auto min-w-0">
          <div className="flex-1 p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <TopicCards
                    topics={topicsData}
                    onSelect={handleTopicSelect}
                  />
                }
              />
              <Route
                path="/topic/:topicId"
                element={
                  selectedTopic ? (
                    <>
                      <h2 className="text-2xl font-bold mb-4 text-center">
                        {selectedTopic.name}
                      </h2>
                      <SubtopicsList
                        subtopics={selectedTopic.subtopics}
                        onSelect={handleSubtopicSelect}
                      />
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Topic not found</p>
                    </div>
                  )
                }
              />
              <Route
                path="/topic/:topicId/:subtopicId"
                element={
                  selectedSubtopic ? (
                    <BlogView
                      filePath={selectedSubtopic.filePath}
                      downloadLink={selectedSubtopic.downloadLink}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Subtopic not found
                      </p>
                    </div>
                  )
                }
              />
              <Route
                path="/about-us"
                element={<BlogView filePath="/content/about_us.md" />}
              />
              <Route
                path="/contact-us"
                element={<BlogView filePath="/content/contact_us.md" />}
              />
            </Routes>
          </div>
          <div className="text-center p-4 text-muted-foreground mt-auto">
            © Copyright of HackersEra, 2025. <br /> All rights reserved.
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
