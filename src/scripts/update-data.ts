import parseFeed from "./feedParser/index";
import generateEpisodes from "./merge";

const episodesFileName = await parseFeed();
generateEpisodes(episodesFileName);
