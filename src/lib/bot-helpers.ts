import type { BotContext } from '@/bot/context';
import type { InlineKeyboard } from 'grammy';

export const HTML = { parse_mode: 'HTML' as const };

export async function sendOrAlert(ctx: BotContext, text: string): Promise<void> {
    if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: text, show_alert: true });
    } else {
        await ctx.reply(`<b>${text}</b>`, HTML);
    }
}

export async function sendOrEdit(ctx: BotContext, text: string, keyboard?: InlineKeyboard): Promise<void> {
    const opts = { ...HTML, reply_markup: keyboard };
    if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
        await ctx.editMessageText(text, opts);
    } else {
        await ctx.reply(text, opts);
    }
}
