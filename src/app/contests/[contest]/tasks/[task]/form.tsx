'use client'

import Editor from "@/components/ace-editor";
import { Button, Divider, MenuItem, Select, TextField } from "@mui/material"
import type { LanguageData } from "@prisma/atsuocoder";
import { useEffect, useState } from "react";

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

	const [language, setLanguage] = useState((languageData[0] || { language_id: "" }).language_id.toString());

	useEffect(() => {

		setLanguage(localStorage.getItem("last-language") || (languageData[0] || { language_id: "" }).language_id.toString());

	}, []);

	return (
		<div>

			<input type='hidden' name='contest' value={contest} />
			<input type='hidden' name='task' value={task} />
			<Select
				name='language_id'
				fullWidth
				value={language}
				onChange={(e) => {
					setLanguage(e.target.value);
					localStorage.setItem("last-language", e.target.value);
				}}
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
			<Editor language={language} />
			<Button fullWidth type='submit' variant='contained'>提出</Button>

		</div>
	)

}
