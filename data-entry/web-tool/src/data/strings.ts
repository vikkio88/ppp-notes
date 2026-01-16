export const strings = {
  globals: {
    next: "Next",
    close: "Close",
    add: "Add",
  },
  login: {
    title: "PPP DataEntry",
    episodeTitle: "Episode Title",
    episodeNumber: "Episode Number",
    name: "Your Name/Nickname",
  },
  collecting: {
    title: "Collecting Info for Episode: %episode%",
    description: "Topic Description",
    pizzaDescription: "Pizza Description",
    adding: "Adding a new: ",
    author: "Author:",
    authorPH: "Other Author",
    fette: "Quette?",
    timestamp: "Timestamp",
    menews: "MeNews",
    lorrowap: "Lorro-wap",
    main: "Main",
    finished: "Finished Collecting",
  },
  finished: {
    message: "You finished collecting Info for Episode %episode% of PowerPizza",
    please: "please Download the file and share it.",
    download: "Download",
  },
};

export function t(str: string, params?: Record<string, string | number>) {
  if (!params) return str;

  return str.replace(/%(\w+)%/g, (_, key: string) => {
    const value = params[key];
    return value !== undefined ? String(value) : `%${key}%`;
  });
}
