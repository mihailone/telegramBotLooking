'use strict';

import { Telegraf, Markup } from 'telegraf';
import 'dotenv/config'

function Day(userName) {
    this.userName = userName
    this.launch = 1
    this.snack = 2
    this.limit = true
}

const userListClearAllDay = [];

function resetStat() {
    for (let key in peopleList) {
        peopleList[key] = new Day(peopleList[key].userName)
    }
}

setInterval(() => {
    let currentHour = new Date().getHours();
    if (currentHour === 0) {
        resetStat();
    }
}, 1800000)

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command("menu", async ctx => {
    return await ctx.reply(
        "Куда пойдем?",
        Markup.keyboard([
            ["На обед"],
            ["На завтрак"],
            // ["Сколько людей в столовой?"],
            // ["Уйти с кухни"]
        ])
            .oneTime()
            .resize(),
    );
});

let peopleСounter = {
    human: 0,
}

let peopleList = {

}

bot.start(ctx => {
    if (!userListClearAllDay.includes(ctx.message.from.username)) {
        userListClearAllDay.push(ctx.message.from.username);
        peopleList[ctx.message.from.username] = new Day(ctx.message.from.username)
        ctx.reply('Теперь ты можешь пойти на кухню и покушать.', {
            reply_to_message_id: ctx.message.message_id
        })
    } else {
        ctx.reply('Иди уже кушать!', {
            reply_to_message_id: ctx.message.message_id
        })
    }
})

bot.hears('На обед'.trim(), ctx => {
    if (peopleList.hasOwnProperty(ctx.message.from.username)) {
        if (peopleList[ctx.message.from.username].launch === 0) {
            ctx.reply('Сегодня вы уже были на обеде!', {
                reply_to_message_id: ctx.message.message_id
            })
            return
        } else {
            if (peopleСounter.human >= 2) {
                ctx.reply('В столовой сейчас 2 человека, приходи позже!', {
                    reply_to_message_id: ctx.message.message_id
                });
                return
            }
            peopleList[ctx.message.from.username].launch--;
            peopleСounter.human++;
            ctx.reply('Вы ушли на обед!', {
                reply_to_message_id: ctx.message.message_id
            })
            setTimeout(() => {
                ctx.reply('Ваш обед закончился!', {
                    reply_to_message_id: ctx.message.message_id
                })
                peopleСounter.human--;
            }, 1800000)
        }
    } else {
        ctx.reply('В начале авторизуйся введя команду: /start', {
            reply_to_message_id: ctx.message.message_id
        });
    }
})

bot.hears('На завтрак', ctx => {
    if (peopleList.hasOwnProperty(ctx.message.from.username)) {
        if (peopleList[ctx.message.from.username].snack === 0) {
            ctx.reply('Ваши перекусы закончились!', {
                reply_to_message_id: ctx.message.message_id
            })
            return
        } else {
            if (peopleСounter.human >= 2) {
                ctx.reply('В столовой сейчас 2 человека, приходи позже!', {
                    reply_to_message_id: ctx.message.message_id
                });
                return
            }
            peopleList[ctx.message.from.username].snack--;
            peopleСounter.human++;
            ctx.reply('Вы ушли на завтрак!', {
                reply_to_message_id: ctx.message.message_id
            })
            setTimeout(() => {
                ctx.reply('Ваш завтрак закончился!', {
                    reply_to_message_id: ctx.message.message_id
                })
                peopleСounter.human--;
            }, 900000)
        }
    } else {
        ctx.reply('В начале авторизуйся введя команду: /start', {
            reply_to_message_id: ctx.message.message_id
        });
    }
})

bot.launch()
