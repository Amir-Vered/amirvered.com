<script lang="ts">
    import clsx from 'clsx';
    import { onMount } from "svelte";
    import { gsap } from "gsap";

    export let tag = 'section';
    export let animated = true;

    let el: HTMLElement;

    onMount(() => {
        if (!animated) return;
        gsap.from(el, {
            x: -80,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out"
        });
    });
</script>

<svelte:element
    this={tag}
    bind:this={el}
    {...$$restProps}
    class={clsx(`px-4 py-10 md:px-6 md:py-14 lg:py-16`, $$props.class)}
>
    <div class="mx-auto w-full max-w-7xl">
        <slot />
    </div>
</svelte:element>
