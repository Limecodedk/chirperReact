import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react'

const FriendRequest = ({ user, friends }) => {
  const [areFriends, setAreFriends] = useState(false);
  /*   const [friends, setFriends] = useState([]); */

  const { data, setData, post, processing, reset, errors } = useForm({
    message: '',
    image: '',
    userId: '',
    friendsId: ''
  });


  /*   useEffect(() => {
      const fetchFriendsData = async () => {
        try {
          const response = await fetch(`/user/{user:slug}/friend`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          setFriends(data.friends);
          setFriendRequests(data.friend_requests);
        } catch (error) {
          console.error('Error fetching friends data:', error);
        }
      };
  
      fetchFriendsData();
    }, [user.id]);
   */

  const handleAddFriends = async (e) => {
    e.preventDefault();
    const friendFormData = new FormData();
    friendFormData.append('userId', Number(auth.user.id));
    friendFormData.append('friendsId', Number(user.id));

    try {
      await Inertia.post(route('friendsrequest'), friendFormData);
      setAreFriends(true);
    } catch (error) {
      console.error('Error adding friends:', error);
    }
  };



  return (
    <>
      <h2 className='font-bold'>Friends Request:</h2>
    </>
  )
}

export default FriendRequest