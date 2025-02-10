import type { SearchableLink } from "../../types";

export type Props = {
  link: SearchableLink;
};

export default function ResultCard({ link }: Props) {
  return (
    <div className="result">
      <h3>{link.episodeTitle}</h3>
      <a href={link.episodeAudioUrl} target="_blank">
        Ascolta 🔊
      </a>
      <a href={link.url} target="_blank">
        {link.description} 🔗
      </a>
    </div>
  );
}
