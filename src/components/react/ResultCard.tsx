export type Props = {
  linkEntry: {
    fileUrl: string;
    link: string;
    description: string;
    title: string;
  };
};

export default function ResultCard({ linkEntry }: Props) {
  return (
    <div className="result">
      <h3>{linkEntry.title}</h3>
      <a href={linkEntry.fileUrl} target="_blank">
        Ascolta 🔊
      </a>
      <a href={linkEntry.link} target="_blank">
        {linkEntry.description} 🔗
      </a>
    </div>
  );
}
