import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

const ProfileImage = ({ className = '' }) => {
  const user = usePage().props.auth.user;
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    profileImageUrl: null,
  });

  const handleFileUpload = (e) => {
    const image = e.target.files[0];
    setData('profileImageUrl', image);
  };

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profileImageUrl', data.profileImageUrl);

    try {
      post(route('profile.profileimage'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Optionally reset the form or perform other actions upon success
      setData('profileImageUrl', null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
      <div>
        <InputLabel htmlFor="profileImageUrl" value="Profile Image" />
        <input
          type="file"
          name="profileImageUrl"
          id="profileImageUrl"
          onChange={handleFileUpload}
          className="mt-1 block w-full"
        />
        <InputError className="mt-2" message={errors.profile_image_url} />
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

export default ProfileImage;
