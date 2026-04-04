import {useEffect, useState, useCallback} from 'react';
import {
	fetchEngagement,
	trackView,
	toggleHeart,
	EngagementType,
	EngagementData,
} from '@/app/api/cms';

interface UseEngagementReturn extends EngagementData {
	loading: boolean;
	toggling: boolean;
	heart: () => Promise<void>;
}

export function useEngagement(
	type: EngagementType,
	id: string,
	trackOnMount = false,
): UseEngagementReturn {
	const [data, setData] = useState<EngagementData>({views: 0, hearts: 0, hearted: false});
	const [loading, setLoading] = useState(true);
	const [toggling, setToggling] = useState(false);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		fetchEngagement(type, id)
			.then(setData)
			.catch(() => {})
			.finally(() => setLoading(false));

		if (trackOnMount) {
			trackView(type, id).catch(() => {});
		}
	}, [type, id, trackOnMount]);

	const heart = useCallback(async () => {
		if (toggling) return;
		setToggling(true);
		// Optimistic update
		setData((prev) => ({
			...prev,
			hearted: !prev.hearted,
			hearts: prev.hearted ? prev.hearts - 1 : prev.hearts + 1,
		}));
		try {
			const result = await toggleHeart(type, id);
			setData((prev) => ({...prev, hearted: result.hearted, hearts: result.hearts}));
		} catch {
			// Revert on failure
			setData((prev) => ({
				...prev,
				hearted: !prev.hearted,
				hearts: prev.hearted ? prev.hearts - 1 : prev.hearts + 1,
			}));
		} finally {
			setToggling(false);
		}
	}, [type, id, toggling]);

	return {...data, loading, toggling, heart};
}
