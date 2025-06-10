// src/components/TopicCards.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const TopicCards = ({ topics, onSelect }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Web Security Testing Guide</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <Card
            key={topic.name}
            className="group cursor-pointer transition-all duration-300 border-2 border-border hover:border-primary bg-background hover:bg-primary/5"
            onClick={() => onSelect(topic)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                {topic.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {topic.subtopics.length} subtopics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Click to explore subtopics
              </p>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopicCards;
