'use client'

import { Button, Divider, MenuItem, Select, TextField } from "@mui/material"
import type { LanguageData } from "@prisma/atsuocoder";
import { useState } from "react";

export default function TaskSubmitForm(
	{
		contest,
		task,
		languageData,
	}: {
		contest: string,
		task: string,
		languageData: LanguageData[],
	}
) {

	const [language, setLanguage] = useState('');

	return (
		<div>

			<input type='hidden' name='contest' value={contest} />
			<input type='hidden' name='task' value={task} />
			<Select
				name='language_id'
				fullWidth
				value={language}
				onChange={(e) => setLanguage(e.target.value)}
				required
			>
				<MenuItem value="">
					言語を選択してください
				</MenuItem>
				<Divider />
				{
					languageData.map(
						(language, i) =>
							<MenuItem key={i} value={language.language_id} >
								{language.name}
							</MenuItem>
					)
				}
			</Select>
			<TextField name="code" rows={12} style={{ width: "100%" }} multiline />
			<Button fullWidth type='submit' variant='contained'>提出</Button>

		</div>
	)

}
