import React from 'react';
import { BiNotification } from 'react-icons/bi';
import { CgAdd, CgNotes } from 'react-icons/cg';
import { GoGraph, GoReport } from 'react-icons/go';
import { MdOutlineManageAccounts, MdOutlineSpaceDashboard } from 'react-icons/md';
import { PiExam } from 'react-icons/pi';
import { NavLink } from 'react-router-dom';

const ControllerSidebar = () => {
    const menuItems = [
        {
            to: '/controller',
            icon: <MdOutlineSpaceDashboard size={20} />,
            label: 'Dashboard',
            end: true
        },
        {
            to: '/controller/create-exam',
            icon: <CgAdd size={20} />,
            label: 'Create Exam'
        },
        {
            to: '/controller/manage-teacher',
            icon: <MdOutlineManageAccounts size={20} />,
            label: 'Manage Teachers'
        },
        {
            to: '/controller/add-department',
            icon: <PiExam size={20} />,
            label: 'Departments'
        },
        {
            to: '/controller/controllernotification',
            icon: <BiNotification size={20} />,
            label: 'Notifications'
        },
        {
            to: '/controller/resultsmanage-',
            icon: <CgNotes size={20} />,
            label: 'Manage Results'
        },
        {
            to: '/controller/allstudents',
            icon: <GoReport size={20} />,
            label: 'All Students'
        },
        {
            to: '/controller/analytics',
            icon: <GoGraph size={20} />,
            label: 'Analytics'
        }
    ];

    return (
        <div className='flex flex-col w-20 md:w-64 border-r border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-300'>
            <div className='flex-1 py-6 px-3 space-y-2'>
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group
              ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 transform scale-[1.02]'
                                : 'text-gray-600 hover:bg-gray-100/80 hover:text-blue-600'
                            }`
                        }
                    >
                        <span className={`transition-colors duration-300`}>
                            {item.icon}
                        </span>
                        <span className='hidden md:block font-medium text-sm tracking-wide opacity-90 transition-all duration-300 group-hover:translate-x-1'>
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </div>

            {/* Optional: Sidebar Footer info if needed */}
            <div className='p-6 hidden md:block'>
  <div className='p-4 bg-blue-100 rounded-2xl border border-blue-300 shadow-sm'>
    <p className='text-sm font-bold text-blue-800 uppercase tracking-wider mb-1'>
      OES Control
    </p>
    <p className='text-xs text-blue-700'>
      Admin Administration Panel
    </p>
  </div>
</div>
        </div>
    );
};

export default ControllerSidebar;