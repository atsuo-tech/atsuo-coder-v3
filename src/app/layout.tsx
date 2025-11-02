import 'material-symbols';
import './globals.css';
import styles from './layout.module.css';
import { Lato, Noto_Sans_JP } from 'next/font/google';
import Logo from '@/img/logo-titled.svg';
import LogoUntitled from '@/img/logo.svg';
import LogoMono from '@/img/logo-titled-mono.svg';
import Link from 'next/link';
import w_auth_db from '@/lib/w_auth_db';
import { cookies } from 'next/headers';
import User from '@/components/user';
import Theme from './theme';
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import atsuocoder_db from '@/lib/atsuocoder_db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AtsuoCoder',
  description: 'AtsuoCoder は早稲田有数の競技プログラミングポータルです。',
  icons: ['/logo.svg']
}

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-noto-sans-jp',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session_token = (await cookies()).get("SESSION_TOKEN")?.value;

  const user = session_token && await w_auth_db.user.findFirst({
    where: {
      login_token: {
        has: session_token,
      },
    },
  });

  if (user) {

    const data = await atsuocoder_db.userData.findUnique({
      where: {
        unique_id: user.unique_id,
      },
    });

    if (!data) {

      await atsuocoder_db.userData.create({
        data: {
          unique_id: user.unique_id,
          role: "Member",
        },
      });

    }

  }

  return (
    <html lang="ja">
      <body
        className={`${lato.variable} ${notoSansJP.variable}`}
      >
        <nav
          className={styles.nav}
        >
          <h2>
            <Link href="/">
              <Logo height="1.5em" className={styles.pc} />
              <LogoUntitled height="1.5em" className={styles.sp} />
            </Link>
          </h2>
          <div className={styles.menu}>
            {
              user ?
                <>
                  <User unique_id={user.unique_id} />
                </> :
                <>
                  <Link href={process.env.LOGIN_URL as string}>
                    <div>
                      ログイン
                    </div>
                  </Link>
                  <Link href={process.env.SIGNUP_URL as string}>
                    <div>
                      新規登録
                    </div>
                  </Link>
                </>
            }
          </div>
        </nav>

        <div
          className={styles.main}
        >
          <Theme>
            <NotificationsProvider>
              {children}
            </NotificationsProvider>
          </Theme>
        </div>

        <footer className={styles.footer}>

          <div className={styles.table}>
            <div>
              <h2>ページ一覧</h2>
              <ul>
                <li><Link href="/">トップ</Link></li>
                <li><Link href="/login">ログイン</Link></li>
                <li><Link href="/contests">コンテスト一覧</Link></li>
                <li><Link href="/rankings">ランキング</Link></li>
                <li><Link href="/posts">最近の投稿</Link></li>
              </ul>
            </div>
            <div>
              <h2>PC プログラミング部</h2>
              <ul>
                <li><Link href="https://www.w-pcp.dev">活動紹介</Link></li>
                <li><Link href="https://kofu2025.w-pcp.dev">興風祭</Link></li>
                <li><Link href="https://management.w-pcp.dev">出席管理</Link></li>
                <li><Link href="https://course.w-pcp.dev">学習資料</Link></li>
                <li><Link href="https://auth.w-pcp.dev">認証</Link></li>
              </ul>
            </div>
          </div>

          <LogoMono fill="#333" />

          <hr />

          <p>Copyright Since 2025 W-PCP Web Developing Group (Atsuo Technologies). All rights of course reserved.</p>
        </footer>

      </body>
    </html>
  )
}