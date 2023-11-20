import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';

const Messages = ({ user }) => {
  const { data, setData, post } = useForm({
    content: '',
    receiver_id: '',
    receiver: '',
  });

  const fetchMessagesData = async (type) => {
    try {
      const response = await fetch(`/messages/${user.id}/${type}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      /*  console.log('Before setData - data:', data);
       console.log('Before setData - responseData:', responseData); */

      setData({ ...data, messages: responseData.messages });

      /*  console.log('After setData - data:', data); */
    } catch (error) {
      console.error('Error fetching messages data:', error);
    }
  };

  const formatDate = (isoDateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(isoDateString);
    return date.toLocaleDateString('da-DK', options);
  };

  console.log(data)

  // Opdaterer beskeder periodisk
  useEffect(() => {
    fetchMessagesData('inbox'); // For indgående beskeder
    // Hvis du vil opdatere data periodisk, kan du bruge en intervalfunktion.
    const intervalId = setInterval(() => fetchMessagesData('inbox'), 50000000000000000000000); // Opdater hvert 5. sekund

    return () => clearInterval(intervalId); // Rens op ved komponentens afmontering
  }, [user.id]); // Tilføj user.id til afhængighedslisten


  // Send Messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await Inertia.post(route('messages.store'), data);
      await fetchMessagesData(); // Opdater beskeder efter afsendelse af en besked
      console.log('Besked sendt');
    } catch (error) {
      console.error('Fejl ved afsendelse af besked:', error);
    }
  };



  return (
    <div className='grid grid-cols-3 gap-5'>
      {/* Messages receiver */}
      <div className='col-span-2 mr-5'>
        {data.messages && data.messages.map((message) => (
          <div className='bg-gray-50 p-4 mt-4 rounded-lg' key={message.id} >
            <div className='flex flex-row gap-3 mx-3'>
              <img src={`/storage/${user.profile_Image_Url}`} alt="Profile image" className='round-small' />
              <Link href={`/profile/${user.slug}`}>
                {user.name}
                <p className='font-medium text-sm text-gray-700'>{formatDate(message.created_at)}</p>
              </Link>
            </div>
            <div className='mt-3'>

              <div>
                {message.content}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Messages sender */}
      <div className='col-span-2 col-start-2 mr-5'>
        <div className='bg-gray-50 p-4 mt-4 sm:rounded-lg'>
          <div className='flex flex-row justify-end'>
            <div className='flex flex-col gap-3 mx-3'>
              {user.name}
              <p className='font-medium text-sm text-gray-700'>12-12-2020</p>
            </div>
          </div>
          <div>
            {data.sender && (
              <p>
                {data.sender}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages form */}
      <form onSubmit={handleSendMessage} className='flex flex-col my-3 col-span-full'>
        <textarea
          name="messages"
          id="messages"
          className='resize-none my-4 rounded-lg'
          value={data.content}
          onChange={(e) => setData((prevData) => ({ ...prevData, content: e.target.value }))}
        ></textarea>
        <button type="submit" className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg'>
          Send
        </button>
      </form>
    </div>
  );
}

export default Messages;
