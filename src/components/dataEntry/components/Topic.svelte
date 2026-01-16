<script lang="ts">
  import { isZeroTs } from "../libs/formatters";
  import { id } from "../libs/topics";
  import type {
    Author,
    BaseTopic,
    CollectionType,
    MainTopic,
    Timestamp as TS,
  } from "../libs/types";
  import app from "../store/app.svelte";
  import AuthorSelector from "./shared/AuthorSelector.svelte";
  import Quette from "./shared/Quette.svelte";
  import Tags from "./shared/Tags.svelte";
  import Timestamp from "./shared/Timestamp.svelte";
  import TopicCmd from "./shared/TopicCmd.svelte";
  type Props = {
    type: CollectionType;
    onFinished: () => void;
  };

  const { type, onFinished }: Props = $props();
  const typeMap: Record<
    CollectionType,
    { title: string; canHavePizza: boolean }
  > = {
    lorrowap: { title: "Lorrowap", canHavePizza: false },
    menews: { title: "Menews", canHavePizza: false },
    main: { title: "Main Argomento", canHavePizza: true },
  };

  const { title, canHavePizza } = typeMap[type];

  let author: Author = $state("Lorro");
  let description: Author = $state("");
  let pizzaValue: number = $state(5);
  let pizzaDescription: string = $state("");
  let tags: string[] = $state([]);
  let timestamp: TS = $state({ hours: 0, minutes: 0, seconds: 0 });

  function onAddInternal() {
    if (description.length < 2 || author.length < 2) {
      return;
    }

    let body: BaseTopic = {
      id: id(type),
      author,
      description,
      tags: [...tags],
      timestamp: isZeroTs(timestamp) ? undefined : timestamp,
    };
    if (type === "main") {
      body = {
        ...body,
        pizza: { slices: pizzaValue, description: pizzaDescription },
      } as MainTopic;
    }

    app.add(type, body);
    onFinished();
  }

  function onCancelInternal() {
    onFinished();
  }
</script>

<div class="f1 f c pd g">
  <h3>Aggiungendo: {title}</h3>
  <div class="f r g">
    <h4>Autore/Conduttore</h4>
    <AuthorSelector bind:author />
  </div>
  <input type="text" placeholder="Descrizione" bind:value={description} />

  {#if canHavePizza}
    <div class="f r g">
      <Quette bind:value={pizzaValue} bind:description={pizzaDescription} />
    </div>
  {/if}
  <Timestamp bind:timestamp />
  <Tags bind:tags />
</div>

<TopicCmd onAdd={onAddInternal} onCancel={onCancelInternal} />
