import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DateInput from '@/Components/DateInput'
import SelectInput from '@/Components/SelectInput'
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import TextArea from '@/Components/TextArea';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
  const user = usePage().props.auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
    birthday: user.birthday,
    gender: user.gender,
    profile_text: user.profile_text
  });



  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('birthday', data.birthday);
    formData.append('gender', data.gender);
    formData.append('profile_text', data.profile_text);
    patch(route('profile.update'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(data.ProfileText)
    /*     console.log(formData) */
  };

  const genderOptions = [
    { value: '', label: 'Select your gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
        <p className="mt-1 text-sm text-gray-600">
          Update your account's profile information and email address.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="name" value="Name" />

          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            isFocused
            autoComplete="name"
          />

          <InputError className="mt-2" message={errors.name} />
        </div>

        <div>
          <InputLabel htmlFor="birthday" value="Birthday" />

          <DateInput
            id="birthday"
            className="mt-1 block w-full"
            value={data.birthday}
            onChange={(e) => setData('birthday', e.target.value)}
            required
            isFocused
            autoComplete="birthday"
          />

          <InputError className="mt-2" message={errors.birthday} />
        </div>

        <div>
          <InputLabel htmlFor="gender" value="Gender" />

          <SelectInput
            id="gender"
            className="mt-1 block w-full"
            value={data.gender}
            options={genderOptions}
            onChange={(e) => setData('gender', e.target.value)}
            required
            isFocused
            autoComplete="gender"
          />

          <InputError className="mt-2" message={errors.gender} />
        </div>

        <div>
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
            autoComplete="username"
          />

          <InputError className="mt-2" message={errors.email} />
        </div>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div>
            <p className="text-sm mt-2 text-gray-800">
              Your email address is unverified.
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Click here to re-send the verification email.
              </Link>
            </p>

            {status === 'verification-link-sent' && (
              <div className="mt-2 font-medium text-sm text-green-600">
                A new verification link has been sent to your email address.
              </div>
            )}
          </div>
        )}


        <div>
          <InputLabel htmlFor="ProfileText" value="Profile Text" />

          <TextArea
            id="ProfileText"
            className="mt-1 block w-full"
            value={data.profile_text}
            onChange={(e) => setData('profile_text', e.target.value)}
            required
            isFocused
            autoComplete="ProfileText"
          />
          <InputError className="mt-2" message={errors.ProfileText} />
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
    </section>
  );
}
