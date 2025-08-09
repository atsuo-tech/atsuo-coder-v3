'use client';

import { Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import type { GetContestType } from '@/lib/atsuocoder_db';
import { DateToForm } from '@/lib/utils';

export default function ContestControlComponent(
	{
		contestData,
	}: {
		contestData: GetContestType,
	}
) {

	if (!contestData) {

		throw new Error('Unknown input');

	}

	const [isPermanent, setIsPermanent] = useState(contestData.is_permanent);
	const [isPublic, setIsPublic] = useState(contestData.is_public);

	return (
		<div>
			<input type="hidden" name="old_id" value={contestData.url_id} />
			<FormControl fullWidth margin="normal">
				<TextField name="id" label="ID" defaultValue={contestData.url_id} />
				<TextField name="title" label="Title" defaultValue={contestData.title} />
				<TextField name="description" label="Description" multiline rows={6} defaultValue={contestData.description} />
			</FormControl>
			<FormControl fullWidth>
				<Select
					name="is_permanent"
					value={isPermanent ? "true" : "false"}
					onChange={(e) => setIsPermanent(e.target.value == "true")}
				>
					<MenuItem value="false">Not Permanent</MenuItem>
					<MenuItem value="true">Permanent</MenuItem>
				</Select>
			</FormControl>
			<FormControl fullWidth>
				<TextField name="start_time" label="Start Time" type="datetime-local" defaultValue={DateToForm(contestData.start_time)} />
				<TextField name="end_time" label="End Time" type="datetime-local" defaultValue={DateToForm(contestData.end_time)} />
				<TextField name="rated_range_from" label="RatedRange (From)" type="number" defaultValue={contestData.rated_range[0]} />
				<TextField name="rated_range_to" label="RatedRange (To)" type="number" defaultValue={contestData.rated_range[1]} />
			</FormControl>
			<FormControl fullWidth>
				<Select
					name="is_public"
					value={isPublic ? "true" : "false"}
					onChange={(e) => setIsPublic(e.target.value == "true")}
				>
					<MenuItem value="true">Public</MenuItem>
					<MenuItem value="false">Private</MenuItem>
				</Select>
			</FormControl>
			<FormControl fullWidth>
				<Button
					type="submit"
					variant="contained"
				>
					Edit
				</Button>
			</FormControl>
		</div>
	);

}