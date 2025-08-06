import w_auth_db from '@/lib/w_auth_db';
import atsuocoder_db from '@/lib/atsuocoder_db';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import User from '@/components/user';

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
                    <table>
                        <tbody>
                            <tr>
                                <th>ユーザー名</th>
                                <td><User unique_id={atsuoCoderData.unique_id} /></td>
                            </tr>
                            <tr>
                                <th>レーティング</th>
                                <td>{atsuoCoderData.rating}</td>
                            </tr>
                            <tr>
                                <th>最高レーティング</th>
                                <td>{/*atsuoCoderData.highest*/}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles.history}>
                <h2>コンテスト履歴</h2>
                <table>
                    <thead>
                        <tr>
                            <th>コンテスト名</th>
                            <th>順位</th>
                            <th>パフォーマンス</th>
                            <th>レーティング変動</th>
                            <th>新レーティング</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ToDo: CREATE THIS WITH ATSUOCODER DETAILED DB */}
                    </tbody>
                </table>
            </div>
        </main>
    );

}