import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {format, parseISO} from 'date-fns';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function dateParser(isoString: string | null | undefined | boolean): string {
	try {
		// Handle null, undefined, false, or empty strings
		if (!isoString || typeof isoString !== 'string') {
			return 'Invalid Date';
		}

		// Parse the ISO string into a Date object
		const date = parseISO(isoString);

		// Check if the date is valid
		if (isNaN(date.getTime())) {
			console.error('Invalid date:', isoString);
			return 'Invalid Date';
		}

		// Format the date into a human-readable string
		const formattedDate = format(date, 'MMMM dd, yyyy');
		return formattedDate;
	} catch (error) {
		console.error('Error parsing date:', isoString, error);
		return 'Invalid Date';
	}
}

export const capitalizeFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};
