import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import User from '@/components/user';
import { ContestManagable, ContestSubmitable, ContestViewable } from '@/lib/contest';
import { notFound } from 'next/navigation';
import atsuocoder_db, { getContest } from '@/lib/atsuocoder_db';
import assert from 'assert';
import { getCurrentUser } from '@/lib/w_auth_db';
import Link from 'next/link';

export default async function ClarPage(
    {
        params,
    }: {
        params: Promise<{
            contest: string,
        }>,
    },
) {

    const { contest } = await params;

    const user = await getCurrentUser();
    const contestData = await getContest(contest);

    if (!(await ContestViewable(contestData))) {

        notFound();

    }

    assert(contestData);
    assert(user);

    const contestManagable = await ContestManagable(contestData);

    const clars = await atsuocoder_db.clar.findMany({
        where: {
            contestUnique_id: contestData.unique_id,
            is_publishable: true,
            OR: [
                {
                    ClarAnswer: {
                        is_public: true,
                    },
                },
                {
                    questioner: {
                        unique_id: user.unique_id,
                    },
                },
            ],
        },
        include: {
            task: {
                select: {
                    title: true,
                    url_id: true,
                    TaskUse: {
                        where: {
                            contest: {
                                unique_id: contestData.unique_id,
                            },
                        },
                        select: {
                            assignment: true,
                        }
                    }
                },
            },
            ClarAnswer: {
                select: {
                    answer: true,
                    answerer: {
                        select: {
                            unique_id: true,
                        },
                    },
                    is_public: true,
                }
            }
        }
    });

    return (
        <main>
            <h1>質問</h1>
            {
                await ContestSubmitable(contestData) &&
                <Link href={`/contests/${contest}/clar/create`}>質問を作成</Link>
            }
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: "20%" }}>問題</TableCell>
                        <TableCell sx={{ width: "30%" }}>質問内容</TableCell>
                        <TableCell sx={{ width: "10%" }}>質問者</TableCell>
                        <TableCell sx={{ width: "25%" }}>回答内容</TableCell>
                        <TableCell sx={{ width: "10%" }}>回答者</TableCell>
                        {
                            contestManagable &&
                            <TableCell sx={{ width: "5%" }}></TableCell>
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        clars.length == 0 &&
                        <TableRow>
                            <TableCell colSpan={4}>
                                まだ質問がありません
                            </TableCell>
                        </TableRow>
                    }
                    {
                        clars.map((element, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>{element.task ? <Link href={`/contests/${contest}/tasks/${element.task.url_id}`}>{`${element.task.TaskUse[0].assignment} - ${element.task.title}`}</Link> : "コンテストに対する質問"}</TableCell>
                                    <TableCell>{element.question}</TableCell>
                                    <TableCell><User unique_id={element.questionerUnique_id} /></TableCell>
                                    {
                                        element.ClarAnswer ?
                                            <>
                                                <TableCell>{element.ClarAnswer.answer}</TableCell>
                                                <TableCell>
                                                    <User unique_id={element.ClarAnswer.answerer.unique_id} />
                                                </TableCell>
                                            </> :
                                            <TableCell colSpan={2}>
                                                <i>未回答</i>
                                            </TableCell>
                                    }
                                    {
                                        contestManagable &&
                                        <TableCell><Link href={`/contests/${contest}/clar/edit/${element.unique_id}`}>編集</Link></TableCell>
                                    }
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </main>
    );
}