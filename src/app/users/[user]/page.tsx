import w_auth_db from '@/lib/w_auth_db';
import atsuocoder_db from '@/lib/atsuocoder_db';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import User from '@/components/user';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Metadata } from 'next';

export async function generateMetadata(
    {
        params
    }: {
        params: Promise<{
            user: string,
        }>,
    }
): Promise<Metadata> {

    const { user } = await params;

    const wAuthData = await w_auth_db.user.findUnique({
        where: {
            username: user,
        },
    });

    if (!wAuthData) {

        notFound();

    }

    return {
        title: `@${wAuthData.username} / AtsuoCoder`,
    };

}

export default async function UserPage(
    {
        params
    }: {
        params: Promise<{
            user: string,
        }>,
    }
) {
    const { user } = await params;

    const wAuthData = await w_auth_db.user.findUnique({
        where: {
            username: user,
        },
    });

    if (!wAuthData) {

        notFound();

    }

    const atsuoCoderData = await atsuocoder_db.userData.findUnique({
        where: {
            unique_id: wAuthData.unique_id,
        },
    });

    if (!atsuoCoderData) {

        notFound();

    }

    return (
        <main>
            <h1>@<User unique_id={atsuoCoderData.unique_id} /> | AtsuoCoder</h1>
            <div className={styles.graphSpace}>
                <div className={styles.graph}>
                </div>
                <div className={styles.userInfo}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>ユーザー名</TableCell>
                                <TableCell><User unique_id={atsuoCoderData.unique_id} /></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>レーティング</TableCell>
                                <TableCell>{atsuoCoderData.rating}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>最高レーティング</TableCell>
                                <TableCell>{/*atsuoCoderData.highest*/}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className={styles.history}>
                <h2>コンテスト履歴</h2>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>コンテスト名</TableCell>
                            <TableCell>順位</TableCell>
                            <TableCell>パフォーマンス</TableCell>
                            <TableCell>レーティング変動</TableCell>
                            <TableCell>新レーティング</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* ToDo: CREATE THIS WITH ATSUOCODER DETAILED DB */}
                    </TableBody>
                </Table>
            </div>
        </main>
    );

}