import { slugify } from "../../libs/slugify";
import type { SearchableLink } from "../../types";

export type Props = {
  link: SearchableLink;
};

export default function ResultCard({ link }: Props) {
  return (
    <div className="result">
      <a href={`/episodes/${slugify(link.episodeTitle)}`}>
        <h3>{link.episodeTitle}</h3>
      </a>
      <a href={link.episodeAudioUrl} target="_blank">
        Ascolta 🔊
      </a>
      <a href={link.url} target="_blank">
        {link.description} 🔗
      </a>
    </div>
  );
}
