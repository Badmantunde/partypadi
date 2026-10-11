"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "./Toast";
import { EventPhoto } from "@/types";
import {
  Camera,
  Upload,
  Download,
  Share2,
  Check,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Tag,
  Eye,
  Lock,
} from "lucide-react";

interface EventPhotoGalleryProps {
  eventId: string;
  eventTitle: string;
  organizerName: string;
}

// Curated default seeds for event photo pickup
const DEFAULT_EVENT_PHOTOS: Record<string, EventPhoto[]> = {
  default: [
    {
      id: "photo-1",
      eventId: "default",
      url: "/images/friends-linkup.jpg",
      category: "red-carpet",
      categoryLabel: "Red Carpet & Fits",
      caption: "Main Hall Quad entrance fits · The arrivals clique",
      photographer: "@campus_lens",
      uploadedBy: "fassa_execs",
      uploadedAt: "2026-10-10",
      downloadsCount: 142,
    },
    {
      id: "photo-2",
      eventId: "default",
      url: "/images/concert-live.jpg",
      category: "stage",
      categoryLabel: "Stage & Performances",
      caption: "Main stage spotlight & DJ hype set",
      photographer: "@lagos_sound_lens",
      uploadedBy: "fassa_execs",
      uploadedAt: "2026-10-10",
      downloadsCount: 238,
    },
    {
      id: "photo-3",
      eventId: "default",
      url: "/images/dinner-gala.jpg",
      category: "vip",
      categoryLabel: "VIP & Tables",
      caption: "Faculty table toast & champagne reception",
      photographer: "@kemilaw_lens",
      uploadedBy: "fassa_execs",
      uploadedAt: "2026-10-10",
      downloadsCount: 89,
    },
    {
      id: "photo-4",
      eventId: "default",
      url: "/images/hero-student.jpg",
      category: "crowd",
      categoryLabel: "Dancefloor & Vibes",
      caption: "Midnight dance circle under the neon lasers",
      photographer: "@campus_hypeman",
      uploadedBy: "fassa_execs",
      uploadedAt: "2026-10-10",
      downloadsCount: 312,
    },
    {
      id: "photo-5",
      eventId: "default",
      url: "/images/bento-sculpture.jpg",
      category: "red-carpet",
      categoryLabel: "Red Carpet & Fits",
      caption: "Glamour photobooth with 3D neon installations",
      photographer: "@campus_lens",
      uploadedBy: "fassa_execs",
      uploadedAt: "2026-10-10",
      downloadsCount: 165,
    },
    {
      id: "photo-6",
      eventId: "default",
      url: "/images/bento-rocket.jpg",
      category: "stage",
      categoryLabel: "Stage & Performances",
      caption: "Pyro countdown and stage lasers at peak hour",
      photographer: "@lagos_sound_lens",
      uploadedBy: "fassa_execs",
      uploadedAt: "2026-10-10",
      downloadsCount: 198,
    },
  ],
};

