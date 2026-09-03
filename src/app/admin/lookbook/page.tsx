"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Save, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function LookbookAdmin() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await fetch("/api/admin/lookbook");
    const data = await res.json();
    setImages(data);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const file = e.target.files[0];
    
    // Upload to Vercel Blob via our existing upload route
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.url) {
        // Save to Database
        await fetch("/api/admin/lookbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: data.url, caption: "New Lookbook Image" }),
        });
        fetchImages();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const toggleHomepage = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/admin/lookbook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showOnHomepage: !currentStatus }),
    });
    fetchImages();
  };

  const deleteImage = async (id: string) => {
    await fetch(`/api/admin/lookbook/${id}`, { method: "DELETE" });
    fetchImages();
  };

  if (loading) return <div className="text-foreground p-10">Loading lookbook...</div>;

  return (
    <div className="space-y-10 text-foreground">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-light mb-2">Lookbook Magazine</h1>
          <p className="text-sm font-mono text-muted-foreground tracking-widest uppercase">Manage editorial images and homepage gallery</p>
        </div>
        <div>
          <label className="cursor-pointer px-6 py-3 bg-gold hover:opacity-90 text-background font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            {uploading ? "Uploading..." : <><Upload className="w-4 h-4" /> Upload Image</>}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="bg-card border border-border overflow-hidden group relative">
            <div className="relative w-full aspect-[4/5] bg-muted">
              <Image src={img.url} alt="Lookbook" fill className="object-cover" />
              <button 
                onClick={() => deleteImage(img.id)}
                className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 border-t border-border flex justify-between items-center">
              <span className="text-xs font-mono uppercase text-muted-foreground truncate max-w-[150px]">
                {img.caption || "Editorial"}
              </span>
              <button
                onClick={() => toggleHomepage(img.id, img.showOnHomepage)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors border ${
                  img.showOnHomepage 
                    ? "bg-gold text-background border-gold" 
                    : "bg-transparent text-foreground/50 border-border hover:border-gold hover:text-gold"
                }`}
              >
                {img.showOnHomepage ? "On Homepage" : "Hidden"}
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-3 py-20 text-center border border-dashed border-border flex flex-col items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-4" />
            <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">No images in lookbook.</p>
          </div>
        )}
      </div>
    </div>
  );
}
