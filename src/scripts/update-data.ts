import generateEpisodes from "./data-entry";
import parseFeed from "./feedParser/index";

const episodesFileName = await parseFeed();
generateEpisodes(episodesFileName);
