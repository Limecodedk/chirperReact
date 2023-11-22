import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';

const Messages = ({ user, receiver_id }) => {

  const { data, setData, post } = useForm({
    content: '',
    receiver_id: receiver_id,
    receiver: '',
  });

  //Hent Beskeder fra modtager
  const fetchMessagesData = async (type, receiverId) => {
    try {
      const response = await fetch(`/messages/${receiverId}/${type}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      // Opdater data med modtagne beskeder og modtagerens profiloplysninger
      setData({
        ...data,
        messages: responseData.messages,
        profileImageUrl: responseData.profileImageUrl,
      });
    } catch (error) {
      console.error('Error fetching messages data:', error);
    }
  };


  //Hent sendte beskeder
  const fetchSentMessagesData = async (receiverId) => {
    try {
      const response = await fetch(`/messages/${receiverId}/sent`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      /* console.log('Sent Messages API Response:', responseData); */
      /* setData((prevData) => ({ ...prevData, sentMessages: responseData.sentMessages })); */
      setData((prevData) => ({ ...prevData, sentMessages: responseData.messages }));
    } catch (error) {
      console.error('Error fetching sent messages data:', error);
    }
  };

  //Dato og tid formatering
  const formatDate = (isoDateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(isoDateString);
    return date.toLocaleDateString('da-DK', options);
  };

  // Opdaterer beskeder periodisk
  useEffect(() => {
    const fetchData = async () => {
      if (receiver_id) {
        await fetchMessagesData('inbox', receiver_id); // Brug receiver_id i stedet for user.id
        await fetchSentMessagesData(receiver_id); //receiver_id
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 120000);

    return () => clearInterval(intervalId);
  }, [receiver_id]);

  // Send nye beskeder
  const handleSendMessage = async (e) => {
    e.preventDefault();
    // Hent receiver_id fra den første besked i sentMessages, hvis det er tilgængeligt
    const receiverIdFromSentMessages = data.sentMessages?.[0]?.receiver_id;

    const newData = {
      ...data,
      receiver_id: data.receiver_id || receiverIdFromSentMessages || receiver_id,
    };

    // Hent receiver_id fra URL'en, hvis det ikke allerede er inkluderet
    if (!newData.receiver_id) {
      const urlParams = new URLSearchParams(window.location.search);
      const receiverIdFromURL = urlParams.get('receiver_id');
      newData.receiver_id = receiverIdFromURL || '';
    }


    try {
      await Inertia.post(route('messages.store', { id: newData.receiver_id }), newData);
      await fetchMessagesData(); // Opdater beskeder efter afsendelse af en besked
      console.log('Besked sendt til', newData.receiver_id);
    } catch (error) {
      console.error('Fejl ved afsendelse af besked:', error);
    }
  };

  return (
    <div>
      {/* Messages */}
      <div className='grid grid-cols-3 messagesGrid '>
        {(data.messages || []).concat(data.sentMessages || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((message) => (
          <div
            className={`message-container ${message.sender_id === user.id ? 'sent-message' : 'received-message'}`}
            key={message.id}
          >
            <div className={`flex flex-row gap-3 mx-3 messagesHeader ${message.sender_id === user.id ? 'sent-message-header' : ''}`}>
              {message.sender_id !== user.id && (
                <img src={'/storage/' + data.profileImageUrl} alt="Sender Profile" className='round-small' />

              )}
              <Link href={`/profile/${user.slug}`}>
                {data.senderName}
                <p className='font-medium text-sm text-gray-700'>{formatDate(message.created_at)}</p>
              </Link>
            </div>
            <div className='mt-3'>
              <div className={`message-content ${message.sender_id === user.id ? 'sent-message' : 'received-message'}`}>
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Messages form */}
      <form onSubmit={handleSendMessage} className='flex flex-col my-3 col-span-full'>
        <textarea
          name="messages"
          id="messages"
          className='resize-none my-4 rounded-lg'
          onChange={(e) => setData((prevData) => ({ ...prevData, content: e.target.value }))}
        ></textarea>
        <button type="submit" className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg'>
          Send
        </button>
      </form>
    </div >
  );
}

export default Messages;
