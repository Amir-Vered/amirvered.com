<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import { isFilled, type Content } from '@prismicio/client';
	import { PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';
	import ContentList from './ContentList.svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	export let slice: Content.ContentIndexSlice;

	export let items: Content.BlogpostDocument[] | Content.ProjectDocument[];

	let el: HTMLElement;

    onMount(() => {
        gsap.from(".animate", {
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        });
    });
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation} animated={false}>
	<div class="animate">
		<Heading size="xl" class="mb-8">{slice.primary.heading}</Heading>
		{#if isFilled.richText(slice.primary.description)}
			<div class="prose prose-xl prose-invert mb-10">
				<PrismicRichText field={slice.primary.description} />
			</div>
		{/if}
	</div>
	<ContentList {items} fallbackItemImage={slice.primary.fallback_item_image} viewMoreText={slice.primary.view_more_text} />
</Bounded>
