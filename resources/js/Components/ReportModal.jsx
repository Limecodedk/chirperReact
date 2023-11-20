import { useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import DangerButton from './DangerButton';
import { MdReportProblem } from "react-icons/md";
import TextArea from './TextArea';

const ReportModal = ({ user, auth, friends, className = '' }) => {
  const [confirmingUserReport, setConfirmingUserReport] = useState(false);

  const { data, setData, delete: destroy, processing, reset, errors, } = useForm({
    password: '',
    name: '',
    reportMessage: '',
  });

  const reportUser = (e) => {
    e.preventDefault()
    console.log('modal open')
    setConfirmingUserReport(true);
  }

  const closeModal = () => {
    setConfirmingUserReport(false);
    reset();
  };
  return (
    <>
      <section className={`space-y-6 ${className}`}>
        <header>
          <div className='flex flex-row' onClick={reportUser}>
            <MdReportProblem /><p className='mx-2'>Repport user</p>
          </div>
        </header>

        <Modal show={confirmingUserReport} onClose={closeModal}>
          <form onSubmit={reportUser} className="p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Are you sure you want to report this user?
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Once your account is deleted, all of its resources and data will be permanently deleted. Please
              enter your password to confirm you would like to permanently delete your account.
            </p>

            <div className="mt-6">
              <InputLabel htmlFor="userName" value="User name" />
              <TextInput
                id="username"
                className="mt-1 block w-full"
                value={user.name}
                required
                isFocused
                autoComplete="userName"
              />

              <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mt-6">
              <InputLabel htmlFor="name" value="You name" />
              <TextInput
                id="name"
                className="mt-1 block w-full"
                value={auth.user.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                isFocused
                autoComplete="name"
              />

              <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="mt-6">
              <InputLabel htmlFor="reportMessage" value="Report message" />
              <TextArea
                id="reportMessage"
                className="mt-1 block w-full"
                value={data.profile_text}
                onChange={(e) => setData('reportMessage', e.target.value)}
                required
                isFocused
                autoComplete="reportMessage"
              />
              <InputError className="mt-2" message={errors.reportMessage} />
            </div>

            <div className="mt-6 flex justify-end">
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

              <DangerButton className="ml-3">
                Send
              </DangerButton>
            </div>
          </form>
        </Modal>
      </section>
    </>
  )
}

export default ReportModal