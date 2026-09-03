"use client";

import React, { useState } from "react";
import { MessageSquare, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";

type PollOption = { id: string; text: string; votes: number };
type Poll = { id: string; question: string; options: PollOption[] };
type Discussion = { id: string; title: string; content: string; author: { name: string | null }; createdAt: Date };

export default function CommunityClientUI({ 
  initialDiscussions, 
  initialPolls,
  userId 
}: { 
  initialDiscussions: Discussion[]; 
  initialPolls: Poll[];
  userId: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"discussions" | "polls">("polls");
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // Local state for optimistic poll voting
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

  const handleVote = async (pollId: string, optionId: string) => {
    if (votedPolls.has(pollId)) return;
    
    // Optimistic UI update
    setPolls(current => current.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
        };
      }
      return p;
    }));
    setVotedPolls(new Set(votedPolls).add(pollId));

    try {
      await fetch(`/api/community/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId })
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/community/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      if (res.ok) {
        setIsCreating(false);
        setTitle("");
        setContent("");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      {/* Sidebar Controls */}
      <div className="lg:col-span-3 space-y-4">
        <button 
          onClick={() => setActiveTab("polls")}
          className={`w-full text-left px-5 py-4 border font-mono text-xs uppercase tracking-widest transition-colors ${activeTab === "polls" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" : "border-white/10 text-white/60 hover:text-white"}`}
        >
          Studio Polls
        </button>
        <button 
          onClick={() => setActiveTab("discussions")}
          className={`w-full text-left px-5 py-4 border font-mono text-xs uppercase tracking-widest transition-colors ${activeTab === "discussions" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" : "border-white/10 text-white/60 hover:text-white"}`}
        >
          Discussions
        </button>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-9">
        
        {/* POLLS VIEW */}
        {activeTab === "polls" && (
          <div className="space-y-8">
            {polls.length === 0 ? (
              <p className="text-white/40 font-mono text-xs">No active polls from the studio right now.</p>
            ) : (
              polls.map(poll => {
                const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
                const hasVoted = votedPolls.has(poll.id);
                
                return (
                  <div key={poll.id} className="p-8 bg-[#141414] border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4AF37] m-4" />
                    <h3 className="text-xl md:text-2xl font-serif text-white mb-6">{poll.question}</h3>
                    
                    <div className="space-y-4">
                      {poll.options.map(option => {
                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        return (
                          <div key={option.id} className="relative">
                            <button
                              onClick={() => handleVote(poll.id, option.id)}
                              disabled={hasVoted}
                              className={`w-full text-left relative z-10 p-4 border font-mono text-xs uppercase tracking-wider transition-colors flex justify-between items-center ${hasVoted ? "border-white/5 cursor-default text-white/70" : "border-white/20 hover:border-[#D4AF37] text-white"}`}
                            >
                              <span>{option.text}</span>
                              {hasVoted && <span className="text-[#D4AF37] font-bold">{percentage}%</span>}
                            </button>
                            {hasVoted && (
                              <div 
                                className="absolute top-0 left-0 h-full bg-[#D4AF37]/10 transition-all duration-1000 ease-out z-0 border-r border-[#D4AF37]/30"
                                style={{ width: `${percentage}%` }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {hasVoted && (
                      <p className="mt-6 text-[10px] font-mono text-[#D4AF37] uppercase flex items-center gap-2">
                        <Check className="w-3 h-3" /> Your vote has been recorded
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* DISCUSSIONS VIEW */}
        {activeTab === "discussions" && (
          <div className="space-y-8">
            <div className="flex justify-end">
              <button 
                onClick={() => setIsCreating(!isCreating)}
                className="flex items-center gap-2 px-6 py-3 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-mono text-xs uppercase tracking-widest transition-colors"
              >
                <Plus className="w-4 h-4" /> Start Discussion
              </button>
            </div>

            {isCreating && (
              <form onSubmit={handleCreateDiscussion} className="p-8 bg-[#141414] border border-[#D4AF37]/30 space-y-4">
                <input 
                  type="text" 
                  placeholder="Discussion Title..." 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-white font-serif focus:outline-none focus:border-[#D4AF37]"
                />
                <textarea 
                  placeholder="Share your thoughts..." 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-white text-sm font-sans focus:outline-none focus:border-[#D4AF37] resize-none"
                />
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-3 bg-[#D4AF37] text-black font-mono text-xs font-bold uppercase tracking-widest">
                    Post to Community
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {initialDiscussions.length === 0 ? (
                <p className="text-white/40 font-mono text-xs">No discussions yet. Be the first.</p>
              ) : (
                initialDiscussions.map(disc => (
                  <div key={disc.id} className="p-6 bg-[#141414] border border-white/10 hover:border-white/20 transition-colors">
                    <h3 className="text-xl font-serif text-white mb-2">{disc.title}</h3>
                    <p className="text-white/60 font-sans text-sm mb-4 line-clamp-2">{disc.content}</p>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase">
                        By {disc.author.name || "Rover"}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        {new Date(disc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
