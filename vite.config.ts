import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},

	define: {
		'process.env.VITE_TOKEN': JSON.stringify(process.env.VITE_TOKEN),
	},

	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test-setup.ts'],
	},
});
