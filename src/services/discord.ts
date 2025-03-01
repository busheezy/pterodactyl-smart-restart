import { MessageBuilder, Webhook } from 'webhook-discord';
import { env } from '../env';

const hook = new Webhook(env.DISCORD_WEBHOOK_URL);

export async function successAlert(
  name: string,
  identifier: string,
  node: string,
  hoursSinceRestart: number,
) {
  const embed = new MessageBuilder()
    .setName('Ptero Restarter')
    .setTitle(name)
    .setColor('#00FF00')
    .setDescription(`Server has been restarted after ${hoursSinceRestart} hours of uptime!`)
    .addField('Identifier', identifier)
    .addField('Node', node)
    .setURL(`${env.PTERO_URL}/server/$identifier}`)
    .setTime();

  await hook.send(embed);
}

export async function failureAlert(
  name: string,
  identifier: string,
  node: string,
  errorMessage: string,
) {
  const embed = new MessageBuilder()
    .setName('Ptero Restarter')
    .setTitle(name)
    .setColor('#FF0000')
    .setDescription(errorMessage)
    .addField('Identifier', identifier)
    .addField('Node', node)
    .setURL(`${env.PTERO_URL}/server/${identifier}`)
    .setTime();

  await hook.send(embed);
}
