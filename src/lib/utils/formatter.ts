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
