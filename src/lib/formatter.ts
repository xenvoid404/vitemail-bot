export function cleanExcessiveSpaces(text: string): string {
    if (!text) return '';

    return text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^[ \t]+|[ \t]+$/gm, '')
        .trim();
}

export function escapeTelegramHtml(text: string): string {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const formatDate = (dateInput: Date | string | number | null | undefined): string => {
    if (!dateInput) return '-';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '-';
    const datePart = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(date);
    const timePart = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);
    return `${datePart}, ${timePart}`;
};

export const DIVIDER = '───────────────────────';
