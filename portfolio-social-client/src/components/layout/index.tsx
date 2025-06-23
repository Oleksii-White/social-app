import { Container } from '@/components/container'
import { Header } from '@/components/header'
import { NavBar } from '@/components/navbar'
import { selectIsAuthenticated, selectUser } from '@/features/user/userSlice'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { Profile } from '../profile'

export const Layout = () => {
const isAuntenticated = useSelector(selectIsAuthenticated);
const user = useSelector(selectUser);
const navigate = useNavigate();

useEffect(() => {
  if (!isAuntenticated) {
    navigate('/auth');
  }
},[]);

  return (
    <>
        <Header/>
        <Container>
            <div className="flex-2 p-4">
                <NavBar/>
            </div>
            <div className="flex-1 p-4">
                <Outlet/>
            </div>
            <div className="flex-2 p-4">
              <div className="flex-col flex gap-5">
                {!user && <Profile/>}
              </div>
            </div>
        </Container>
    </>
  )
}
