import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Jwt from 'jsonwebtoken';
import axios from 'axios';
import { LangDropDown } from '@/constants/constants';
import { useDispatch, useSelector } from 'react-redux';

import { dirRTL, dirLTR } from '@/slices/directionSlice';
import { RootState } from '@/store';
interface MenuItem {
  id: number;
  name: string;
  localizedName: string;
  href: string;
  permission?: string;
  parentId?: number;
  subItems?: MenuItem[];
}

const Navbar: React.FC = () => {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const route = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [logo, setLogo] = useState('');
  const dispatch = useDispatch();
  const direction = useSelector((state: RootState) => state.counter.direction);

  const getData = (userEmail: string) => {
    axios
      .get(`https://localhost:7160/api/Permission/GetMenuItems?userEmail=${userEmail}`)
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
      .get(`https://localhost:7160/api/Restaurant/GetRestaurantLogo?userEmail=${userEmail}`)
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

  useEffect(() => {
    const userEmail = session?.user?.userEmail;
    if (userEmail) {
      getData(userEmail);
      getLogo(userEmail);
    }
  }, [session]);

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
  

 const handleLogin = async () => {
    if (window.confirm('Are you sure to Loing from this user !') === true) {
      try {
          debugger;
          const fetchResponse = await fetch(`https://localhost:7160/api/Auth/AuthenticateById?id=${session?.user.saId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
          });

          if (!fetchResponse.ok) {
              throw new Error(`Request failed with status: ${fetchResponse.status}`);
          }

          const resp = await fetchResponse.json();
          const json = Jwt.decode(resp.message) as { [key: string]: string };
          console.log(json);
          signIn("credentials", {
              email: json['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
              name: json['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
              role: json['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
              permission: json['permission'],
              saId : json['saId'],
              redirect: false,
          }).then(() => {
              route.push('/');
          });
      } catch (error) {
          console.error('Fetch error:');
      }
    }}

  return (
    <>
      {session && (
        <nav className="bg-gray-800 p-4">
          <div dir={direction} className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="w-12 h-12 md:w-16 md:h-16 mr-4 rounded-full"
              />
              <h1 className="text-white text-lg md:text-xl font-semibold">{'Restaurant: '+session.user.name}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={route.locale}
                onChange={(e) => {
                  route.push('', undefined, {
                    locale: e.target.value,
                  });
                  if(e.target.value == 'ar'){
                    dispatch(dirRTL());
                  }
                  else{
                    dispatch(dirLTR());
                  }
                }}
                className="text-white bg-gray-600 rounded-md p-1"
              >
                {LangDropDown.map((op) => (
                  <option value={op.value} key={op.id}>
                    {op.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
              >
                Menu
              </button>

              <div className={`absolute top-14 right-0 bg-gray-800 mt-2 p-2 ${isMenuOpen ? '' : 'hidden'}`}>
                {nestedMenuItems.map((item, index) => (
                  <div key={`${item}-${index}`}>
                    {/* Add your logic for nested items here */}
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src='https://localhost:7160/Image/mine234629318.jpg'
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <button onClick={() => signOut()} className="text-white">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
