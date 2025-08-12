"use client";

import { GetContestType } from "@/lib/atsuocoder_db";
import { Button, Divider, FormControl, FormGroup, MenuItem, Select, TextField } from "@mui/material";
import assert from "assert";
import { useState } from "react";

export default function CreateClarForm(
	{
		contestData,
	}: {
		contestData: GetContestType,
	},
) {

	assert(contestData);

	const [target, setTarget] = useState("contest");
	const [isPublishable, setIsPublishable] = useState("true");

	return (
		<FormGroup>

			<input type="hidden" name="contest" value={contestData.url_id} />

			<Select name="target" value={target} onChange={(e) => setTarget(e.target.value)}>

				<MenuItem value="contest">コンテスト全体に対する質問</MenuItem>

				<Divider />

				{
					contestData.TaskUse.map(
						(taskUse, i) =>
							<MenuItem key={i} value={`task_${taskUse.task.url_id}`}>
								{taskUse.assignment} - {taskUse.task.title}
							</MenuItem>
					)
				}

			</Select>

			<Select name="is_publishable" value={isPublishable} onChange={(e) => setIsPublishable(e.target.value)}>

				<MenuItem value="true">質問の公開を許可</MenuItem>
				<MenuItem value="false">非公開</MenuItem>

			</Select>

			<TextField multiline rows={5} name="question" label="質問" />

			<Button type="submit">送信</Button>
		</FormGroup>
	)

}
