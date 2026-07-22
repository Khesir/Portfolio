import categoriesJson from './categories.json';

export interface CategoryFilter {
	value: string;
	label: string;
}

const categories = categoriesJson as CategoryFilter[];

export function getCategoryFilters(): CategoryFilter[] {
	return categories;
}
