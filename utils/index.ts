import type { Post } from "@/types";
import { serverTimestamp } from "@/config/firebase";

export const getYouTubeEmbedUrl = (url: string) => {
  const youtubeUrlRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?=.*v=(\w+))(?:\S+)?|embed\/(\w+)|v\/(\w+)|user\/\w+)?|youtu\.be\/(\w+))$/;
  const match = url.match(youtubeUrlRegex);

  if (match) {
    const videoId = match[1] || match[2] || match[3] || match[4];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return null;
};

export const uuidv4Regex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const youtubeUrlRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?=.*v=([-\w]+))(?:\S+)?|embed\/([-\w]+)|v\/([-\w]+)|user\/\w+)?|youtu\.be\/([-\w]+))/;

export const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const findPostById = (
  id: string,
  postsDictionary: Record<string, Post>
): Post | undefined => {
  for (const key in postsDictionary) {
    if (postsDictionary[key].id === id) {
      return postsDictionary[key];
    }
  }
  return undefined;
};
export const findPostKeyById = (
  id: string,
  postsDictionary: Record<string, Post>
): string | undefined => {
  for (const key in postsDictionary) {
    if (postsDictionary[key].id === id) {
      return key;
    }
  }
  return undefined;
};

export const getFormattedDate = (timestamp: any) => {
  let date;

  // Check if the timestamp is a Firebase Timestamp object
  if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    // Assume the timestamp is in seconds
    date = new Date(timestamp);
  }

  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
