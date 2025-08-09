import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import User from '@/components/user';

export default function ClarPage () {
    return (
        <main>
            <h1>質問</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{width: "40%"}} >質問内容</TableCell>
                        <TableCell sx={{width: "15%"}} >質問者</TableCell>
                        <TableCell sx={{width: "30%"}} >回答内容</TableCell>
                        <TableCell sx={{width: "15%"}} >回答者</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/*
                        Clars.map((element, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>{element.question}</TableCell>
                                    <TableCell><Link unique_id={element.questionerID} /></TableCell>
                                    <TableCell>{element.answer}</TableCell>
                                    <TableCell><Link unique_id={element.answererID} /></TableCell>
                                </TableRow>
                            )
                        })
                    */}
                </TableBody>
            </Table>
        </main>
    );
}