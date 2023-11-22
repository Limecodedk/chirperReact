import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FriendRequest from '@/Components/FriendRequest'
import React, { useEffect, useState } from 'react'
import { useForm, Head, Link } from '@inertiajs/react';

const AllFriends = ({ user, auth, chirp }) => {
  const [areFriends, setAreFriends] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);

  const { data, setData, post, processing, reset, errors } = useForm({
    message: '',
    image: '',
    userId: '',
    friendsId: ''
  });

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const response = await fetch(`/user/${user.slug}/friends`, {
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


  const handleSearch = () => {
    const filteredResults = searchQuery
      ? friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : friends;

    setFilteredFriends(filteredResults);
  };


  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
      >
        <Head title="Friends" />

        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8" >
            <div className='bg-white my-4 py-4 px-3'>
              <FriendRequest user={user} friends={friends} />
            </div>
            <div className='bg-white'>
              <div className='p-4'>
                <h2 className='font-bold'>My Friends:</h2>
                <div className='flex flex-row justify-center mt-4'>
                  <input
                    type="text"
                    name="searchFriend"
                    id="searchFriend"
                    placeholder='Search Friend'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='bg-gray-100 rounded border-none mt-3 mx-3 outline-none'
                  />
                  <button
                    onClick={handleSearch}
                    className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg'
                  >
                    Search
                  </button>
                </div>
                <div className='flex flex-row mt-4'>
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map(friend => (
                      <div key={friend.id}>
                        <Link href={`/profile/${friend.slug}`}>
                          <img src={`/storage/${friend.profile_Image_Url}`} alt="" className='h-64 mx-3' />
                          <p className='text-center text-xl'>{friend.name}</p>
                          <div className='flex'>
                            <button className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto'>
                              View friend
                            </button>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    ''
                  )}
                </div>
                <div className='flex flex-row mt-4'>
                  {friends ? (
                    friends.map(friend => (
                      <div key={friend.id}>
                        <Link href={`/profile/${friend.slug}`}>
                          <img src={`/storage/${friend.profile_Image_Url}`} alt="" className='h-64 mx-3' />
                          <p className='text-center text-xl'>{friend.name}</p>
                          <div className='flex'>
                            <button className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto'>
                              View friend
                            </button>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p>Loading friends...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  )
}

export default AllFriends