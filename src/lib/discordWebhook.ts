export interface ContactMessage {
	name: string;
	email: string;
	message: string;
}

const NOTIFY_DISCORD_USER_ID = '409467545951928322';

export async function sendContactMessage({name, email, message}: ContactMessage): Promise<boolean> {
	const webhookUrl = import.meta.env.VITE_WEBHOOK_CONTACT;
	if (!webhookUrl) return false;

	try {
		const res = await fetch(webhookUrl, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				content: `<@${NOTIFY_DISCORD_USER_ID}> someone reached out!`,
				embeds: [
					{
						title: 'New portfolio contact message',
						color: 0xf5b246,
						fields: [
							{name: 'Name', value: name, inline: true},
							{name: 'Email', value: email, inline: true},
							{name: 'Message', value: message},
						],
					},
				],
			}),
		});
		return res.ok;
	} catch {
		return false;
	}
}
