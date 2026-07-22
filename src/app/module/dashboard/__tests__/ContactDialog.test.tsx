import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';

vi.mock('@/lib/discordWebhook', () => ({
	sendContactMessage: vi.fn(),
}));

import {sendContactMessage} from '@/lib/discordWebhook';
import {ContactDialog} from '../ContactDialog';

const mockSendContactMessage = sendContactMessage as ReturnType<typeof vi.fn>;

function fillAndSubmit() {
	fireEvent.change(screen.getByLabelText('Name'), {target: {value: 'Ada'}});
	fireEvent.change(screen.getByLabelText('Email'), {target: {value: 'ada@example.com'}});
	fireEvent.change(screen.getByLabelText('Message'), {target: {value: 'Hello there'}});
	fireEvent.click(screen.getByRole('button', {name: /send message/i}));
}

describe('ContactDialog', () => {
	it('opens the dialog when the trigger is clicked', () => {
		render(<ContactDialog trigger={<span>me@example.com</span>} fallbackEmail="me@example.com" />);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		fireEvent.click(screen.getByText('me@example.com'));
		expect(screen.getByRole('dialog', {name: 'Get in touch'})).toBeInTheDocument();
	});

	it('sends the form via the webhook and shows a success state', async () => {
		mockSendContactMessage.mockResolvedValue(true);
		render(<ContactDialog trigger={<span>me@example.com</span>} fallbackEmail="me@example.com" />);
		fireEvent.click(screen.getByText('me@example.com'));

		fillAndSubmit();

		await waitFor(() => expect(screen.getByText(/message sent/i)).toBeInTheDocument());
		expect(mockSendContactMessage).toHaveBeenCalledWith({
			name: 'Ada',
			email: 'ada@example.com',
			message: 'Hello there',
		});
	});

	it('shows an error state with a mailto fallback when the webhook fails', async () => {
		mockSendContactMessage.mockResolvedValue(false);
		render(<ContactDialog trigger={<span>me@example.com</span>} fallbackEmail="fallback@example.com" />);
		fireEvent.click(screen.getByText('me@example.com'));

		fillAndSubmit();

		await waitFor(() => expect(screen.getByText(/couldn't send/i)).toBeInTheDocument());
		const fallbackLink = screen.getByRole('link', {name: /email me instead/i});
		expect(fallbackLink).toHaveAttribute('href', 'mailto:fallback@example.com');
	});

	it('lets the user copy the fallback email to clipboard', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(navigator, {clipboard: {writeText}});

		render(<ContactDialog trigger={<span>me@example.com</span>} fallbackEmail="hello@khesir.dev" />);
		fireEvent.click(screen.getByText('me@example.com'));

		fireEvent.click(screen.getByRole('button', {name: /hello@khesir\.dev/}));
		expect(writeText).toHaveBeenCalledWith('hello@khesir.dev');
	});

	it('resets the form after closing and reopening', async () => {
		mockSendContactMessage.mockResolvedValue(true);
		render(<ContactDialog trigger={<span>me@example.com</span>} fallbackEmail="me@example.com" />);
		fireEvent.click(screen.getByText('me@example.com'));

		fillAndSubmit();
		await waitFor(() => expect(screen.getByText(/message sent/i)).toBeInTheDocument());

		fireEvent.click(screen.getByRole('button', {name: /close/i}));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		fireEvent.click(screen.getByText('me@example.com'));
		expect(screen.getByLabelText('Name')).toHaveValue('');
	});
});
