export const AUTHORS = ["Lorro", "Nick", "Sio", "Other"] as const;
export type Author = (typeof AUTHORS)[number] | string;

export type VotoPizze = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Timestamp = { hours: number; minutes: number; seconds: number };

export type BaseTopic = {
  id: string;
  author: Author;
  description: string;
  tags?: string[];
  link?: string;
  timestamp?: Timestamp;
};
export type Pizza = {
  slices: VotoPizze;
  description?: string;
};

export type MainTopic = BaseTopic & { pizza?: Pizza };

export type BaseTopicNoId = Omit<BaseTopic, "id">;
export type MainTopicNoId = Omit<MainTopic, "id">;

export type Episode = {
  title: string;
  date?: Date;
  menews: BaseTopicNoId[];
  lorrowap: BaseTopicNoId[];
  main: MainTopicNoId[];
  dolcetto: BaseTopicNoId[];
  amaro: BaseTopicNoId[];
  lore: BaseTopicNoId[];
  others: BaseTopicNoId[];
  meta: {
    user: string;
    date: Date;
  };
};

export type CollectionType = "lorrowap" | "menews" | "main";
