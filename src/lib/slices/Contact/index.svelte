<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import { type Content, isFilled } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicLink } from "@prismicio/svelte";

    import IconGithub from '~icons/fa-brands/github';
    import IconLinkedIn from '~icons/fa-brands/linkedin';
    import IconMail from '~icons/material-symbols/mail-rounded';

	type Props = SliceComponentProps<Content.ContactSlice>;

	export let slice: Props['slice'];

	let firstName = '';
	let lastName = '';
	let email = '';
	let message = '';

	let sending = false;
	let success = false;
	let error: string | null = null;

	const handleSubmit = async () => {
		sending = true;
		success = false;
		error = null;

		try {
			// build the email body
			const text = `
Name: ${firstName} ${lastName}
Email: ${email}

Message:
${message}
			`.trim();

			const html = `
  <h2>New Portfolio Contact Form Message:</h2>
  <p><strong>Name:</strong> ${firstName} ${lastName}</p>
  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
  <hr>
  <p><strong>Message:</strong></p>
  <p>${message.replace(/\n/g, '<br/>')}</p>
`.trim();

			const res = await fetch('/api/send-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					subject: `Portfolio Contact Message from ${firstName || 'Unknown'} ${lastName || 'Unknown'}`,
					text,
					html
				})
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				console.error('Send failed:', body);
				throw new Error(body?.error || 'Failed to send message');
			}

			success = true;
			firstName = '';
			lastName = '';
			email = '';
			message = '';
		} catch (e: any) {
			error = e?.message ?? 'Something went wrong.';
		} finally {
			sending = false;
		}
	};
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<Bounded>
		<Heading size="xl" class="col-start-1">{slice.primary.heading}</Heading>
		<div class="grid w-full gap-x-8 gap-y-6 md:grid-cols-[3fr,1fr] items-start">
			<div class="col-span-3 md:col-span-1 md:col-start-1">
				<Heading size="sm" class="mb-4 mt-8 text-stone-50">{slice.primary.form_header}</Heading>
				<div class="prose prose-xl prose-invert mb-8">{slice.primary.form_subheading}</div>
				<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
					<!-- Name -->
					<div>
						<div class="mb-2 flex items-baseline gap-2">
							<label for="first-name" class="text-m font-medium text-stone-50">
								Name
							</label>
							<span class="text-sm text-stone-400">(required)</span>
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label for="first-name" class="mb-1 block text-sm tracking-wide text-stone-400">
									First Name
								</label>
								<input
									id="first-name"
									type="text"
									bind:value={firstName}
									required
									class="w-full rounded-lg border border-stone-700 bg-stone-900/60 px-4 py-2.5 text-sm text-stone-50 placeholder-stone-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/60"
								/>
							</div>

							<div>
								<label for="last-name" class="mb-1 block text-sm tracking-wide text-stone-400">
									Last Name
								</label>
								<input
									id="last-name"
									type="text"
									bind:value={lastName}
									class="w-full rounded-lg border border-stone-700 bg-stone-900/60 px-4 py-2.5 text-sm text-stone-50 placeholder-stone-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/60"
								/>
							</div>
						</div>
					</div>

					<!-- Email -->
					<div>
						<div class="mb-1 flex items-baseline gap-2">
							<label for="email" class="text-m font-medium text-stone-50">
								Email
							</label>
							<span class="text-sm text-stone-400">(required)</span>
						</div>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							class="w-full rounded-lg border border-stone-700 bg-stone-900/60 px-4 py-2.5 text-sm text-stone-50 placeholder-stone-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/60"
						/>
					</div>

					<!-- Message -->
					<div>
						<div class="mb-1 flex items-baseline gap-2">
							<label for="message" class="text-m font-medium text-stone-50">
								Message
							</label>
							<span class="text-sm text-stone-400">(required)</span>
						</div>
						<textarea
							id="message"
							rows="5"
							bind:value={message}
							required
							class="w-full rounded-lg border border-stone-700 bg-stone-900/60 px-4 py-2.5 text-m text-stone-50 placeholder-stone-500 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/60"
						></textarea>
					</div>

					<!-- Submit -->
					<div class="flex flex-col items-end gap-2">
						<button
							type="submit"
							disabled={sending}
							class="inline-flex items-center rounded-xl bg-rose-400 px-8 py-3 text-sm font-semibold text-stone-950 shadow-md shadow-rose-400/20 transition hover:translate-y-0.5 hover:bg-rose-300 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-rose-400/70 focus:ring-offset-2 focus:ring-offset-stone-950"
						>
							{#if sending}
								Sending...
							{:else}
								Send
							{/if}
						</button>

						{#if success}
							<p class="text-sm text-emerald-400">Message sent! I’ll get back to you soon.</p>
						{/if}

						{#if error}
							<p class="text-sm text-rose-400">{error}</p>
						{/if}
					</div>
				</form>
			</div>

			<div class="col-start-1 col-end-3 md:col-start-3 md:col-end-4 relative">
				<div class="hidden lg:block absolute left-0 top-12 bottom-2 w-px bg-stone-600"></div>
				<div class="text-left md:text-right">
					<Heading size="sm" class="mb-4 mt-8 text-stone-50">{slice.primary.links_header}</Heading>
					<div class="prose prose-xl prose-invert mb-4">{slice.primary.link_subheading}</div>
					<div class="inline-flex items-center gap-4 rounded-xl bg-stone-900 border-2 border-stone-800 p-3">
						<div class="socials inline-flex justify-center sm:justify-end">
							{#if isFilled.link(slice.primary.github_link)}
							<PrismicLink field={slice.primary.github_link} class="p-2 text-4xl transform text-stone-300 transition-scale duration-150 hover:scale-110" aria-label={slice.primary.name + " on Github"}>
								<IconGithub/>
							</PrismicLink>
							{/if}
							{#if isFilled.link(slice.primary.linkedin_link)}
							<PrismicLink field={slice.primary.linkedin_link} class="p-2 text-4xl transform text-stone-300 transition-scale duration-150 hover:scale-110" aria-label={slice.primary.name + " on LinkedIn"}>
								<IconLinkedIn/>
							</PrismicLink>
							{/if}
							{#if isFilled.link(slice.primary.email_link)}
							<PrismicLink field={slice.primary.email_link} class="p-2 text-4xl transform text-stone-300 transition-scale duration-150 hover:scale-110" aria-label={slice.primary.name + "'s Email"}>
								<IconMail/>
							</PrismicLink>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>	
	</Bounded>
</section>
