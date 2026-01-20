import { id } from "../libs/topics";
import type {
  BaseTopic,
  CollectionType,
  Episode,
  MainTopic,
} from "../libs/types";

export const PHASES = ["login", "collecting", "finished"] as const;
export type Phase = (typeof PHASES)[number];

const nextPhase: Record<Phase, Phase | undefined> = {
  login: "collecting",
  collecting: "finished",
  finished: undefined,
};

class AppState {
  #phase = $state<Phase>("login");

  meta?: {
    title: string;
    number: number;
    user: string;
    date: Date;
  };

  #lorrowaps: BaseTopic[] = $state([]);
  #menews: BaseTopic[] = $state([]);
  #main: MainTopic[] = $state([]);

  get phase(): Phase {
    return this.#phase;
  }

  next() {
    let n = nextPhase[this.#phase];
    if (n) {
      this.#phase = n;
    }
  }

  startSession({
    title,
    number,
    user,
  }: {
    title: string;
    number: number;
    user: string;
  }) {
    this.meta = { title, number, user, date: new Date() };
  }

  add(type: CollectionType, body: MainTopic | BaseTopic) {
    const collections = {
      lorrowap: () => this.#lorrowaps.push(body as BaseTopic),
      menews: () => this.#menews.push(body as BaseTopic),
      main: () => this.#main.push(body as MainTopic),
    };

    collections[type]?.();
  }

  remove(type: CollectionType, id: string) {
    const collections = {
      lorrowap: () =>
        (this.#lorrowaps = this.#lorrowaps.filter((t) => t.id !== id)),
      menews: () => (this.#menews = this.#menews.filter((t) => t.id !== id)),
      main: () => (this.#main = this.#main.filter((t) => t.id !== id)),
    };

    collections[type]?.();
  }

  load(episode: Episode) {
    this.meta = {
      title: episode.title,
      number: episode.number,
      user: episode.meta.user ?? "unknown",
      date: new Date(),
    };

    const withId = <T>(items: T[], type: CollectionType) =>
      items.map((item) => ({
        id: id(type),
        ...item,
      }));

    this.#menews = withId(episode.menews, "menews");
    this.#lorrowaps = withId(episode.lorrowap, "lorrowap");
    this.#main = withId(episode.main, "main");

    // this.#dolcetto = episode.dolcetto.map((item) => ({
    //   id: id("menews"),
    //   ...item,
    // }));
    // this.#amaro = episode.amaro.map((item) => ({ id: id("menews"), ...item }));
    // this.#lore = episode.lore.map((item) => ({ id: id("menews"), ...item }));
    // this.#others = episode.others.map((item) => ({
    //   id: id("menews"),
    //   ...item,
    // }));
  }

  download() {
    const title = `episode_${this.meta?.number}`;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/json;charset=utf-8," +
        encodeURIComponent(
          `${JSON.stringify(
            {
              title: this.meta?.title!,
              number: this.meta?.number!,
              meta: { user: this.meta?.user, date: new Date() },
              menews: this.#menews.map(({ id, ...rest }) => rest),
              lorrowap: this.#lorrowaps.map(({ id, ...rest }) => rest),
              main: this.#main.map(({ id, ...rest }) => rest),
              dolcetto: [],
              amaro: [],
              lore: [],
              others: [],
            } as Episode,
            null,
            2,
          )}`,
        ),
    );
    element.download = `${title}.json`;
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  get main() {
    return this.#main;
  }

  get lorrowaps() {
    return this.#lorrowaps;
  }

  get menews() {
    return this.#menews;
  }

  restart() {
    this.#phase = "login";

    this.meta = undefined;

    this.#lorrowaps = [];
    this.#menews = [];
    this.#main = [];
  }
}

const app = new AppState();
export default app;
