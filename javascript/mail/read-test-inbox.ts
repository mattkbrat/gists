// https://gist.githubusercontent.com/Myles-J/af458d2c7b85ea59b66a791f837deaf8/raw/fa4a3862d189af0d42dbb82fe707c9b6c9934720/read-test-inbox.ts

import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

// Function to connect to the mailbox using Ethereal SMTP server details.
const connectToMailbox = async () => {
  // Replace these with the Ethereal SMTP server details obtained while creating the account.
  const user = process.env.ETHEREAL_USERNAME;
  const pass = process.env.ETHEREAL_PASSWORD;

  if (!user || !pass) {
    throw new Error("Ethereal username or password not found");
  }

  const client = new ImapFlow({
    host: "imap.ethereal.email",
    port: 993,
    auth: {
      user,
      pass,
    },
  });

  await client.connect(); // Connect to the mailbox
  return client;
};

// Function to fetch the last email from the INBOX mailbox.
const fetchLastEmail = async (client: ImapFlow) => {
  const lock = await client.getMailboxLock("INBOX");
  try {
    const message = await client.fetchOne("*", { source: true }); // Use "*" to get the last message
    return message;
  } finally {
    lock.release();
  }
};

// Function to parse the email content.
const parseEmail = async (source: Buffer) => {
  const parsedEmail = await simpleParser(source);

  // Extract the necessary information from the parsed email
  return {
    subject: parsedEmail.subject,
    text: parsedEmail.text,
    html: parsedEmail.html,
    attachments: parsedEmail.attachments,
  };
};

// Function to retrieve the last received email from the mailbox.
export const lastEmail = async () => {
  const client = await connectToMailbox();
  try {
    const message = await fetchLastEmail(client);

    if (!message) {
      throw new Error("No message found");
    }

    return parseEmail(Buffer.from(message.source));
  } finally {
    await client.logout();
  }
};
