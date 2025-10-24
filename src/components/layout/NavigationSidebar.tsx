

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Icon, { type IconName } from '@/components/ui/Icon';

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: 'settings' as IconName },
  { href: '/pricing', label: 'Pricing', icon: 'creditCard' as IconName },
  { href: '/profile', label: 'Profile', icon: 'user' as IconName },
];

const NavigationSidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) {
    return null; // Don't render sidebar on login/signup pages
  }

  // Dynamically construct nav items based on user's primary workflow
  const baseNavItems = [
    { href: '/', label: 'Dashboard', icon: 'layoutDashboard' as IconName },
    { href: '/chat', label: 'Chats', icon: 'messageCircle' as IconName },
  ];

  const workflowNavItems = [
    { href: '/orders', label: 'Orders', icon: 'package' as IconName },
    { href: '/quotations', label: 'Quotations', icon: 'fileText' as IconName },
  ];

  const otherNavItems = [
    { href: '/broadcasts', label: 'Broadcasts', icon: 'radio' as IconName },
    { href: '/groups', label: 'Groups', icon: 'users' as IconName },
  ];

  let orderedWorkflowItems = [...workflowNavItems]; // Default: Orders first

  if (session.user.primaryWorkflow === 'QUOTATION_FOCUSED') {
    // If user is quotation-focused, reverse the order to show Quotations first
    orderedWorkflowItems.reverse();
  }

  const navItems = [...baseNavItems, ...orderedWorkflowItems, ...otherNavItems];
  const workflow = session.user.primaryWorkflow;


  return (
    <aside className="w-16 bg-white dark:bg-[var(--card-background)] border-r border-gray-200 dark:border-[var(--card-border)] flex flex-col items-center py-4">
      <div className="p-2 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          V
        </div>
      </div>
      <nav className="flex flex-col items-center space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          let isDisabled = false;

          if (item.href === '/orders' && workflow === 'QUOTATION_FOCUSED') {
            isDisabled = true;
          }
          if (item.href === '/quotations' && workflow === 'ORDER_FOCUSED') {
            isDisabled = true;
          }

          if (isDisabled) {
            return (
              <div
                key={item.href}
                className="flex flex-col items-center justify-center w-14 h-14 rounded-lg text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                title={`${item.label} (Disabled in this workspace)`}
              >
                <Icon name={item.icon} size={20} />
                <span className="text-[9px] mt-1">{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              href={item.href}
              key={item.href}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-blue-100 text-blue-600 dark:bg-[var(--incoming-bubble-bg)] dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              title={item.label}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-[9px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col items-center space-y-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.href}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-blue-100 text-blue-600 dark:bg-[var(--incoming-bubble-bg)] dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              title={item.label}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-[9px] mt-1">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => signOut()}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400"
          title="Sign Out"
        >
          <Icon name="lock" size={20} />
          <span className="text-[9px] mt-1">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default NavigationSidebar;