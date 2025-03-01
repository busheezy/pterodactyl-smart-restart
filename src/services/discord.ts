import { MessageBuilder, Webhook } from 'webhook-discord';
import { env } from '../env';

const hook = new Webhook(env.DISCORD_WEBHOOK_URL);

export async function successAlert(name: string, identifier: string, node: string) {
  const embed = new MessageBuilder()
    .setName('Ptero Restarter')
    .setTitle(name)
    .setColor('#00FF00')
    .addField('Status', 'Success', true)
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
    .addField('Status', 'Failure', true)
    .setColor('#FF0000')
    .setDescription(errorMessage)
    .addField('Identifier', identifier)
    .addField('Node', node)
    .setURL(`${env.PTERO_URL}/server/${identifier}`)
    .setTime();

  await hook.send(embed);
}
