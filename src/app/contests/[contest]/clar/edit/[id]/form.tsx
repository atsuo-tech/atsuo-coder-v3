"use client";

import { GetContestType } from "@/lib/atsuocoder_db";
import { Button, Divider, FormGroup, MenuItem, Select, TextField } from "@mui/material";
import assert from "assert";
import { useState } from "react";
import type { ClarType } from "../../lib";

export default function EditClarForm(
	{
		contestData,
		clar,
	}: {
		contestData: GetContestType,
		clar: ClarType,
	},
) {

	assert(contestData);
	assert(clar);

	const [isPublic, setIsPublic] = useState(clar.ClarAnswer ? (clar.ClarAnswer.is_public ? "true" : "false") : (clar.is_publishable ? "true" : "false"));

	return (
		<FormGroup>

			<input type="hidden" name="id" value={clar.unique_id} />

			<p>
				ユーザーの設定：{clar.is_publishable ? "公開可能" : "非公開"}
			</p>

			<Select name="is_public" value={isPublic} onChange={(e) => setIsPublic(e.target.value)}>

				<MenuItem value="true" disabled={!clar.is_publishable}>公開</MenuItem>
				<MenuItem value="false">非公開</MenuItem>

			</Select>

			<TextField multiline rows={5} name="answer" label="回答" defaultValue={clar.ClarAnswer?.answer} />

			<Button type="submit">送信</Button>
		</FormGroup>
	)

}
