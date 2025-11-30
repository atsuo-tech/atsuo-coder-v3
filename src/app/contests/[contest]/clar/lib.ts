import atsuocoder_db from "@/lib/atsuocoder_db";

export async function getClar(unique_id: string) {

	return await atsuocoder_db.clar.findUnique({
		where: {
			unique_id,
		},
		include: {
			contest: {
				select: {
					url_id: true,
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

}

export type ClarType = Awaited<ReturnType<typeof getClar>>;
