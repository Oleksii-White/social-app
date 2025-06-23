import { useContext } from 'react'
import { ThemeContext } from '../theme-provider'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar'
import { FaRegMoon } from 'react-icons/fa'
import { LuSunMedium } from 'react-icons/lu'
import { logout, selectIsAuthenticated } from '@/features/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/button'
import { CiLogout } from 'react-icons/ci'

export const Header = () => {

    const {theme, toggleTheme} = useContext(ThemeContext)

    const isAuntenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem('token');
        navigate('/auth');
    }

  return (
    <Navbar>
        <NavbarBrand>
            <p className='font-bold text-inherit'>Network Social</p>
        </NavbarBrand>
        <NavbarContent justify='end'>
            <NavbarItem className='lg:flex text-3xl cursor-pointer'
            onClick={toggleTheme}
            >
                {theme === 'light' ? <FaRegMoon/> : <LuSunMedium/>}
            </NavbarItem>
            <NavbarItem>
                {isAuntenticated && (
                    <Button
                        color='default'
                        variant='flat'
                        className='gap-2'
                        onClick={handleLogout}>
                            <CiLogout /> <span>Logout</span>
                        </Button>
                )}
            </NavbarItem>
        </NavbarContent>
    </Navbar>
  )
}
