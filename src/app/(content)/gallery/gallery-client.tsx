"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArtPiece } from "@/lib/api/gallery";
import { Button } from "@/components/ui/button";
import { CONTENTFUL } from "@/config/contentful";

interface GalleryClientProps {
  initialArtPieces: ArtPiece[];
}

export function GalleryClient({ initialArtPieces }: GalleryClientProps) {
  const [filter, setFilter] = useState<string>("all");
  const [lastViewedPhoto, setLastViewedPhoto] = useState<string | null>(null);
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  const filteredArtPieces = initialArtPieces.filter(
    (piece) => filter === "all" || piece.type === filter
  );

  useEffect(() => {
    if (lastViewedPhoto) {
      lastViewedPhotoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setLastViewedPhoto(null);
    }
  }, [lastViewedPhoto]);

  const loader = ({ src }: { src: string }) => src;

  return (
    <div className="flex flex-col items-center">
      <Image src="/gallery.png" alt="Gallery" width={300} height={300} />

      <div className="flex justify-center space-x-4 mb-8">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        {CONTENTFUL.galleryApiKeys.map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
        {filteredArtPieces.map((piece) =>
          piece.assets.map((asset) => (
            <Link
              key={asset.id}
              href={`/gallery/${piece.type}/${asset.id}`}
              shallow
              className="relative mb-5 block w-full cursor-zoom-in group after:content-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
              ref={asset.id === lastViewedPhoto ? lastViewedPhotoRef : null}
              onClick={() => setLastViewedPhoto(asset.id)}
            >
              <Image
                alt={`${piece.title} - ${piece.type} art`}
                className="transform rounded-lg brightness-90 transition group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={asset.blurDataUrl}
                src={asset.url}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                loader={loader}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
