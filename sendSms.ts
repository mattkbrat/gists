'use server'

import { smppErrorCodes } from '@lib/smpp'
import isDev from '@utils/isDev'
import { randomUUID } from 'crypto'
import { env } from 'env/nextjs'
import smpp from 'smpp'

const { SMPP_PORT, SMPP_PASSWORD, SYSTEM_ID, SMPP_IP } = env

// Parameters
let i = 0
let failedCount = 0
let successCount = 0

export const sendSMS = (phoneNumbers: string | string[], message: string) => {
  if (!phoneNumbers || !message) {
    throw new Error('Missing phone number or message')
  }

  phoneNumbers = Array.isArray(phoneNumbers) ? phoneNumbers : [phoneNumbers]

  let finalMessageSent = false

  try {
    const session = smpp.connect(
      {
        url: `smpp://${SMPP_IP}:${SMPP_PORT}`,
        auto_enquire_link_period: 10000,
        debug: isDev,
      },
      () => {
        session.bind_transmitter(
          {
            system_id: SYSTEM_ID,
            password: SMPP_PASSWORD,
            system_type: 'smpp',
          },
          async ({ command_status }: { command_status: number }) => {
            const error = smppErrorCodes.find(
              ({ value }) => value === command_status,
            )

            if (command_status !== 0) {
              console.error(`Error binding to SMPP server: ${error?.description}`)
              return
            }

            for (const phone of phoneNumbers) {
              session.submit_sm(
                {
                  destination_addr: phone,
                  short_message: 'Test',
                  message_id: randomUUID(),
                  registered_delivery: 1,
                },
                (pdu) => {
                  if (pdu.command_status === 0) {
                    successCount++
                    // Message successfully sent
                  } else {
                    failedCount++
                    console.error(
                      `Error sending message: ${
                        smppErrorCodes.find(
                          ({ value }) => value === pdu.command_status,
                        )?.description
                      }`,
                    )
                  }
                },
              )

              if (i === phoneNumbers.length - 1) {
                finalMessageSent = true
              }
            }
          },
        )
      },
    )

    if (finalMessageSent) session.close()

    session.on('close', () =>
      console.log(`Closed SMPP session. Sent ${successCount} messages.`),
    )

    // sleep for
  } catch (error) {
    console.error(error)
  }
}
