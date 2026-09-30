export const APP_ICONS: Record<string, string> = {
  finder: '/icons/finder.png',
  safari: '/icons/safari.png',
  photos: '/icons/photos.png',
  messages: '/icons/contacts.png',
  contacts: '/icons/contacts.png',
  resume: '/icons/folder.png',
  terminal: '/icons/terminal.png',
  trash: '/icons/trash.png',
  folder: '/icons/folder.png',
};

export const getAppIcon = (appId: string): string | undefined => {
  return APP_ICONS[appId];
};
