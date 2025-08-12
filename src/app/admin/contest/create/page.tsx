import { Button, FormControl, TextField } from '@mui/material';
import { useActionState } from 'react';
import ContestCreateAction from './action';
import { restrictUser } from '@/lib/atsuocoder_db';
import ContestCreateForm from './form';

export default async function ContestCreatePage() {

	await restrictUser('SuperAdmin');

	return (
		<main>

			<h1>コンテストを作成</h1>

			<ContestCreateForm />

		</main>
	)

}