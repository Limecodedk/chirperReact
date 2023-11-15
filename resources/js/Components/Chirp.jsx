import React, { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useForm, usePage, Link } from '@inertiajs/react';
import { FaComments } from 'react-icons/fa'
import { AiFillHeart, AiOutlineLike } from 'react-icons/ai'

dayjs.extend(relativeTime);

export default function Chirp({ chirp }) {
  const [editing, setEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(chirp.likes_count);

  const { auth } = usePage().props;
  const userId = auth.user.id;

  const ProfilImage = chirp.user.profile_Image_Url;
  const ProfilImageUrl = '/storage/' + ProfilImage;

  const { data, setData, post, patch, clearErrors, reset, errors } = useForm({
    user_id: userId,
    chirp_id: chirp.id,
    content: newComment,

  });

  const chirpId = data.chirp_id;
  const imagePath = chirp.image;
  const imageUrl = '/storage/' + imagePath;



  //Update chirps
  const submit = (e) => {
    e.preventDefault();
    patch(route('chirps.update', chirp.id), { onSuccess: () => setEditing(false) });
  };

  //Like Chirp
  const handleLikeChirp = async (e) => {
    e.preventDefault();
    post(route('chirps.like', chirp.id), {
    });
    setLikes(likes + 1);
    e.target.reset()
  };

  //Get Comments
  useEffect(() => {
    fetch(`/comments/${chirpId}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => setComments(data.comments));
  }, []);

  //Create chirp comment
  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    data.user_id = userId;
    data.chirp_id = chirp.id;
    data.content = newComment;
    post(route('comments.store'), data, {
    });
    e.target.reset()
  };

  //Show chirp comments
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  //like chirp comment
  const handleLikeComment = async (e) => {
    e.preventDefault();
    post(route('comment.like', comments.id), {
    });
    setLikes(likes + 1);
  };

  return (
    <div className="p-6  flex space-x-2">
      <img src={ProfilImageUrl} alt="" className='round-small' />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <Link href={`/profile/${chirp.user_id}/`}>
              <span className="text-gray-800">{chirp.user.name}</span>
            </Link>
            <small className="ml-2 text-sm text-gray-600">{dayjs(chirp.created_at).fromNow()}</small>
            {chirp.created_at !== chirp.updated_at && <small className="text-sm text-gray-600"> &middot; edited</small>}
          </div>
          {chirp.user.id === auth.user.id &&
            <Dropdown>
              <Dropdown.Trigger>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <button className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out" onClick={() => setEditing(true)}>
                  Edit
                </button>
                <Dropdown.Link as="button" href={route('chirps.destroy', chirp.id)} method="delete">
                  Delete
                </Dropdown.Link>
              </Dropdown.Content>
            </Dropdown>
          }
        </div>
        {editing
          ? <form onSubmit={submit}>
            <textarea value={data.message} onChange={e => setData('message', e.target.value)} className="mt-4 w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm resize-none"></textarea>
            <InputError message={errors.message} className="mt-2" />
            <div className="space-x-2">
              <PrimaryButton className="mt-4">Save</PrimaryButton>
              <button className="mt-4" onClick={() => { setEditing(false); reset(); clearErrors(); }}>Cancel</button>
            </div>
          </form>
          :
          <>
            <p className="mt-2 text-lg text-gray-900">{chirp.message}</p>
            {chirp.image && <img src={imageUrl} alt="Chirp Image" className="mt-4 max-w-full" />}
            <div className='flex flex-row justify-end'>
              {chirp.user.id !== auth.user.id && (
                <div className="flex justify-end mt-4 mx-3 cursor-pointer" onClick={handleLikeChirp}>
                  <AiFillHeart style={{ fontSize: "1.5em" }} className='likeHeart' />
                  <span className="ml-2 text-gray-600">{likes} synes godt om</span>
                </div>
              )}
              {chirp.user.id === auth.user.id && (
                <div className="flex justify-end mt-4 mx-3">
                  <AiFillHeart style={{ fontSize: "1.5em" }} className='likeHeart' />
                  <span className="ml-2 text-gray-600">{likes} synes godt om</span>
                </div>
              )}
              {(!chirp.comments || chirp.comments.length === 0) && (
                <div className="flex flex-col">
                  <FaComments className='px-4' />
                  <h2 className="font-semibold cursor-pointer" onClick={toggleComments}>
                    <span className='ml-2 text-gray-600'>Comment:</span>
                  </h2>
                </div>
              )}
            </div>
            {showComments && (
              <ul>
                <li>
                  <form onSubmit={handleNewCommentSubmit} className='flex justify-center mt-6'>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className='rounded-lg w-3/5 mx-3 justify-center'
                    />
                    <PrimaryButton className="mt-4" type="submit ">Submit</PrimaryButton>
                  </form>
                </li>
                {comments.map((comment, index) => (
                  <div key={index} className='border-b-2 py-2 mt-4'>
                    <p>{comment.content}</p>
                    <div className='flex '>
                      <small>By {comment.userName}</small>
                      <small className="ml-2 text-sm text-gray-600">{dayjs(comment.created_at).fromNow()}</small>
                      <div className='flex px-2 cursor-pointer' onClick={handleLikeComment}>
                        <small><p className='likecounter'>0 syntes godt om</p></small>
                        <AiOutlineLike />
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </>
        }
      </div>
    </div >
  );
}