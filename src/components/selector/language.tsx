'use client'

import { Divider, MenuItem, Select } from "@mui/material"
import type { LanguageData } from "@prisma/atsuocoder";
import { useEffect, useState } from "react";

export default function LanguageSelector(
	{
		languageData,
		callback,
		hideEmpty,
		fullWidth,
		search,
	}: {
		languageData: LanguageData[],
		callback?: (language_id: string) => void,
		hideEmpty?: boolean,
		fullWidth?: boolean,
		search?: boolean,
	}
) {

	const [language, setLanguage] = useState((languageData[0] || { language_id: "" }).language_id.toString());

	if (!search) {

		useEffect(() => {

			setLanguage(localStorage.getItem("last-language") || (languageData[0] || { language_id: "" }).language_id.toString());

		}, []);

	}

	return (
		<Select
			name='language_id'
			fullWidth={fullWidth}
			sx={{ minWidth: 200 }}
			value={language}
			onChange={(e) => {
				setLanguage(e.target.value);
				callback?.(e.target.value);
				localStorage.setItem("last-language", e.target.value);
			}}
			required
		>
			{
				!hideEmpty &&
				[
					<MenuItem value={search ? "all" : ""}>
						{
							search ?
								"すべての言語" :
								"言語を選択してください"
						}
					</MenuItem>,
					<Divider />,
				]
			}
			{
				languageData.map(
					(language, i) =>
						<MenuItem key={i} value={language.language_id} >
							{language.name}
						</MenuItem>
				)
			}
		</Select>
	)

}
