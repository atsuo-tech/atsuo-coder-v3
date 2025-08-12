"use client";

import { getNotification } from "@/app/admin/contest/lib";
import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

export default function AdminNotificationEditForm(
	{
		data,
	}: {
		data: Awaited<ReturnType<typeof getNotification>>,
	},
) {

	const [isPublic, setIsPublic] = useState(data?.isPublic || "true");

	return (
		<FormControl fullWidth>
			<input type="hidden" name="unique_id" value={data?.unique_id} />
			<TextField label="Title" name="title" defaultValue={data?.title} />
			<TextField label="Description (MarkDown)" multiline rows={8} name="description" defaultValue={data?.description} />
			<Select label="Is Public" value={isPublic} name="is_public" onChange={(e) => setIsPublic(e.target.value)}>
				<MenuItem value="true">Public</MenuItem>
				<MenuItem value="false">Private</MenuItem>
			</Select>
			<Button type="submit" variant="contained">編集</Button>
		</FormControl>
	);

}