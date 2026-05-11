# m1v Anti Spam

Bot de segurança para Discord focado em detectar contas infectadas por malware/spam bots.

## Funcionalidades

- Honeypot channel (canal armadilha)
- Timeout automático
- Remoção automática de mensagens
- Ignora o dono do servidor
- Sistema anti-spam simples e rápido

## Como funciona

O bot monitora um canal específico configurado como armadilha.

Se qualquer usuário enviar mensagem nesse canal:
- a mensagem é apagada
- o usuário recebe timeout automaticamente

Bots de spam e malwares normalmente enviam mensagens sem verificar regras do servidor, então acabam sendo detectados rapidamente.

## Tecnologias

- Node.js
- discord.js v14

## Instalação

```bash
npm install
