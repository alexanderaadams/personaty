export const randomColorPicker = () => {
	// const randomColor = Math.floor(Math.random() * 16777215).toString(16);
	const colorPicker = Math.floor(Math.random() * 11);
	return '#' + colors[colorPicker];
};
export const colors = [
	'#0d6efd',
	'#6610f2',
	'#6f42c1',
	'#d63384',
	'#dc3545',
	'#fd7e14',
	'#ffc107',
	'#198754',
	'#20c997',
	'#0dcaf0',
];
