
import React from 'react';
// FIX: Used type-only import to prevent module resolution errors.
import type { Contact } from '../../types';
import { MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import Avatar from '../ui/Avatar';

interface RecentActivityProps {
  contacts: Contact[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ contacts = [] }) => {
  return (
    <div className="bg-white dark:bg-[var(--card-background)] p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-[var(--card-border)] h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h3>
        <Icon name="activity" className="text-gray-400 dark:text-gray-400" />
      </div>
      <div className="mt-4 flow-root flex-1 overflow-y-auto min-h-0">
        {contacts.length > 0 ? (
          <ul className="-mb-4">
            {contacts.map((contact) => (
              <li key={contact.id} className="pb-4">
                <Link href={`/chat?contactId=${contact.id}`} className="relative flex items-start space-x-3 group">
                  <div className="relative">
                    <Avatar initials={(contact.name || '?').charAt(0).toUpperCase()} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600">{contact.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-400">
                        {contact.lastMessageAt && formatDistanceToNow(new Date(contact.lastMessageAt), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-0.5 line-clamp-2">{contact.lastMessage}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Icon name="check" size={32} className="text-green-500 bg-green-100 p-2 rounded-full" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">All caught up!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No new messages from customers.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;