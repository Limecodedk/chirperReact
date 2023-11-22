import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import { useForm, Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia'
import Dropdown from '@/Components/Dropdown';
import { FaUserCheck } from "react-icons/fa6";
import ReportModal from '@/Components/ReportModal';
import { FaRegMessage } from "react-icons/fa6";

const UserProfile = ({ user, auth, chirp }) => {
  const [areFriends, setAreFriends] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const { data, setData, post, processing, reset, errors } = useForm({
    message: '',
    image: '',
    userId: '',
    friendsId: ''
  });

  const chrips = chirp;
  /* 
    console.log(user)
    console.log(auth) */

  //Chirps Image
  const [fileInputKey, setFileInputKey] = useState(0);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setData('image', file);
  };

  //Create New Chirps
  const submit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('message', data.message);
    formData.append('image', data.image);

    post(route('chirps.store'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    e.target.reset();
    setData('image', null);
    setFileInputKey((prevKey) => prevKey + 1);
  };

  //Profile Cover image
  const backgroundStyle = {
    backgroundImage: `url(/storage/${user.profile_cover_image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  //Get Friends
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

  //Add Friends
  const handleAddFriends = async (e) => {
    e.preventDefault();
    const friendFormData = new FormData();
    friendFormData.append('userId', Number(auth.user.id));
    friendFormData.append('friendsId', Number(user.id));

    try {
      await Inertia.post(route('friends.add'), friendFormData);
      setAreFriends(true);
    } catch (error) {
      console.error('Error adding friends:', error);
    }
  };
  //Remove Friends
  const removeFriend = (e) => {
    e.preventDefault()
    try {
      Inertia.delete(route('deletefriend', { user: user.slug }));
      console.log('Ven slettet succesfuldt');

    } catch (error) {
      console.error('Fejl ved sletning af ven:', error);
    }
  }

  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
      >
        <Head title="Chirps" />
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8" >
            <div className="bg-white shadow-sm sm:rounded-lg" style={backgroundStyle}>
              <div className="flex p-6 text-gray-900">
                <img src={`/storage/${user.profile_Image_Url}`} alt="Profile image" className='w-52 rounded-lg shadow-lg' />
                <div className="flex flex-col ml-3 self-end">
                  <div><h1 className='text-3xl text-white'>@{user.name}</h1></div>
                  {user.id !== auth.user.id && (
                    <div className='flex flex-row'>
                      <div>
                        <button
                          className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg'
                          onClick={handleAddFriends}
                          disabled={friends.some(friend => friend.id === auth.user.id)}
                        >
                          {friends.some(friend => friend.id === auth.user.id) ?
                            <div className='flex flex-row'>
                              <FaUserCheck className='mt-1' /> <p className='mx-3'>Friend</p>
                            </div>
                            :
                            'Add friend'}
                        </button>
                      </div>
                      <div className="mt-2 mx-4 px-2 pt-3 relative self-end bg-blue-500 text-white rounded-lg">
                        {/* <Link href='/messages' className='flex flex-row'>
                          <FaRegMessage style={{ fontSize: '18px' }} />
                          <p className='mx-2 pb-1'>Send messages</p>
                        </Link> */}

                        <Link href={`/messages?receiver_id=${user.id}`} className='flex flex-row'>
                          <FaRegMessage style={{ fontSize: '18px' }} />
                          <p className='mx-2 pb-1'>Send messages</p>
                        </Link>
                      </div>
                      <div>
                        <div className="mt-2 relative self-end bg-gray-50 text-black rounded-lg">
                          <Dropdown>
                            <Dropdown.Trigger>
                              <span className="inline-flex rounded-md">
                                <button
                                  type="button"
                                  className="mt-2 px-4 py-2 items-center bg-transparent border-transparent"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                  </svg>
                                </button>
                              </span>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                              {friends.some(friend => friend.id === auth.user.id) ? (
                                <Dropdown.Link >
                                  < div onClick={removeFriend}>
                                    Remove friend
                                  </div>
                                </Dropdown.Link>
                              ) : (
                                <Dropdown.Link className='hidden' >
                                  <div className='hidden'></div>
                                </Dropdown.Link>
                              )}
                              <Dropdown.Link >
                                <ReportModal user={user} auth={auth} friends={friends} />
                              </Dropdown.Link>
                            </Dropdown.Content>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3  shadow-sm sm:rounded-lg mt-3">
              <div className=" text-gray-900 col-1">
                <div className='mb-4 p-4 bg-white '>
                  <div className="flex justify-between mb-3">
                    <h2>
                      About me:
                    </h2>
                    {user.id === auth.user.id && (
                      <Link href='/profile/settings'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </Link>
                    )}
                  </div>
                  <ul>
                    <li className='mb-2'>Name: {user.name}</li>
                    <li className='mb-2'>Birthday: {user.birthday}</li>
                    <li className='mb-2'>{user.gender}</li>
                  </ul>
                </div>
                <div className='mb-4 bg-white p-4 '>
                  {user.profile_text ? (
                    <p>
                      {user.profile_text}
                    </p>
                  ) : (
                    <p>Profil text comming soon</p>
                  )}
                </div>
                <div className='mb-4 bg-white p-4 '>
                  <div className='flex flex-col'>
                    <h2 className='mb-2'>Friends:</h2>
                    <div className='grid grid-cols-4 gap-3'>
                      {friends ? (
                        friends.map(friend => (
                          <div key={friend.id}>
                            <Link href={`/profile/${friend.slug}`}>
                              <img src={`/storage/${friend.profile_Image_Url}`} alt="" className='round-small mx-3' />
                              <p>{friend.name}</p>
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p>Loading friends...</p>
                      )}

                    </div>
                    <Link href={`/${user.slug}/friends`}>
                      <div className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg mx-auto'>
                        Show all friends
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="px-6  bg-white text-gray-900 col-2">
                <div className=" mx-auto p-4 sm:p-2 lg:p-1">
                  {/*           <form onSubmit={submit} className='chripForm'>
                    <textarea
                      placeholder="What's on your mind?"
                      className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm resize-none"
                      onChange={e => setData('message', e.target.value)}
                    ></textarea>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      onChange={handleFileUpload}
                      className='flex mt-3'
                    />
                    <InputError message={errors.message} className="mt-2" />
                    <PrimaryButton className="mt-4" disabled={processing}>Chirp</PrimaryButton>
                  </form> */}
                  {/*  <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {chirps.map(chirp =>
                      <Chirp key={chirp.id} chirp={chirp} />
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div >
      </AuthenticatedLayout >
    </>
  );
};

export default UserProfile;
