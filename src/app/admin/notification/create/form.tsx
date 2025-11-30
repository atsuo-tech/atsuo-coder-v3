"use client";

import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

export default function AdminNotificationCreateForm() {

	const [isPublic, setIsPublic] = useState("true");

	return (
		<FormControl fullWidth>
			<TextField label="Title" name="title" />
			<TextField label="Description (MarkDown)" multiline rows={8} name="description" />
			<Select label="Is Public" value={isPublic} name="is_public" onChange={(e) => setIsPublic(e.target.value)}>
				<MenuItem value="true">Public</MenuItem>
				<MenuItem value="false">Private</MenuItem>
			</Select>
			<Button type="submit" variant="contained">作成</Button>
		</FormControl>
	);

}