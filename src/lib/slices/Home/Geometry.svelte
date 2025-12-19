<script lang="ts">
    import {T as Threlte} from "@threlte/core";
	import { createTransition, Float } from "@threlte/extras";
    import * as THREE from 'three';
    import gsap from 'gsap';
	import { elasticOut } from "svelte/easing";
	import { onMount } from "svelte";

    export let position: [number, number, number] = [0, 0, 0];
    export let geometry: THREE.BufferGeometry = new THREE.IcosahedronGeometry(3);
    export let rate = 0.5;

    const soundEffects = [
        new Audio('/Sounds/hit1.ogg'),
        new Audio('/Sounds/hit2.ogg'),
        new Audio('/Sounds/hit3.ogg')
    ]
        
    let visible = false;
    let reduecedMotionRate = 0;

    const materialParams = [
        { color: 0xe11d48, roughness: 0.1 }, // rose-600
        { color: 0xbe123c, roughness: 0.4 }, // rose-700 (dark rose)
        { color: 0x4c0519, roughness: 0.1 }, // rose-900 (darkest rose)

        // --- Purple (rich transition zone) ---
        { color: 0x9333ea, roughness: 0.1 }, // purple-600 (vivid)
        { color: 0x7e22ce, roughness: 0.4 }, // purple-700 (deeper)
        { color: 0x581c87, roughness: 0.2 }, // purple-700 (deeper)

        // --- Indigo (deep cool tones) ---
        { color: 0x4338ca, roughness: 0.1 }, // indigo-600 (bold)
        { color: 0x3730a3, roughness: 0.4 }, // indigo-700
        { color: 0x1e1b4b, roughness: 0.1 }, // indigo-950

        // --- Blue (clean cold finish) ---
        { color: 0x2563eb, roughness: 0.4 }, // blue-600 (bright but controlled)
        { color: 0x1d4ed8, roughness: 0.1 }, // blue-700 (deep anchor)

        { color: 0x2c3e50, roughness: 0.1, metalness: 0.5 }
    ];

    function getRandomMaterial() {
        return new THREE.MeshStandardMaterial(gsap.utils.random(materialParams));
    }

    function handleClick(event: MouseEvent) {
        gsap.utils.random(soundEffects).play();
        if ('object' in event && event.object instanceof THREE.Mesh) {
            gsap.to(event.object.rotation, {
                x: `+=${gsap.utils.random(0,3)}`,
                y: `+=${gsap.utils.random(0,3)}`,
                z: `+=${gsap.utils.random(0,3)}`,
                duraction: 1.3,
                ease: 'elastic.out(1,0.3)',
                yoyo: true,
            })

            event.object.material = getRandomMaterial();
        }
    }

    const bounce = createTransition((ref) => {
        return {
            tick (t) {
                if (t > 0) visible = true;
                ref.scale.set(t, t, t);
            },
            easing: elasticOut,
            duration: gsap.utils.random(800, 1200),
            delay: gsap.utils.random(0, 500)
        }
    })

    $: groupPosition = [
        position[0] * 2,
        position[1] * 2,
        position[2] * 2
    ] as [number, number, number];

    onMount(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        reduecedMotionRate = prefersReducedMotion ? 0 : 1;
    })

    $: compoundRate = rate * reduecedMotionRate;
</script>

<Threlte.Group position={groupPosition}> 
    <Float speed={5 * compoundRate} rotationSpeed={5 * compoundRate} rotationIntensity={6 * compoundRate} floatIntensity={5 * compoundRate}>
        <Threlte.Mesh {visible} {geometry} in={bounce} material={getRandomMaterial()}
        interactive
        onclick={handleClick}
        ></Threlte.Mesh>
    </Float>
</Threlte.Group>