export function EventPhotoGallery({
  eventId,
  eventTitle,
  organizerName,
}: EventPhotoGalleryProps) {
  const { currentUser, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Upload Form States
  const [selectedUploadFiles, setSelectedUploadFiles] = useState<
    Array<{ url: string; name: string }>
  >([]);
  const [uploadCategory, setUploadCategory] = useState<EventPhoto["category"]>("red-carpet");
  const [photographerTag, setPhotographerTag] = useState("@campus_paparazzi");
  const [photoCaption, setPhotoCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Load photos from localStorage or default seed
  useEffect(() => {
    const storageKey = `pp_event_photos_${eventId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setPhotos(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // Initialize with seeded photos tailored to this event
    const seed = DEFAULT_EVENT_PHOTOS.default.map((p, idx) => ({
      ...p,
      id: `photo-${eventId}-${idx + 1}`,
      eventId,
    }));
    setPhotos(seed);
  }, [eventId]);

  const savePhotos = (updated: EventPhoto[]) => {
    setPhotos(updated);
    localStorage.setItem(`pp_event_photos_${eventId}`, JSON.stringify(updated));
  };

  const isOrganizer = currentUser?.role === "organizer";

  // Filter photos by category
  const filteredPhotos =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  // Handle Photo File Pick
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSelectedUploadFiles((prev) => [
            ...prev,
            { url: ev.target!.result as string, name: file.name },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit Organizer Photos
  const handlePublishPhotos = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUploadFiles.length === 0) {
      showToast({
        type: "error",
        title: "No Photos Selected",
        message: "Please choose at least one photo from your device.",
      });
      return;
    }

    setIsUploading(true);

    const categoryLabels: Record<EventPhoto["category"], string> = {
      all: "All",
      "red-carpet": "Red Carpet & Fits",
      crowd: "Dancefloor & Vibes",
      stage: "Stage & Performances",
      vip: "VIP & Tables",
    };

    const newPhotos: EventPhoto[] = selectedUploadFiles.map((file, i) => ({
      id: `user-upload-${Date.now()}-${i}`,
      eventId,
      url: file.url,
      category: uploadCategory,
      categoryLabel: categoryLabels[uploadCategory],
      caption: photoCaption.trim() || `Event drops from ${eventTitle}`,
      photographer: photographerTag.trim() || `@${currentUser?.username || "organizer"}`,
      uploadedBy: currentUser?.username || "organizer",
      uploadedAt: new Date().toISOString().split("T")[0],
      downloadsCount: 0,
    }));

    const updated = [...newPhotos, ...photos];
    savePhotos(updated);

    setIsUploading(false);
    setSelectedUploadFiles([]);
    setPhotoCaption("");
    setUploadModalOpen(false);

    showToast({
      type: "success",
      title: "Event Photos Dropped!",
      message: `${newPhotos.length} photos published. Partygoers can now find and download their pictures.`,
    });
  };

  // Handle Individual Download ("Pick Picture")
  const handleDownloadPhoto = (photo: EventPhoto, e?: React.MouseEvent) => {
    e?.stopPropagation();

    // Increment download count
    const updated = photos.map((p) =>
      p.id === photo.id ? { ...p, downloadsCount: p.downloadsCount + 1 } : p
    );
    savePhotos(updated);

    // Create trigger for browser download
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = `partypadi-${eventId}-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: "success",
      title: "Picture Picked!",
      message: "High-resolution photo saved to your device. Tag @partypadi on your story!",
    });
  };

  // Share Photo
  const handleSharePhoto = (photo: EventPhoto, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/events/${eventId}#gallery`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast({
        type: "success",
        title: "Photo Link Copied!",
        message: "Link copied to clipboard. Share with your friends on WhatsApp!",
      });
    }
  };

  return (
    <section id="gallery" className="pt-12 sm:pt-16 border-t border-neutral-200">
      <div className="space-y-8">
        {/* Gallery Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11120F]/5 border border-neutral-300 text-[10px] font-mono uppercase tracking-wider text-[#11120F] font-bold">
              <Camera className="w-3.5 h-3.5 text-black" />
              <span>OFFICIAL CAMPUS PHOTO DROP // {photos.length} PICTURES</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-medium text-[#11120F] tracking-tight leading-snug">
              Event Photos & Picture Pickup.
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
              Find your red carpet, stage, and party moments. Browse the official album, tap to pick your pictures, and download high-resolution copies for your WhatsApp status & IG feed.
            </p>
          </div>

          {/* Action Buttons: Organizer Upload & Info */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isOrganizer ? (
              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="spicy-btn px-5 py-2.5 bg-[#11120F] hover:bg-[#2C2E2A] text-white rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <Upload className="w-4 h-4 text-[#C5FF35]" />
                <span>Upload Event Photos</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    openAuthModal("signin", "organizer");
                  } else {
                    setUploadModalOpen(true);
                  }
                }}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#11120F] rounded-full text-xs font-mono font-semibold flex items-center gap-2 transition-all border border-neutral-300"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Organizer / Paparazzi Drop</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: `All Photos (${photos.length})` },
            { id: "red-carpet", label: "Red Carpet & Fits" },
            { id: "crowd", label: "Dancefloor & Vibes" },
            { id: "stage", label: "Stage & Performances" },
            { id: "vip", label: "VIP & Tables" },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#11120F] text-white font-bold shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200 border border-neutral-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Responsive Grid of Event Photos */}
        {filteredPhotos.length === 0 ? (
          <div className="rounded-3xl bg-neutral-50 border border-neutral-200 p-8 sm:p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-200 flex items-center justify-center text-neutral-500 mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-medium text-lg text-[#11120F]">
                No photos found in this category yet
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Official photographers are dropping pictures periodically. Check back soon or switch categories!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-black cursor-pointer shadow-md border border-neutral-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <Image
                  src={photo.url}
                  alt={photo.caption || "Event Photo"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={photo.url.startsWith("data:")}
                />

                {/* Top Badge: Category */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/90 uppercase tracking-tight border border-white/10">
                    {photo.categoryLabel}
                  </span>
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover / Tap Bottom Meta & Pick Button */}
                <div className="absolute bottom-0 inset-x-0 p-3 text-white space-y-2 z-10 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300">
                  {photo.caption && (
                    <p className="text-[11px] font-sans font-medium line-clamp-1 text-white/90">
                      {photo.caption}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300">
                    <span>{photo.photographer}</span>
                    <span>{photo.downloadsCount} picks</span>
                  </div>

                  {/* Pick & Download Button */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={(e) => handleDownloadPhoto(photo, e)}
                      className="flex-1 py-1.5 bg-[#C5FF35] hover:bg-white text-black font-mono text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-md transition-colors"
                      title="Download high-resolution photo"
                    >
                      <Download className="w-3 h-3" />
                      <span>Pick Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSharePhoto(photo, e)}
                      className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors"
                      title="Share picture link"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar: Controls */}
          <div
            className="flex items-center justify-between z-20 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#C5FF35] tracking-widest block font-bold">
                {filteredPhotos[lightboxIndex].categoryLabel} · {lightboxIndex + 1} OF {filteredPhotos.length}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Photographer: {filteredPhotos[lightboxIndex].photographer}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadPhoto(filteredPhotos[lightboxIndex])}
                className="px-4 py-2 bg-[#C5FF35] hover:bg-white text-black font-mono text-xs font-bold rounded-full flex items-center gap-1.5 shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Photo</span>
              </button>

              <button
                type="button"
                onClick={() => handleSharePhoto(filteredPhotos[lightboxIndex])}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage Image with Nav Arrows */}
          <div
            className="relative flex-1 flex items-center justify-center my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            {lightboxIndex > 0 && (
              <button
                type="button"
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* High-res Image Display */}
            <div className="relative max-w-4xl max-h-[75vh] w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={filteredPhotos[lightboxIndex].url}
                alt="Enlarged photo"
                fill
                className="object-contain"
                priority
                unoptimized={filteredPhotos[lightboxIndex].url.startsWith("data:")}
              />
            </div>

            {/* Next Button */}
            {lightboxIndex < filteredPhotos.length - 1 && (
              <button
                type="button"
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption & Download Bar */}
          <div
            className="text-center text-white space-y-2 z-20 max-w-xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredPhotos[lightboxIndex].caption && (
              <p className="text-xs sm:text-sm font-sans text-neutral-300">
                {filteredPhotos[lightboxIndex].caption}
              </p>
            )}
            <div className="text-[11px] font-mono text-neutral-400">
              Picked {filteredPhotos[lightboxIndex].downloadsCount} times by campus partygoers
            </div>
          </div>
        </div>
      )}

      {/* ORGANIZER UPLOAD MODAL */}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setUploadModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-[#0C0D0E] border border-white/15 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#C5FF35] uppercase font-bold tracking-wider">
                  ORGANIZER PHOTO DROP STUDIO
                </span>
                <h3 className="font-display font-bold text-xl text-white">
                  Upload Event Photos to Album
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishPhotos} className="space-y-4">
              {/* File Selector */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                  Select Event Photos from Device (Multiple Allowed)
                </label>
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-white/20 hover:border-[#C5FF35] bg-white/[0.02] cursor-pointer transition-all space-y-2">
                  <Upload className="w-6 h-6 text-[#C5FF35]" />
                  <span className="text-xs font-mono text-neutral-300 font-bold">
                    Click to browse or drop event pictures here
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    PNG, JPG, WebP supported · High-resolution
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Selected Files Previews */}
              {selectedUploadFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>{selectedUploadFiles.length} Photos Selected for Upload:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedUploadFiles([])}
                      className="text-red-400 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
                    {selectedUploadFiles.map((file, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black"
                      >
                        <Image
                          src={file.url}
                          alt={`Upload preview ${i}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUploadFiles(
                              selectedUploadFiles.filter((_, idx) => idx !== i)
                            )
                          }
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Album Section / Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) =>
                      setUploadCategory(e.target.value as EventPhoto["category"])
                    }
                    className="w-full bg-[#161719] border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#C5FF35]"
                  >
                    <option value="red-carpet">Red Carpet & Fits</option>
                    <option value="crowd">Dancefloor & Vibes</option>
                    <option value="stage">Stage & Performances</option>
                    <option value="vip">VIP & Tables</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                    Photographer Tag / Credit
                  </label>
                  <input
                    type="text"
                    value={photographerTag}
                    onChange={(e) => setPhotographerTag(e.target.value)}
                    placeholder="e.g. @lensbydavid or @partysnaps"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#C5FF35]"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                  Caption / Moment Description (Optional)
                </label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="e.g. VIP table arrivals and hall red carpet looks"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#C5FF35]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading || selectedUploadFiles.length === 0}
                  className="spicy-btn w-full py-3 bg-[#C5FF35] text-black font-mono text-xs font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  <span>
                    {isUploading
                      ? "Publishing Drops..."
                      : `Publish ${selectedUploadFiles.length} Photos to Event Album`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
