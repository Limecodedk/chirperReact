import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react'
import { useForm, Head, Link } from '@inertiajs/react';
import { FaInbox } from "react-icons/fa";
import Messages from '@/Components/NewMessages';
import { MdDelete } from "react-icons/md";
const messagesInbox = ({ auth, user }) => {

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
                <div className='p-4 bg-white h-full'>

                  <div className='bg-gray-50 p-4 mt-4 messagesCard sm:rounded-lg'>
                    <div className='flex flex-row w-50%'>
                      <div className='flex flex-row gap-3 mx-3'>
                        <img src={`/storage/${user.profile_Image_Url}`} alt="Profile image" className='round-small' />
                        <Link href={`/profile/${user.slug}`}>
                          {user.name}
                          <p className='font-medium text-sm text-gray-700'>12-12-2020</p>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <p>messages content</p>
                    </div>
                  </div>

                  <div className='bg-gray-50 p-4 mt-4 messagesCard sm:rounded-lg'>
                    <div className='flex flex-row w-50%'>
                      <div className='flex flex-row gap-3 mx-3'>
                        <img src={`/storage/${user.profile_Image_Url}`} alt="Profile image" className='round-small' />
                        <Link href={`/profile/${user.slug}`}>
                          {user.name}
                          <p className='font-medium text-sm text-gray-700'>12-12-2020</p>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <p>messages content</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="px-6  bg-white text-gray-900 col-2">
                <div className=" mx-auto p-4 sm:p-2 lg:p-1">
                  <div className='bg-50-gray'>
                    <Messages user={user} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >

      </AuthenticatedLayout >
    </>
  )
}

export default messagesInbox