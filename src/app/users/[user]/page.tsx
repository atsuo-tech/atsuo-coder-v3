import w_auth_db from '@/lib/w_auth_db';
import atsuocoder_db from '@/lib/atsuocoder_db';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import User from '@/components/user';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Metadata } from 'next';
import { getColorByRating } from '@/components/user/client';
import { unstable_cache } from 'next/cache';

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

const getAtsuoCoderData = unstable_cache(
    async (unique_id: string) => atsuocoder_db.userData.findUnique({
        where: {
            unique_id,
        },
        include: {
            Rating: {
                select: {
                    rating: true,
                    rating_system: {
                        select: {
                            rating_name: true,
                        },
                    },
                },
            },
            RatingChangeLog: {
                select: {
                    rank: true,
                    contest: {
                        select: {
                            title: true,
                            end_time: true,
                        },
                    },
                    changed_at: true,
                    performance: true,
                    old_rating: true,
                    new_rating: true,
                    rating_system: {
                        select: {
                            rating_name: true,
                        },
                    },
                },
                orderBy: {
                    changed_at: 'desc',
                },
            },
        },
    }),
    [],
    {
        revalidate: 3600 * 24,
        tags: ["rating"],
    },
);

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

    const atsuoCoderData = await getAtsuoCoderData(wAuthData.unique_id);

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
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className={styles.history}>
                <h2>コンテスト履歴</h2>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>変更日時</TableCell>
                            <TableCell>コンテスト名</TableCell>
                            <TableCell>順位</TableCell>
                            <TableCell>パフォーマンス</TableCell>
                            <TableCell>レーティング変動</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            atsuoCoderData.RatingChangeLog.map((rating, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{rating.changed_at.toLocaleString("ja-jp")}</TableCell>
                                        <TableCell>{rating.contest.title}</TableCell>
                                        <TableCell>{rating.rank}</TableCell>
                                        <TableCell style={{ color: getColorByRating(rating.performance), fontWeight: "bold" }}>{rating.performance}</TableCell>
                                        <TableCell>
                                            <span style={{ color: getColorByRating(rating.old_rating), fontWeight: "bold" }}>{rating.old_rating}</span>
                                            →
                                            <span style={{ color: getColorByRating(rating.new_rating), fontWeight: "bold" }}>{rating.new_rating}</span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        </main>
    );

}