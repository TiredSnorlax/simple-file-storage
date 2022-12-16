export const imgTypes = ['jpg', 'jpeg', 'png'];
export const vidTypes = ['mp4', 'mov'];
export const pdfTypes = ['pdf'];

export const getFileSize = (bytes: number) => {
	let value = 0;
	let unit = '';
	// MB
	if (bytes >= 1000000000) {
		value = bytes / 1000000000;
		unit = 'GB';
	} else if (bytes >= 1000000) {
		value = bytes / 1000000;
		unit = 'MB';
	} else if (bytes > 1000) {
		value = bytes / 1000;
		unit = 'KB';
	} else if (bytes === 0) {
		value = 0;
		unit = 'KB';
	}

	return value.toFixed(2) + ' ' + unit;
};
