<script lang="ts">
	import { asImageSrc, isFilled, type Content, type ImageField, type KeyTextField } from "@prismicio/client";
	import { PrismicLink } from "@prismicio/svelte";
	import { gsap } from "gsap";
	import type { Action } from "svelte/action";
    import IconArrow from '~icons/ic/baseline-arrow-outward'
	import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

	gsap.registerPlugin(ScrollTrigger);

    export let items: Content.BlogpostDocument[] | Content.ProjectDocument[];
    export let fallbackItemImage: ImageField;
    export let viewMoreText: KeyTextField = "Read More";

    let lastMousePos = {x:0, y:0};
    let currentIndex: number | undefined;
    let listEl: HTMLUListElement;
    $: contentImages = items.map((item) => {
        const image = isFilled.image(item.data.hover_image) ? item.data.hover_image : fallbackItemImage;
        return asImageSrc(image, {
            fit: 'crop',
            w: 220,
            h:320,
            exp: -10
        });
    });

    const onItemEnter: Action<HTMLElement, number> = (node, index) => {
        gsap.fromTo(
            node, {
                opacity: 0,
                y: 20
            }, {
                opacity: 1,
                y: 0,
                duration: 1.3,
                ease: "elastic.out(1,0.3)",
                stagger: 0.2,
                scrollTrigger: {
                    trigger: node,
                    start: 'top bottom-=200px',
                    end: 'bottom center',
                    toggleActions: 'play none none none'
                },
                onEnter: () => {
                    if (index === items.length - 1) {
                        gsap.to(listEl, {
                            borderBottomColor: "#f5f5f4", //stone-100
                            duration: 0.4,
                            ease: "power2.out",
                        });
                    }
                }
            }
        );

        const imageUrl  = contentImages[index];
        if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
        }

        return {
            destroy() {}
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };
        const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.x, 2));

        //extra values add additional buffer against edge
        const maxY = window.scrollY + window.innerHeight - 350;
        const maxX = window.innerWidth - 250;

        gsap.to('.hover-reveal', {
            //extra values center
            x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
            rotation: speed * (mousePos.x > lastMousePos.x ? 1 : -1), //direction
            ease: "back.out(2)",
            duration:1.3
        });

        gsap.to('.hover-reveal', {
            opacity: currentIndex === undefined ? 0 : 1,
            visibility: 'visible',
            ease: 'power3.out',
            duration: 0.6
        })

        lastMousePos = mousePos;
    };

    const onMouseEnter = (index:number) => {
        currentIndex = index;
    };

    const onMouseLeave = () => {
        currentIndex = undefined;
    }
</script>

<svelte:window on:mousemove={handleMouseMove} />

<ul bind:this={listEl} on:mouseleave={onMouseLeave} class="grid border-b border-b-transparent">
    {#each items as post, index (post.id + index)}
        <li on:mouseenter={() => onMouseEnter(index)} class="content-list-item opacity-0" use:onItemEnter={index}>
            <PrismicLink document={post} class="flex flex-col justify-between border-t border-t-stone-100 py-10  text-stone-200 md:flex-row">
                <div class="flex flex-col">
                    <span class="text-3xl font-bold">{post.data.title}</span>
                    <div class="flex gap-3 text-rose-500">
                        {#each post.tags as tag}
                            <span class="text-lg font-bold">
                                {tag}
                            </span>
                        {/each}
                    </div>
                </div>
                <span class="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0 transition-all duration-150 hover:text-rose-600 hover:scale-110">
                    {viewMoreText}
                    <IconArrow />
                </span>
            </PrismicLink>
        </li>
    {/each}
</ul>

<!-- Hover Element -->
<div class="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-80 w-[220px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300" style={currentIndex === undefined ? "" : `background-image: url(${contentImages[currentIndex]})`}></div>