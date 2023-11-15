import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

const ProfileCover = ({ className = '' }) => {
  const user = usePage().props.auth.user;
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    profilecoverimage: null,
  });

  const handleFileUpload = (e) => {
    const image = e.target.files[0];
    setData('profilecoverimage', image);
  };

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profilecoverimage', data.profilecoverimage);

    try {
      post(route('profile.profilecoverimage'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData('profilecoverimage', null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
      <div>
        <InputLabel htmlFor="profilecoverimage" value="Profile Cover Image" />
        <input
          type="file"
          name="profilecoverimage"
          id="profilecoverimage"
          onChange={handleFileUpload}
          className="mt-1 block w-full"
        />
        <InputError className="mt-2" message={errors.profilecoverimage} />
      </div>
      <div className="flex items-center gap-4">
        <PrimaryButton disabled={processing}>Save</PrimaryButton>
        <Transition
          show={recentlySuccessful}
          enter="transition ease-in-out"
          enterFrom="opacity-0"
          leave="transition ease-in-out"
          leaveTo="opacity-0"
        >
          <p className="text-sm text-gray-600">Saved.</p>
        </Transition>
      </div>
    </form>
  );
};

export default ProfileCover;
