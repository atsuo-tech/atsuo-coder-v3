import styles from './not-found.module.css';
import Logo from '@/img/logo-titled.svg';

export default async function NotFoundPage() {

	return (
		<main
			className={styles.not_found}
		>

			<div>

				<span>Sorry, we tried to find what you want, but...</span>

				<h1>Not Found!!</h1>

				<h2>Lost children:</h2>

				<div
					className={styles.lost_person}
				>

					<span>You</span>
					<span>&</span>

				</div>

				<Logo height="100px" width="100%" />

			</div>

		</main>
	)

}