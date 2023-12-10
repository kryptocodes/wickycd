import { ConnectButton, useConnectModal, Wallet } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect, useSignMessage, useSignTypedData } from "wagmi";
import { useWalletClient } from 'wagmi'

import { Client } from "@xmtp/xmtp-js";


import React, { useEffect, useState, useRef } from "react";
import Chat from "./chat";
import Contacts from "./contacts"

const styles = `.Home {
    background-color: white;
  }
  
  .walletBtn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: black;
    height: 100vh;
  }
  .xmtp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  .btnXmtp {
    all: unset;
    color: black;
    background: hsl(300, 20%, 99%);
    border: 1px solid hsl(278, 4.1%, 89.1%);
    cursor: pointer;
    padding: 12px 12px;
    border-radius: 12px;
    cursor: pointer;
    align-items: center;
    box-sizing: border-box;
    line-height: 1;
    margin: 10px;
  }`

const BOT_ADDRESS = "0x937C0d4a6294cdfa575de17382c7076b579DC176";

export default function Home() {
  const [messages, setMessages] = useState(null);
  const convRef = useRef(null);
  const clientRef = useRef(null);
  const { address } = useAccount();
  const { data:signer } = useWalletClient();
  const isConnected = !!signer;
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [showContactsList, setShowContactList] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null)

  // Function to load the existing messages in a conversation
  const newConversation = async function (xmtp_client, addressTo) {
    //Creates a new conversation with the address
    if (await xmtp_client?.canMessage(addressTo)) {
      const conversation = await xmtp_client.conversations.newConversation(
        addressTo,
      );
      convRef.current = conversation;
      //Loads the messages of the conversation
      const messages = await conversation.messages();
      setMessages(messages);
    } else {
      alert("The contact you searched for can't be messaged because they are not on the xmtp network.");
      //cant message because is not on the network.
    }
  };

  const loadConversations = async () => {
    const conversations = await clientRef.current.conversations.list()
    return conversations
  }

  // Function to initialize the XMTP client
  const initXmtp = async function () {
    const startConvo = async(contactToInit) => {
      const xmtp = await Client.create(signer, { env: "production" });
      //Create or load conversation with Gm bot
      newConversation(xmtp, contactToInit.address);
      // Set the XMTP client in state for later use
      setIsOnNetwork(!!xmtp.address);
      //Set the client in the ref
      clientRef.current = xmtp;
    }


    if(selectedContact) {
      startConvo(selectedContact);
    }  else {
      startConvo({address: BOT_ADDRESS})
    }  
  };

  useEffect(() => {
    if (isOnNetwork && convRef.current) {
      // Function to stream new messages in the conversation
      const streamMessages = async () => {
        const newStream = await convRef.current.streamMessages();
        for await (const msg of newStream) {
          const exists = messages.find((m) => m.id === msg.id);
          if (!exists) {
            setMessages((prevMessages) => {
              const msgsnew = [...prevMessages, msg];
              return msgsnew;
            });
          }
        }
      };
      streamMessages();    
      loadConversations();  
    }
  }, [messages, isOnNetwork]);

  useEffect(() => {
    const startConvo = async() => {
      const xmtp = await Client.create(signer, { env: "production" });
      //Create or load conversation with Gm bot
      newConversation(xmtp, selectedContact.address);
      // Set the XMTP client in state for later use
      setIsOnNetwork(!!xmtp.address);
      //Set the client in the ref
      clientRef.current = xmtp;
    }


    if(selectedContact) {
      startConvo();
    }
  }, [selectedContact]);

  return (
    <div className="
        flex flex-col
        justify-center items-center
        h-screen
        bg-white
        text-black
    ">
    {/* Display the ConnectWallet component if not connected */}
    {!isConnected && (
      <div className="
        flex flex-col
        justify-center items-center
        h-screen
        bg-white
        text-black
      ">
        <ConnectButton theme="dark" onClick={() => connectModal.open()} />
      </div>
    )}
    {/* Display XMTP connection options if connected but not initialized */}
    {isConnected && !isOnNetwork && (
      <div className={styles.xmtp}>
        <ConnectButton theme="light" onClick={initXmtp} />
        <button onClick={initXmtp} className="
            black-btn justify-center items-center h-12 w-48 text-white
        ">
          Connect to XMTP
        </button>
      </div>
    )}
    {/* Render the Chat component if connected, initialized, and messages exist */}
    {isConnected && isOnNetwork && messages && !showContactsList ? (
      <Chat
        client={clientRef.current}
        conversation={convRef.current}
        messageHistory={messages}
        selectedContact={selectedContact}
        setShowContactList={setShowContactList}
      />
    ) : isConnected && isOnNetwork && messages && (
      <Contacts
        loadConversations={loadConversations}
        setSelectedContact={setSelectedContact}
        setShowContactList={setShowContactList}
      />
    )}
  </div>
  );
}