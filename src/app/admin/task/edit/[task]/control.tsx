'use client';

import { Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { Task } from '@atsuo-tech/atsuo-coder-v3-prisma';

export default function TaskControlComponent(
	{
		taskData,
	}: {
		taskData: Task,
	}
) {

	if (!taskData) {

		throw new Error('Unknown input');

	}

	const [type, setType] = useState(taskData.type);

	return (
		<div>
			<input type="hidden" name="old_id" value={taskData.url_id} />
			<FormControl fullWidth margin="normal">
				<TextField name="id" label="ID" defaultValue={taskData.url_id} />
				<TextField name="title" label="Title" defaultValue={taskData.title} />
				<TextField name="problem" label="Problem" multiline rows={6} defaultValue={taskData.problem} />
			</FormControl>
			<FormControl fullWidth margin="normal">
				<TextField name="time_limit" label="Time Limit (milliseconds)" type="number" defaultValue={taskData.time_limit} />
				<TextField name="memory_limit" label="Memory Limit (Bytes)" type="number" defaultValue={taskData.memory_limit} />
				<TextField name="score" label="Max Score" type="number" defaultValue={taskData.score} />
			</FormControl>
			<FormControl fullWidth>
				<Select
					name="type"
					value={type}
					onChange={(e) => setType(e.target.value)}
				>
					<MenuItem value="Batch">Batch</MenuItem>
					<MenuItem value="Communication">Communication</MenuItem>
					<MenuItem value="OutputOnly">OutputOnly</MenuItem>
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