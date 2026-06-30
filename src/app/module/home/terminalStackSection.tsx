import {useAboutConfig} from '@/hooks/use-home-config';
import {motion} from 'framer-motion';

const rowContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.1}},
};
const rowItem = {
	hidden: {opacity: 0, x: -14},
	show: {opacity: 1, x: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};
const chipContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.055}},
};
const chipItem = {
	hidden: {opacity: 0, scale: 0.82, y: 8},
	show: {opacity: 1, scale: 1, y: 0, transition: {type: 'spring' as const, stiffness: 130, damping: 16}},
};

export function TerminalStackSection() {
	const {config} = useAboutConfig();

	return (
		<>
			<div className="sl">
				<span className="n">01</span>
				<h2>tech_stack</h2>
				<span className="rule" />
				<span className="more">// what I build with</span>
			</div>
			<motion.section
				className="stack"
				key={config.technicalSkills.length}
				variants={rowContainer}
				initial="hidden"
				whileInView="show"
				viewport={{once: true, amount: 0.15}}
			>
				{config.technicalSkills.map((cat, i) => (
					<motion.div className="stack-row" key={i} variants={rowItem}>
						<div className="stack-cat">{cat.category}</div>
						<motion.div className="chips" variants={chipContainer}>
							{cat.items.map((item, j) => (
								<motion.span className="chip2" key={j} variants={chipItem}>
									{item}
								</motion.span>
							))}
						</motion.div>
					</motion.div>
				))}
			</motion.section>
		</>
	);
}
