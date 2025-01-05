const Parser = require("rss-parser");
const fs = require("fs");
const stringCleaner = require("./libs/stringCleaner");

const URL = "https://www.spreaker.com/show/3039391/episodes/feed";

class Show {
  constructor(
    title,
    description,
    link,
    feedUrl,
    copyright,
    image,
    author,
    email,
    language,
    explicit,
    podcasts
  ) {
    this.title = title;
    this.description = description;
    this.link = link;
    this.feedUrl = feedUrl;
    this.copyright = copyright;
    this.image = image;
    this.author = author;
    this.email = email;
    this.language = language;
    this.explicit = explicit;

    this.podcasts = podcasts;
  }

  static fromFeed(data) {
    let {
      title,
      description,
      link,
      feedUrl,
      copyright,
      language,
      itunes,
      items = [],
    } = data;
    description = stringCleaner.rmHtml(description);
    const image = itunes.image;
    const author = itunes.author || itunes.owner.name;
    const email = itunes.owner.email;
    const explicit = stringCleaner.booleanize(itunes.explicit);

    let podcasts = items;

    if (items && items.length) {
      podcasts = items.map((item) => {
        return Podcast.fromFeed(item).toJs();
      });
    }

    return new Show(
      title,
      description,
      link,
      feedUrl,
      copyright,
      image,
      author,
      email,
      language,
      explicit,
      podcasts
    );
  }

  toJs() {
    return {
      title: this.title,
      description: this.description,
      link: this.link,
      feedUrl: this.feedUrl,
      copyright: this.copyright,
      image: this.image,
      author: this.author,
      email: this.email,
      language: this.language,
      explicit: this.explicit,
      podcasts: this.podcasts,
    };
  }
}

class Podcast {
  constructor(title, pubDate, fileUrl, content, contentSnippet, guid, isoDate) {
    this.title = title;
    this.pubDate = pubDate;
    this.fileUrl = fileUrl;
    this.content = content;
    this.contentSnippet = contentSnippet;
    this.guid = guid;
    this.isoDate = isoDate;
  }

  static fromFeed(data) {
    let { title, pubDate, enclosure, content, contentSnippet, guid, isoDate } =
      data;
    const fileUrl = enclosure.url;
    content = stringCleaner.rmHtml(content);
    contentSnippet = stringCleaner.rmHtml(contentSnippet);

    return new Podcast(
      title,
      pubDate,
      fileUrl,
      content,
      contentSnippet,
      guid,
      isoDate
    );
  }

  toJs() {
    return {
      title: this.title,
      pubDate: this.pubDate,
      fileUrl: this.fileUrl,
      content: this.content,
      contentSnippet: this.contentSnippet,
      guid: this.guid,
      isoDate: this.isoDate,
    };
  }
}

const parser = new Parser();

const feedParser = async (url) => {
  const feed = await parser.parseURL(url);
  return feed;
};

const main = async () => {
  console.log(`\t getting remote feed...`);
  const data = await feedParser(URL);
  const show = Show.fromFeed(data);
  console.log(`\t parsing links...`);

  save(show, "shows");
  const episodes = [];
  const links = [];
  for (const episode of show.podcasts) {
    const currentEpisodeLinks = [];
    console.log(`\t\t- ${episode.title}`);
    const rows = episode.content.replace(/\n+/gm, "\n").split("\n");
    let previous = null;
    for (const row of rows) {
      if (stringCleaner.isValidURL(row) && previous) {
        const link = {
          link: row,
          description: previous.replace("►", ""),
          title: episode.title,
          fileUrl: episode.fileUrl,
        };
        currentEpisodeLinks.push(link);
        links.push(link);
        previous = null;
      } else {
        previous = row;
      }
    }
    episodes.push({
      title: episode.title,
      fileUrl: episode.fileUrl,
      links: currentEpisodeLinks,
      content: episode.content,
      date: episode.isoDate,
    });
    console.log("\t\t...done\n");
  }

  const linksFile = save(links, "links");
  const episodesFile = save(episodes, "episodes");

  for (const filename of [linksFile, episodesFile]) {
    console.log(`\t moving ${filename} to public src folder...`);
    fs.copyFileSync(`output/${filename}`, `public/${filename}`);
  }
  console.log(`\t generating consts`);
  fs.writeFileSync(
    `src/consts.js`,
    `export const LINK_URL = '/${linksFile}';\nexport const EPISODES_URL = '/${episodesFile}';\nexport const LAST_UPDATE = new Date('${now()}');`
  );

  console.log("...all done bye <3\n");
};

const now = () => new Date().toISOString();

const save = (data, prefix) => {
  let filename = now().replace(/:/gm, ".");
  filename = `${prefix}_${filename}.json`;
  console.log(`\t saving ${filename} file...`);
  fs.writeFileSync(`output/${filename}`, JSON.stringify(data));

  return filename;
};

main();
