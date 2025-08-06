'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';

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


export default function Theme({ children }: { children: React.ReactNode }) {

	return (
		<ThemeProvider theme={muiTheme}>
			{children}
		</ThemeProvider>
	)

}