<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicImage, type SliceComponentProps } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.ImageBlockSlice>;

	const { slice }: Props = $props();
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<PrismicImage field={slice.primary.image} class="not-prose w-full h-full rounded-md mt-10 md:mt-14 lg:mt-16" />
	<div class="italic text-center mt-2 mb-10 md:mb-14 lg:mb-16">
		{slice.primary.caption}
	</div>
</section>
