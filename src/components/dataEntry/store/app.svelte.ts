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

  #lorrowap: BaseTopic[] = $state([]);
  #menews: BaseTopic[] = $state([]);
  #main: MainTopic[] = $state([]);
  #dolcetto: BaseTopic[] = $state([]);
  #amaro: BaseTopic[] = $state([]);
  #impizioni: BaseTopic[] = $state([]);
  #lore: BaseTopic[] = $state([]);

  set name(name: string) {
    if (!this.meta) {
      return;
    }

    this.meta!.user = name;
  }

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
      lorrowap: () => this.#lorrowap.push(body as BaseTopic),
      menews: () => this.#menews.push(body as BaseTopic),
      main: () => this.#main.push(body as MainTopic),
      dolcetto: () => this.#dolcetto.push(body as BaseTopic),
      amaro: () => this.#amaro.push(body as BaseTopic),
      impizioni: () => this.#impizioni.push(body as BaseTopic),
      lore: () => this.#lore.push(body as BaseTopic),
    };

    collections[type]?.();
  }

  remove(type: CollectionType, id: string) {
    const f = filterId(id);
    const collections = {
      lorrowap: () => (this.#lorrowap = this.#lorrowap.filter(f)),
      menews: () => (this.#menews = this.#menews.filter(f)),
      main: () => (this.#main = this.#main.filter(f)),
      dolcetto: () => this.#dolcetto.filter(f),
      amaro: () => this.#amaro.filter(f),
      impizioni: () => this.#impizioni.filter(f),
      lore: () => this.#lore.filter(f),
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
    this.#lorrowap = withId(episode.lorrowap, "lorrowap");
    this.#main = withId(episode.main, "main");

    this.#dolcetto = episode.dolcetto.map((item) => ({
      id: id("dolcetto"),
      ...item,
    }));
    this.#amaro = episode.amaro.map((item) => ({ id: id("amaro"), ...item }));
    this.#impizioni =
      episode.impizioni?.map((item) => ({ id: id("impizioni"), ...item })) ??
      [];
    this.#lore = episode.lore.map((item) => ({ id: id("lore"), ...item }));
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
              menews: this.#menews.map(removeId),
              lorrowap: this.#lorrowap.map(removeId),
              main: this.#main.map(removeId),
              dolcetto: this.#dolcetto.map(removeId),
              amaro: this.#amaro.map(removeId),
              impizioni: this.#impizioni.map(removeId),
              lore: this.lore.map(removeId),
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

  get lorrowap() {
    return this.#lorrowap;
  }

  get menews() {
    return this.#menews;
  }

  get dolcetto() {
    return this.#dolcetto;
  }

  get amaro() {
    return this.#amaro;
  }

  get impizioni() {
    return this.#impizioni;
  }

  get lore() {
    return this.#lore;
  }

  restart() {
    this.#phase = "login";

    this.meta = undefined;

    this.#lorrowap = [];
    this.#menews = [];
    this.#main = [];
    this.#dolcetto = [];
    this.#amaro = [];
    this.#impizioni = [];
    this.#lore = [];
  }
}

const removeId = ({ id, ...rest }: any) => rest;
const filterId = (id: string) => (i: { id: string }) => i.id !== id;

const app = new AppState();
export default app;
