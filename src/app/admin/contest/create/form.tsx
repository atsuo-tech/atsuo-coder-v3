'use client';

import { Button, FormControl, TextField } from '@mui/material';
import { useActionState } from 'react';
import ContestCreateAction from './action';

export default function ContestCreateForm() {

	const [state, action, isPending] = useActionState(ContestCreateAction, { message: '' });

	return (
		<main>

			<h1>コンテストを作成</h1>

			<form
				action={action}
			>
				<FormControl fullWidth>

					<TextField name="url_id" label="ID" />
					<br />
					<Button variant="contained" type="submit">Create</Button>

				</FormControl>

				{
					state.message &&
					<p>Error: {state.message}</p>
				}
			</form>

		</main>
	)

}