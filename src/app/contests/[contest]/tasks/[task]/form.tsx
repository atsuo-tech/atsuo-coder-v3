'use client'

import Editor from "@/components/ace-editor";
import LanguageSelector from "@/components/selector/language";
import { Button } from "@mui/material"
import type { LanguageData } from "@atsuo-tech/atsuo-coder-v3-prisma";
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
			<LanguageSelector languageData={languageData} callback={setLanguage} fullWidth />
			<Editor language={language} />
			<Button fullWidth type='submit' variant='contained'>提出</Button>

		</div>
	)

}
