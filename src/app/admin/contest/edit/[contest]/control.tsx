'use client';

import { Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import type { GetContestType } from '@/lib/atsuocoder_db';
import { DateToForm } from '@/lib/utils';
import Link from 'next/link';
import styles from './control.module.css';

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
			<FormControl fullWidth margin="normal">
				<TextField name="id" label="ID" defaultValue={contestData.url_id} />
				<br />
				<TextField name="title" label="Title" defaultValue={contestData.title} />
				<br />
				<TextField name="description" label="Description" multiline rows={6} defaultValue={contestData.description} />
				<br />
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
				<br />
			</FormControl>
			<FormControl fullWidth>
				<TextField name="start_time" label="Start Time" type="datetime-local" defaultValue={DateToForm(contestData.start_time)} />
				<br />
				<TextField name="end_time" label="End Time" type="datetime-local" defaultValue={DateToForm(contestData.end_time)} />
				<br />
				<TextField
					name="editor"
					label="Editor (UUID)"
					multiline
					rows={3}
					defaultValue={contestData.ContestManagement.filter((management) => management.role == "Editor").map((management) => management.user.unique_id).join("\n")}
				/>
				<br />
				<TextField
					name="tester"
					label="Tester (UUID)"
					multiline
					rows={3}
					defaultValue={contestData.ContestManagement.filter((management) => management.role == "Tester").map((management) => management.user.unique_id).join("\n")}
				/>
				<p>ヘルプ：<Link href="/admin/user/to-uuid">ユーザーを UUID に変換するページ</Link></p>
				<TextField name="rated_range_from" label="RatedRange (From)" type="number" defaultValue={contestData.rated_range[0]} />
				<br />
				<TextField name="rated_range_to" label="RatedRange (To)" type="number" defaultValue={contestData.rated_range[1]} />
				<br />
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
				<br />
			</FormControl>
			<FormControl fullWidth>
				<TextField name="task" label="Tasks" multiline rows={5} />
				<p>
					割当とスペースと問題の UUID を順に入力して問題ごとに開業してください。
					<br />
					ヘルプ：<Link href="/admin/task/to-uuid">問題を UUID に変換するページ</Link>
				</p>
				<br />
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