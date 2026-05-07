import PostalMime from 'postal-mime';

interface Env {
    WEBHOOK_URL: string;
    WEBHOOK_SECRET: string;
}

export default {
    async email(message: ForwardableEmailMessage, env: Env, _ctx: ExecutionContext): Promise<void> {
        const to = message.to.toLowerCase();
        const from = message.from;

        console.log(`[ViteMail Worker] Email masuk: ${from} -> ${to}`);

        const rawReader = message.raw.getReader();
        const chunks: Uint8Array[] = [];
        let totalSize = 0;

        while (true) {
            const { done, value } = await rawReader.read();
            if (done) break;
            chunks.push(value);
            totalSize += value.length;

            if (totalSize > 5 * 1024 * 1024) {
                console.warn('[ViteMail Worker] Email terlalu besar, memotong di 5MB...');
                break;
            }
        }

        const mergedChunks = new Uint8Array(totalSize);
        let offset = 0;
        for (const chunk of chunks) {
            mergedChunks.set(chunk, offset);
            offset += chunk.length;
        }

        let payload: any;

        try {
            const parser = new PostalMime();
            const parsedEmail = await parser.parse(mergedChunks);

            payload = {
                to: to,
                from: parsedEmail.from?.address || from,
                fromName: parsedEmail.from?.name || '',
                subject: parsedEmail.subject || '(Tanpa Subjek)',
                body: parsedEmail.text || '(Pesan kosong)',
                bodyHtml: parsedEmail.html || null,
                rawSize: totalSize,
                secret: env.WEBHOOK_SECRET,
            };
        } catch (err) {
            console.error('[ViteMail Worker] postal-mime gagal memparsing email:', err);

            payload = {
                to,
                from,
                fromName: '',
                subject: message.headers.get('subject') ?? '(Tanpa Subjek)',
                body: '(Gagal memproses isi email. Format tidak didukung)',
                bodyHtml: null,
                rawSize: totalSize,
                secret: env.WEBHOOK_SECRET,
            };
        }

        try {
            const response = await fetch(env.WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'CF-ViteMail-Worker/2.0',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const bodyText = await response.text();
                console.error(`[ViteMail Worker] Webhook error ${response.status}: ${bodyText}`);
            } else {
                console.log(`[ViteMail Worker] Webhook sukses terkirim ke VPS.`);
            }
        } catch (err) {
            console.error('[ViteMail Worker] Gagal menghubungi webhook VPS:', err);
        }
    },
} satisfies ExportedHandler<Env>;

interface ForwardableEmailMessage {
    readonly to: string;
    readonly from: string;
    readonly headers: Headers;
    readonly raw: ReadableStream<Uint8Array>;
    readonly rawSize: number;
}

interface ExportedHandler<Env> {
    email?: (message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) => Promise<void>;
}

declare const ExecutionContext: { new (): ExecutionContext };

interface ExecutionContext {
    waitUntil(promise: Promise<unknown>): void;
    passThroughOnException(): void;
}
