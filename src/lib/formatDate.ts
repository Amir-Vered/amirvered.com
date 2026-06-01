import type { DateField } from "@prismicio/client";

export function formatDate(dateStr: DateField): string {
	if (!dateStr) return "";

	const [year, month, day] = dateStr.split("-").map(Number);

	const date = new Date(year, month - 1, day);

	return new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	}).format(date);
}
