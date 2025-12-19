<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicEmbed } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.VideoBlockSlice>;

	const { slice }: Props = $props();
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div
		class="not-prose w-full mt-10 md:mt-14 lg:mt-16
		       relative aspect-video overflow-hidden rounded-md
		       [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:top-0 [&_iframe]:left-0"
	>
		<PrismicEmbed field={slice.primary.video} />
	</div>

	<div class="italic text-center mt-2 mb-10 md:mb-14 lg:mb-16">
		{slice.primary.caption}
	</div>
</section>
