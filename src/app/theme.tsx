'use server';

import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';

export default async function Theme({ children }: { children: React.ReactNode }) {

	const muiTheme = createTheme({
		components: {
			MuiTextField: {
				styleOverrides: {
					root: {
						margin: "1rem 0",
					}
				}
			}
		}
	});

	return (
		<ThemeProvider theme={muiTheme}>
			{children}
		</ThemeProvider>
	)

}