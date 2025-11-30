'use client';

import { Box, Button } from "@mui/material";

export default function PageControl({ page, hasNext }: { page: number, hasNext: boolean }) {

	return (
		<Box sx={{ m: 2 }}>

			<Button disabled={page == 0} sx={{ width: "50%" }} variant="outlined" onClick={() => location.search = `?page=${page - 1}`}>Back</Button>
			<Button disabled={!hasNext} sx={{ width: "50%" }} variant="outlined" onClick={() => location.search = `?page=${page + 1}`}>Next</Button>

		</Box>
	)

}