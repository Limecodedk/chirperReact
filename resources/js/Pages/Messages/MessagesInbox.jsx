import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react'
import { useForm, Head, Link } from '@inertiajs/react';
import { FaInbox } from "react-icons/fa";
import Messages from '@/Components/NewMessages';
import { MdDelete } from "react-icons/md";


const messagesInbox = ({ auth, user }) => {
  const [receiver_id, setReceiver_id] = useState('');

  const { data, setData, post } = useForm({
    content: '',
    receiver_id: receiver_id,
    receiver: '',
  });


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/messages/viewconversations', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [user.id, receiver_id]);

  const fetchConversations = async (conversationId) => {
    try {
      if (conversationId) {
        const response = await fetch(`/messages/${conversationId}/inbox`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        // Opdater data med de hentede samtaler og opdater receiver_id baseret på beskederne
        setData(responseData);

        // Opdater receiver_id baseret på logikken fra beskederne (eksempel)
        const newReceiverId = calculateReceiverId(responseData.messages);

        setReceiver_id(newReceiverId);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  useEffect(() => {
    const defaultType = '';
    fetchConversations(defaultType);
  }, [user.id]);

  // funktion til at beregne receiver_id baseret på beskederne
  const calculateReceiverId = (messages) => {
    return messages.length > 0 ? messages[0].receiver_id : '';
  };


  useEffect(() => {
    const defaultType = '';
    fetchConversations(defaultType);
  }, [user.id]);

  // messagesInbox.jsx
  const handleConversationClick = async (conversation) => {
    if (conversation && conversation.receiver_id) {
      setReceiver_id(conversation.receiver_id);
      await fetchConversations(conversation.receiver_id);
    } else {
      console.error('Invalid conversation object:', conversation);
    }
  };


  //Dato og tid formatering
  const formatDate = (isoDateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(isoDateString);
    return date.toLocaleDateString('da-DK', options);
  };



  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
      >
        <Head title="Inbox" />

        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8" >
            <div className="bg-white shadow-sm sm:rounded-lg">
              <div className="flex p-6 text-gray-900">
                <FaInbox style={{ fontSize: '2rem' }} />
                <h2 className='ml-3 font-bold'>Inbox</h2>
              </div>
            </div>
            <div className="flex gap-3  shadow-sm sm:rounded-lg mt-3">
              <div className=" text-gray-900 col-1">
                <div className="p-4 bg-white h-full overflow-y-auto">
                  {data.conversations && data.conversations.map(conversation => (
                    <div key={`${conversation.receiver_id}-${conversation.lastMessageDate}`} className="mb-4" onClick={() => handleConversationClick(conversation)}>
                      <h3 className="font-semibold">{conversation.otherUserName}</h3>
                      <p>{conversation.lastMessageContent}</p>
                      <p>Dato: {conversation.lastMessageDate}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Messages */}
              <div className="px-6  bg-white text-gray-900 col-2">
                <div className=" mx-auto p-4 sm:p-2 lg:p-1">
                  <div className='bg-50-gray'>
                    <Messages user={user} receiver_id={receiver_id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout >
    </>
  )
}

export default messagesInbox