import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Chirp from '@/Components/Chirp';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';

export default function Index({ auth, chirps }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    message: '',
    image: ''
  });

  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setData('image', file);
  };

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

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Chirps" />

      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={submit} className='chripForm'>
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
        </form>
        <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
          {chirps.map(chirp =>
            <Chirp key={chirp.id} chirp={chirp} />
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}