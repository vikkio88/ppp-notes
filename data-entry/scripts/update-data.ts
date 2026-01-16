import parseFeed from "./feedParser";
import generateEpisodes from "./merge";

const episodesFileName = await parseFeed();
generateEpisodes(episodesFileName);
