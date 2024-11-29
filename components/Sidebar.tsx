'use client';
import { useState } from 'react';
import { FaTasks, FaRegCalendarAlt, FaCog } from 'react-icons/fa';
import { MdOutlineDashboard } from "react-icons/md";
import { IoIosStats } from 'react-icons/io';
import { BsArrowBarRight, BsArrowBarLeft } from 'react-icons/bs';
import { TbLogout2 } from "react-icons/tb";
import Link from 'next/link';
import styles from '../styles/sidebar.module.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? '' : styles.closed}`}>
        {/* Icone d'ouverture/fermeture */}
        <div 
          className={`${styles.toggleIcon} ${isOpen ? styles.open : styles.closed}`} 
          onClick={toggleSidebar} 
          aria-label="Toggle sidebar"
        >
          {isOpen ? <BsArrowBarLeft /> : <BsArrowBarRight />}
        </div>

        {/* Section Profil */}
        <div className={styles.profile}>
          <img 
            src="/images/pfp-cloud.jpg" 
            alt="Profile" 
            className={styles.profileImage} 
          />
          {isOpen && <p className={styles.profileName}>Username</p>}
        </div>

        {/* Liens de navigation */}
        <div className={`${styles.navLinks} ${isOpen ? '' : styles.closed}`}>
          <Link href="/dashboard" className={styles.navLink}>
            <MdOutlineDashboard className={styles.icon} />
            {isOpen && <span>Dashboard</span>}
          </Link>

          <Link href="/calendar" className={styles.navLink}>
            <FaRegCalendarAlt className={styles.icon} />
            {isOpen && <span>Calendar</span>}
          </Link>

          <Link href="/statistics" className={styles.navLink}>
            <IoIosStats className={styles.icon} />
            {isOpen && <span>Statistics</span>}
          </Link>

          <Link href="/tasks" className={styles.navLink}>
            <FaTasks className={styles.icon} />
            {isOpen && <span>Tasks</span>}
          </Link>
        </div>

        {/* Lien de déconnexion */}
          <div className={styles.logout}>
          <Link href="/logout" className={styles.navLink}>
            <TbLogout2 className={`${styles.icon} ${styles.logoutIcon}`} />
            {isOpen && <span>Logout</span>}
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className={`${styles['main-content']} ${isOpen ? '' : styles.open}`}>
        {/* Le contenu de la page */}
      </div>
    </>
  );
};

export default Sidebar;
