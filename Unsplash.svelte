<script lang="ts">
  import type { UnsplashRelevant as Unsplash } from "$lib/types/unsplash";
  import { onMount } from "svelte";
  import { loadQotd, loadQotdImage, qotdImageStore, qotdStore } from "$lib/stores/qotd";
  import { hexIsDark } from "$lib/hexIsDark";
  import { dev } from "$app/environment";

  export let image: Unsplash | undefined;
  export let withQuote = true;

  const hex75 = "BF";

  const searchEngine = "https://en.wikipedia.org/w/index.php";

  qotdImageStore.subscribe((i) => {
    if (!i) return;
    if (typeof image !== "undefined") return;
    image = i;
  });

  $: userLink = image && image.user?.link;
  $: user = image && image.user?.name;
  $: unsplashLink = image && image.unsplash;

  onMount(() => {
    if (!$qotdImageStore) loadQotdImage();
    if (!$qotdStore?.author && withQuote) loadQotd();
  });

  // https://en.wikipedia.org/w/index.php?search=Wayne+Dyer&title=Special:Search&profile=advanced&fulltext=1&ns0=1
  // https://en.wikipedia.org/w/index.phpsearch=Wayne+Dyer&title=Special%3ASearch&profile=advanced&fulltext=1&ns0=1

  $: queryParams = new URLSearchParams({
    search: $qotdStore?.author || "Viaero Wireless",
    title: "Special:Search",
    profile: "advanced",
    fulltext: "1",
    ns0: "1",
  }).toString();

  $: authorSearch = `${searchEngine}?${queryParams}`;

  $: backgroundStyle = `background-color: ${image?.color || "gray"}; max-height: min(${image?.height+'px' || '90dvh'}, 90dvh); max-width: min(${image?.width+'px' || '90dvw'}, 90dvw')`;

  $: backgroundStyleTransparent = backgroundStyle + hex75;

  $: useLightText = image?.color ? hexIsDark(image.color) : false;
</script>

{#if ($qotdImageStore || !withQuote) && image?.url}
  <img
    style={backgroundStyle}
    class="shadow-inner p-4 outline outline-tertiary-100 block mx-auto my-auto select-none"
    id="unsplash-image"
    width={'auto'}
    height={'auto'}
    alt={image.title}
    title={image.title}
    src={image.url}
  />
  {#if withQuote}
    <div
      id="unsplash-splash"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col gap-4"
      style={`color: ${useLightText ? "white" : "black"}`}
    >
      <div
        class="flex flex-col bg-gray-500/75 p-16 backdrop-blur-md gap-4 rounded-lg rounded-br-none"
        style={backgroundStyleTransparent}
      >
        <span class="text-2xl text-left">
          {$qotdStore.content}
        </span>
        <span class="text-sm text-right">
          -
          <a class="underline" target="_blank" href={authorSearch} rel="external noreferrer">
            {$qotdStore.author}
          </a>
        </span>
      </div>
      <div
        style={backgroundStyleTransparent}
        class="p-4 backdrop-blur-md rounded-lg rounded-br-3xl rounded-t-none self-end"
      >
        <a class="underline" target="_blank" href={image.url} rel="external noreferrer"> Image </a>
        <span>By</span>
        <a class="underline" target="_blank" href={userLink} rel="external noreferrer"> {user} </a>
        <span>On</span>
        <a class="underline" target="_blank" href={unsplashLink} rel="external noreferrer">
          Unsplash
        </a>
        {#if dev}
          <button
            class="btn btn-icon"
            on:click={() => {
              loadQotdImage(true);
            }}
          >
            <i class="w-4 fa-solid fa-arrow-right"></i>
          </button>
        {/if}
      </div>
    </div>
  {/if}
{/if}
