import type { Note } from "@/types";

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

export const findNoteById = (
  id: string,
  notesDictionary: Record<string, Note>
): Note | undefined => {
  for (const key in notesDictionary) {
    if (notesDictionary[key].id === id) {
      return notesDictionary[key];
    }
  }
  return undefined;
};
export const findNoteKeyById = (
  id: string,
  notesDictionary: Record<string, Note>
): string | undefined => {
  for (const key in notesDictionary) {
    if (notesDictionary[key].id === id) {
      return key;
    }
  }
  return undefined;
};

export function getTimeAgo(date: Date) {
  // check if timestamp or date object
  if (!(date instanceof Date)) {
    date = date.toDate();
  }
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();

  // Calculate the time difference in seconds, minutes, hours, days, and years
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
  } else {
    return seconds === 1 ? "1 sec ago" : `${seconds} secs ago`;
  }
}
