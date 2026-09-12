import React from "react";
import { SiteConfig } from "@/config/siteContent";
import { Plus, Trash2, Edit } from "lucide-react";

export default function JournalView({ config, setConfig }: { config: SiteConfig, setConfig: any }) {
  const addNewPost = () => {
    const newPost = {
      id: `post-${Date.now()}`,
      slug: `new-article-${Date.now()}`,
      title: "New Journal Article",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      seoDescription: "A brief description of this article for Google search results.",
      content: "Write your article content here...",
      coverImage: "/images/editorial-rocks.png",
    };
    setConfig({ ...config, journal: { ...config.journal, posts: [newPost, ...config.journal.posts] } });
  };

  const removePost = (idx: number) => {
    if (confirm("Delete this article permanently?")) {
      const copy = [...config.journal.posts];
      copy.splice(idx, 1);
      setConfig({ ...config, journal: { ...config.journal, posts: copy } });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-white mb-2">Journal & Articles</h2>
          <p className="text-sm text-white/60">Publish editorial content to improve SEO and brand storytelling.</p>
        </div>
        <button
          onClick={addNewPost}
          className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {config.journal.posts.map((post, idx) => (
          <div key={post.id} className="bg-[#141414] border border-white/10 overflow-hidden flex flex-col md:flex-row">
            
            <div className="w-full md:w-64 shrink-0 bg-black p-4 flex flex-col gap-4 border-r border-white/5">
              <label className="text-[10px] uppercase font-mono text-white/50 tracking-widest block">Cover Image</label>
              <img src={post.coverImage || "/images/placeholder.png"} className="w-full h-40 object-cover border border-white/10" alt="Cover" />
              <input
                type="text"
                value={post.coverImage}
                onChange={(e) => {
                  const copy = [...config.journal.posts];
                  copy[idx].coverImage = e.target.value;
                  setConfig({ ...config, journal: { ...config.journal, posts: copy } });
                }}
                className="w-full bg-transparent border-b border-white/20 pb-1 text-xs font-mono text-white focus:border-[#D4AF37]"
                placeholder="/images/your-image.jpg"
              />
            </div>

            <div className="flex-1 p-6 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-white/50 tracking-widest mb-1 block">Article Title</label>
                    <input
                      type="text"
                      value={post.title}
                      onChange={(e) => {
                        const copy = [...config.journal.posts];
                        copy[idx].title = e.target.value;
                        copy[idx].slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                        setConfig({ ...config, journal: { ...config.journal, posts: copy } });
                      }}
                      className="w-full bg-transparent border-b border-white/20 pb-1 text-xl font-serif text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-mono text-white/50 tracking-widest mb-1 block">URL Slug</label>
                      <input
                        type="text"
                        value={post.slug}
                        onChange={(e) => {
                          const copy = [...config.journal.posts];
                          copy[idx].slug = e.target.value;
                          setConfig({ ...config, journal: { ...config.journal, posts: copy } });
                        }}
                        className="w-full bg-transparent border-b border-white/20 pb-1 text-xs font-mono text-white/70 focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="text-[10px] uppercase font-mono text-white/50 tracking-widest mb-1 block">Publish Date</label>
                      <input
                        type="text"
                        value={post.date}
                        onChange={(e) => {
                          const copy = [...config.journal.posts];
                          copy[idx].date = e.target.value;
                          setConfig({ ...config, journal: { ...config.journal, posts: copy } });
                        }}
                        className="w-full bg-transparent border-b border-white/20 pb-1 text-xs font-mono text-white/70 focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => removePost(idx)}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-white/50 tracking-widest mb-1 block">SEO Meta Description</label>
                <textarea
                  value={post.seoDescription}
                  onChange={(e) => {
                    const copy = [...config.journal.posts];
                    copy[idx].seoDescription = e.target.value;
                    setConfig({ ...config, journal: { ...config.journal, posts: copy } });
                  }}
                  className="w-full bg-black border border-white/10 p-3 text-xs text-white/80 focus:border-[#D4AF37] min-h-[60px]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-white/50 tracking-widest mb-1 block flex items-center gap-2">
                  <Edit className="w-3 h-3" /> Article Content (Markdown)
                </label>
                <textarea
                  value={post.content}
                  onChange={(e) => {
                    const copy = [...config.journal.posts];
                    copy[idx].content = e.target.value;
                    setConfig({ ...config, journal: { ...config.journal, posts: copy } });
                  }}
                  className="w-full bg-black border border-white/10 p-4 text-sm font-mono text-white focus:border-[#D4AF37] min-h-[250px]"
                />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
