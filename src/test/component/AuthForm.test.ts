import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import AuthForm from '$lib/components/AuthForm.svelte';
import type { ActionData } from '../../routes/auth/$types';

test('submits the form when the button is clicked', async () => {
	const user = userEvent.setup();
	const props = {
		entries: [
			{ name: 'email', label: 'Email', type: 'email' },
			{ name: 'password', label: 'Password', type: 'password' }
		],
		action: '?/login',
		buttonText: 'Login',
		formData: {} as ActionData
	};

	const { container } = render(AuthForm, props);
	const form = container.querySelector('form');
	const handleSubmit = vi.fn((e) => e.preventDefault());
	form?.addEventListener('submit', handleSubmit);

	const button = screen.getByText(props.buttonText);
	await user.click(button);

	expect(handleSubmit).toHaveBeenCalledTimes(1);
});
