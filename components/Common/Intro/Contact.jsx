import React from 'react';
import { CONTACTS } from '../../../constants/constants';
import Link from 'next/link';

const Contact = ({ contacts }) => {
  const email = contacts?.email || CONTACTS.EMAIL;
  const phone = contacts?.phone || CONTACTS.PHONE;

  return (
    <div className="flex flex-col space-y-2 pt-6">
      <div className="flex flex-col">
        <span className="text-Snow text-xs font-bold">Email Address</span>
        <span className="text-xs text-gray-400">
          <Link href={`mailto:${email}`} className="hover:text-yellow transition-colors">{email}</Link>
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-Snow text-xs font-bold">Phone</span>
        <span className="text-xs text-gray-400">{phone}</span>
      </div>
    </div>
  );
};

export default Contact;
