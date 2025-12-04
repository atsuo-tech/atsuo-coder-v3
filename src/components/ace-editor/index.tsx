"use client";

import AceEditor from "react-ace";
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/mode/python';
import 'brace/mode/javascript';
import 'brace/mode/assembly_x86';
import 'brace/theme/chrome';
import 'brace/mode/sh';
import React, { useState } from 'react';
import style from './editor.module.css';
import { Ace } from "ace-builds";
import languages from "./languages";

export default function Editor(
	{
		language,
		onLoad,
		readonly,
		value,
	}
		: {
			language: keyof typeof languages,
			onLoad?: ((editor: Ace.Editor) => void) | undefined,
			readonly?: boolean | undefined,
			value?: string | undefined,
		}
) {

	const [rvalue, setValue] = useState(value);

	return (
		<>
			<AceEditor
				mode={languages[language]}
				theme="chrome"
				width="100%"
				className={`ace-editor ${style["ace-editor"]}`}
				onLoad={onLoad}
				value={value}
				readOnly={readonly}
				onChange={(e) => setValue(e)}
				name="code"
			/>
			<textarea name="code" readOnly={readonly} hidden required value={rvalue} />
		</>
	)

}