import React from 'react';
import { BiNotification } from 'react-icons/bi';
import { CgAdd } from 'react-icons/cg';
import { PiExam } from 'react-icons/pi';
import { RxDashboard } from 'react-icons/rx';
import { FaUsers } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { GoGraph } from 'react-icons/go';
import { TbShare3 } from "react-icons/tb";


const TeacherSidebar = () => {
    const menuItems = [
        {
            to: '/teacher',
            icon: <RxDashboard size={20} />,
            label: 'Dashboard',
            end: true
        },
        {
            to: '/teacher/addstudent',
            icon: <CgAdd size={20} />,
            label: 'Add Student'
        },
        {
            to: '/teacher/managestudents',
            icon: <FaUsers size={20} />,
            label: 'Manage Students'
        },
        {
            to: '/teacher/evaluate',
            icon: <PiExam size={20} />,
            label: 'Evaluate Exam'
        },
        {
            to: '/teacher/notification',
            icon: <BiNotification size={20} />,
            label: 'Notifications'
        },
        {
            to: '/teacher/analytics',
            icon: <GoGraph size={20} />,
            label: 'Analytics'
        },
        {
            to: '/teacher/sharefile',
            icon: <TbShare3 size={20} />,
            label: 'Share File'
        }
    ];

    return (
        <div className='flex flex-col w-20 md:w-64 border-r border-gray-200 bg-white/50 backdrop-blur-sm transition-all duration-300 font-out'>
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

            {/* Sidebar Footer info */}
           <div className='p-6 hidden md:block'>
  <div className='p-4 bg-blue-600 rounded-2xl shadow-md'>
    <p className='text-sm font-bold text-white uppercase tracking-wider mb-1'>
      Teacher Portal
    </p>
    <p className='text-xs text-blue-100'>
      OES Examination Management
    </p>
  </div>
</div>
        </div>
    );
};

export default TeacherSidebar;