import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import en from '@/locales/en';
import ar from '@/locales/ar';
import { LangDropDown, themes } from '@/constants/constants';
import { API_CONFIG } from '@/constants/api-config';
import { Context } from '@/contexts/UseContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
interface MenuItem {
  id: number;
  name: string;
  localizedName: string;
  href: string;
  permission?: string;
  parentId?: number;
  subItems?: MenuItem[];
}
const NavBar: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : ar;

  const { setDirection, setTheme } = Context();

  const changeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLocale = e.target.value;
    router.push(router.pathname, router.asPath, { locale: selectedLocale });
    if (selectedLocale == 'ar') {
      setDirection('rtl');

    } else {
      setDirection('ltr');
    }
  };
  const changeTheme = (e: ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
    setDataTheme(e.target.value);
  };
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isUserProfileOpen, setUserProfileOpen] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [logo, setLogo] = useState('');
  const [email, setEmail] = useState('');
  const [dataTheme, setDataTheme] = useState('');

  const handleToggleUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setUserProfileOpen(!isUserProfileOpen);
    setOpenDropdownMenu(null);
  };

  const handleToggleDropdownMenu = (
    menuName: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setOpenDropdownMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleDocumentClick = (event: MouseEvent) => {
    const isDropdownClick = (event.target as Element).closest('.dropdown-menu');

    if (!isDropdownClick) {
      setUserProfileOpen(false);
      setOpenDropdownMenu(null);
    }
  };
  const getData = (userEmail: string) => {
    axios
      .get(
        `${API_CONFIG.BASE_URL}api/Permission/GetMenuItems?userEmail=${userEmail}`
      )
      .then((response) => {
        console.log('get data');
        setMenuItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getLogo = (userEmail: string) => {
    axios
      .get(
        `${API_CONFIG.BASE_URL}api/Restaurant/GetRestaurantLogo?userEmail=${userEmail}`
      )
      .then((response) => {
        console.log('get logo');
        console.log(response);
        setLogo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const nestedMenuItems = buildMenuTree(menuItems);

  function buildMenuTree(menuItems: MenuItem[], parentId = 0): MenuItem[] {
    const menuTree: MenuItem[] = [];

    menuItems
      .filter((item) => item.parentId === parentId)
      .forEach((item) => {
        const subItems = buildMenuTree(menuItems, item.id);
        if (subItems.length > 0) {
          item.subItems = subItems;
        }
        menuTree.push(item);
      });

    return menuTree;
  }
  const cookies = parseCookies();

  useEffect(() => {
    var dataTheme = document.documentElement.getAttribute('data-theme') || '';
    setDataTheme(dataTheme);
    const userEmail = cookies.username;
    getData(userEmail);
    getLogo(userEmail);
    setEmail(userEmail);
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);
  return (
    <div className='w-full bg-gray-800'>
      <div className='mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              type='button'
              className='inline-flex items-center justify-center p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
            >
              {isMenuOpen ? (
                <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
          <div className='flex flex-shrink-0 items-center'>
            <img
              className='hidden h-8 w-auto md:block lg:block'
              src={logo}
              alt='abc'
            />
          </div>

          <div className='hidden sm:ml-6 sm:flex sm:items-center'>
            {nestedMenuItems.map((menuItem) => (
              <div key={menuItem.name} className='relative ml-3'>
                {menuItem.subItems ? (
                  <div className='relative'>
                    <button
                      type='button'
                      onClick={(event) =>
                        handleToggleDropdownMenu(menuItem.name, event)
                      }
                      className='flex rounded-xl bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                    >
                      <span className='sr-only'>{`Open ${menuItem.name} menu`}</span>
                      <span className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
                        {menuItem.name}
                      </span>
                    </button>
                    {openDropdownMenu === menuItem.name && (
                      <div className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        {menuItem.subItems.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className='block px-4 py-2 text-sm text-gray-700'
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={menuItem.href}
                    className={classNames(
                      'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    {menuItem.name}
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className='relative ml-3'>
            <select
              onChange={changeLanguage}
              value={locale}
              className='text-shadow-sm bg-transparent text-lg tracking-wide text-white'
            >
              {LangDropDown.map((op) => (
                <option value={op.value} key={op.id}>
                  {op.label}
                </option>
              ))}
            </select>

            <select
              onChange={changeTheme}
              value={dataTheme}
              className='text-shadow-sm bg-transparent text-lg tracking-wide text-white'
            >
              {themes.map((op) => (
                <option value={op.value} key={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>
          <div className='sm:ml-6 sm:flex sm:items-center'>
            {/* Profile dropdown */}
            <div className='relative ml-3'>
              <button
                type='button'
                onClick={handleToggleUserMenu}
                className='flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
              >
                <span className='sr-only'>Open user menu</span>
                <img
                  className='h-8 w-8 rounded-full'
                  src='https://localhost:7160/Image/mine234629318.jpg'
                  alt=''
                />
              </button>
            </div>
            {isUserProfileOpen && (
              <div className='absolute right-0 z-10 mt-48 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div
                  className='text-md block px-4 py-2 font-bold text-gray-700'
                  role='menuitem'
                  id='user-menu-item-0'
                >
                  {email}
                </div>
                <a
                  href='/'
                  className='block px-4 py-2 text-sm text-gray-700'
                  role='menuitem'
                  id='user-menu-item-0'
                >
                  Your Profile
                </a>
                <a
                  href='#'
                  className='block px-4 py-2 text-sm text-gray-700'
                  role='menuitem'
                  id='user-menu-item-1'
                >
                  Settings
                </a>
                <a
                  href='/logout'
                  className='block px-4 py-2 text-sm text-gray-700'
                  role='menuitem'
                  id='user-menu-item-2'
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className='sm:hidden' onClick={() => setMenuOpen(true)}>
          <div className='space-y-1 px-2 pb-3 pt-2'>
            {nestedMenuItems.map((menuItem) => (
              <div key={menuItem.name} className='relative ml-3'>
                {menuItem.subItems ? (
                  <div className='relative'>
                    <button
                      type='button'
                      onClick={(event) =>
                        handleToggleDropdownMenu(menuItem.name, event)
                      }
                      className='flex rounded-xl bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                    >
                      <span className='sr-only'>{`Open ${menuItem.name} menu`}</span>
                      <span className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
                        {menuItem.name}
                      </span>
                    </button>
                    {openDropdownMenu === menuItem.name && (
                      <div className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        {menuItem.subItems.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className='block px-4 py-2 text-sm text-gray-700'
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={menuItem.href}
                    className={classNames(
                      'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    {menuItem.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
