import {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {sendContactMessage} from '@/lib/discordWebhook';

type SendState = 'idle' | 'sending' | 'success' | 'error';

function CopyableEmail({email}: {email: string}) {
	const [copied, setCopied] = useState(false);

	function copy() {
		navigator.clipboard.writeText(email).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}

	return (
		<div className="contact-dialog-copy-row">
			<span>Prefer email? </span>
			<button type="button" className="contact-dialog-copy" onClick={copy}>
				{email}
				<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					{copied ? <polyline points="20 6 9 17 4 12" /> : (
						<>
							<rect x="9" y="9" width="13" height="13" rx="2" />
							<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
						</>
					)}
				</svg>
			</button>
		</div>
	);
}

interface ContactDialogProps {
	trigger: React.ReactNode;
	fallbackEmail: string;
}

export function ContactDialog({trigger, fallbackEmail}: ContactDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [state, setState] = useState<SendState>('idle');

	function resetAndClose() {
		setOpen(false);
		setState('idle');
		setName('');
		setEmail('');
		setMessage('');
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setState('sending');
		const sent = await sendContactMessage({name, email, message});
		setState(sent ? 'success' : 'error');
	}

	return (
		<Dialog.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : resetAndClose())}>
			<Dialog.Trigger className="dash-contact-trigger">{trigger}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="contact-dialog-overlay" />
				<Dialog.Content className="contact-dialog">
					<Dialog.Title className="contact-dialog-title">Get in touch</Dialog.Title>
					<Dialog.Description className="contact-dialog-desc">
						Send a message directly — I'll be notified right away.
					</Dialog.Description>

					{state === 'success' ? (
						<div className="contact-dialog-status">
							<p>Message sent — I'll get back to you soon.</p>
							<button type="button" className="contact-dialog-submit" onClick={resetAndClose}>
								Close
							</button>
						</div>
					) : state === 'error' ? (
						<div className="contact-dialog-status">
							<p>Couldn't send that — something went wrong.</p>
							<div className="contact-dialog-actions">
								<button type="button" className="contact-dialog-ghost" onClick={() => setState('idle')}>
									Try again
								</button>
								<a className="contact-dialog-submit" href={`mailto:${fallbackEmail}`}>
									Email me instead
								</a>
							</div>
						</div>
					) : (
						<form className="contact-dialog-form" onSubmit={handleSubmit}>
							<label className="contact-dialog-field">
								<span>Name</span>
								<input
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={state === 'sending'}
								/>
							</label>
							<label className="contact-dialog-field">
								<span>Email</span>
								<input
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={state === 'sending'}
								/>
							</label>
							<label className="contact-dialog-field">
								<span>Message</span>
								<textarea
									required
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									disabled={state === 'sending'}
								/>
							</label>
							<button type="submit" className="contact-dialog-submit" disabled={state === 'sending'}>
								{state === 'sending' ? 'Sending…' : 'Send message'}
							</button>
							<CopyableEmail email={fallbackEmail} />
						</form>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
