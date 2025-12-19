<script lang="ts">
    import { onMount } from 'svelte';
	import { type ImageField } from "@prismicio/client";
    import { PrismicImage } from "@prismicio/svelte";
	import clsx from "clsx";
    import gsap from "gsap";

    export let image: ImageField;
    let className: string = "";
    export {className as class};

    let component: HTMLElement;

    onMount(() => {
        gsap.fromTo('.avatar', {
            opacity: 0,
            scale: 1.4
        }, {
            scale: 1,
            opacity: 1,
            duration: 1.3,
            ease: 'power3.inOut'
        });

        window.onmousemove = (e) => {
            if (!component) return;
            const rect = component.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;

            const percentX = {
                x: (e.clientX - centerX) / rect.width / 2
            };
            const distFromCenterX = 1 - Math.abs(percentX.x);

            gsap.timeline({
                defaults: {duration: 0.5, overwrite: 'auto', ease: 'power3.out'}
            }).to(".avatar", {
                rotation: gsap.utils.clamp(-2, 2, 5 * percentX.x),
                filter: `drop-shadow(${gsap.utils.clamp(-40, 40, 15 * percentX.x)}px 10px 25px rgba(0,0,0,0.35))`
            }, 0).to(".highlight", {
                opacity: distFromCenterX - 0.8,
                x: -10 + 20 * percentX.x
            }, 0);
        };
    });
</script>

<div class={clsx('relative h-full w-full', className)} bind:this={component}>
    <div class="avatar aspect-square overflow-hidden rounded-3xl border-2 border-stone-700 opacity-0">
        <PrismicImage 
            field={image} 
            class="avatar-image h-full w-full object-cover"
            imgixParams={{q:90}}
        />
        <div class="highlight absolute inset-0 w-full scale-110 bg-linear-to-tr from-transparent via-white to-transparent opacity-0"></div>
    </div>
</div>

<style>
    .avatar {
        perspective: 500px;
        perspective-origin: 150% 150%;
    }
</style>