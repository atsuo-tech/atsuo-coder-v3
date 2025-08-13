'use client';

import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

export default function ManagementFormControl(
	{
		task: contest,
	}: {
		task: string,
	}
) {

	const [role, setRole] = useState('tester');

	return (
		<div>
			<FormControl fullWidth>
				<input type='hidden' name='task' value={contest} />
				<TextField type="text" name="username" label="ユーザー名" />
				<Select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
					<MenuItem value="editor">作問者</MenuItem>
					<MenuItem value="tester">テスター</MenuItem>
				</Select>
				<Button variant="contained" type="submit" sx={{ my: 1 }}>追加</Button>
			</FormControl>
		</div>
	)

}
